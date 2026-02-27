import { useState, useCallback, useEffect } from 'react';

/**
 * Hook para gerenciar CRM com persistência no backend
 */
export const useCRM = (companyId) => {
  const [pipelines, setPipelines] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Buscar pipelines da empresa
   */
  const fetchPipelines = useCallback(async () => {
    if (!companyId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/crm/pipelines', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ companyId })
      });

      if (!response.ok) throw new Error('Erro ao buscar pipelines');

      const data = await response.json();
      setPipelines(data.pipelines || []);
    } catch (err) {
      console.error('Erro ao buscar pipelines:', err);
      setError(err.message);
      setPipelines([]);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  /**
   * Criar nova pipeline
   */
  const createPipeline = useCallback(async (pipelineData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/crm/pipelines', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...pipelineData, companyId })
      });

      if (!response.ok) throw new Error('Erro ao criar pipeline');

      const data = await response.json();
      setPipelines(prev => [...prev, data.pipeline]);
      return data.pipeline;
    } catch (err) {
      console.error('Erro ao criar pipeline:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  /**
   * Atualizar pipeline
   */
  const updatePipeline = useCallback(async (id, updates) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/crm/pipelines/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Erro ao atualizar pipeline');

      const data = await response.json();
      setPipelines(prev =>
        prev.map(p => p._id === id ? data.pipeline : p)
      );
      return data.pipeline;
    } catch (err) {
      console.error('Erro ao atualizar pipeline:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Deletar pipeline
   */
  const deletePipeline = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/crm/pipelines/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Erro ao deletar pipeline');

      setPipelines(prev => prev.filter(p => p._id !== id));
      setLeads(prev => prev.filter(l => l.pipelineId !== id));
    } catch (err) {
      console.error('Erro ao deletar pipeline:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Criar novo lead
   */
  const createLead = useCallback(async (leadData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...leadData, companyId })
      });

      if (!response.ok) throw new Error('Erro ao criar lead');

      const data = await response.json();
      setLeads(prev => [...prev, data.lead]);
      return data.lead;
    } catch (err) {
      console.error('Erro ao criar lead:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  /**
   * Atualizar lead
   */
  const updateLead = useCallback(async (id, updates) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/crm/leads/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Erro ao atualizar lead');

      const data = await response.json();
      setLeads(prev =>
        prev.map(l => l._id === id ? data.lead : l)
      );
      return data.lead;
    } catch (err) {
      console.error('Erro ao atualizar lead:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Deletar lead
   */
  const deleteLead = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/crm/leads/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Erro ao deletar lead');

      setLeads(prev => prev.filter(l => l._id !== id));
    } catch (err) {
      console.error('Erro ao deletar lead:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Adicionar nota ao lead
   */
  const addNota = useCallback(async (leadId, texto) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/crm/leads/${leadId}/notas`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ texto })
      });

      if (!response.ok) throw new Error('Erro ao adicionar nota');

      const data = await response.json();
      setLeads(prev =>
        prev.map(l => l._id === leadId ? data.lead : l)
      );
      return data.lead;
    } catch (err) {
      console.error('Erro ao adicionar nota:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar pipelines ao montar
  useEffect(() => {
    if (companyId) {
      fetchPipelines();
    }
  }, [companyId, fetchPipelines]);

  return {
    pipelines,
    leads,
    loading,
    error,
    fetchPipelines,
    createPipeline,
    updatePipeline,
    deletePipeline,
    createLead,
    updateLead,
    deleteLead,
    addNota
  };
};

export default useCRM;
