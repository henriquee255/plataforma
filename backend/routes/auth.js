const express = require('express');
const {
  register,
  login,
  getMe,
  updateDetails,
  logout
} = require('../controllers/authController');

const router = express.Router();
const { protect } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/me', protect, updateDetails);

module.exports = router;
