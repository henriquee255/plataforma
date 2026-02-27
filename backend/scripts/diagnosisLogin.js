const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function diagnosis() {
  console.log('🔍 DIAGNÓSTICO COMPLETO DO LOGIN\n');
  console.log('=' .repeat(50));

  try {
    // 1. Conectar ao MongoDB
    console.log('\n1️⃣  Testando conexão com MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/plataforma');
    console.log('   ✅ MongoDB conectado');

    // 2. Verificar se usuário admin existe
    console.log('\n2️⃣  Verificando usuário admin...');
    const User = require('../models/User');
    const admin = await User.findOne({ email: 'eu.henriquee2501@gmail.com' }).select('+password');

    if (!admin) {
      console.log('   ❌ Usuário admin NÃO ENCONTRADO!');
      console.log('   💡 Solução: execute: node scripts/seedAdmin.js');
      process.exit(1);
    }

    console.log(`   ✅ Usuário encontrado: ${admin.nome}`);
    console.log(`   📧 Email: ${admin.email}`);
    console.log(`   🔐 Role: ${admin.role}`);
    console.log(`   ✓ Ativo: ${admin.isActive}`);

    // 3. Testar bcrypt
    console.log('\n3️⃣  Testando autenticação (bcrypt)...');
    const senha = 'admin@2026';
    const senhaCorreta = await admin.matchPassword(senha);

    if (!senhaCorreta) {
      console.log('   ❌ SENHA ESTÁ INCORRETA!');
      console.log('   Senha esperada: admin@2026');
      console.log('   💡 Solução: delete o usuário e execute: node scripts/seedAdmin.js');
      process.exit(1);
    }

    console.log('   ✅ Senha está correta');

    // 4. Gerar token
    console.log('\n4️⃣  Gerando token JWT...');
    const token = admin.getSignedJwtToken();

    if (!token) {
      console.log('   ❌ Erro ao gerar token');
      process.exit(1);
    }

    console.log('   ✅ Token gerado com sucesso');
    console.log(`   Token (primeiros 50 chars): ${token.substring(0, 50)}...`);

    // 5. Verificar arquivo .env
    console.log('\n5️⃣  Verificando configuração .env...');
    console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Definido' : '❌ NÃO DEFINIDO'}`);
    console.log(`   JWT_EXPIRE: ${process.env.JWT_EXPIRE || '7d'}`);
    console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Definido' : '❌ Usando padrão'}`);
    console.log(`   PORT: ${process.env.PORT || 5000}`);

    // 6. Resumo
    console.log('\n' + '='.repeat(50));
    console.log('\n✅ TUDO ESTÁ CORRETO!');
    console.log('\n📝 Você pode fazer login com:');
    console.log(`   Email: eu.henriquee2501@gmail.com`);
    console.log(`   Senha: admin@2026`);

    console.log('\n🚀 Próximos passos:');
    console.log('   1. Certifique-se que o backend está rodando: node server.js');
    console.log('   2. Abra http://localhost:5173 no navegador');
    console.log('   3. Clique em "Login"');
    console.log('   4. Digite email e senha acima');
    console.log('   5. Clique "Entrar"');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.log(`\n❌ ERRO: ${error.message}`);
    console.log('\n🆘 Checklist de resolução:');
    console.log('   [ ] MongoDB está rodando?');
    console.log('   [ ] MONGODB_URI está correto em .env?');
    console.log('   [ ] JWT_SECRET está definido em .env?');
    console.log('   [ ] Usuário admin foi criado? (node scripts/seedAdmin.js)');
    process.exit(1);
  }
}

diagnosis();
