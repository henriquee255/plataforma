/**
 * Middleware RBAC - Role-Based Access Control
 * Verifica se o usuário tem a role necessária para acessar a rota
 */

/**
 * Middleware que requer roles específicas
 * @param {string|string[]} allowedRoles - Role(s) permitida(s)
 */
const requireRole = (allowedRoles) => {
  // Normalizar para array
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    // Verificar se usuário está autenticado (deve vir do middleware authenticate)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado',
      });
    }

    // Verificar se usuário tem role adequada
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Você não tem permissão para acessar este recurso.',
        requiredRoles: roles,
        userRole: req.user.role,
      });
    }

    // Usuário tem permissão, continuar
    next();
  };
};

/**
 * Middleware que requer role admin
 */
const requireAdmin = requireRole('admin');

/**
 * Middleware que requer role admin ou manager
 */
const requireManager = requireRole(['admin', 'manager']);

module.exports = {
  requireRole,
  requireAdmin,
  requireManager,
};
