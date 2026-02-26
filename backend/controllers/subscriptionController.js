const Subscription = require('../models/Subscription');
const Company = require('../models/Company');
const User = require('../models/User');

/**
 * @route   GET /api/subscriptions/me
 * @desc    Obter assinatura do usuário logado
 * @access  Private
 */
exports.getMySubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user._id });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Assinatura não encontrada',
      });
    }

    res.json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    console.error('Error getting subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar assinatura',
      error: error.message,
    });
  }
};

/**
 * @route   POST /api/subscriptions
 * @desc    Criar assinatura para usuário
 * @access  Private
 */
exports.createSubscription = async (req, res) => {
  try {
    const { plan, paymentGateway, externalSubscriptionId } = req.body;

    // Verificar se já tem assinatura
    const existingSubscription = await Subscription.findOne({
      userId: req.user._id,
    });

    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        message: 'Usuário já possui uma assinatura',
      });
    }

    // Criar assinatura
    const subscription = new Subscription({
      userId: req.user._id,
      plan,
      status: 'trial', // Inicia em trial
      paymentGateway,
      externalSubscriptionId,
    });

    await subscription.save();

    res.status(201).json({
      success: true,
      message: 'Assinatura criada com sucesso',
      data: subscription,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar assinatura',
      error: error.message,
    });
  }
};

/**
 * @route   PATCH /api/subscriptions/upgrade
 * @desc    Fazer upgrade de plano
 * @access  Private
 */
exports.upgradePlan = async (req, res) => {
  try {
    const { newPlan } = req.body;

    if (!newPlan) {
      return res.status(400).json({
        success: false,
        message: 'newPlan é obrigatório',
      });
    }

    const subscription = await Subscription.findOne({ userId: req.user._id });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Assinatura não encontrada',
      });
    }

    // Fazer upgrade
    await subscription.upgradePlan(newPlan);

    // Atualizar plano de todas as empresas do usuário
    await Company.updateMany(
      { ownerId: req.user._id },
      { inheritedPlan: newPlan }
    );

    res.json({
      success: true,
      message: `Upgrade para plano ${newPlan} realizado com sucesso`,
      data: subscription,
    });
  } catch (error) {
    console.error('Error upgrading plan:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao fazer upgrade',
    });
  }
};

/**
 * @route   PATCH /api/subscriptions/downgrade
 * @desc    Fazer downgrade de plano
 * @access  Private
 */
exports.downgradePlan = async (req, res) => {
  try {
    const { newPlan } = req.body;

    if (!newPlan) {
      return res.status(400).json({
        success: false,
        message: 'newPlan é obrigatório',
      });
    }

    const subscription = await Subscription.findOne({ userId: req.user._id });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Assinatura não encontrada',
      });
    }

    // Fazer downgrade
    await subscription.downgradePlan(newPlan);

    // Atualizar plano de todas as empresas do usuário
    await Company.updateMany(
      { ownerId: req.user._id },
      { inheritedPlan: newPlan }
    );

    res.json({
      success: true,
      message: `Downgrade para plano ${newPlan} realizado com sucesso`,
      data: subscription,
    });
  } catch (error) {
    console.error('Error downgrading plan:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao fazer downgrade',
    });
  }
};

/**
 * @route   POST /api/subscriptions/cancel
 * @desc    Cancelar assinatura
 * @access  Private
 */
exports.cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user._id });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Assinatura não encontrada',
      });
    }

    await subscription.cancel();

    // Suspender todas as empresas do usuário
    await Company.updateMany(
      { ownerId: req.user._id },
      { status: 'suspended' }
    );

    res.json({
      success: true,
      message: 'Assinatura cancelada com sucesso',
      data: subscription,
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao cancelar assinatura',
      error: error.message,
    });
  }
};

/**
 * @route   POST /api/subscriptions/reactivate
 * @desc    Reativar assinatura
 * @access  Private
 */
exports.reactivateSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user._id });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Assinatura não encontrada',
      });
    }

    await subscription.reactivate();

    // Reativar todas as empresas do usuário
    await Company.updateMany(
      { ownerId: req.user._id },
      { status: 'active' }
    );

    res.json({
      success: true,
      message: 'Assinatura reativada com sucesso',
      data: subscription,
    });
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao reativar assinatura',
      error: error.message,
    });
  }
};

/**
 * @route   POST /api/subscriptions/payment
 * @desc    Adicionar pagamento ao histórico
 * @access  Private (Webhook)
 */
exports.addPayment = async (req, res) => {
  try {
    const { userId, amount, status, transactionId, invoiceUrl } = req.body;

    const subscription = await Subscription.findOne({ userId });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Assinatura não encontrada',
      });
    }

    await subscription.addPayment({
      amount,
      status,
      transactionId,
      invoiceUrl,
      paidAt: new Date(),
    });

    res.json({
      success: true,
      message: 'Pagamento registrado com sucesso',
    });
  } catch (error) {
    console.error('Error adding payment:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar pagamento',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/subscriptions/can-create-company
 * @desc    Verificar se usuário pode criar empresa
 * @access  Private
 */
exports.canCreateCompany = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user._id });

    if (!subscription) {
      return res.json({
        success: true,
        canCreate: false,
        reason: 'no_subscription',
        message: 'Você precisa ter uma assinatura para criar empresas',
      });
    }

    const canCreate = subscription.canCreateCompany;

    if (!canCreate) {
      const PLANS = {
        free: 0,
        starter: 1,
        professional: 3,
        enterprise: 5,
      };

      const maxCompanies = PLANS[subscription.plan];

      return res.json({
        success: true,
        canCreate: false,
        reason: 'limit_reached',
        message: `Você atingiu o limite de ${maxCompanies} empresa(s) do plano ${subscription.plan}`,
        currentPlan: subscription.plan,
        companiesCreated: subscription.usage.companiesCreated,
        maxCompanies,
      });
    }

    res.json({
      success: true,
      canCreate: true,
      currentPlan: subscription.plan,
      companiesCreated: subscription.usage.companiesCreated,
    });
  } catch (error) {
    console.error('Error checking if can create company:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar limite de empresas',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/subscriptions/stats
 * @desc    Obter estatísticas de uso da assinatura
 * @access  Private
 */
exports.getSubscriptionStats = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user._id });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Assinatura não encontrada',
      });
    }

    // Buscar dados reais
    const companiesCount = await Company.countDocuments({
      ownerId: req.user._id,
      status: { $ne: 'archived' },
    });

    const companies = await Company.find({
      ownerId: req.user._id,
      status: { $ne: 'archived' },
    });

    let totalMembers = 0;
    companies.forEach((company) => {
      totalMembers += company.members.length;
    });

    res.json({
      success: true,
      data: {
        plan: subscription.plan,
        status: subscription.status,
        companiesCreated: companiesCount,
        totalMembers,
        usage: subscription.usage,
        isOnTrial: subscription.isOnTrial,
        trialDaysRemaining: subscription.trialDaysRemaining,
      },
    });
  } catch (error) {
    console.error('Error getting subscription stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas',
      error: error.message,
    });
  }
};
