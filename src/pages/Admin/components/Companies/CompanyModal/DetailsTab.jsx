import React, { useState } from 'react';
import { FaBuilding, FaEnvelope, FaPhone, FaGlobe, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaCrown } from 'react-icons/fa';
import PlanBadge from '../../Shared/PlanBadge';
import StatusBadge from '../../Shared/StatusBadge';
import { formatDate, formatCurrency } from '../../../utils/formatters';

/**
 * Tab de Detalhes da Empresa
 * Informações completas + formulário de criação/edição
 */
const DetailsTab = ({ company, isEditMode }) => {
  const isNewCompany = !company;

  const [formData, setFormData] = useState({
    name: company?.name || '',
    documentType: company?.documentType || 'cnpj',
    document: company?.document || company?.cnpj || '',
    email: company?.email || '',
    phone: company?.phone || '',
    website: company?.website || '',
    plan: company?.plan || 'starter',
    ownerId: company?.ownerId || '',
    ownerName: company?.ownerName || '',
    status: company?.status || 'active',
    address: company?.address || '',
    city: company?.city || '',
    state: company?.state || '',
    zipCode: company?.zipCode || '',
  });

  const [errors, setErrors] = useState({});

  // Mock users list - substituir por dados reais
  const mockUsers = [
    { id: 'user-001', name: 'João Silva', email: 'joao@email.com' },
    { id: 'user-002', name: 'Maria Santos', email: 'maria@email.com' },
    { id: 'user-003', name: 'Carlos Mendes', email: 'carlos@email.com' },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando usuário digita
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const formatDocument = (value, type) => {
    const numbers = value.replace(/\D/g, '');

    if (type === 'cnpj') {
      // CNPJ: 00.000.000/0000-00
      return numbers
        .slice(0, 14)
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      // CPF: 000.000.000-00
      return numbers
        .slice(0, 11)
        .replace(/^(\d{3})(\d)/, '$1.$2')
        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1-$2');
    }
  };

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .slice(0, 11)
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome da empresa é obrigatório';
    }

    const docNumbers = formData.document.replace(/\D/g, '');
    if (!docNumbers) {
      newErrors.document = 'Documento é obrigatório';
    } else if (formData.documentType === 'cnpj' && docNumbers.length !== 14) {
      newErrors.document = 'CNPJ deve ter 14 dígitos';
    } else if (formData.documentType === 'cpf' && docNumbers.length !== 11) {
      newErrors.document = 'CPF deve ter 11 dígitos';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.ownerId && !isNewCompany) {
      newErrors.ownerId = 'Selecione um proprietário';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (!isEditMode && !isNewCompany) {
    // Modo visualização
    return (
      <div className="space-y-6">
        {/* Status e Plano */}
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
            <StatusBadge status={company?.status} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Plano</p>
            <PlanBadge plan={company?.plan} showIcon />
          </div>
        </div>

        {/* Proprietário */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FaCrown className="w-4 h-4 text-yellow-500" />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Proprietário
            </p>
          </div>
          <p className="text-gray-900 dark:text-white font-medium">
            {company?.ownerName || '-'}
          </p>
        </div>

        {/* Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaBuilding className="w-4 h-4 text-gray-400" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Nome da Empresa
              </p>
            </div>
            <p className="text-gray-900 dark:text-white font-medium">
              {company?.name || '-'}
            </p>
          </div>

          {/* Documento */}
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              {company?.documentType === 'cpf' ? 'CPF' : 'CNPJ'}
            </p>
            <p className="text-gray-900 dark:text-white font-mono">
              {company?.document || company?.cnpj || '-'}
            </p>
          </div>

          {/* Email */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaEnvelope className="w-4 h-4 text-gray-400" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Email
              </p>
            </div>
            <p className="text-gray-900 dark:text-white">
              {company?.email || '-'}
            </p>
          </div>

          {/* Telefone */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaPhone className="w-4 h-4 text-gray-400" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Telefone
              </p>
            </div>
            <p className="text-gray-900 dark:text-white">
              {company?.phone || '-'}
            </p>
          </div>

          {/* Website */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaGlobe className="w-4 h-4 text-gray-400" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Website
              </p>
            </div>
            <p className="text-gray-900 dark:text-white">
              {company?.website || '-'}
            </p>
          </div>

          {/* Cadastro */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaCalendarAlt className="w-4 h-4 text-gray-400" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Data de Cadastro
              </p>
            </div>
            <p className="text-gray-900 dark:text-white">
              {formatDate(company?.createdAt, true)}
            </p>
          </div>
        </div>

        {/* Endereço */}
        {company?.address && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Endereço
              </p>
            </div>
            <p className="text-gray-900 dark:text-white">
              {company.address}
              {company.city && `, ${company.city}`}
              {company.state && ` - ${company.state}`}
              {company.zipCode && ` | CEP: ${company.zipCode}`}
            </p>
          </div>
        )}

        {/* Métricas - SEM MRR/ARR */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-750 dark:to-gray-700 rounded-xl">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Total de Mensagens
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {company?.totalMessages || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Membros Ativos
            </p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {company?.membersCount || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Total de Contatos
            </p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {company?.totalContacts || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Total de Atividades
            </p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {company?.totalActivities || 0}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Modo edição/criação
  return (
    <div className="space-y-6">
      {isNewCompany && (
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
          <h3 className="font-bold text-purple-900 dark:text-purple-300 mb-1">
            Nova Empresa
          </h3>
          <p className="text-sm text-purple-700 dark:text-purple-400">
            Preencha os dados abaixo para cadastrar uma nova empresa
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nome da Empresa *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.name
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-200 dark:border-gray-700'
            } bg-white dark:bg-gray-750 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            placeholder="Ex: Minha Empresa Ltda"
          />
          {errors.name && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.name}</p>
          )}
        </div>

        {/* Tipo de Documento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipo de Documento *
          </label>
          <select
            value={formData.documentType}
            onChange={(e) => {
              handleChange('documentType', e.target.value);
              handleChange('document', ''); // Limpar documento ao mudar tipo
            }}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-750 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="cnpj">CNPJ (Pessoa Jurídica)</option>
            <option value="cpf">CPF (Pessoa Física)</option>
          </select>
        </div>

        {/* Documento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {formData.documentType === 'cpf' ? 'CPF' : 'CNPJ'} *
          </label>
          <input
            type="text"
            value={formData.document}
            onChange={(e) =>
              handleChange('document', formatDocument(e.target.value, formData.documentType))
            }
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.document
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-200 dark:border-gray-700'
            } bg-white dark:bg-gray-750 text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            placeholder={formData.documentType === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'}
          />
          {errors.document && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.document}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.email
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-200 dark:border-gray-700'
            } bg-white dark:bg-gray-750 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            placeholder="contato@empresa.com"
          />
          {errors.email && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Telefone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', formatPhone(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-750 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="(00) 00000-0000"
          />
        </div>

        {/* Plano */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Plano *
          </label>
          <select
            value={formData.plan}
            onChange={(e) => handleChange('plan', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-750 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="free">Free - R$ 0/mês</option>
            <option value="starter">Starter - R$ 11/mês</option>
            <option value="professional">Professional - R$ 97/mês</option>
            <option value="enterprise">Enterprise - R$ 499/mês</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status *
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-750 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="active">Ativa</option>
            <option value="suspended">Suspensa</option>
          </select>
        </div>

        {/* Proprietário */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Proprietário {!isNewCompany && '*'}
          </label>
          <select
            value={formData.ownerId}
            onChange={(e) => {
              const selectedUser = mockUsers.find((u) => u.id === e.target.value);
              handleChange('ownerId', e.target.value);
              if (selectedUser) {
                handleChange('ownerName', selectedUser.name);
              }
            }}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.ownerId
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-200 dark:border-gray-700'
            } bg-white dark:bg-gray-750 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
          >
            <option value="">Selecione um usuário</option>
            {mockUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
          {errors.ownerId && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.ownerId}</p>
          )}
          {isNewCompany && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Ou deixe em branco para criar um novo usuário proprietário
            </p>
          )}
        </div>

        {/* Website */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Website
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => handleChange('website', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-750 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="https://www.empresa.com.br"
          />
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 className="font-bold text-gray-900 dark:text-white mb-4">
          Endereço (Opcional)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Endereço */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Endereço
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-750 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Rua, Avenida, etc"
            />
          </div>

          {/* Cidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cidade
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-750 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="São Paulo"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estado
            </label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value.toUpperCase())}
              maxLength={2}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-750 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
              placeholder="SP"
            />
          </div>

          {/* CEP */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              CEP
            </label>
            <input
              type="text"
              value={formData.zipCode}
              onChange={(e) =>
                handleChange(
                  'zipCode',
                  e.target.value.replace(/\D/g, '').slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2')
                )
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-750 text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="00000-000"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(DetailsTab);
