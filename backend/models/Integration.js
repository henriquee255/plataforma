const mongoose = require('mongoose');

const integrationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['kiwify', 'hotmart', 'stripe'],
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'error'],
    default: 'inactive'
  },
  credentials: {
    type: Map,
    of: String,
    default: {}
  },
  lastSync: {
    type: Date,
    default: null
  },
  syncData: {
    type: Object,
    default: {}
  },
  webhookUrl: {
    type: String,
    default: ''
  },
  errorMessage: {
    type: String,
    default: ''
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
integrationSchema.index({ userId: 1, platform: 1 }, { unique: true });
integrationSchema.index({ status: 1, userId: 1 });

// Middleware para atualizar updatedAt
integrationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Método para verificar se a integração está ativa
integrationSchema.methods.isActive = function() {
  return this.status === 'active';
};

// Método para verificar se precisa renovar token
integrationSchema.methods.needsTokenRefresh = function() {
  if (!this.credentials || !this.credentials.get('token_expires_at')) {
    return false;
  }

  const expiresAt = new Date(this.credentials.get('token_expires_at'));
  const now = new Date();
  const fiveMinutes = 5 * 60 * 1000;

  // Renova se faltar menos de 5 minutos para expirar
  return (expiresAt - now) < fiveMinutes;
};

// Método para limpar credenciais sensíveis ao retornar
integrationSchema.methods.toJSON = function() {
  const obj = this.toObject();

  // Remove credenciais sensíveis
  if (obj.credentials) {
    const credentials = {};
    const credentialsMap = obj.credentials;

    for (const [key, value] of Object.entries(credentialsMap)) {
      if (key.includes('secret') || key.includes('token') || key.includes('key')) {
        credentials[key] = '***hidden***';
      } else {
        credentials[key] = value;
      }
    }

    obj.credentials = credentials;
  }

  return obj;
};

// Statics methods
integrationSchema.statics.findByUserAndPlatform = function(userId, platform) {
  return this.findOne({ userId, platform });
};

integrationSchema.statics.findActiveByUser = function(userId) {
  return this.find({ userId, status: 'active' });
};

const Integration = mongoose.model('Integration', integrationSchema);

module.exports = Integration;
