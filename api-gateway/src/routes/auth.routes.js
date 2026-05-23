const router = require('express').Router();
const { login, register, validate, logout } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware'); 

router.post('/login', login);
router.post('/register', register);
router.post('/validate', validate);
router.post('/logout', authenticate, logout);

module.exports = router;