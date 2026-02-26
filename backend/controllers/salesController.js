const Sale = require('../models/Sale');

exports.getSales = async (req, res, next) => {
  try {
    const { integrationId, status } = req.query;
    const filter = {};
    if (integrationId) filter.integrationId = integrationId;
    if (status) filter.status = status;
    
    const sales = await Sale.find(filter)
      .populate('customerId', 'nome email')
      .populate('productId', 'name price')
      .sort({ dataCompra: -1 });
    
    res.json({ success: true, count: sales.length, data: sales });
  } catch (error) {
    next(error);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const { integrationId } = req.query;
    const filter = integrationId ? { integrationId } : {};
    
    const [totalSales, totalRefunds, salesByType] = await Promise.all([
      Sale.aggregate([
        { $match: { ...filter, status: 'approved' } },
        { $group: { _id: null, total: { $sum: '$valor' }, count: { $sum: 1 } } }
      ]),
      Sale.aggregate([
        { $match: { ...filter, reembolsado: true } },
        { $group: { _id: null, total: { $sum: '$valor' }, count: { $sum: 1 } } }
      ]),
      Sale.aggregate([
        { $match: { ...filter, status: 'approved' } },
        { $group: { _id: '$tipoPagamento', total: { $sum: '$valor' }, count: { $sum: 1 } } }
      ])
    ]);
    
    res.json({
      success: true,
      data: {
        totalVendas: totalSales[0]?.total || 0,
        totalVendasCount: totalSales[0]?.count || 0,
        totalReembolsos: totalRefunds[0]?.total || 0,
        totalReembolsosCount: totalRefunds[0]?.count || 0,
        porTipo: salesByType
      }
    });
  } catch (error) {
    next(error);
  }
};
