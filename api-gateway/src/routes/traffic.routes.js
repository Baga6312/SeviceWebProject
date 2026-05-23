const router = require('express').Router();
const { createZone, measureDensity, getCongestedZones } = require('../controllers/traffic.controller');
const { authenticate, requireRole } = require('../middleware/auth.middleware');

router.post('/zones', authenticate, requireRole('ADMIN'), createZone);
router.post('/density', authenticate, requireRole('ADMIN'), measureDensity);
router.get('/congested', authenticate, getCongestedZones);

module.exports = router;