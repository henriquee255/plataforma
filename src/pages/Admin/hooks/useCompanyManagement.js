import { useState, useCallback, useEffect } from 'react';

/**
 * Hook para gerenciamento de empresas
 * CRUD completo + operações especiais
 */
export const useCompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Buscar empresas (mock - substituir por API real)
   */
  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Substituir por chamada real à API
      // const response = await api.get('/admin/companies');
      // setCompanies(response.data);

      // Mock data
      const mockCompanies = [
        {
          id: '1',
          name: 'Empresa Alpha',
          logo: null,
          status: 'Ativo',
          membersCount: 25,
          ownerName: 'João Silva',
          ownerEmail: 'joao@alpha.com',
          createdAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          name: 'Beta Solutions',
          logo: null,
          status: 'Ativo',
          membersCount: 12,
          ownerName: 'Maria Santos',
          ownerEmail: 'maria@beta.com.br',
          createdAt: '2024-02-01T14:30:00Z',
        },
        {
          id: '3',
          name: 'Gamma Tech',
          logo: null,
          status: 'Suspenso',
          membersCount: 5,
          ownerName: 'Pedro Costa',
          ownerEmail: 'pedro@gamma.tech',
          createdAt: '2023-12-10T09:15:00Z',
        },
        {
          id: '4',
          name: 'Delta Corp',
          logo: null,
          status: 'Ativo',
          membersCount: 50,
          ownerName: 'Ana Oliveira',
          ownerEmail: 'ana@deltacorp.com',
          createdAt: '2024-01-20T11:45:00Z',
        },
        {
          id: '5',
          name: 'Epsilon Sistemas',
          logo: null,
          status: 'Ativo',
          membersCount: 8,
          ownerName: 'Carlos Mendes',
          ownerEmail: 'carlos@epsilon.com.br',
          createdAt: '2024-02-10T16:20:00Z',
        },
      ];

      setCompanies(mockCompanies);
    } catch (err) {
      setError(err.message || 'Erro ao buscar empresas');
      console.error('Erro ao buscar empresas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Criar nova empresa
   */
  const createCompany = useCallback(async (companyData) => {
    try {
      setLoading(true);
      setError(null);

      // TODO: API call
      // const response = await api.post('/admin/companies', companyData);
      // const newCompany = response.data;

      const newCompany = {
        id: Date.now().toString(),
        ...companyData,
        createdAt: new Date().toISOString(),
      };

      setCompanies((prev) => [newCompany, ...prev]);
      return newCompany;
    } catch (err) {
      setError(err.message || 'Erro ao criar empresa');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Atualizar empresa
   */
  const updateCompany = useCallback(async (companyId, updates) => {
    try {
      setLoading(true);
      setError(null);

      // TODO: API call
      // await api.patch(`/admin/companies/${companyId}`, updates);

      setCompanies((prev) =>
        prev.map((company) =>
          company.id === companyId ? { ...company, ...updates } : company
        )
      );
    } catch (err) {
      setError(err.message || 'Erro ao atualizar empresa');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Deletar empresa
   */
  const deleteCompany = useCallback(async (companyId) => {
    try {
      setLoading(true);
      setError(null);

      // TODO: API call
      // await api.delete(`/admin/companies/${companyId}`);

      setCompanies((prev) => prev.filter((company) => company.id !== companyId));
    } catch (err) {
      setError(err.message || 'Erro ao deletar empresa');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Suspender empresa
   */
  const suspendCompany = useCallback(async (companyId) => {
    try {
      setLoading(true);
      setError(null);

      // TODO: API call
      // await api.patch(`/admin/companies/${companyId}/suspend`);

      setCompanies((prev) =>
        prev.map((company) =>
          company.id === companyId ? { ...company, status: 'Suspenso' } : company
        )
      );
    } catch (err) {
      setError(err.message || 'Erro ao suspender empresa');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Ativar empresa
   */
  const activateCompany = useCallback(async (companyId) => {
    try {
      setLoading(true);
      setError(null);

      // TODO: API call
      // await api.patch(`/admin/companies/${companyId}/activate`);

      setCompanies((prev) =>
        prev.map((company) =>
          company.id === companyId ? { ...company, status: 'Ativo' } : company
        )
      );
    } catch (err) {
      setError(err.message || 'Erro ao ativar empresa');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Trocar plano da empresa
   */
  const changePlan = useCallback(async (companyId, newPlan) => {
    try {
      setLoading(true);
      setError(null);

      // TODO: API call
      // await api.patch(`/admin/companies/${companyId}/plan`, { plan: newPlan });

      setCompanies((prev) =>
        prev.map((company) =>
          company.id === companyId ? { ...company, plano: newPlan } : company
        )
      );
    } catch (err) {
      setError(err.message || 'Erro ao trocar plano');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refetch (atualizar dados)
   */
  const refetch = useCallback(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // Buscar empresas ao montar
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return {
    companies,
    loading,
    error,
    fetchCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    suspendCompany,
    activateCompany,
    changePlan,
    refetch,
  };
};
