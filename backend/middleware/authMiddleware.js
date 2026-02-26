import { verifyToken, extractTokenFromHeader } from '../utils/jwt.js';
import UserModel from '../models/User.js';

/**
 * Middleware de autenticação JWT
 * Verifica se o usuário está autenticado e adiciona req.user
 */
export const authenticate = async (req, res, next) => {
  try {
    // Extrair token do header
    const token = extractTokenFromHeader(req.headers.authorization);

    // Verificar token
    const decoded = verifyToken(token);

    // Buscar usuário no banco
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado',
      });
    }

    // Adicionar user ao request (sem a senha)
    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || 'Token inválido',
    });
  }
};

/**
 * Middleware opcional de autenticação
 * Se houver token válido, adiciona req.user, senão continua sem autenticação
 */
export const optionalAuthenticate = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return next();
    }

    const token = extractTokenFromHeader(req.headers.authorization);
    const decoded = verifyToken(token);
    const user = await UserModel.findById(decoded.userId);

    if (user) {
      const { password, ...userWithoutPassword } = user;
      req.user = userWithoutPassword;
    }

    next();
  } catch (error) {
    // Ignora erros de token no modo opcional
    next();
  }
};

export default {
  authenticate,
  optionalAuthenticate,
};
