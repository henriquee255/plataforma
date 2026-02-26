import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/requireRole.js';

const router = express.Router();

/**
 * Todas as rotas de usuários requerem autenticação e role admin
 */

/**
 * GET /api/users
 * Listar todos os usuários
 */
router.get('/', authenticate, requireAdmin, getAllUsers);

/**
 * GET /api/users/:id
 * Obter usuário por ID
 */
router.get('/:id', authenticate, requireAdmin, getUserById);

/**
 * PATCH /api/users/:id/role
 * Atualizar role do usuário
 */
router.patch('/:id/role', authenticate, requireAdmin, updateUserRole);

/**
 * DELETE /api/users/:id
 * Deletar usuário
 */
router.delete('/:id', authenticate, requireAdmin, deleteUser);

export default router;
