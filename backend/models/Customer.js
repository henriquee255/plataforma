const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    index: true
  },
  phone: {
    type: String,
    default: ''
  },
  document: {
    type: String,
    default: ''
  },
  source: {
    type: String,
    enum: ['kiwify', 'hotmart', 'stripe', 'manual'],
    required: true
  },
  externalId: {
    type: String,
    default: ''
  },
  tags: [{
    type: String
  }],
  totalPurchases: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  lastPurchaseDate: {
    type: Date,
    default: null
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

// Índices compostos
customerSchema.index({ userId: 1, email: 1 }, { unique: true });
customerSchema.index({ userId: 1, source: 1 });
customerSchema.index({ tags: 1 });

// Método para adicionar tag
customerSchema.methods.addTag = function(tag) {
  if (!this.tags.includes(tag)) {
    this.tags.push(tag);
  }
};

// Método para remover tag
customerSchema.methods.removeTag = function(tag) {
  this.tags = this.tags.filter(t => t !== tag);
};

// Método para atualizar estatísticas de compra
customerSchema.methods.updatePurchaseStats = async function() {
  const Sale = mongoose.model('Sale');

  const stats = await Sale.aggregate([
    {
      $match: {
        customerId: this._id,
        status: 'approved'
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        totalSpent: { $sum: '$amount' },
        lastPurchase: { $max: '$saleDate' }
      }
    }
  ]);

  if (stats.length > 0) {
    this.totalPurchases = stats[0].total;
    this.totalSpent = stats[0].totalSpent;
    this.lastPurchaseDate = stats[0].lastPurchase;
  }

  await this.save();
};

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
