const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode');
const path = require('path');
const fs = require('fs');

/**
 * WhatsApp Service usando Baileys
 * Gerencia autenticação e conexão com WhatsApp
 */

// Armazenar sessões ativas em memória
const activeSessions = new Map();

/**
 * Iniciar sessão de WhatsApp e gerar QR Code
 */
exports.generateWhatsAppQR = async (sessionId, userId, companyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Diretório para armazenar auth
      const authDir = path.join(__dirname, '../auth_info_baileys', sessionId);
      if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir, { recursive: true });
      }

      // Carregar estado de autenticação
      const { state, saveCreds } = await useMultiFileAuthState(authDir);

      // Criar socket
      const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: require('pino')({ level: 'error' })
      });

      // Armazenar QR Code quando gerado
      sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        // QR Code gerado
        if (qr) {
          try {
            const qrDataUrl = await qrcode.toDataURL(qr);
            console.log(`✅ QR Code gerado para sessão ${sessionId}`);

            // Armazenar na memória
            activeSessions.set(sessionId, {
              sock,
              qr: qrDataUrl,
              status: 'waiting-scan',
              userId,
              companyId,
              createdAt: new Date()
            });

            // Resolver a promise com o QR code
            resolve({
              success: true,
              qrCode: qrDataUrl,
              sessionId: sessionId
            });
          } catch (err) {
            reject({
              success: false,
              message: 'Erro ao gerar QR code',
              error: err.message
            });
          }
        }

        // Conexão estabelecida
        if (connection === 'open') {
          console.log(`✅ WhatsApp conectado para sessão ${sessionId}`);

          const session = activeSessions.get(sessionId);
          if (session) {
            session.status = 'connected';
            session.connectedAt = new Date();
            session.phoneNumber = sock.user?.id;
          }
        }

        // Desconectado
        if (connection === 'close') {
          const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
          console.log(`❌ WhatsApp desconectado para sessão ${sessionId}`, shouldReconnect ? 'Reconectando...' : 'Logout');

          // Limpar sessão
          if (!shouldReconnect) {
            activeSessions.delete(sessionId);
            // Limpar arquivos de autenticação
            if (fs.existsSync(authDir)) {
              fs.rmSync(authDir, { recursive: true, force: true });
            }
          }
        }
      });

      // Salvar credenciais quando autenticado
      sock.ev.on('creds.update', saveCreds);

      // Timeout de 60 segundos para gerar QR
      setTimeout(() => {
        if (activeSessions.get(sessionId)?.status === 'waiting-scan') {
          reject({
            success: false,
            message: 'Timeout ao gerar QR code'
          });
        }
      }, 60000);
    } catch (error) {
      console.error('Erro ao gerar WhatsApp QR:', error);
      reject({
        success: false,
        message: 'Erro ao conectar WhatsApp',
        error: error.message
      });
    }
  });
};

/**
 * Obter sessão ativa
 */
exports.getActiveSession = (sessionId) => {
  return activeSessions.get(sessionId);
};

/**
 * Listar todas as sessões
 */
exports.listActiveSessions = () => {
  const sessions = [];
  activeSessions.forEach((session, id) => {
    sessions.push({
      sessionId: id,
      status: session.status,
      phoneNumber: session.phoneNumber,
      connectedAt: session.connectedAt,
      userId: session.userId,
      companyId: session.companyId
    });
  });
  return sessions;
};

/**
 * Desconectar sessão
 */
exports.disconnectSession = async (sessionId) => {
  try {
    const session = activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Sessão não encontrada');
    }

    // Fazer logout
    await session.sock.logout();

    // Remover da memória
    activeSessions.delete(sessionId);

    // Remover arquivos
    const authDir = path.join(__dirname, '../auth_info_baileys', sessionId);
    if (fs.existsSync(authDir)) {
      fs.rmSync(authDir, { recursive: true, force: true });
    }

    console.log(`✅ Sessão ${sessionId} desconectada`);

    return {
      success: true,
      message: 'Sessão desconectada com sucesso'
    };
  } catch (error) {
    console.error('Erro ao desconectar sessão:', error);
    throw error;
  }
};

/**
 * Enviar mensagem (para testes)
 */
exports.sendMessage = async (sessionId, phoneNumber, message) => {
  try {
    const session = activeSessions.get(sessionId);
    if (!session || session.status !== 'connected') {
      throw new Error('Sessão não conectada');
    }

    // Enviar mensagem
    await session.sock.sendMessage(phoneNumber + '@s.whatsapp.net', {
      text: message
    });

    return {
      success: true,
      message: 'Mensagem enviada com sucesso'
    };
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    throw error;
  }
};

/**
 * Limpar sessões antigas (mais de 1 hora)
 */
exports.cleanupOldSessions = () => {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  activeSessions.forEach((session, sessionId) => {
    if (session.status === 'waiting-scan' && session.createdAt < oneHourAgo) {
      console.log(`🧹 Limpando sessão antiga: ${sessionId}`);
      session.sock.end();
      activeSessions.delete(sessionId);

      const authDir = path.join(__dirname, '../auth_info_baileys', sessionId);
      if (fs.existsSync(authDir)) {
        fs.rmSync(authDir, { recursive: true, force: true });
      }
    }
  });
};

// Executar limpeza a cada 30 minutos
setInterval(exports.cleanupOldSessions, 30 * 60 * 1000);
