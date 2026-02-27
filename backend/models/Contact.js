const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome do contato é obrigatório'],
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  telefone: {
    type: String,
    trim: true
  },
  documento: {
    type: String,
    trim: true
  },
  origem: {
    type: String,
    default: 'Manual',
    enum: ['Manual', 'Site - Chat ao vivo', 'Importação', 'Integração']
  },
  empresa: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  atribuidoPara: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  notas: [{
    texto: String,
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    data: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['ativo', 'inativo', 'bloqueado'],
    default: 'ativo'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Índice composto para melhor performance
ContactSchema.index({ companyId: 1, email: 1 });
ContactSchema.index({ companyId: 1, createdAt: -1 });

module.exports = mongoose.model('Contact', ContactSchema);
