const mongoose = require('mongoose');

/**
 * Model de Assinatura
 * Vinculado ao User (quem paga)
 */
const subscriptionSchema = new mongoose.Schema(
  {
    // Vinculação ao usuário
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Plano atual
    plan: {
      type: String,
      enum: ['free', 'starter', 'professional', 'enterprise'],
      default: 'free',
      required: true,
    },

    // Status da assinatura
    status: {
      type: String,
      enum: ['active', 'suspended', 'canceled', 'past_due', 'trial'],
      default: 'trial',
      required: true,
    },

    // Billing
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly', null],
      default: 'monthly',
    },

    // Datas importantes
    startDate: {
      type: Date,
      default: Date.now,
    },

    trialEndsAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias trial
    },

    currentPeriodStart: {
      type: Date,
      default: Date.now,
    },

    currentPeriodEnd: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
    },

    canceledAt: {
      type: Date,
      default: null,
    },

    // Payment Gateway
    paymentGateway: {
      type: String,
      enum: ['stripe', 'kiwify', 'hotmart', 'pix', null],
      default: null,
    },

    // IDs externos
    externalSubscriptionId: {
      type: String, // ID do Stripe/Kiwify/etc
      default: null,
    },

    externalCustomerId: {
      type: String,
      default: null,
    },

    // Histórico de pagamentos
    paymentHistory: [
      {
        amount: Number,
        currency: { type: String, default: 'BRL' },
        status: {
          type: String,
          enum: ['paid', 'pending', 'failed', 'refunded'],
        },
        paidAt: Date,
        invoiceUrl: String,
        transactionId: String,
      },
    ],

    // Cupom/Desconto
    couponCode: {
      type: String,
      default: null,
    },

    discount: {
      type: Number, // Percentual de desconto (0-100)
      default: 0,
    },

    // Métricas de uso (para validação de limites)
    usage: {
      companiesCreated: {
        type: Number,
        default: 0,
      },
      totalMembers: {
        type: Number,
        default: 0,
      },
      storageUsed: {
        type: String,
        default: '0MB',
      },
      integrationsActive: {
        type: Number,
        default: 0,
      },
      automationsActive: {
        type: Number,
        default: 0,
      },
    },

    // Metadata
    metadata: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// ===== INDEXES =====
subscriptionSchema.index({ userId: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ plan: 1 });
subscriptionSchema.index({ externalSubscriptionId: 1 });

// ===== VIRTUALS =====

/**
 * Verifica se assinatura está ativa
 */
subscriptionSchema.virtual('isActive').get(function () {
  return this.status === 'active';
});

/**
 * Verifica se está em trial
 */
subscriptionSchema.virtual('isOnTrial').get(function () {
  return this.status === 'trial' && new Date() < this.trialEndsAt;
});

/**
 * Dias restantes de trial
 */
subscriptionSchema.virtual('trialDaysRemaining').get(function () {
  if (!this.isOnTrial) return 0;
  const diffTime = this.trialEndsAt - new Date();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

/**
 * Verifica se pode criar empresa
 */
subscriptionSchema.virtual('canCreateCompany').get(function () {
  const PLANS = {
    free: { maxCompanies: 0 },
    starter: { maxCompanies: 1 },
    professional: { maxCompanies: 3 },
    enterprise: { maxCompanies: 5 },
  };

  const maxCompanies = PLANS[this.plan].maxCompanies;
  return this.usage.companiesCreated < maxCompanies;
});

// ===== METHODS =====

/**
 * Atualizar uso de empresas
 */
subscriptionSchema.methods.incrementCompaniesCreated = async function () {
  this.usage.companiesCreated += 1;
  return this.save();
};

/**
 * Decrementar uso de empresas (quando deletar)
 */
subscriptionSchema.methods.decrementCompaniesCreated = async function () {
  if (this.usage.companiesCreated > 0) {
    this.usage.companiesCreated -= 1;
    return this.save();
  }
};

/**
 * Fazer upgrade de plano
 */
subscriptionSchema.methods.upgradePlan = async function (newPlan) {
  const planOrder = ['free', 'starter', 'professional', 'enterprise'];
  const currentIndex = planOrder.indexOf(this.plan);
  const newIndex = planOrder.indexOf(newPlan);

  if (newIndex <= currentIndex) {
    throw new Error('Novo plano deve ser superior ao atual');
  }

  this.plan = newPlan;
  this.status = 'active';
  this.currentPeriodStart = new Date();
  this.currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return this.save();
};

/**
 * Fazer downgrade de plano
 */
subscriptionSchema.methods.downgradePlan = async function (newPlan) {
  const planOrder = ['free', 'starter', 'professional', 'enterprise'];
  const currentIndex = planOrder.indexOf(this.plan);
  const newIndex = planOrder.indexOf(newPlan);

  if (newIndex >= currentIndex) {
    throw new Error('Novo plano deve ser inferior ao atual');
  }

  // Verificar se usage está dentro dos limites do novo plano
  const PLANS = {
    free: { maxCompanies: 0 },
    starter: { maxCompanies: 1 },
    professional: { maxCompanies: 3 },
    enterprise: { maxCompanies: 5 },
  };

  const maxCompanies = PLANS[newPlan].maxCompanies;

  if (this.usage.companiesCreated > maxCompanies) {
    throw new Error(
      `Você tem ${this.usage.companiesCreated} empresas. O plano ${newPlan} permite apenas ${maxCompanies}. Exclua empresas antes de fazer downgrade.`
    );
  }

  this.plan = newPlan;
  this.currentPeriodStart = new Date();
  this.currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return this.save();
};

/**
 * Cancelar assinatura
 */
subscriptionSchema.methods.cancel = async function () {
  this.status = 'canceled';
  this.canceledAt = new Date();
  return this.save();
};

/**
 * Reativar assinatura
 */
subscriptionSchema.methods.reactivate = async function () {
  this.status = 'active';
  this.canceledAt = null;
  this.currentPeriodStart = new Date();
  this.currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  return this.save();
};

/**
 * Adicionar pagamento ao histórico
 */
subscriptionSchema.methods.addPayment = async function (paymentData) {
  this.paymentHistory.push({
    amount: paymentData.amount,
    currency: paymentData.currency || 'BRL',
    status: paymentData.status,
    paidAt: paymentData.paidAt || new Date(),
    invoiceUrl: paymentData.invoiceUrl,
    transactionId: paymentData.transactionId,
  });

  // Se pagamento foi bem-sucedido, ativar assinatura
  if (paymentData.status === 'paid') {
    this.status = 'active';
    this.currentPeriodStart = new Date();
    this.currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }

  return this.save();
};

// ===== STATICS =====

/**
 * Buscar assinatura ativa do usuário
 */
subscriptionSchema.statics.findByUserId = function (userId) {
  return this.findOne({ userId, status: { $in: ['active', 'trial'] } });
};

/**
 * Verificar se usuário pode criar empresa
 */
subscriptionSchema.statics.canUserCreateCompany = async function (userId) {
  const subscription = await this.findByUserId(userId);
  if (!subscription) return false;

  return subscription.canCreateCompany;
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
