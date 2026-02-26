import bcrypt from 'bcryptjs';
import UserModel from '../models/User.js';

/**
 * Seed automático - Cria usuários iniciais se não existirem
 */
export const seedUsers = async () => {
  try {
    // Verificar se já existem usuários
    const users = await UserModel.findAll();

    if (users.length > 0) {
      console.log('✅ Usuários já existem no sistema');
      return;
    }

    console.log('🌱 Criando usuário admin inicial...');

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Criar admin
    const admin = await UserModel.create({
      name: 'Henrique de Oliveira',
      email: 'eu.henriquee2501@gmail.com',
      password: hashedPassword,
      role: 'admin',
      avatar: 'https://ui-avatars.com/api/?name=Henrique+Oliveira&background=9333ea&color=fff&size=128',
    });

    console.log('✅ Usuário admin criado:');
    console.log('   Email:', admin.email);
    console.log('   Senha: admin123');
    console.log('   Role:', admin.role);
  } catch (error) {
    console.error('❌ Erro ao criar seed:', error);
  }
};

export default seedUsers;
