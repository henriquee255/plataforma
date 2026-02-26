const express = require('express');
const router = express.Router();
const webhooksController = require('../controllers/webhooksController');

// IMPORTANTE: Webhooks NÃO usam authMiddleware
// As plataformas enviam dados publicamente

// Kiwify Webhook
router.post('/kiwify', webhooksController.handleKiwifyWebhook);

// Hotmart Postback
router.post('/hotmart', webhooksController.handleHotmartWebhook);

// Stripe Webhook
router.post('/stripe', express.raw({ type: 'application/json' }), webhooksController.handleStripeWebhook);

// Health check para testar conectividade
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Webhooks endpoint funcionando',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
