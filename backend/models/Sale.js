const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
    index: true
  },
  platform: {
    type: String,
    enum: ['kiwify', 'hotmart', 'stripe'],
    required: true
  },
  externalId: {
    type: String,
    required: true,
    index: true
  },
  productName: {
    type: String,
    required: true
  },
  productId: {
    type: String,
    default: ''
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'BRL',
    uppercase: true
  },
  status: {
    type: String,
    enum: ['approved', 'pending', 'canceled', 'refunded', 'chargeback'],
    default: 'approved',
    index: true
  },
  paymentType: {
    type: String,
    default: ''
  },
  saleDate: {
    type: Date,
    required: true,
    index: true
  },
  refundedAt: {
    type: Date,
    default: null
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  refundReason: {
    type: String,
    default: ''
  },
  canceledAt: {
    type: Date,
    default: null
  },
  chargebackAt: {
    type: Date,
    default: null
  },
  commission: {
    value: { type: Number, default: 0 },
    currency: { type: String, default: 'BRL' }
  },
  metadata: {
    type: Map,
    of: String,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices compostos para queries otimizadas
saleSchema.index({ userId: 1, platform: 1 });
saleSchema.index({ userId: 1, status: 1 });
saleSchema.index({ userId: 1, saleDate: -1 });
saleSchema.index({ platform: 1, externalId: 1 }, { unique: true });

// Virtual para calcular lucro líquido (após reembolso/comissão)
saleSchema.virtual('netAmount').get(function() {
  if (this.status === 'refunded') {
    return this.amount - this.refundAmount;
  }
  return this.amount - (this.commission?.value || 0);
});

// Método estático para buscar vendas por período
saleSchema.statics.findByDateRange = function(userId, startDate, endDate) {
  return this.find({
    userId,
    saleDate: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ saleDate: -1 });
};

// Método estático para calcular total de vendas
saleSchema.statics.calculateTotalSales = async function(userId, filters = {}) {
  const match = { userId, status: 'approved' };

  if (filters.startDate && filters.endDate) {
    match.saleDate = {
      $gte: new Date(filters.startDate),
      $lte: new Date(filters.endDate)
    };
  }

  if (filters.platform) {
    match.platform = filters.platform;
  }

  const result = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
        count: { $sum: 1 },
        avgTicket: { $avg: '$amount' }
      }
    }
  ]);

  return result.length > 0 ? result[0] : { total: 0, count: 0, avgTicket: 0 };
};

// Método estático para calcular reembolsos
saleSchema.statics.calculateRefunds = async function(userId, filters = {}) {
  const match = { userId, status: 'refunded' };

  if (filters.startDate && filters.endDate) {
    match.refundedAt = {
      $gte: new Date(filters.startDate),
      $lte: new Date(filters.endDate)
    };
  }

  const result = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        total: { $sum: '$refundAmount' },
        count: { $sum: 1 }
      }
    }
  ]);

  return result.length > 0 ? result[0] : { total: 0, count: 0 };
};

// Middleware para atualizar estatísticas do cliente
saleSchema.post('save', async function() {
  if (this.customerId) {
    const Customer = mongoose.model('Customer');
    const customer = await Customer.findById(this.customerId);

    if (customer) {
      await customer.updatePurchaseStats();
    }
  }
});

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
