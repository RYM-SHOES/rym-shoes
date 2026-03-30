const express = require('express');
const router = express.Router();
const { adminLogin, register, login } = require('../controllers/authController');

router.post('/admin/login', adminLogin);
router.post('/register', register);
router.post('/login', login);

module.exports = router;
