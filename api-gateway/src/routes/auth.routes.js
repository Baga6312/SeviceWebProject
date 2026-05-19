const router = require('express').Router();
const { login, register, validate } = require('../controllers/auth.controller');

router.post('/login', login);
router.post('/register', register);
router.post('/validate', validate);

module.exports = router;