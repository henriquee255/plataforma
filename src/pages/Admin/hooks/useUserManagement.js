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
   * Busca lista de usuários
   */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Substituir por API real
      // const response = await fetch('/api/admin/users');
      // const data = await response.json();

      // Mock data
      const mockUsers = [
        {
          id: '1',
          nome: 'João Silva',
          email: 'joao@empresa.com',
          telefone: '(11) 98765-4321',
          cpf: '123.456.789-00',
          plano: 'professional',
          status: 'Ativo',
          role: 'user',
          empresa: 'Tech Corp',
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          nome: 'Maria Santos',
          email: 'maria@startup.com',
          telefone: '(11) 91234-5678',
          cpf: '987.654.321-00',
          plano: 'enterprise',
          status: 'Ativo',
          role: 'Admin',
          empresa: 'Startup XYZ',
          createdAt: '2024-02-20'
        }
        // ... mais usuários mockados
      ];

      setUsers(mockUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Erro ao buscar usuários');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cria novo usuário
   */
  const createUser = useCallback(async (userData) => {
    setLoading(true);
    setError(null);

    try {
      // TODO: API call
      // const response = await fetch('/api/admin/users', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData)
      // });
      // const newUser = await response.json();

      const newUser = {
        ...userData,
        id: `user-${Date.now()}`,
        createdAt: new Date().toISOString()
      };

      setUsers(prev => [...prev, newUser]);

      return { success: true, user: newUser };
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
      // TODO: API call
      // const response = await fetch(`/api/admin/users/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updates)
      // });
      // const updatedUser = await response.json();

      setUsers(prev =>
        prev.map(user =>
          user.id === id
            ? { ...user, ...updates, updatedAt: new Date().toISOString() }
            : user
        )
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
      // TODO: API call
      // await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });

      setUsers(prev => prev.filter(user => user.id !== id));

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
    return updateUser(id, { role: newRole });
  }, [updateUser]);

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
