const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

const testRegistration = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/plataforma');

    console.log('\n📋 TESTE DE REGISTRO DE NOVO USUÁRIO\n');

    // 1. Deletar usuário de teste se existir
    console.log('1️⃣  Limpando usuários de teste anterior...');
    await User.deleteMany({ email: 'teste@example.com' });
    console.log('✅ Limpeza concluída');

    // 2. Criar novo usuário
    console.log('\n2️⃣  Registrando novo usuário...');
    const newUser = await User.create({
      nome: 'Usuário Teste',
      email: 'teste@example.com',
      password: 'senha123456',
      role: 'user',
      isActive: true
    });
    console.log('✅ Usuário criado:', newUser.email);
    console.log('   ID:', newUser._id);
    console.log('   Nome:', newUser.nome);
    console.log('   Role:', newUser.role);

    // 3. Verificar se aparece na listagem
    console.log('\n3️⃣  Buscando usuário na listagem...');
    const allUsers = await User.find({}).select('-password');
    const foundUser = allUsers.find(u => u.email === 'teste@example.com');

    if (foundUser) {
      console.log('✅ Usuário encontrado na listagem!');
      console.log('   Total de usuários:', allUsers.length);
    } else {
      console.log('❌ Usuário NÃO encontrado na listagem!');
    }

    // 4. Simular login
    console.log('\n4️⃣  Testando login...');
    const userForLogin = await User.findOne({ email: 'teste@example.com' }).select('+password');
    const isPasswordValid = await userForLogin.matchPassword('senha123456');
    console.log('   Senha válida:', isPasswordValid ? '✅ SIM' : '❌ NÃO');

    // 5. Gerar JWT
    console.log('\n5️⃣  Gerando JWT token...');
    const token = userForLogin.getSignedJwtToken();
    console.log('✅ Token gerado:', token.substring(0, 30) + '...');

    await mongoose.connection.close();
    console.log('\n✨ Testes de registro concluídos!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
};

testRegistration();
