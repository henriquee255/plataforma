const express = require('express');
const { protect } = require('../middlewares/auth');
const { getSales, getStats } = require('../controllers/salesController');

const router = express.Router();
router.use(protect);

router.get('/', getSales);
router.get('/stats', getStats);

module.exports = router;
