const router = require('express').Router();
const { createZone, measureDensity, getCongestedZones, getZones , getAllTrafficData} = require('../controllers/traffic.controller');
const { authenticate, requireRole } = require('../middleware/auth.middleware');

router.post('/zones', authenticate, createZone);
router.post('/density', authenticate, measureDensity);
router.get('/congested', authenticate, getCongestedZones);
router.get('/zones', authenticate, getZones);
router.get('/data', authenticate, getAllTrafficData);

module.exports = router;