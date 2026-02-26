import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNotification } from '../hooks/useNotification';

// Mock do useToast
const mockToast = vi.fn();

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

describe('useNotification Hook', () => {
  beforeEach(() => {
    mockToast.mockClear();
  });

  it('deve ter todas as funções de notificação disponíveis', () => {
    const { result } = renderHook(() => useNotification());

    expect(typeof result.current.notifySaved).toBe('function');
    expect(typeof result.current.notifyAdded).toBe('function');
    expect(typeof result.current.notifyUpdated).toBe('function');
    expect(typeof result.current.notifyDeleted).toBe('function');
    expect(typeof result.current.notifySuccess).toBe('function');
    expect(typeof result.current.notifyError).toBe('function');
    expect(typeof result.current.notifyWarning).toBe('function');
    expect(typeof result.current.notifyInfo).toBe('function');
  });

  it('notifySaved deve chamar toast com configuração correta', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.notifySaved();
    });

    expect(mockToast).toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        duration: 2000,
      })
    );
  });

  it('notifySaved deve aceitar mensagem customizada', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.notifySaved('Dados salvos!');
    });

    expect(mockToast).toHaveBeenCalled();
  });

  it('notifyAdded deve funcionar corretamente', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.notifyAdded('Novo item adicionado');
    });

    expect(mockToast).toHaveBeenCalled();
  });

  it('notifyUpdated deve funcionar corretamente', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.notifyUpdated('Item atualizado');
    });

    expect(mockToast).toHaveBeenCalled();
  });

  it('notifyDeleted deve funcionar corretamente', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.notifyDeleted('Item deletado');
    });

    expect(mockToast).toHaveBeenCalled();
  });

  it('notifySuccess deve funcionar corretamente', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.notifySuccess('Operação bem-sucedida');
    });

    expect(mockToast).toHaveBeenCalled();
  });

  it('notifyError deve funcionar corretamente', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.notifyError('Ocorreu um erro');
    });

    expect(mockToast).toHaveBeenCalled();
  });

  it('notifyWarning deve funcionar corretamente', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.notifyWarning('Atenção!');
    });

    expect(mockToast).toHaveBeenCalled();
  });

  it('notifyInfo deve funcionar corretamente', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.notifyInfo('Informação importante');
    });

    expect(mockToast).toHaveBeenCalled();
  });

  it('deve chamar toast com mensagens diferentes', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.notifySaved('Mensagem 1');
    });

    act(() => {
      result.current.notifyAdded('Mensagem 2');
    });

    expect(mockToast).toHaveBeenCalledTimes(2);
  });

  it('deve funcionar sem mensagem (usar padrão)', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.notifySaved();
    });

    expect(mockToast).toHaveBeenCalled();
  });
});
