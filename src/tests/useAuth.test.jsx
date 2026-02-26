import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { AuthProvider, AuthContext } from '../contexts/AuthContext';
import React from 'react';

// Mock dos services
vi.mock('../services/authService', () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  refreshTokens: vi.fn(),
  getCurrentUser: vi.fn(),
}));

vi.mock('../utils/tokenStorage', () => ({
  getAccessToken: vi.fn(() => null),
  getRefreshToken: vi.fn(() => null),
  getUser: vi.fn(() => null),
  saveAuthData: vi.fn(),
  clearAuthData: vi.fn(),
  isTokenExpired: vi.fn(() => false),
  willTokenExpireSoon: vi.fn(() => false),
  decodeToken: vi.fn(() => null),
}));

import * as authService from '../services/authService';
import * as tokenStorage from '../utils/tokenStorage';

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tokenStorage.getAccessToken.mockReturnValue(null);
    tokenStorage.getRefreshToken.mockReturnValue(null);
    tokenStorage.getUser.mockReturnValue(null);
  });

  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

  it('deve inicializar com user null e isLoading false', async () => {
    const { result } = renderHook(
      () => React.useContext(AuthContext),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('deve fazer login com sucesso', async () => {
      id: '1',
      name: 'Teste User',
      email: 'teste@example.com',
      role: 'user',
    };

      success: true,
      user: mockUser,
      accessToken: 'fake-access-token',
      refreshToken: 'fake-refresh-token',
    };

    authService.login.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(
      () => React.useContext(AuthContext),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let loginResult;
    await act(async () => {
      loginResult = await result.current.login('teste@example.com', 'senha123');
    });

    await waitFor(() => {
      expect(loginResult.success).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(tokenStorage.saveAuthData).toHaveBeenCalled();
    });
  });

  it('deve retornar erro ao fazer login com credenciais inválidas', async () => {

    authService.login.mockRejectedValueOnce(mockError);

    const { result } = renderHook(
      () => React.useContext(AuthContext),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let loginResult;
    await act(async () => {
      loginResult = await result.current.login('teste@example.com', 'senha-errada');
    });

    expect(loginResult.success).toBe(false);
    expect(loginResult.message).toBe('Email ou senha inválidos');
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('deve fazer logout e limpar dados', async () => {
    // Simular usuário logado
      id: '1',
      name: 'Test',
      email: 'test@example.com',
      role: 'user',
    };

    tokenStorage.getAccessToken.mockReturnValue('fake-token');
    tokenStorage.getUser.mockReturnValue(mockUser);
    tokenStorage.isTokenExpired.mockReturnValue(false);

    authService.logout.mockResolvedValueOnce({ success: true });

    const { result } = renderHook(
      () => React.useContext(AuthContext),
      { wrapper }
    );

    // Aguardar carregamento inicial
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Fazer logout
    await act(async () => {
      await result.current.logout();
    });

    await waitFor(() => {
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(tokenStorage.clearAuthData).toHaveBeenCalled();
    });
  });

  it('deve registrar novo usuário com sucesso', async () => {
      id: '1',
      name: 'Novo User',
      email: 'novo@example.com',
      role: 'user',
    };

      success: true,
      user: mockUser,
      accessToken: 'fake-access-token',
      refreshToken: 'fake-refresh-token',
    };

    authService.register.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(
      () => React.useContext(AuthContext),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let registerResult;
    await act(async () => {
      registerResult = await result.current.register(
        'Novo User',
        'novo@example.com',
        'senha123'
      );
    });

    await waitFor(() => {
      expect(registerResult.success).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  it('deve retornar erro ao registrar com email duplicado', async () => {

    authService.register.mockRejectedValueOnce(mockError);

    const { result } = renderHook(
      () => React.useContext(AuthContext),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let registerResult;
    await act(async () => {
      registerResult = await result.current.register(
        'Test',
        'existente@example.com',
        'senha123'
      );
    });

    expect(registerResult.success).toBe(false);
    expect(registerResult.message).toBe('Email já cadastrado');
    expect(result.current.user).toBeNull();
  });

  it('deve carregar usuário do localStorage ao inicializar', async () => {
      id: '1',
      name: 'Saved User',
      email: 'saved@example.com',
      role: 'user',
    };

    tokenStorage.getAccessToken.mockReturnValue('valid-token');
    tokenStorage.getUser.mockReturnValue(mockUser);
    tokenStorage.isTokenExpired.mockReturnValue(false);

    const { result } = renderHook(
      () => React.useContext(AuthContext),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  it('deve limpar dados se token estiver expirado', async () => {
      id: '1',
      name: 'Expired User',
      email: 'expired@example.com',
      role: 'user',
    };

    tokenStorage.getAccessToken.mockReturnValue('expired-token');
    tokenStorage.getUser.mockReturnValue(mockUser);
    tokenStorage.isTokenExpired.mockReturnValue(true);
    tokenStorage.getRefreshToken.mockReturnValue(null); // Sem refresh token

    const { result } = renderHook(
      () => React.useContext(AuthContext),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});
