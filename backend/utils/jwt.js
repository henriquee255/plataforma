import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const ACCESS_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION || '15m';
const REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '7d';

/**
 * Gerar Access Token (curta duração - 15min)
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_EXPIRATION,
  });
};

/**
 * Gerar Refresh Token (longa duração - 7d)
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_EXPIRATION,
  });
};

/**
 * Verificar e decodificar token
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expirado');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Token inválido');
    }
    throw error;
  }
};

/**
 * Extrair token do header Authorization
 */
export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) {
    throw new Error('Authorization header não fornecido');
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new Error('Formato de token inválido. Use: Bearer {token}');
  }

  return parts[1];
};

/**
 * Decodificar token sem verificar (útil para debug)
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  extractTokenFromHeader,
  decodeToken,
};
