const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

const seedAdmin = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/plataforma');

    console.log('🔄 Verificando usuário admin...');

    // Verificar se admin já existe
    let adminUser = await User.findOne({ email: 'eu.henriquee2501@gmail.com' });

    if (adminUser) {
      console.log('✅ Admin já existe:', adminUser.email);
    } else {
      console.log('➕ Criando usuário admin...');

      // Criar novo admin
      adminUser = await User.create({
        nome: 'Henrique',
        email: 'eu.henriquee2501@gmail.com',
        password: 'admin@2026',
        role: 'admin',
        isActive: true,
        avatar: 'https://ui-avatars.com/api/?name=Henrique&background=9333ea&color=fff&size=128'
      });

      console.log('✅ Admin criado com sucesso!');
      console.log('📧 Email:', adminUser.email);
      console.log('🔐 Role:', adminUser.role);
    }

    await mongoose.connection.close();
    console.log('✨ Seed concluído!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
    process.exit(1);
  }
};

seedAdmin();
