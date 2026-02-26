const Product = require('../models/Product');

exports.getProducts = async (req, res, next) => {
  try {
    const { integrationId } = req.query;
    const filter = integrationId ? { integrationId } : {};
    const products = await Product.find(filter);
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};
