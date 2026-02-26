// TODO: Implementar autenticação OAuth (Google, Facebook, Microsoft)
// TODO: Adicionar autenticação de dois fatores (2FA)
// TODO: Implementar recuperação de senha por email
// TODO: Adicionar limite de tentativas de login
// TODO: Implementar sessões simultâneas
import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import * as authService from '../services/authService';
import * as tokenStorage from '../utils/tokenStorage';

/**
 * Contexto de autenticação da aplicação
 * @typedef {Object} AuthContextType
 * @property {Object|null} user - Dados do usuário autenticado
 * @property {boolean} isLoading - Indica se está carregando dados de autenticação
 * @property {boolean} isAuthenticated - Indica se usuário está autenticado
 * @property {Function} login - Função para realizar login
 * @property {Function} register - Função para realizar registro
 * @property {Function} logout - Função para realizar logout
 * @property {Function} refreshToken - Função para renovar tokens
 */
export const AuthContext = createContext();

/**
 * Provider do contexto de autenticação
 * Gerencia estado de autenticação, login, registro e renovação de tokens
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes filhos
 * @returns {JSX.Element}
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const refreshTimeoutRef = useRef(null);

  /**
   * Carregar usuário do localStorage ao montar componente
   * Verifica se token é válido e agenda renovação automática
   */
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const accessToken = tokenStorage.getAccessToken();
        const savedUser = tokenStorage.getUser();

        if (accessToken && savedUser) {
          // Verificar se token ainda é válido
          if (!tokenStorage.isTokenExpired(accessToken)) {
            setUser(savedUser);
            setIsAuthenticated(true);
            scheduleTokenRefresh(accessToken);
          } else {
            // Tentar renovar com refresh token
            await handleRefreshToken();
          }
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        tokenStorage.clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();

    // Cleanup
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Agendar renovação automática do token antes de expirar
   * @param {string} accessToken - Token de acesso JWT
   */
  const scheduleTokenRefresh = useCallback((accessToken) => {
    // Limpar timeout anterior
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    // Renovar 2 minutos antes de expirar
    if (tokenStorage.willTokenExpireSoon(accessToken, 2)) {
      handleRefreshToken();
    } else {
      const decoded = tokenStorage.decodeToken(accessToken);
      if (decoded && decoded.exp) {
        const currentTime = Date.now() / 1000;
        const timeUntilExpiration = (decoded.exp - currentTime - 120) * 1000; // 2min antes

        refreshTimeoutRef.current = setTimeout(() => {
          handleRefreshToken();
        }, Math.max(timeUntilExpiration, 0));
      }
    }
  }, []);

  /**
   * Renovar tokens usando refresh token
   * @throws {Error} Se refresh token for inválido ou expirado
   */
  const handleRefreshToken = async () => {
    try {
      const refreshToken = tokenStorage.getRefreshToken();

      if (!refreshToken || tokenStorage.isTokenExpired(refreshToken)) {
        throw new Error('Refresh token inválido ou expirado');
      }

      const data = await authService.refreshTokens(refreshToken);

      tokenStorage.saveAuthData({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user,
      });

      scheduleTokenRefresh(data.accessToken);
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      await handleLogout();
    }
  };

  /**
   * Realizar login do usuário
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise<{success: boolean, message?: string}>} Resultado do login
   */
  const handleLogin = async (email, password) => {
    try {
      setIsLoading(true);

      const data = await authService.login({ email, password });

      tokenStorage.saveAuthData({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });

      setUser(data.user);
      setIsAuthenticated(true);
      scheduleTokenRefresh(data.accessToken);

      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        message: error.message || 'Erro ao fazer login',
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Realizar registro de novo usuário
   * @param {Object} userData - Dados do usuário a ser registrado
   * @returns {Promise<{success: boolean, message?: string}>} Resultado do registro
   */
  const handleRegister = async (userData) => {
    try {
      setIsLoading(true);

      const data = await authService.register(userData);

      tokenStorage.saveAuthData({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });

      setUser(data.user);
      setIsAuthenticated(true);
      scheduleTokenRefresh(data.accessToken);

      return { success: true };
    } catch (error) {
      console.error('Erro no registro:', error);
      return {
        success: false,
        message: error.message || 'Erro ao criar conta',
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Realizar logout e limpar dados de autenticação
   */
  const handleLogout = async () => {
    try {
      const refreshToken = tokenStorage.getRefreshToken();

      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      // Limpar dados locais sempre, mesmo se API falhar
      tokenStorage.clearAuthData();
      setUser(null);
      setIsAuthenticated(false);

      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshToken: handleRefreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
