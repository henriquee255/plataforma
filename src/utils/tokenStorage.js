/**
 * Token Storage Utilities
 * Gerencia armazenamento seguro de tokens JWT
 */

const ACCESS_TOKEN_KEY = 'plataforma_access_token';
const REFRESH_TOKEN_KEY = 'plataforma_refresh_token';
const USER_KEY = 'plataforma_user';

/**
 * Salvar access token
 */
export const saveAccessToken = (token) => {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
};

/**
 * Obter access token
 */
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Salvar refresh token
 */
export const saveRefreshToken = (token) => {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
};

/**
 * Obter refresh token
 */
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Salvar dados do usuário
 */
export const saveUser = (user) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

/**
 * Obter dados do usuário
 */
export const getUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Erro ao parsear usuário:', error);
    return null;
  }
};

/**
 * Salvar tudo (access token, refresh token, user)
 */
export const saveAuthData = ({ accessToken, refreshToken, user }) => {
  saveAccessToken(accessToken);
  saveRefreshToken(refreshToken);
  saveUser(user);
};

/**
 * Limpar todos os dados de autenticação
 */
export const clearAuthData = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Verificar se está autenticado (tem tokens salvos)
 */
export const hasAuthData = () => {
  return !!getAccessToken() && !!getRefreshToken();
};

/**
 * Decodificar JWT (sem verificar assinatura)
 * Útil para verificar expiração no frontend
 */
export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
};

/**
 * Verificar se token está expirado
 */
export const isTokenExpired = (token) => {
  if (!token) return true;

  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  // exp está em segundos, Date.now() em milissegundos
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

/**
 * Verificar se token vai expirar em breve (próximos 5 minutos)
 */
export const willTokenExpireSoon = (token, minutesThreshold = 5) => {
  if (!token) return true;

  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Date.now() / 1000;
  const expirationTime = decoded.exp;
  const timeUntilExpiration = expirationTime - currentTime;

  // Converter threshold de minutos para segundos
  return timeUntilExpiration < minutesThreshold * 60;
};

export default {
  saveAccessToken,
  getAccessToken,
  saveRefreshToken,
  getRefreshToken,
  saveUser,
  getUser,
  saveAuthData,
  clearAuthData,
  hasAuthData,
  decodeToken,
  isTokenExpired,
  willTokenExpireSoon,
};
