import bcrypt from 'bcryptjs';
import UserModel from '../models/User.js';

/**
 * Script para criar usuário Henrique (Admin)
 */

const createHenrique = async () => {
  try {
    console.log('🔧 Criando usuário Henrique...\n');

    const email = 'eu.henriquee2501@gmail.com';

    // Verificar se usuário já existe
    const existing = await UserModel.findByEmail(email);

    if (existing) {
      console.log('⚠️  Usuário já existe!');
      console.log('📧 Email:', email);
      console.log('🔑 Senha: admin123\n');

      // Atualizar para admin se não for
      if (existing.role !== 'admin') {
        await UserModel.update(existing.id, { role: 'admin' });
        console.log('✅ Role atualizado para admin!\n');
      }
      return;
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Criar usuário
    const user = await UserModel.create({
      name: 'Henrique de Oliveira',
      email: email,
      password: hashedPassword,
      role: 'admin',
      avatar: 'https://ui-avatars.com/api/?name=Henrique+Oliveira&background=9333ea&color=fff&size=128',
    });

    console.log('✅ Usuário criado com sucesso!\n');
    console.log('📋 Detalhes:');
    console.log('   ID:', user.id);
    console.log('   Nome:', user.name);
    console.log('   Email:', user.email);
    console.log('   Role:', user.role);
    console.log('   Senha: admin123\n');
    console.log('🔐 Você já pode fazer login!\n');
  } catch (error) {
    console.error('❌ Erro:', error);
  }
};

createHenrique();

export default createHenrique;
