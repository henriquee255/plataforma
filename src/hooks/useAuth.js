import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Hook personalizado para acessar o AuthContext
 * Facilita o uso da autenticação nos componentes
 *
 * @example
 * const { user, login, logout, isAuthenticated } = useAuth();
 *
 * @returns {Object} Contexto de autenticação
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};

export default useAuth;
