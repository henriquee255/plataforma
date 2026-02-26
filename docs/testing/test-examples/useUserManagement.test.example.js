/**
 * Exemplo Completo de Teste: useUserManagement Hook
 *
 * Hook responsável por operações CRUD de usuários
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import useUserManagement from '@admin/hooks/useUserManagement';
import { mockUsers } from '@admin/__mocks__/adminMockData';

// Mock do useAdminContext
vi.mock('@admin/context/AdminContext', () => ({
  useAdminContext: () => ({
    users: mockUsers,
    setUsers: vi.fn(),
    refetchData: vi.fn(),
  }),
}));

// Mock do useNotification
vi.mock('@/hooks/useNotification', () => ({
  useNotification: () => ({
    notifySuccess: vi.fn(),
    notifyError: vi.fn(),
    notifyInfo: vi.fn(),
  }),
}));

describe('useUserManagement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe('READ Operations', () => {
    describe('listar todos os usuários', () => {
      it('deve retornar todos os usuários', () => {
        const { result } = renderHook(() => useUserManagement());

        expect(result.current.users).toEqual(mockUsers);
        expect(result.current.users.length).toBe(3);
      });

      it('deve ordenar usuários por data de criação (mais recentes primeiro)', () => {
        const { result } = renderHook(() => useUserManagement());

        const users = result.current.users;
        const dates = users.map(u => new Date(u.createdAt).getTime());

        // Verificar ordem decrescente
        for (let i = 1; i < dates.length; i++) {
          expect(dates[i - 1]).toBeGreaterThanOrEqual(dates[i]);
        }
      });
    });

    describe('buscar usuário por ID', () => {
      it('deve retornar usuário existente', async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({ success: true, user: mockUsers[0] }),
        });

        const { result } = renderHook(() => useUserManagement());

        let user;
        await act(async () => {
          user = await result.current.getUserById('1');
        });

        expect(user).toEqual(mockUsers[0]);
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/users/1'),
          expect.any(Object)
        );
      });

      it('deve retornar null para usuário inexistente', async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 404,
          json: async () => ({ success: false, error: 'User not found' }),
        });

        const { result } = renderHook(() => useUserManagement());

        let user;
        await act(async () => {
          user = await result.current.getUserById('999');
        });

        expect(user).toBeNull();
      });

      it('deve fazer cache de usuário já carregado', async () => {
        const { result } = renderHook(() => useUserManagement());

        // Primeira busca (do contexto)
        let user1;
        await act(async () => {
          user1 = await result.current.getUserById('1');
        });

        // Segunda busca (deve usar cache)
        let user2;
        await act(async () => {
          user2 = await result.current.getUserById('1');
        });

        expect(user1).toEqual(user2);
        // Não deve ter chamado API na segunda vez
        expect(global.fetch).not.toHaveBeenCalled();
      });
    });

    describe('filtrar usuários por role', () => {
      it('deve filtrar superadmins', () => {
        const { result } = renderHook(() => useUserManagement());

        act(() => {
          result.current.setFilters({ role: 'superadmin' });
        });

        const filtered = result.current.filteredUsers;
        expect(filtered.length).toBe(1);
        expect(filtered[0].role).toBe('superadmin');
      });

      it('deve filtrar managers', () => {
        const { result } = renderHook(() => useUserManagement());

        act(() => {
          result.current.setFilters({ role: 'manager' });
        });

        const filtered = result.current.filteredUsers;
        expect(filtered.length).toBe(1);
        expect(filtered[0].role).toBe('manager');
      });

      it('deve retornar todos quando role = "todos"', () => {
        const { result } = renderHook(() => useUserManagement());

        act(() => {
          result.current.setFilters({ role: 'todos' });
        });

        expect(result.current.filteredUsers.length).toBe(mockUsers.length);
      });
    });

    describe('filtrar usuários por status', () => {
      it('deve filtrar usuários ativos', () => {
        const { result } = renderHook(() => useUserManagement());

        act(() => {
          result.current.setFilters({ status: 'ativo' });
        });

        const filtered = result.current.filteredUsers;
        expect(filtered.length).toBe(2);
        expect(filtered.every(u => u.status === 'ativo')).toBe(true);
      });

      it('deve filtrar usuários inativos', () => {
        const { result } = renderHook(() => useUserManagement());

        act(() => {
          result.current.setFilters({ status: 'inativo' });
        });

        const filtered = result.current.filteredUsers;
        expect(filtered.length).toBe(1);
        expect(filtered[0].status).toBe('inativo');
      });
    });

    describe('buscar usuários por termo', () => {
      it('deve buscar por nome', () => {
        const { result } = renderHook(() => useUserManagement());

        act(() => {
          result.current.setSearchTerm('Admin');
        });

        const filtered = result.current.filteredUsers;
        expect(filtered.length).toBe(1);
        expect(filtered[0].name).toContain('Admin');
      });

      it('deve buscar por email', () => {
        const { result } = renderHook(() => useUserManagement());

        act(() => {
          result.current.setSearchTerm('manager@test.com');
        });

        const filtered = result.current.filteredUsers;
        expect(filtered.length).toBe(1);
        expect(filtered[0].email).toBe('manager@test.com');
      });

      it('deve buscar case-insensitive', () => {
        const { result } = renderHook(() => useUserManagement());

        act(() => {
          result.current.setSearchTerm('ADMIN');
        });

        const filtered = result.current.filteredUsers;
        expect(filtered.length).toBeGreaterThan(0);
      });

      it('deve buscar por termo parcial', () => {
        const { result } = renderHook(() => useUserManagement());

        act(() => {
          result.current.setSearchTerm('User');
        });

        const filtered = result.current.filteredUsers;
        expect(filtered.length).toBeGreaterThan(0);
      });
    });

    describe('combinar filtros e busca', () => {
      it('deve aplicar filtro de role + busca', () => {
        const { result } = renderHook(() => useUserManagement());

        act(() => {
          result.current.setFilters({ role: 'manager' });
          result.current.setSearchTerm('Manager');
        });

        const filtered = result.current.filteredUsers;
        expect(filtered.length).toBe(1);
        expect(filtered[0].role).toBe('manager');
        expect(filtered[0].name).toContain('Manager');
      });

      it('deve aplicar filtro de status + busca', () => {
        const { result } = renderHook(() => useUserManagement());

        act(() => {
          result.current.setFilters({ status: 'ativo' });
          result.current.setSearchTerm('Admin');
        });

        const filtered = result.current.filteredUsers;
        expect(filtered.length).toBe(1);
        expect(filtered[0].status).toBe('ativo');
        expect(filtered[0].name).toContain('Admin');
      });
    });
  });

  describe('CREATE Operations', () => {
    it('deve criar novo usuário com sucesso', async () => {
      const newUser = {
        name: 'New User',
        email: 'new@test.com',
        role: 'user',
        status: 'ativo',
      };

      const createdUser = { ...newUser, id: '4', createdAt: new Date().toISOString() };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, user: createdUser }),
      });

      const { result } = renderHook(() => useUserManagement());

      let user;
      await act(async () => {
        user = await result.current.createUser(newUser);
      });

      expect(user).toEqual(createdUser);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/users'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(newUser),
        })
      );
    });

    it('deve validar campos obrigatórios', async () => {
      const { result } = renderHook(() => useUserManagement());

      await act(async () => {
        await expect(
          result.current.createUser({ name: 'Test' })
        ).rejects.toThrow('Email é obrigatório');
      });
    });

    it('deve validar formato de email', async () => {
      const { result } = renderHook(() => useUserManagement());

      await act(async () => {
        await expect(
          result.current.createUser({
            name: 'Test',
            email: 'invalid-email',
            role: 'user',
          })
        ).rejects.toThrow('Email inválido');
      });
    });

    it('deve validar email único', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 409,
        json: async () => ({ success: false, error: 'Email já cadastrado' }),
      });

      const { result } = renderHook(() => useUserManagement());

      await act(async () => {
        await expect(
          result.current.createUser({
            name: 'Test',
            email: 'admin@test.com', // Email já existe
            role: 'user',
          })
        ).rejects.toThrow('Email já cadastrado');
      });
    });

    it('deve definir role padrão como "user"', async () => {
      const newUser = {
        name: 'New User',
        email: 'new@test.com',
      };

      const createdUser = { ...newUser, id: '4', role: 'user' };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, user: createdUser }),
      });

      const { result } = renderHook(() => useUserManagement());

      let user;
      await act(async () => {
        user = await result.current.createUser(newUser);
      });

      expect(user.role).toBe('user');
    });

    it('deve definir status padrão como "ativo"', async () => {
      const newUser = {
        name: 'New User',
        email: 'new@test.com',
        role: 'user',
      };

      const createdUser = { ...newUser, id: '4', status: 'ativo' };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, user: createdUser }),
      });

      const { result } = renderHook(() => useUserManagement());

      let user;
      await act(async () => {
        user = await result.current.createUser(newUser);
      });

      expect(user.status).toBe('ativo');
    });
  });

  describe('UPDATE Operations', () => {
    describe('atualizar role de usuário', () => {
      it('deve atualizar role com sucesso', async () => {
        const updatedUser = { ...mockUsers[2], role: 'manager' };

        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({ success: true, user: updatedUser }),
        });

        const { result } = renderHook(() => useUserManagement());

        let user;
        await act(async () => {
          user = await result.current.updateUserRole('3', 'manager');
        });

        expect(user.role).toBe('manager');
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/users/3/role'),
          expect.objectContaining({
            method: 'PATCH',
            body: JSON.stringify({ role: 'manager' }),
          })
        );
      });

      it('deve validar roles permitidas', async () => {
        const { result } = renderHook(() => useUserManagement());

        await act(async () => {
          await expect(
            result.current.updateUserRole('3', 'invalid-role')
          ).rejects.toThrow('Role inválida');
        });
      });

      it('deve impedir mudança para superadmin sem permissão', async () => {
        const { result } = renderHook(() => useUserManagement());

        await act(async () => {
          await expect(
            result.current.updateUserRole('3', 'superadmin')
          ).rejects.toThrow('Sem permissão para criar superadmin');
        });
      });
    });

    describe('atualizar status de usuário', () => {
      it('deve ativar usuário', async () => {
        const updatedUser = { ...mockUsers[2], status: 'ativo' };

        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({ success: true, user: updatedUser }),
        });

        const { result } = renderHook(() => useUserManagement());

        let user;
        await act(async () => {
          user = await result.current.updateUserStatus('3', 'ativo');
        });

        expect(user.status).toBe('ativo');
      });

      it('deve desativar usuário', async () => {
        const updatedUser = { ...mockUsers[0], status: 'inativo' };

        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({ success: true, user: updatedUser }),
        });

        const { result } = renderHook(() => useUserManagement());

        let user;
        await act(async () => {
          user = await result.current.updateUserStatus('1', 'inativo');
        });

        expect(user.status).toBe('inativo');
      });

      it('deve validar status permitidos', async () => {
        const { result } = renderHook(() => useUserManagement());

        await act(async () => {
          await expect(
            result.current.updateUserStatus('3', 'invalid-status')
          ).rejects.toThrow('Status inválido');
        });
      });
    });

    describe('atualizar dados pessoais', () => {
      it('deve atualizar nome', async () => {
        const updatedUser = { ...mockUsers[0], name: 'Updated Name' };

        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({ success: true, user: updatedUser }),
        });

        const { result } = renderHook(() => useUserManagement());

        let user;
        await act(async () => {
          user = await result.current.updateUser('1', { name: 'Updated Name' });
        });

        expect(user.name).toBe('Updated Name');
      });

      it('deve atualizar email', async () => {
        const updatedUser = { ...mockUsers[0], email: 'newemail@test.com' };

        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({ success: true, user: updatedUser }),
        });

        const { result } = renderHook(() => useUserManagement());

        let user;
        await act(async () => {
          user = await result.current.updateUser('1', { email: 'newemail@test.com' });
        });

        expect(user.email).toBe('newemail@test.com');
      });

      it('deve validar email ao atualizar', async () => {
        const { result } = renderHook(() => useUserManagement());

        await act(async () => {
          await expect(
            result.current.updateUser('1', { email: 'invalid-email' })
          ).rejects.toThrow('Email inválido');
        });
      });

      it('deve retornar erro se usuário não encontrado', async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 404,
          json: async () => ({ success: false, error: 'User not found' }),
        });

        const { result } = renderHook(() => useUserManagement());

        await act(async () => {
          await expect(
            result.current.updateUser('999', { name: 'Test' })
          ).rejects.toThrow('User not found');
        });
      });
    });
  });

  describe('DELETE Operations', () => {
    it('deve deletar usuário com sucesso', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, message: 'User deleted' }),
      });

      const { result } = renderHook(() => useUserManagement());

      await act(async () => {
        await result.current.deleteUser('3');
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/3'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    it('deve impedir deleção do próprio usuário', async () => {
      // Mock current user
      const { result } = renderHook(() => useUserManagement({ currentUserId: '1' }));

      await act(async () => {
        await expect(
          result.current.deleteUser('1')
        ).rejects.toThrow('Não é possível deletar seu próprio usuário');
      });
    });

    it('deve impedir deleção do último superadmin', async () => {
      const { result } = renderHook(() => useUserManagement());

      await act(async () => {
        await expect(
          result.current.deleteUser('1') // Único superadmin
        ).rejects.toThrow('Não é possível deletar o último superadmin');
      });
    });

    it('deve retornar erro se usuário não encontrado', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ success: false, error: 'User not found' }),
      });

      const { result } = renderHook(() => useUserManagement());

      await act(async () => {
        await expect(
          result.current.deleteUser('999')
        ).rejects.toThrow('User not found');
      });
    });
  });

  describe('Permissions', () => {
    it('deve atualizar permissões de usuário', async () => {
      const newPermissions = ['users.read', 'users.write', 'crm.read'];

      const updatedUser = {
        ...mockUsers[2],
        permissions: newPermissions,
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, user: updatedUser }),
      });

      const { result } = renderHook(() => useUserManagement());

      let user;
      await act(async () => {
        user = await result.current.updateUserPermissions('3', newPermissions);
      });

      expect(user.permissions).toEqual(newPermissions);
    });

    it('deve validar permissões antes de salvar', async () => {
      const invalidPermissions = ['invalid.permission'];

      const { result } = renderHook(() => useUserManagement());

      await act(async () => {
        await expect(
          result.current.updateUserPermissions('3', invalidPermissions)
        ).rejects.toThrow('Permissões inválidas');
      });
    });

    it('deve impedir edição de permissões de superadmin', async () => {
      const { result } = renderHook(() => useUserManagement());

      await act(async () => {
        await expect(
          result.current.updateUserPermissions('1', ['users.read'])
        ).rejects.toThrow('Não é possível editar permissões de superadmin');
      });
    });
  });

  describe('Notificações', () => {
    it('deve notificar sucesso ao criar usuário', async () => {
      const mockNotifySuccess = vi.fn();
      vi.mocked(useNotification).mockReturnValue({
        notifySuccess: mockNotifySuccess,
        notifyError: vi.fn(),
      });

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, user: { id: '4' } }),
      });

      const { result } = renderHook(() => useUserManagement());

      await act(async () => {
        await result.current.createUser({
          name: 'Test',
          email: 'test@test.com',
        });
      });

      expect(mockNotifySuccess).toHaveBeenCalledWith('Usuário criado com sucesso');
    });

    it('deve notificar erro ao falhar criação', async () => {
      const mockNotifyError = vi.fn();
      vi.mocked(useNotification).mockReturnValue({
        notifySuccess: vi.fn(),
        notifyError: mockNotifyError,
      });

      global.fetch = vi.fn().mockRejectedValue(new Error('Create failed'));

      const { result } = renderHook(() => useUserManagement());

      await act(async () => {
        try {
          await result.current.createUser({
            name: 'Test',
            email: 'test@test.com',
          });
        } catch (error) {
          // Expected
        }
      });

      expect(mockNotifyError).toHaveBeenCalledWith(
        expect.stringContaining('Erro ao criar usuário')
      );
    });
  });
});
