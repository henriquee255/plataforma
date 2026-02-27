const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  remetente: {
    tipo: {
      type: String,
      enum: ['usuario', 'contato', 'sistema'],
      default: 'usuario'
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    nome: String,
    email: String,
    avatar: String
  },
  destinatario: {
    tipo: {
      type: String,
      enum: ['usuario', 'contato', 'grupo'],
      default: 'contato'
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact'
    },
    nome: String,
    email: String
  },
  texto: {
    type: String,
    required: true
  },
  canal: {
    type: String,
    enum: ['email', 'whatsapp', 'instagram', 'chat', 'system'],
    default: 'chat'
  },
  anexos: [{
    nome: String,
    url: String,
    tipo: String,
    tamanho: Number
  }],
  lido: {
    type: Boolean,
    default: false
  },
  dataLeitura: {
    type: Date,
    default: null
  },
  respondido: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['enviado', 'entregue', 'lido', 'erro', 'agendado'],
    default: 'enviado'
  },
  reacao: {
    type: String,
    enum: ['👍', '❤️', '😂', '😮', '😢', '😡'],
    default: null
  },
  respostaA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  tags: [{
    type: String,
    trim: true
  }],
  prioridade: {
    type: String,
    enum: ['baixa', 'normal', 'alta', 'urgente'],
    default: 'normal'
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

// Índices para melhor performance
MessageSchema.index({ companyId: 1, conversationId: 1, createdAt: -1 });
MessageSchema.index({ companyId: 1, 'remetente.id': 1 });
MessageSchema.index({ companyId: 1, lido: 1 });
MessageSchema.index({ companyId: 1, canal: 1 });

module.exports = mongoose.model('Message', MessageSchema);
