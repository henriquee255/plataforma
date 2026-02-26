const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

const testAuth = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/plataforma');

    console.log('\n📋 TESTE DE AUTENTICAÇÃO COMPLETO\n');

    // 1. Teste: Admin existe?
    console.log('1️⃣  Verificando admin...');
    const admin = await User.findOne({ email: 'eu.henriquee2501@gmail.com' });
    if (admin) {
      console.log('✅ Admin encontrado:', admin.email);
      console.log('   ID:', admin._id);
      console.log('   Role:', admin.role);
      console.log('   Ativo:', admin.isActive);
    } else {
      console.log('❌ Admin NÃO encontrado!');
    }

    // 2. Teste: Contar usuários
    console.log('\n2️⃣  Contando usuários no banco...');
    const totalUsers = await User.countDocuments();
    console.log(`✅ Total de usuários: ${totalUsers}`);

    // 3. Teste: Listar todos os usuários
    console.log('\n3️⃣  Listando usuários...');
    const users = await User.find({}).select('-password');
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.nome} (${user.email}) - Role: ${user.role}`);
    });

    // 4. Teste: Verificar se senha do admin está hasheada
    console.log('\n4️⃣  Verificando hash de senha...');
    const adminFull = await User.findOne({ email: 'eu.henriquee2501@gmail.com' }).select('+password');
    if (adminFull) {
      console.log('✅ Senha está hasheada:', adminFull.password.substring(0, 20) + '...');

      // Testar match
      const isMatch = await adminFull.matchPassword('admin@2026');
      console.log('   Teste bcrypt.compare:', isMatch ? '✅ PASSOU' : '❌ FALHOU');
    }

    await mongoose.connection.close();
    console.log('\n✨ Testes concluídos!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
};

testAuth();
