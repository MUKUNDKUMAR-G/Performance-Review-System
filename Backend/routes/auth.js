const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../utils/validators');

router.post('/register', registerValidation, authController.register);

router.post('/login', loginValidation, authController.login);

router.get('/me', auth, authController.getCurrentUser);

module.exports = router;