const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const whatsappService = require('../services/whatsappService');

/**
 * POST /api/whatsapp/generate-qr
 * Gerar QR code para autenticação de WhatsApp
 */
router.post('/generate-qr', protect, async (req, res) => {
  try {
    const sessionId = `wa_${req.user._id}_${Date.now()}`;

    const result = await whatsappService.generateWhatsAppQR(
      sessionId,
      req.user._id,
      req.user.companyId
    );

    res.json({
      success: true,
      qrCode: result.qrCode,
      sessionId: result.sessionId
    });
  } catch (error) {
    console.error('Erro ao gerar QR code:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao gerar QR code',
      error: error
    });
  }
});

/**
 * GET /api/whatsapp/session/:sessionId
 * Obter status da sessão
 */
router.get('/session/:sessionId', protect, async (req, res) => {
  try {
    const session = whatsappService.getActiveSession(req.params.sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Sessão não encontrada'
      });
    }

    res.json({
      success: true,
      session: {
        status: session.status,
        phoneNumber: session.phoneNumber,
        connectedAt: session.connectedAt,
        qr: session.status === 'waiting-scan' ? session.qr : null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter sessão',
      error: error.message
    });
  }
});

/**
 * GET /api/whatsapp/sessions
 * Listar todas as sessões ativas
 */
router.get('/sessions', protect, async (req, res) => {
  try {
    const sessions = whatsappService.listActiveSessions();

    // Filtrar apenas as sessões do usuário
    const userSessions = sessions.filter(s => s.userId === req.user._id.toString());

    res.json({
      success: true,
      sessions: userSessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao listar sessões',
      error: error.message
    });
  }
});

/**
 * DELETE /api/whatsapp/disconnect/:sessionId
 * Desconectar sessão
 */
router.delete('/disconnect/:sessionId', protect, async (req, res) => {
  try {
    const result = await whatsappService.disconnectSession(req.params.sessionId);

    res.json({
      success: true,
      message: 'Sessão desconectada com sucesso'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao desconectar',
      error: error.message
    });
  }
});

/**
 * POST /api/whatsapp/send-message
 * Enviar mensagem de teste
 */
router.post('/send-message', protect, async (req, res) => {
  try {
    const { sessionId, phoneNumber, message } = req.body;

    if (!sessionId || !phoneNumber || !message) {
      return res.status(400).json({
        success: false,
        message: 'sessionId, phoneNumber e message são obrigatórios'
      });
    }

    const result = await whatsappService.sendMessage(sessionId, phoneNumber, message);

    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao enviar mensagem',
      error: error.message
    });
  }
});

module.exports = router;
