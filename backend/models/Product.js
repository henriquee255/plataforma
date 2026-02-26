const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  integrationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Integration',
    required: true
  },
  externalId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: [true, 'Nome do produto é obrigatório'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Preço é obrigatório'],
    min: 0
  },
  type: {
    type: String,
    enum: ['vitalicia', 'mensal', 'anual'],
    required: true
  },
  description: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index para buscar por integração
ProductSchema.index({ integrationId: 1, externalId: 1 }, { unique: true });

module.exports = mongoose.model('Product', ProductSchema);
