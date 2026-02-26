const mongoose = require('mongoose');

const connectDB = async () => {
  // Se estiver em modo mock, MongoDB é opcional
  const isUsingMock = process.env.KIWIFY_USE_MOCK === 'true';

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);

    // Event listeners
    mongoose.connection.on('error', (err) => {
      console.error(`❌ Erro no MongoDB: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB desconectado');
    });

  } catch (error) {
    console.error(`❌ Erro ao conectar ao MongoDB: ${error.message}`);

    if (isUsingMock) {
      console.warn('⚠️ MongoDB não disponível, mas continuando em MODO DEMO');
      console.warn('📝 Os dados serão apenas mockados e não persistirão');
    } else {
      console.error('💥 MongoDB é necessário quando não estiver em modo mock');
      process.exit(1);
    }
  }
};

module.exports = connectDB;
