const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    default: '#9333ea' // Purple theme
  },
  source: {
    type: String,
    enum: ['manual', 'kiwify', 'hotmart', 'stripe', 'automation'],
    default: 'manual'
  },
  productId: {
    type: String,
    default: '' // ID do produto na plataforma de origem
  },
  description: {
    type: String,
    default: ''
  },
  customerCount: {
    type: Number,
    default: 0
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

// Índice composto único para evitar duplicatas por usuário
tagSchema.index({ userId: 1, name: 1 }, { unique: true });
tagSchema.index({ userId: 1, source: 1 });

// Método estático para buscar ou criar tag
tagSchema.statics.findOrCreate = async function(userId, tagName, source = 'manual', productId = '') {
  let tag = await this.findOne({ userId, name: tagName });

  if (!tag) {
    tag = new this({
      userId,
      name: tagName,
      source,
      productId
    });
    await tag.save();
    console.log(`✅ Tag criada: "${tagName}" (source: ${source})`);
  }

  return tag;
};

// Método para atualizar contagem de clientes
tagSchema.methods.updateCustomerCount = async function() {
  const Customer = mongoose.model('Customer');

  const count = await Customer.countDocuments({
    userId: this.userId,
    tags: this.name
  });

  this.customerCount = count;
  await this.save();
};

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
