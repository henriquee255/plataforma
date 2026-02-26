import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';

/**
 * Context de Assinaturas e Empresas
 * Gerencia estado global de subscription, companies e permissions
 */
const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const { user } = useAuth();

  // Estado
  const [subscription, setSubscription] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Buscar assinatura do usuário
   */
  const fetchSubscription = useCallback(async () => {
    if (!user) return;

    try {
      // TODO: Substituir por API real
      // const response = await api.get('/api/subscriptions/me');
      // setSubscription(response.data.data);

      // TODO: Buscar dados da API
      setSubscription(null);
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError(err.message);
    }
  }, [user]);

  /**
   * Buscar empresas do usuário
   */
  const fetchCompanies = useCallback(async () => {
    if (!user) return;

    try {
      // TODO: Substituir por API real
      // const response = await api.get('/api/companies/my-companies');
      // const { owned, member } = response.data.data;
      // setCompanies([...owned, ...member]);

      // Mock data
        {
          _id: 'company-1',
          name: user.empresa || 'Minha Empresa',
          slug: (user.empresa || 'minha-empresa').toLowerCase().replace(/\s+/g, '-'),
          logo: null,
          ownerId: user._id,
          inheritedPlan: subscription?.plan || 'free',
          status: 'active',
          role: 'owner', // Role do usuário atual nesta empresa
          department: null,
          permissions: ['all'],
          members: [
            {
              userId: user._id,
              role: 'owner',
              department: null,
              permissions: ['all'],
              joinedAt: new Date(),
            },
          ],
          usage: {
            totalMembers: 1,
            storageUsed: 0,
            contactsCount: 0,
            messagesCount: 0,
          },
        },
      ];

      setCompanies(mockCompanies);

      // Definir empresa atual
      const savedCompanyId = localStorage.getItem('currentCompanyId');
      const company = mockCompanies.find((c) => c._id === savedCompanyId) || mockCompanies[0];
      setCurrentCompany(company);
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, subscription]);

  /**
   * Carregar dados ao montar
   */
  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user, fetchSubscription]);

  useEffect(() => {
    if (subscription) {
      fetchCompanies();
    }
  }, [subscription, fetchCompanies]);

  /**
   * Trocar empresa atual
   */
  const switchCompany = useCallback((companyId) => {
    const company = companies.find((c) => c._id === companyId);
    if (company) {
      setCurrentCompany(company);
      localStorage.setItem('currentCompanyId', companyId);
    }
  }, [companies]);

  /**
   * Verificar se pode criar empresa
   */
  const canCreateCompany = useCallback(() => {
    if (!subscription) return false;

    const LIMITS = {
      free: 0,
      starter: 1,
      professional: 3,
      enterprise: 5,
    };

    const ownedCompanies = companies.filter((c) => c.ownerId === user?._id);
    return ownedCompanies.length < LIMITS[subscription.plan];
  }, [subscription, companies, user]);

  /**
   * Verificar se tem feature
   */
  const hasFeature = useCallback((featureName) => {
    if (!currentCompany) return false;

    const PLAN_FEATURES = {
      free: [],
      starter: ['dashboard', 'crm', 'contacts', 'inbox', 'team'],
      professional: [
        'dashboard',
        'crm',
        'contacts',
        'inbox',
        'team',
        'integrations',
        'reports',
        'automations',
      ],
      enterprise: [
        'dashboard',
        'crm',
        'contacts',
        'inbox',
        'team',
        'integrations',
        'reports',
        'automations',
        'ia',
        'whitelabel',
        'api',
      ],
    };

    return PLAN_FEATURES[currentCompany.inheritedPlan]?.includes(featureName) || false;
  }, [currentCompany]);

  /**
   * Verificar se tem permissão
   */
  const hasPermission = useCallback((permission) => {
    if (!currentCompany || !user) return false;

    const member = currentCompany.members?.find((m) => m.userId === user._id);
    if (!member) return false;

    // Owner tem tudo
    if (member.permissions.includes('all')) return true;

    return member.permissions.includes(permission);
  }, [currentCompany, user]);

  /**
   * Criar empresa
   */
  const createCompany = useCallback(async (companyData) => {
    try {
      setLoading(true);

      // TODO: Substituir por API real
      // const response = await api.post('/api/companies', companyData);
      // const newCompany = response.data.data;

      const newCompany = {
        _id: `company-${Date.now()}`,
        ...companyData,
        slug: companyData.name.toLowerCase().replace(/\s+/g, '-'),
        ownerId: user._id,
        inheritedPlan: subscription.plan,
        status: 'active',
        role: 'owner',
        permissions: ['all'],
        members: [
          {
            userId: user._id,
            role: 'owner',
            department: null,
            permissions: ['all'],
            joinedAt: new Date(),
          },
        ],
        createdAt: new Date(),
      };

      setCompanies((prev) => [...prev, newCompany]);
      setCurrentCompany(newCompany);
      localStorage.setItem('currentCompanyId', newCompany._id);

      // Atualizar usage da subscription
      setSubscription((prev) => ({
        ...prev,
        usage: {
          ...prev.usage,
          companiesCreated: prev.usage.companiesCreated + 1,
        },
      }));

      return { success: true, data: newCompany };
    } catch (err) {
      console.error('Error creating company:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [user, subscription]);

  /**
   * Refetch tudo
   */
  const refetch = useCallback(() => {
    fetchSubscription();
    fetchCompanies();
  }, [fetchSubscription, fetchCompanies]);

  const value = {
    // Estado
    subscription,
    companies,
    currentCompany,
    loading,
    error,

    // Ações
    switchCompany,
    createCompany,
    refetch,

    // Helpers
    canCreateCompany: canCreateCompany(),
    hasFeature,
    hasPermission,

    // Computed
    plan: subscription?.plan || 'free',
    isOwner: currentCompany?.ownerId === user?._id,
    role: currentCompany?.role || null,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

/**
 * Hook para usar SubscriptionContext
 */
export const useSubscription = () => {
  const context = useContext(SubscriptionContext);

  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }

  return context;
};

export default SubscriptionContext;
