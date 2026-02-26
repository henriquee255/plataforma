import bcrypt from 'bcryptjs';
import UserModel from '../models/User.js';

/**
 * Script para criar usuário admin inicial
 * Executar: node scripts/create-admin.js
 */

const createAdmin = async () => {
  try {
    console.log('🔧 Criando usuário admin...\n');

    const adminEmail = 'admin@plataforma.com';

    // Verificar se admin já existe
    const existingAdmin = await UserModel.findByEmail(adminEmail);

    if (existingAdmin) {
      console.log('⚠️  Admin já existe!');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Senha: admin123\n');
      return;
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Criar admin
    const admin = await UserModel.create({
      name: 'Administrador',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      avatar: 'https://ui-avatars.com/api/?name=Admin&background=9333ea&color=fff&size=128',
    });

    console.log('✅ Usuário admin criado com sucesso!\n');
    console.log('📋 Detalhes:');
    console.log('   ID:', admin.id);
    console.log('   Nome:', admin.name);
    console.log('   Email:', admin.email);
    console.log('   Role:', admin.role);
    console.log('   Senha: admin123\n');
    console.log('🔐 Você pode fazer login com estas credenciais.\n');
  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
  }
};

// Executar se chamado diretamente
createAdmin();

export default createAdmin;
