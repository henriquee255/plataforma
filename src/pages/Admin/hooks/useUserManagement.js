import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para CRUD de usuários
 * Gerencia lista de usuários e operações
 *
 * @returns {Object} Users data e operações CRUD
 */
export const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch users inicial
  useEffect(() => {
    fetchUsers();
  }, []);

  /**
   * Busca lista de usuários da API
   */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        // Se API não responde, retorna array vazio
        console.warn('Erro ao buscar usuários da API:', response.status);
        setUsers([]);
        return;
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      // Retorna array vazio ao invés de mostrar erro
      setUsers([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cria novo usuário (via API)
   */
  const createUser = useCallback(async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar usuário');
      }

      const data = await response.json();
      setUsers(prev => [...prev, data]);

      return { success: true, user: data };
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err.message || 'Erro ao criar usuário');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Atualiza usuário existente
   */
  const updateUser = useCallback(async (id, updates) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar usuário');
      }

      const updatedUser = await response.json();
      setUsers(prev =>
        prev.map(user => user._id === id ? updatedUser : user)
      );

      return { success: true };
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.message || 'Erro ao atualizar usuário');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Deleta usuário
   */
  const deleteUser = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao deletar usuário');
      }

      setUsers(prev => prev.filter(user => user._id !== id));

      return { success: true };
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.message || 'Erro ao deletar usuário');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Suspende usuário
   */
  const suspendUser = useCallback(async (id) => {
    return updateUser(id, { status: 'Suspenso' });
  }, [updateUser]);

  /**
   * Reativa usuário
   */
  const activateUser = useCallback(async (id) => {
    return updateUser(id, { status: 'Ativo' });
  }, [updateUser]);

  /**
   * Altera plano do usuário
   */
  const changePlan = useCallback(async (id, newPlan) => {
    return updateUser(id, { plano: newPlan });
  }, [updateUser]);

  /**
   * Altera role do usuário
   */
  const changeRole = useCallback(async (id, newRole) => {
    try {
      const response = await fetch(`/api/users/${id}/role`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao alterar role');
      }

      const updatedUser = await response.json();
      setUsers(prev =>
        prev.map(user => user._id === id ? updatedUser : user)
      );

      return { success: true };
    } catch (err) {
      console.error('Error changing role:', err);
      return { success: false, error: err.message };
    }
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    suspendUser,
    activateUser,
    changePlan,
    changeRole,
    refetch: fetchUsers
  };
};

export default useUserManagement;
