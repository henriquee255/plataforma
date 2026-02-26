const mongoose = require('mongoose');

/**
 * Model de Empresa (Workspace)
 * Cada empresa é criada por um usuário (owner) e herda seu plano
 */
const companySchema = new mongoose.Schema(
  {
    // Informações básicas
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    logo: {
      type: String,
      default: null,
    },

    description: {
      type: String,
      default: '',
    },

    // Owner (quem criou e paga)
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Plano herdado do owner
    inheritedPlan: {
      type: String,
      enum: ['free', 'starter', 'professional', 'enterprise'],
      required: true,
    },

    // Status da empresa
    status: {
      type: String,
      enum: ['active', 'suspended', 'archived'],
      default: 'active',
    },

    // Membros da empresa
    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        role: {
          type: String,
          enum: ['owner', 'admin', 'member'],
          default: 'member',
        },
        department: {
          type: String,
          default: null, // 'vendas', 'suporte', 'marketing', etc
        },
        permissions: {
          type: [String],
          default: [],
          // ['crm', 'contacts', 'inbox', 'reports', 'integrations', 'settings', etc]
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        invitedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          default: null,
        },
      },
    ],

    // Configurações da empresa
    settings: {
      // Branding
      primaryColor: {
        type: String,
        default: '#9333ea', // Purple
      },
      secondaryColor: {
        type: String,
        default: '#a855f7',
      },
      timezone: {
        type: String,
        default: 'America/Sao_Paulo',
      },
      language: {
        type: String,
        default: 'pt-BR',
      },
      currency: {
        type: String,
        default: 'BRL',
      },

      // Personalizações
      customDomain: {
        type: String,
        default: null, // Apenas Enterprise
      },
      whitelabel: {
        enabled: {
          type: Boolean,
          default: false, // Apenas Enterprise
        },
        companyName: String,
        favicon: String,
      },

      // Notificações
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        push: {
          type: Boolean,
          default: true,
        },
        slack: {
          enabled: Boolean,
          webhookUrl: String,
        },
      },
    },

    // Estatísticas de uso
    usage: {
      totalMembers: {
        type: Number,
        default: 1, // Owner
      },
      storageUsed: {
        type: Number,
        default: 0, // em bytes
      },
      contactsCount: {
        type: Number,
        default: 0,
      },
      messagesCount: {
        type: Number,
        default: 0,
      },
      integrationsCount: {
        type: Number,
        default: 0,
      },
      automationsCount: {
        type: Number,
        default: 0,
      },
    },

    // Billing info (para empresas que pagam separadamente - futuro)
    billingInfo: {
      cnpj: {
        type: String,
        default: null,
      },
      razaoSocial: {
        type: String,
        default: null,
      },
      address: {
        street: String,
        number: String,
        complement: String,
        city: String,
        state: String,
        zipCode: String,
        country: { type: String, default: 'Brasil' },
      },
    },

    // Metadata
    metadata: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// ===== INDEXES =====
companySchema.index({ ownerId: 1 });
companySchema.index({ slug: 1 });
companySchema.index({ status: 1 });
companySchema.index({ 'members.userId': 1 });

// ===== PRE-SAVE HOOKS =====

/**
 * Gerar slug automaticamente
 */
companySchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('name')) {
    const baseSlug = this.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, ''); // Remove hífens no início/fim

    let slug = baseSlug;
    let counter = 1;

    // Verificar se slug já existe
    while (await this.constructor.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }

  next();
});

/**
 * Adicionar owner automaticamente aos members
 */
companySchema.pre('save', function (next) {
  if (this.isNew) {
    // Verificar se owner já está nos members
    const ownerExists = this.members.some(
      (m) => m.userId.toString() === this.ownerId.toString()
    );

    if (!ownerExists) {
      this.members.push({
        userId: this.ownerId,
        role: 'owner',
        department: null,
        permissions: ['all'], // Owner tem todas as permissões
        joinedAt: new Date(),
      });
    }
  }

  next();
});

// ===== VIRTUALS =====

/**
 * Verificar se empresa está ativa
 */
companySchema.virtual('isActive').get(function () {
  return this.status === 'active';
});

/**
 * Contar membros
 */
companySchema.virtual('membersCount').get(function () {
  return this.members.length;
});

// ===== METHODS =====

/**
 * Adicionar membro à empresa
 */
companySchema.methods.addMember = async function (
  userId,
  role = 'member',
  department = null,
  permissions = [],
  invitedBy = null
) {
  // Verificar se usuário já é membro
  const existingMember = this.members.find(
    (m) => m.userId.toString() === userId.toString()
  );

  if (existingMember) {
    throw new Error('Usuário já é membro desta empresa');
  }

  // Adicionar membro
  this.members.push({
    userId,
    role,
    department,
    permissions,
    joinedAt: new Date(),
    invitedBy,
  });

  this.usage.totalMembers = this.members.length;

  return this.save();
};

/**
 * Remover membro da empresa
 */
companySchema.methods.removeMember = async function (userId) {
  // Não pode remover o owner
  const memberToRemove = this.members.find(
    (m) => m.userId.toString() === userId.toString()
  );

  if (!memberToRemove) {
    throw new Error('Membro não encontrado');
  }

  if (memberToRemove.role === 'owner') {
    throw new Error('Não é possível remover o owner da empresa');
  }

  // Remover membro
  this.members = this.members.filter(
    (m) => m.userId.toString() !== userId.toString()
  );

  this.usage.totalMembers = this.members.length;

  return this.save();
};

/**
 * Atualizar role/permissões de um membro
 */
companySchema.methods.updateMember = async function (
  userId,
  updates
) {
  const memberIndex = this.members.findIndex(
    (m) => m.userId.toString() === userId.toString()
  );

  if (memberIndex === -1) {
    throw new Error('Membro não encontrado');
  }

  // Não pode alterar role do owner
  if (this.members[memberIndex].role === 'owner' && updates.role) {
    throw new Error('Não é possível alterar o role do owner');
  }

  // Atualizar campos
  if (updates.role) this.members[memberIndex].role = updates.role;
  if (updates.department !== undefined)
    this.members[memberIndex].department = updates.department;
  if (updates.permissions) this.members[memberIndex].permissions = updates.permissions;

  return this.save();
};

/**
 * Verificar se usuário é membro
 */
companySchema.methods.isMember = function (userId) {
  return this.members.some((m) => m.userId.toString() === userId.toString());
};

/**
 * Verificar se usuário é owner
 */
companySchema.methods.isOwner = function (userId) {
  return this.ownerId.toString() === userId.toString();
};

/**
 * Verificar se usuário é admin ou owner
 */
companySchema.methods.isAdminOrOwner = function (userId) {
  const member = this.members.find(
    (m) => m.userId.toString() === userId.toString()
  );
  return member && (member.role === 'owner' || member.role === 'admin');
};

/**
 * Obter permissões de um usuário
 */
companySchema.methods.getUserPermissions = function (userId) {
  const member = this.members.find(
    (m) => m.userId.toString() === userId.toString()
  );

  if (!member) return [];

  // Owner tem todas as permissões
  if (member.role === 'owner') return ['all'];

  return member.permissions || [];
};

/**
 * Verificar se usuário tem permissão específica
 */
companySchema.methods.hasPermission = function (userId, permission) {
  const permissions = this.getUserPermissions(userId);

  // Owner tem tudo
  if (permissions.includes('all')) return true;

  return permissions.includes(permission);
};

/**
 * Atualizar plano herdado (quando owner mudar de plano)
 */
companySchema.methods.updateInheritedPlan = async function (newPlan) {
  this.inheritedPlan = newPlan;
  return this.save();
};

/**
 * Suspender empresa
 */
companySchema.methods.suspend = async function () {
  this.status = 'suspended';
  return this.save();
};

/**
 * Ativar empresa
 */
companySchema.methods.activate = async function () {
  this.status = 'active';
  return this.save();
};

/**
 * Arquivar empresa
 */
companySchema.methods.archive = async function () {
  this.status = 'archived';
  return this.save();
};

// ===== STATICS =====

/**
 * Buscar empresas do usuário (onde é owner)
 */
companySchema.statics.findOwnedByUser = function (userId) {
  return this.find({ ownerId: userId, status: { $ne: 'archived' } });
};

/**
 * Buscar empresas onde usuário é membro
 */
companySchema.statics.findByMember = function (userId) {
  return this.find({
    'members.userId': userId,
    status: { $ne: 'archived' },
  });
};

/**
 * Contar empresas do usuário
 */
companySchema.statics.countOwnedByUser = function (userId) {
  return this.countDocuments({ ownerId: userId, status: { $ne: 'archived' } });
};

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
