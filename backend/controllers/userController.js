import UserModel from '../models/User.js';

/**
 * GET /api/users
 * Listar todos os usuários (admin only)
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll();

    // Remover senhas da resposta
    const usersWithoutPassword = users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return res.status(200).json({
      success: true,
      users: usersWithoutPassword,
      total: usersWithoutPassword.length,
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao listar usuários',
      error: error.message,
    });
  }
};

/**
 * GET /api/users/:id
 * Obter usuário por ID (admin only)
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
      });
    }

    // Remover senha da resposta
    const { password, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuário',
      error: error.message,
    });
  }
};

/**
 * PATCH /api/users/:id/role
 * Atualizar role do usuário (admin only)
 */
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validar role
    const validRoles = ['admin', 'manager', 'user'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role inválida. Valores permitidos: admin, manager, user',
        validRoles,
      });
    }

    // Buscar usuário
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
      });
    }

    // Não permitir que admin altere própria role
    if (user.id === req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Você não pode alterar sua própria role',
      });
    }

    // Atualizar role
    const updatedUser = await UserModel.update(id, { role });

    // Remover senha da resposta
    const { password, ...userWithoutPassword } = updatedUser;

    return res.status(200).json({
      success: true,
      message: `Role do usuário atualizada para: ${role}`,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Erro ao atualizar role:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao atualizar role do usuário',
      error: error.message,
    });
  }
};

/**
 * DELETE /api/users/:id
 * Deletar usuário (admin only)
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Não permitir que admin delete a si mesmo
    if (id === req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Você não pode deletar sua própria conta',
      });
    }

    const deleted = await UserModel.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Usuário deletado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao deletar usuário',
      error: error.message,
    });
  }
};

export default {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
};
