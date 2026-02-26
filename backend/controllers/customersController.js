const Customer = require('../models/Customer');

exports.getCustomers = async (req, res, next) => {
  try {
    const { integrationId } = req.query;
    const filter = integrationId ? { integrationId } : {};
    const customers = await Customer.find(filter).populate('integrationId', 'platform');
    res.json({ success: true, count: customers.length, data: customers });
  } catch (error) {
    next(error);
  }
};

exports.getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id).populate('integrationId');
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Cliente não encontrado' });
    }
    res.json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};
