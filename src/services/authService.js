/**
 * Auth Service - MOCK VERSION
 * Simulação de autenticação sem backend
 */

// Configuração
const USE_MOCK = true; // Sempre usar mock para desenvolvimento frontend-only
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Gerar token JWT falso (apenas para simulação)
 */
const generateMockToken = (expiresIn = 3600) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: Date.now().toString(),
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresIn,
  }));
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
};

/**
 * Delay para simular latência de rede
 */
const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * MOCK: Registrar novo usuário
 */
const mockRegister = async (userData) => {
  await mockDelay(800);

  // Verificar se usuário já existe
  const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
  const existingUser = users.find(u => u.email === userData.email);

  if (existingUser) {
    throw new Error('Email já cadastrado');
  }

  // Criar novo usuário
  const newUser = {
    id: Date.now().toString(),
    name: userData.name,
    email: userData.email,
    password: userData.password, // Em produção, seria hash
    role: 'user',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=9333ea&color=fff&size=128`,
    createdAt: new Date().toISOString(),
  };

  // Salvar no localStorage
  users.push(newUser);
  localStorage.setItem('mock_users', JSON.stringify(users));

  // Retornar dados com tokens
  const { password, ...userWithoutPassword } = newUser;
  return {
    user: userWithoutPassword,
    accessToken: generateMockToken(3600), // 1 hora
    refreshToken: generateMockToken(86400), // 1 dia
  };
};

/**
 * MOCK: Fazer login
 */
const mockLogin = async (credentials) => {
  await mockDelay(600);

  // ADMIN HARDCODED - Acesso ao painel administrativo
  if (credentials.email === 'eu.henriquee2501@gmail.com' && credentials.password === 'admin@2026') {
    const adminUser = {
      id: 'admin-001',
      name: 'Henrique',
      email: 'eu.henriquee2501@gmail.com',
      role: 'admin',
      avatar: 'https://ui-avatars.com/api/?name=Henrique&background=9333ea&color=fff&size=128',
      createdAt: new Date().toISOString(),
    };

    return {
      user: adminUser,
      accessToken: generateMockToken(3600),
      refreshToken: generateMockToken(86400),
    };
  }

  // Login normal de usuários
  const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
  const user = users.find(u => u.email === credentials.email);

  if (!user) {
    throw new Error('Email ou senha incorretos');
  }

  if (user.password !== credentials.password) {
    throw new Error('Email ou senha incorretos');
  }

  const { password, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
    accessToken: generateMockToken(3600),
    refreshToken: generateMockToken(86400),
  };
};

/**
 * MOCK: Renovar access token
 */
const mockRefreshTokens = async (refreshToken) => {
  await mockDelay(300);

  return {
    accessToken: generateMockToken(3600),
    refreshToken: generateMockToken(86400),
  };
};

/**
 * MOCK: Fazer logout
 */
const mockLogout = async (refreshToken) => {
  await mockDelay(200);
  return { success: true };
};

/**
 * MOCK: Obter dados do usuário autenticado
 */
const mockGetMe = async (accessToken) => {
  await mockDelay(300);

  // Decodificar token mockado (simplificado)
  const userData = JSON.parse(localStorage.getItem('user'));
  if (!userData) {
    throw new Error('Usuário não encontrado');
  }

  return userData;
};

/**
 * Fazer requisição à API REAL (não usado atualmente)
 */
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erro na requisição');
  }

  return data;
};

/**
 * Registrar novo usuário
 */
export const register = async (userData) => {
  if (USE_MOCK) {
    return mockRegister(userData);
  }

  return fetchAPI('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

/**
 * Fazer login
 */
export const login = async (credentials) => {
  if (USE_MOCK) {
    return mockLogin(credentials);
  }

  return fetchAPI('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

/**
 * Renovar access token
 */
export const refreshTokens = async (refreshToken) => {
  if (USE_MOCK) {
    return mockRefreshTokens(refreshToken);
  }

  return fetchAPI('/api/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
};

/**
 * Fazer logout
 */
export const logout = async (refreshToken) => {
  if (USE_MOCK) {
    return mockLogout(refreshToken);
  }

  return fetchAPI('/api/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
};

/**
 * Obter dados do usuário autenticado
 */
export const getMe = async (accessToken) => {
  if (USE_MOCK) {
    return mockGetMe(accessToken);
  }

  return fetchAPI('/api/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export default {
  register,
  login,
  refreshTokens,
  logout,
  getMe,
};
