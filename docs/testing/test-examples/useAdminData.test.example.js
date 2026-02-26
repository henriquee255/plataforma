/**
 * Exemplo Completo de Teste: useAdminData Hook
 *
 * Hook responsável por carregar e gerenciar dados globais do painel Admin
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import useAdminData from '@admin/hooks/useAdminData';
import { mockUsers, mockCompanies } from '@admin/__mocks__/adminMockData';

describe('useAdminData', () => {
  // Cleanup após cada teste
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Carregamento Inicial', () => {
    it('deve iniciar com estado de loading', () => {
      global.fetch = vi.fn().mockImplementation(() =>
        new Promise(() => {}) // Never resolves
      );

      const { result } = renderHook(() => useAdminData());

      expect(result.current.loading).toBe(true);
      expect(result.current.users).toEqual([]);
      expect(result.current.companies).toEqual([]);
    });

    it('deve carregar dados iniciais corretamente', async () => {
      // Mock API responses
      global.fetch = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, users: mockUsers }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, companies: mockCompanies }),
        });

      const { result } = renderHook(() => useAdminData());

      // Aguardar carregamento
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Validar dados carregados
      expect(result.current.users).toEqual(mockUsers);
      expect(result.current.companies).toEqual(mockCompanies);
      expect(result.current.error).toBeNull();
    });

    it('deve retornar erro quando API falha', async () => {
      const errorMessage = 'Erro ao buscar dados';

      global.fetch = vi.fn().mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useAdminData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.users).toEqual([]);
      expect(result.current.companies).toEqual([]);
    });

    it('deve fazer retry após 3 falhas', async () => {
      let callCount = 0;
      global.fetch = vi.fn().mockImplementation(() => {
        callCount++;
        if (callCount <= 2) {
          return Promise.reject(new Error('Network error'));
        }
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, users: mockUsers }),
        });
      });

      const { result } = renderHook(() => useAdminData({ maxRetries: 3 }));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      }, { timeout: 5000 });

      expect(callCount).toBe(3);
      expect(result.current.users).toEqual(mockUsers);
    });
  });

  describe('Cálculo de Métricas', () => {
    it('deve calcular totais de usuários por role', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, users: mockUsers }),
      });

      const { result } = renderHook(() => useAdminData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const metrics = result.current.metrics.users;

      expect(metrics.total).toBe(3);
      expect(metrics.byRole.superadmin).toBe(1);
      expect(metrics.byRole.manager).toBe(1);
      expect(metrics.byRole.user).toBe(1);
    });

    it('deve calcular totais de usuários por status', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, users: mockUsers }),
      });

      const { result } = renderHook(() => useAdminData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const metrics = result.current.metrics.users;

      expect(metrics.byStatus.ativo).toBe(2);
      expect(metrics.byStatus.inativo).toBe(1);
    });

    it('deve calcular totais de empresas por plano', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, companies: mockCompanies }),
      });

      const { result } = renderHook(() => useAdminData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const metrics = result.current.metrics.companies;

      expect(metrics.total).toBe(3);
      expect(metrics.byPlan.enterprise).toBe(1);
      expect(metrics.byPlan.pro).toBe(1);
      expect(metrics.byPlan.starter).toBe(1);
    });

    it('deve calcular taxa de crescimento de usuários', async () => {
      const usersWithGrowth = [
        ...mockUsers,
        { id: '4', name: 'New User', createdAt: new Date().toISOString() },
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, users: usersWithGrowth }),
      });

      const { result } = renderHook(() => useAdminData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const metrics = result.current.metrics.users;

      expect(metrics.growth).toBeGreaterThan(0);
      expect(metrics.growth).toBeLessThanOrEqual(100);
    });

    it('deve recalcular métricas quando dados mudam', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, users: mockUsers }),
      });

      const { result, rerender } = renderHook(() => useAdminData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const initialTotal = result.current.metrics.users.total;
      expect(initialTotal).toBe(3);

      // Adicionar novo usuário
      const newUsers = [...mockUsers, { id: '4', name: 'New User', role: 'user', status: 'ativo' }];
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, users: newUsers }),
      });

      act(() => {
        result.current.refetch();
      });

      await waitFor(() => {
        expect(result.current.metrics.users.total).toBe(4);
      });
    });
  });

  describe('Cache de Dados', () => {
    it('deve fazer cache de dados por 5 minutos', async () => {
      let fetchCallCount = 0;
      global.fetch = vi.fn().mockImplementation(() => {
        fetchCallCount++;
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, users: mockUsers }),
        });
      });

      const { result } = renderHook(() => useAdminData({ cacheTime: 5 * 60 * 1000 }));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(fetchCallCount).toBe(1);

      // Renderizar novamente (dentro do cache time)
      const { result: result2 } = renderHook(() => useAdminData({ cacheTime: 5 * 60 * 1000 }));

      await waitFor(() => {
        expect(result2.current.loading).toBe(false);
      });

      // Não deve ter feito nova chamada
      expect(fetchCallCount).toBe(1);
    });

    it('deve invalidar cache após 5 minutos', async () => {
      let fetchCallCount = 0;
      global.fetch = vi.fn().mockImplementation(() => {
        fetchCallCount++;
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, users: mockUsers }),
        });
      });

      const { result } = renderHook(() => useAdminData({ cacheTime: 5 * 60 * 1000 }));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(fetchCallCount).toBe(1);

      // Avançar 5 minutos
      act(() => {
        vi.advanceTimersByTime(5 * 60 * 1000);
      });

      // Renderizar novamente (após cache expirar)
      const { result: result2 } = renderHook(() => useAdminData({ cacheTime: 5 * 60 * 1000 }));

      await waitFor(() => {
        expect(result2.current.loading).toBe(false);
      });

      // Deve ter feito nova chamada
      expect(fetchCallCount).toBe(2);
    });

    it('deve invalidar cache ao fazer mutação', async () => {
      let fetchCallCount = 0;
      global.fetch = vi.fn().mockImplementation((url, options) => {
        if (options?.method === 'POST') {
          return Promise.resolve({
            ok: true,
            json: async () => ({ success: true, user: { id: '4', name: 'New User' } }),
          });
        }
        fetchCallCount++;
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, users: mockUsers }),
        });
      });

      const { result } = renderHook(() => useAdminData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(fetchCallCount).toBe(1);

      // Fazer mutação (criar usuário)
      await act(async () => {
        await result.current.createUser({ name: 'New User', email: 'new@test.com' });
      });

      // Deve ter invalidado cache e feito nova chamada
      expect(fetchCallCount).toBe(2);
    });

    it('deve salvar cache no localStorage', async () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, users: mockUsers }),
      });

      const { result } = renderHook(() => useAdminData({ persistCache: true }));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(setItemSpy).toHaveBeenCalledWith(
        'admin-data-cache',
        expect.stringContaining('users')
      );

      setItemSpy.mockRestore();
    });

    it('deve restaurar cache do localStorage ao montar', async () => {
      // Salvar cache no localStorage
      localStorage.setItem('admin-data-cache', JSON.stringify({
        users: mockUsers,
        timestamp: Date.now(),
      }));

      global.fetch = vi.fn();

      const { result } = renderHook(() => useAdminData({ persistCache: true, cacheTime: 5 * 60 * 1000 }));

      // Deve ter restaurado do cache sem chamar API
      expect(result.current.users).toEqual(mockUsers);
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('Polling', () => {
    it('deve fazer polling a cada 30 segundos', async () => {
      let fetchCallCount = 0;
      global.fetch = vi.fn().mockImplementation(() => {
        fetchCallCount++;
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, users: mockUsers }),
        });
      });

      const { result } = renderHook(() => useAdminData({ pollingInterval: 30000 }));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(fetchCallCount).toBe(1);

      // Avançar 30 segundos
      act(() => {
        vi.advanceTimersByTime(30000);
      });

      await waitFor(() => {
        expect(fetchCallCount).toBe(2);
      });

      // Avançar mais 30 segundos
      act(() => {
        vi.advanceTimersByTime(30000);
      });

      await waitFor(() => {
        expect(fetchCallCount).toBe(3);
      });
    });

    it('deve limpar polling ao desmontar', async () => {
      let fetchCallCount = 0;
      global.fetch = vi.fn().mockImplementation(() => {
        fetchCallCount++;
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, users: mockUsers }),
        });
      });

      const { result, unmount } = renderHook(() => useAdminData({ pollingInterval: 30000 }));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(fetchCallCount).toBe(1);

      // Desmontar
      unmount();

      // Avançar 30 segundos
      act(() => {
        vi.advanceTimersByTime(30000);
      });

      // Não deve ter feito nova chamada
      expect(fetchCallCount).toBe(1);
    });

    it('deve pausar polling quando tab fica inativa', async () => {
      let fetchCallCount = 0;
      global.fetch = vi.fn().mockImplementation(() => {
        fetchCallCount++;
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, users: mockUsers }),
        });
      });

      const { result } = renderHook(() => useAdminData({ pollingInterval: 30000 }));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(fetchCallCount).toBe(1);

      // Simular tab inativa
      Object.defineProperty(document, 'hidden', {
        writable: true,
        configurable: true,
        value: true,
      });
      document.dispatchEvent(new Event('visibilitychange'));

      // Avançar 30 segundos
      act(() => {
        vi.advanceTimersByTime(30000);
      });

      // Não deve ter feito nova chamada
      expect(fetchCallCount).toBe(1);

      // Reativar tab
      Object.defineProperty(document, 'hidden', {
        value: false,
      });
      document.dispatchEvent(new Event('visibilitychange'));

      // Avançar 30 segundos
      act(() => {
        vi.advanceTimersByTime(30000);
      });

      // Deve ter feito nova chamada
      await waitFor(() => {
        expect(fetchCallCount).toBe(2);
      });
    });
  });

  describe('Refetch Manual', () => {
    it('deve permitir refetch manual', async () => {
      let fetchCallCount = 0;
      global.fetch = vi.fn().mockImplementation(() => {
        fetchCallCount++;
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, users: mockUsers }),
        });
      });

      const { result } = renderHook(() => useAdminData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(fetchCallCount).toBe(1);

      // Refetch manual
      await act(async () => {
        await result.current.refetch();
      });

      expect(fetchCallCount).toBe(2);
    });

    it('deve mostrar loading durante refetch', async () => {
      global.fetch = vi.fn().mockImplementation(() =>
        new Promise(resolve =>
          setTimeout(() => resolve({
            ok: true,
            json: async () => ({ success: true, users: mockUsers }),
          }), 100)
        )
      );

      const { result } = renderHook(() => useAdminData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Iniciar refetch
      act(() => {
        result.current.refetch();
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('Error Handling', () => {
    it('deve lidar com erro de rede', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useAdminData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Network error');
    });

    it('deve lidar com resposta 500', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ success: false, error: 'Internal server error' }),
      });

      const { result } = renderHook(() => useAdminData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toContain('Internal server error');
    });

    it('deve lidar com resposta 401 (não autorizado)', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ success: false, error: 'Unauthorized' }),
      });

      const { result } = renderHook(() => useAdminData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toContain('Unauthorized');
      // Deve ter chamado logout
      // expect(mockLogout).toHaveBeenCalled();
    });

    it('deve limpar erro ao fazer refetch com sucesso', async () => {
      // Primeira chamada: erro
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useAdminData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Network error');

      // Segunda chamada: sucesso
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, users: mockUsers }),
      });

      await act(async () => {
        await result.current.refetch();
      });

      expect(result.current.error).toBeNull();
      expect(result.current.users).toEqual(mockUsers);
    });
  });

  describe('Optimistic Updates', () => {
    it('deve fazer update otimista ao criar usuário', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, users: mockUsers }),
      });

      const { result } = renderHook(() => useAdminData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const initialTotal = result.current.users.length;

      const newUser = { id: '4', name: 'New User', email: 'new@test.com', role: 'user' };

      // Mock create
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, user: newUser }),
      });

      await act(async () => {
        await result.current.createUser(newUser);
      });

      // Deve ter adicionado imediatamente (optimistic)
      expect(result.current.users.length).toBe(initialTotal + 1);
      expect(result.current.users).toContainEqual(expect.objectContaining({ name: 'New User' }));
    });

    it('deve reverter update otimista em caso de erro', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, users: mockUsers }),
      });

      const { result } = renderHook(() => useAdminData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const initialUsers = [...result.current.users];

      // Mock create failure
      global.fetch = vi.fn().mockRejectedValue(new Error('Create failed'));

      await act(async () => {
        try {
          await result.current.createUser({ name: 'New User', email: 'new@test.com' });
        } catch (error) {
          // Expected error
        }
      });

      // Deve ter revertido para estado anterior
      expect(result.current.users).toEqual(initialUsers);
    });
  });
});
