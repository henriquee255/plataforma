import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useToast } from '../contexts/ToastContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useInbox = () => {
  const { token } = useAuth();
  const toast = useToast();

  const [messages, setMessages] = useState([]);
  const [conversas, setConversas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch messages
   */
  const fetchMessages = useCallback(async (companyId, filters = {}) => {
    if (!companyId || !token) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        companyId,
        ...filters
      });

      const response = await fetch(`${API_BASE_URL}/api/inbox?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar mensagens');
      }

      const data = await response.json();
      setMessages(data.data || []);
      return data;
    } catch (err) {
      console.error('❌ Erro ao buscar mensagens:', err);
      setError(err.message);
      toast?.error?.(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  /**
   * Fetch conversations
   */
  const fetchConversas = useCallback(async (companyId, limit = 20) => {
    if (!companyId || !token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/inbox/conversas/grouped?companyId=${companyId}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar conversas');
      }

      const data = await response.json();
      setConversas(data.data || []);
      return data;
    } catch (err) {
      console.error('❌ Erro ao buscar conversas:', err);
      setError(err.message);
      toast?.error?.(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  /**
   * Send message
   */
  const sendMessage = useCallback(async (companyId, conversationId, messageData) => {
    if (!companyId || !conversationId || !token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/inbox`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          companyId,
          conversationId,
          ...messageData
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem');
      }

      const data = await response.json();
      setMessages([...messages, data.data]);
      toast?.success?.('Mensagem enviada com sucesso');
      return data.data;
    } catch (err) {
      console.error('❌ Erro ao enviar mensagem:', err);
      setError(err.message);
      toast?.error?.(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, messages, toast]);

  /**
   * Mark message as read
   */
  const markAsRead = useCallback(async (companyId, messageId) => {
    if (!companyId || !token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/inbox/${messageId}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ companyId })
      });

      if (!response.ok) {
        throw new Error('Erro ao marcar como lida');
      }

      const data = await response.json();
      setMessages(messages.map(m => m._id === messageId ? data.data : m));
      return data.data;
    } catch (err) {
      console.error('❌ Erro ao marcar como lida:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, messages]);

  /**
   * Update message
   */
  const updateMessage = useCallback(async (companyId, messageId, updates) => {
    if (!companyId || !token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/inbox/${messageId}`, {
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
        throw new Error('Erro ao atualizar mensagem');
      }

      const data = await response.json();
      setMessages(messages.map(m => m._id === messageId ? data.data : m));
      toast?.success?.('Mensagem atualizada com sucesso');
      return data.data;
    } catch (err) {
      console.error('❌ Erro ao atualizar mensagem:', err);
      setError(err.message);
      toast?.error?.(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, messages, toast]);

  /**
   * Delete message
   */
  const deleteMessage = useCallback(async (companyId, messageId) => {
    if (!companyId || !token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/inbox/${messageId}?companyId=${companyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar mensagem');
      }

      setMessages(messages.filter(m => m._id !== messageId));
      toast?.success?.('Mensagem deletada com sucesso');
    } catch (err) {
      console.error('❌ Erro ao deletar mensagem:', err);
      setError(err.message);
      toast?.error?.(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, messages, toast]);

  return {
    messages,
    setMessages,
    conversas,
    setConversas,
    loading,
    error,
    fetchMessages,
    fetchConversas,
    sendMessage,
    markAsRead,
    updateMessage,
    deleteMessage
  };
};
