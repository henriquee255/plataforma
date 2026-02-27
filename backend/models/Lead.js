const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome do lead é obrigatório'],
    trim: true
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Email inválido'
    ]
  },
  telefone: {
    type: String
  },
  valor: {
    type: Number,
    default: 0
  },
  estagio: {
    type: String,
    default: 'prospeccao'
  },
  atribuidoPara: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  origem: {
    type: String,
    enum: ['Site', 'WhatsApp', 'Email', 'Instagram', 'Facebook', 'LinkedIn', 'Indicação', 'Outro'],
    default: 'Outro'
  },
  tags: [String],
  pipelineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pipeline',
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  notas: [
    {
      texto: String,
      autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      data: {
        type: Date,
        default: Date.now
      }
    }
  ],
  historico: [
    {
      acao: String,
      mudanca: String,
      usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      data: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lead', LeadSchema);
