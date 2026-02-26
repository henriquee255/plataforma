const express = require('express');
const { protect } = require('../middlewares/auth');
const { getProducts } = require('../controllers/productsController');

const router = express.Router();
router.use(protect);

router.get('/', getProducts);

module.exports = router;
