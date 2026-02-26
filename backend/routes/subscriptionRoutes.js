const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth'); // Assumindo que existe middleware de auth

// ===== SUBSCRIPTION ROUTES =====

/**
 * @route   GET /api/subscriptions/me
 * @desc    Obter assinatura do usuário logado
 * @access  Private
 */
router.get('/me', protect, subscriptionController.getMySubscription);

/**
 * @route   POST /api/subscriptions
 * @desc    Criar assinatura
 * @access  Private
 */
router.post('/', protect, subscriptionController.createSubscription);

/**
 * @route   PATCH /api/subscriptions/upgrade
 * @desc    Fazer upgrade de plano
 * @access  Private
 */
router.patch('/upgrade', protect, subscriptionController.upgradePlan);

/**
 * @route   PATCH /api/subscriptions/downgrade
 * @desc    Fazer downgrade de plano
 * @access  Private
 */
router.patch('/downgrade', protect, subscriptionController.downgradePlan);

/**
 * @route   POST /api/subscriptions/cancel
 * @desc    Cancelar assinatura
 * @access  Private
 */
router.post('/cancel', protect, subscriptionController.cancelSubscription);

/**
 * @route   POST /api/subscriptions/reactivate
 * @desc    Reativar assinatura
 * @access  Private
 */
router.post('/reactivate', protect, subscriptionController.reactivateSubscription);

/**
 * @route   POST /api/subscriptions/payment
 * @desc    Registrar pagamento (webhook)
 * @access  Private (Webhook)
 */
router.post('/payment', subscriptionController.addPayment);

/**
 * @route   GET /api/subscriptions/can-create-company
 * @desc    Verificar se pode criar empresa
 * @access  Private
 */
router.get('/can-create-company', protect, subscriptionController.canCreateCompany);

/**
 * @route   GET /api/subscriptions/stats
 * @desc    Obter estatísticas de uso
 * @access  Private
 */
router.get('/stats', protect, subscriptionController.getSubscriptionStats);

module.exports = router;
