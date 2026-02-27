import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useToast } from '../contexts/ToastContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useContacts = () => {
  const { token } = useAuth();
  const toast = useToast();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch contacts
   */
  const fetchContacts = useCallback(async (companyId, filters = {}) => {
    if (!companyId || !token) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        companyId,
        ...filters
      });

      const response = await fetch(`${API_BASE_URL}/api/contacts?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar contatos');
      }

      const data = await response.json();
      setContacts(data.data || []);
      return data;
    } catch (err) {
      console.error('❌ Erro ao buscar contatos:', err);
      setError(err.message);
      toast?.error?.(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  /**
   * Create contact
   */
  const createContact = useCallback(async (companyId, contactData) => {
    if (!companyId || !token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          companyId,
          ...contactData
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao criar contato');
      }

      const data = await response.json();
      setContacts([...contacts, data.data]);
      toast?.success?.('Contato criado com sucesso');
      return data.data;
    } catch (err) {
      console.error('❌ Erro ao criar contato:', err);
      setError(err.message);
      toast?.error?.(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, contacts, toast]);

  /**
   * Update contact
   */
  const updateContact = useCallback(async (companyId, contactId, updates) => {
    if (!companyId || !token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/contacts/${contactId}`, {
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
        throw new Error('Erro ao atualizar contato');
      }

      const data = await response.json();
      setContacts(contacts.map(c => c._id === contactId ? data.data : c));
      toast?.success?.('Contato atualizado com sucesso');
      return data.data;
    } catch (err) {
      console.error('❌ Erro ao atualizar contato:', err);
      setError(err.message);
      toast?.error?.(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, contacts, toast]);

  /**
   * Delete contact
   */
  const deleteContact = useCallback(async (companyId, contactId) => {
    if (!companyId || !token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/contacts/${contactId}?companyId=${companyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar contato');
      }

      setContacts(contacts.filter(c => c._id !== contactId));
      toast?.success?.('Contato deletado com sucesso');
    } catch (err) {
      console.error('❌ Erro ao deletar contato:', err);
      setError(err.message);
      toast?.error?.(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, contacts, toast]);

  /**
   * Add note to contact
   */
  const addNote = useCallback(async (companyId, contactId, texto) => {
    if (!companyId || !token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/contacts/${contactId}/notas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          companyId,
          texto
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar nota');
      }

      const data = await response.json();
      toast?.success?.('Nota adicionada com sucesso');
      return data.data;
    } catch (err) {
      console.error('❌ Erro ao adicionar nota:', err);
      setError(err.message);
      toast?.error?.(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  return {
    contacts,
    setContacts,
    loading,
    error,
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
    addNote
  };
};
