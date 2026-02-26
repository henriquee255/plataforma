const express = require('express');
const { protect } = require('../middlewares/auth');
const { getCustomers, getCustomer } = require('../controllers/customersController');

const router = express.Router();
router.use(protect);

router.get('/', getCustomers);
router.get('/:id', getCustomer);

module.exports = router;
