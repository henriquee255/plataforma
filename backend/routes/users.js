const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/requireRole');

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

module.exports = router;
