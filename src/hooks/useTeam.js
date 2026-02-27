import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useToast } from '../contexts/ToastContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useTeam = () => {
  const { token } = useAuth();
  const toast = useToast();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch team members
   */
  const fetchMembers = useCallback(async (companyId, filters = {}) => {
    if (!companyId || !token) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        companyId,
        ...filters
      });

      const response = await fetch(`${API_BASE_URL}/api/team?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar membros da equipe');
      }

      const data = await response.json();
      setMembers(data.data || []);
      return data;
    } catch (err) {
      console.error('❌ Erro ao buscar membros:', err);
      setError(err.message);
      toast?.error?.(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  /**
   * Add member to team
   */
  const addMember = useCallback(async (companyId, userId, role = 'membro') => {
    if (!companyId || !userId || !token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/team`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          companyId,
          userId,
          role
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar membro');
      }

      const data = await response.json();
      setMembers([...members, data.data]);
      toast?.success?.('Membro adicionado com sucesso');
      return data.data;
    } catch (err) {
      console.error('❌ Erro ao adicionar membro:', err);
      setError(err.message);
      toast?.error?.(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, members, toast]);

  /**
   * Update member
   */
  const updateMember = useCallback(async (companyId, memberId, updates) => {
    if (!companyId || !token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/team/${memberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          companyId,
          ...updates
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar membro');
      }

      const data = await response.json();
      setMembers(members.map(m => m._id === memberId ? data.data : m));
      toast?.success?.('Membro atualizado com sucesso');
      return data.data;
    } catch (err) {
      console.error('❌ Erro ao atualizar membro:', err);
      setError(err.message);
      toast?.error?.(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, members, toast]);

  /**
   * Update member permissions
   */
  const updatePermissions = useCallback(async (companyId, memberId, permissoes) => {
    if (!companyId || !token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/team/${memberId}/permissoes`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          companyId,
          permissoes
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar permissões');
      }

      const data = await response.json();
      setMembers(members.map(m => m._id === memberId ? data.data : m));
      toast?.success?.('Permissões atualizadas com sucesso');
      return data.data;
    } catch (err) {
      console.error('❌ Erro ao atualizar permissões:', err);
      setError(err.message);
      toast?.error?.(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, members, toast]);

  /**
   * Remove member from team
   */
  const removeMember = useCallback(async (companyId, memberId) => {
    if (!companyId || !token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/team/${memberId}?companyId=${companyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao remover membro');
      }

      setMembers(members.filter(m => m._id !== memberId));
      toast?.success?.('Membro removido com sucesso');
    } catch (err) {
      console.error('❌ Erro ao remover membro:', err);
      setError(err.message);
      toast?.error?.(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, members, toast]);

  return {
    members,
    setMembers,
    loading,
    error,
    fetchMembers,
    addMember,
    updateMember,
    updatePermissions,
    removeMember
  };
};
