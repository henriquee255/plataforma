const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const integrationsController = require('../controllers/integrationsController');

// ROTAS DE LISTAGEM E GERENCIAMENTO
router.get('/', protect, integrationsController.list);
router.get('/:id', protect, integrationsController.getById);
router.post('/', protect, integrationsController.create);
router.put('/:id', protect, integrationsController.update);
router.delete('/:id', protect, integrationsController.delete);

// ROTAS DE AUTENTICAÇÃO POR PLATAFORMA
router.post('/kiwify/connect', integrationsController.connectKiwify); // Temporariamente sem auth para teste
router.post('/kiwify/disconnect', protect, integrationsController.disconnectKiwify);
router.post('/kiwify/sync', protect, integrationsController.syncKiwify);
router.get('/kiwify/sync', integrationsController.getKiwifyData); // Temporariamente sem auth para teste
router.get('/kiwify/stats', integrationsController.getKiwifyStats); // Temporariamente sem auth para teste

router.post('/hotmart/connect', integrationsController.connectHotmart); // Temporariamente sem auth para teste
router.post('/hotmart/disconnect', protect, integrationsController.disconnectHotmart);
router.post('/hotmart/sync', protect, integrationsController.syncHotmart);
router.get('/hotmart/sync', integrationsController.getHotmartData); // Temporariamente sem auth para teste

router.post('/stripe/connect', protect, integrationsController.connectStripe);
router.post('/stripe/disconnect', protect, integrationsController.disconnectStripe);
router.post('/stripe/sync', protect, integrationsController.syncStripe);

// ROTAS DE STATUS
router.get('/:id/status', protect, integrationsController.checkStatus);
router.get('/:id/data', protect, integrationsController.getData);

module.exports = router;

// ENDPOINT DE TESTE - Criar venda fake para teste
router.post('/test/create-sale', async (req, res) => {
  const Customer = require('../models/Customer');
  const Sale = require('../models/Sale');
  const Tag = require('../models/Tag');

  try {
    // Criar cliente de teste
    const customer = new Customer({
      userId: new require('mongoose').Types.ObjectId('000000000000000000000001'),
      name: 'João da Silva Teste',
      email: 'joao.teste@example.com',
      phone: '+55 11 98765-4321',
      document: '123.456.789-00',
      source: req.body.platform || 'kiwify',
      externalId: 'test_' + Date.now()
    });

    // Criar tag
    const productName = req.body.productName || 'Super Links - Plano Vitalício';
    const tagName = productName.split('-')[0].trim();
    
    const tag = await Tag.findOrCreate(customer.userId, tagName, req.body.platform || 'kiwify', 'prod_test_001');
    customer.addTag(tagName);
    customer.metadata.set('lastProduct', productName);
    customer.metadata.set('lastPaymentType', 'vitalicia');
    customer.metadata.set('lastStatus', 'approved');
    
    await customer.save();

    // Criar venda
    const sale = new Sale({
      userId: customer.userId,
      customerId: customer._id,
      platform: req.body.platform || 'kiwify',
      externalId: 'sale_test_' + Date.now(),
      productName: productName,
      productId: 'prod_test_001',
      amount: 497.00,
      currency: 'BRL',
      status: 'approved',
      paymentType: 'vitalicia',
      saleDate: new Date()
    });

    await sale.save();

    // Atualizar stats do cliente
    await customer.updatePurchaseStats();

    res.json({
      success: true,
      message: 'Venda de teste criada com sucesso!',
      data: {
        customer: customer,
        sale: sale,
        tag: tag
      }
    });
  } catch (error) {
    console.error('Erro ao criar venda de teste:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
