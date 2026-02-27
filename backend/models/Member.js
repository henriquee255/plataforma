const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  role: {
    type: String,
    enum: ['proprietario', 'admin', 'gerente', 'vendedor', 'membro'],
    default: 'membro'
  },
  permissoes: {
    gerenciarEquipe: {
      type: Boolean,
      default: false
    },
    gerenciarIntegracoes: {
      type: Boolean,
      default: false
    },
    gerenciarContatos: {
      type: Boolean,
      default: true
    },
    gerenciarCRM: {
      type: Boolean,
      default: true
    },
    verRelatorios: {
      type: Boolean,
      default: false
    },
    gerenciarCobranca: {
      type: Boolean,
      default: false
    }
  },
  status: {
    type: String,
    enum: ['ativo', 'inativo', 'convite_pendente'],
    default: 'ativo'
  },
  horasSemanais: {
    type: Number,
    default: 40,
    min: 0,
    max: 168
  },
  dataAdesao: {
    type: Date,
    default: Date.now
  },
  ultimoAcesso: {
    type: Date,
    default: null
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

// Índices para performance
MemberSchema.index({ companyId: 1, userId: 1 }, { unique: true });
MemberSchema.index({ companyId: 1, role: 1 });
MemberSchema.index({ companyId: 1, status: 1 });

module.exports = mongoose.model('Member', MemberSchema);
