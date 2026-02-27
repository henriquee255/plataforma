const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/plataforma');
    console.log('✅ Conectado ao MongoDB\n');

    const users = await User.find({}).select('-password');

    if (users.length === 0) {
      console.log('❌ NENHUM USUÁRIO ENCONTRADO NO BANCO!');
      console.log('\n💡 Solução: Execute:');
      console.log('   cd backend');
      console.log('   node scripts/seedAdmin.js\n');
    } else {
      console.log('📋 USUÁRIOS NO BANCO:');
      users.forEach((u, i) => {
        console.log(`${i + 1}. ${u.nome} (${u.email}) - Role: ${u.role} - Ativo: ${u.isActive}`);
      });

      console.log('\n✅ Você pode fazer login com:');
      const admin = users.find(u => u.role === 'admin');
      if (admin) {
        console.log(`   Email: ${admin.email}`);
        console.log(`   Senha: admin@2026`);
      }
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

checkUsers();
