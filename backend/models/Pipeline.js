const mongoose = require('mongoose');

const PipelineSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome da pipeline é obrigatório'],
    trim: true,
    maxlength: 100
  },
  descricao: {
    type: String,
    trim: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stages: [{
    id: String,
    nome: String,
    order: Number
  }],
  leads: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead'
  }],
  cor: {
    type: String,
    default: '#9333ea'
  },
  status: {
    type: String,
    enum: ['ativa', 'pausada', 'arquivada'],
    default: 'ativa'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Pipeline', PipelineSchema);
