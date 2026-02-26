const Company = require('../models/Company');
const Subscription = require('../models/Subscription');
const User = require('../models/User');

/**
 * @route   GET /api/companies/my-companies
 * @desc    Obter empresas do usuário (owner + member)
 * @access  Private
 */
exports.getMyCompanies = async (req, res) => {
  try {
    // Empresas onde é owner
    const ownedCompanies = await Company.find({
      ownerId: req.user._id,
      status: { $ne: 'archived' },
    }).populate('ownerId', 'name email');

    // Empresas onde é membro
    const memberCompanies = await Company.find({
      'members.userId': req.user._id,
      ownerId: { $ne: req.user._id }, // Excluir empresas onde já é owner
      status: { $ne: 'archived' },
    }).populate('ownerId', 'name email');

    res.json({
      success: true,
      data: {
        owned: ownedCompanies,
        member: memberCompanies,
        total: ownedCompanies.length + memberCompanies.length,
      },
    });
  } catch (error) {
    console.error('Error getting companies:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar empresas',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/companies/:id
 * @desc    Obter detalhes de uma empresa
 * @access  Private (apenas membros)
 */
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate('ownerId', 'name email')
      .populate('members.userId', 'name email');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa não encontrada',
      });
    }

    // Verificar se usuário é membro
    if (!company.isMember(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem acesso a esta empresa',
      });
    }

    res.json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error('Error getting company:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar empresa',
      error: error.message,
    });
  }
};

/**
 * @route   POST /api/companies
 * @desc    Criar nova empresa
 * @access  Private
 */
exports.createCompany = async (req, res) => {
  try {
    const { name, description, logo } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Nome da empresa é obrigatório',
      });
    }

    // Verificar assinatura do usuário
    const subscription = await Subscription.findOne({ userId: req.user._id });

    if (!subscription) {
      return res.status(403).json({
        success: false,
        message: 'Você precisa ter uma assinatura para criar empresas',
        action: 'subscribe',
      });
    }

    // Verificar se pode criar empresa (limite do plano)
    if (!subscription.canCreateCompany) {
      const PLANS = {
        free: 0,
        starter: 1,
        professional: 3,
        enterprise: 5,
      };

      const maxCompanies = PLANS[subscription.plan];

      return res.status(403).json({
        success: false,
        message: `Você atingiu o limite de ${maxCompanies} empresa(s) do plano ${subscription.plan}`,
        action: 'upgrade',
        currentPlan: subscription.plan,
        companiesCreated: subscription.usage.companiesCreated,
        maxCompanies,
      });
    }

    // Criar empresa
    const company = new Company({
      name,
      description,
      logo,
      ownerId: req.user._id,
      inheritedPlan: subscription.plan,
      status: 'active',
    });

    await company.save();

    // Incrementar contador de empresas na assinatura
    await subscription.incrementCompaniesCreated();

    res.status(201).json({
      success: true,
      message: 'Empresa criada com sucesso',
      data: company,
    });
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar empresa',
      error: error.message,
    });
  }
};

/**
 * @route   PATCH /api/companies/:id
 * @desc    Atualizar empresa
 * @access  Private (apenas owner/admin)
 */
exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa não encontrada',
      });
    }

    // Verificar permissão
    if (!company.isAdminOrOwner(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Apenas owner ou admin podem editar a empresa',
      });
    }

    // Atualizar campos permitidos
    const { name, description, logo, settings } = req.body;

    if (name) company.name = name;
    if (description !== undefined) company.description = description;
    if (logo !== undefined) company.logo = logo;
    if (settings) {
      company.settings = {
        ...company.settings,
        ...settings,
      };
    }

    await company.save();

    res.json({
      success: true,
      message: 'Empresa atualizada com sucesso',
      data: company,
    });
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar empresa',
      error: error.message,
    });
  }
};

/**
 * @route   DELETE /api/companies/:id
 * @desc    Deletar empresa
 * @access  Private (apenas owner)
 */
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa não encontrada',
      });
    }

    // Apenas owner pode deletar
    if (!company.isOwner(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Apenas o owner pode deletar a empresa',
      });
    }

    // Arquivar em vez de deletar (soft delete)
    await company.archive();

    // Decrementar contador de empresas na assinatura
    const subscription = await Subscription.findOne({ userId: req.user._id });
    if (subscription) {
      await subscription.decrementCompaniesCreated();
    }

    res.json({
      success: true,
      message: 'Empresa deletada com sucesso',
    });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar empresa',
      error: error.message,
    });
  }
};

/**
 * @route   POST /api/companies/:id/members
 * @desc    Adicionar membro à empresa
 * @access  Private (apenas owner/admin)
 */
exports.addMember = async (req, res) => {
  try {
    const { email, role, department, permissions } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email é obrigatório',
      });
    }

    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa não encontrada',
      });
    }

    // Verificar permissão
    if (!company.isAdminOrOwner(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Apenas owner ou admin podem adicionar membros',
      });
    }

    // Buscar usuário por email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
      });
    }

    // Adicionar membro
    await company.addMember(
      user._id,
      role || 'member',
      department,
      permissions || [],
      req.user._id
    );

    res.json({
      success: true,
      message: `${user.name} adicionado(a) à empresa com sucesso`,
      data: company,
    });
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao adicionar membro',
    });
  }
};

/**
 * @route   DELETE /api/companies/:id/members/:userId
 * @desc    Remover membro da empresa
 * @access  Private (apenas owner/admin)
 */
exports.removeMember = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa não encontrada',
      });
    }

    // Verificar permissão
    if (!company.isAdminOrOwner(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Apenas owner ou admin podem remover membros',
      });
    }

    // Remover membro
    await company.removeMember(req.params.userId);

    res.json({
      success: true,
      message: 'Membro removido com sucesso',
    });
  } catch (error) {
    console.error('Error removing member:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao remover membro',
    });
  }
};

/**
 * @route   PATCH /api/companies/:id/members/:userId
 * @desc    Atualizar role/permissões de membro
 * @access  Private (apenas owner/admin)
 */
exports.updateMember = async (req, res) => {
  try {
    const { role, department, permissions } = req.body;

    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa não encontrada',
      });
    }

    // Verificar permissão
    if (!company.isAdminOrOwner(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Apenas owner ou admin podem editar membros',
      });
    }

    // Atualizar membro
    await company.updateMember(req.params.userId, {
      role,
      department,
      permissions,
    });

    res.json({
      success: true,
      message: 'Membro atualizado com sucesso',
      data: company,
    });
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao atualizar membro',
    });
  }
};

/**
 * @route   GET /api/companies/:id/members
 * @desc    Listar membros da empresa
 * @access  Private (apenas membros)
 */
exports.getMembers = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate(
      'members.userId',
      'name email'
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa não encontrada',
      });
    }

    // Verificar se usuário é membro
    if (!company.isMember(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem acesso a esta empresa',
      });
    }

    res.json({
      success: true,
      data: company.members,
    });
  } catch (error) {
    console.error('Error getting members:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar membros',
      error: error.message,
    });
  }
};
