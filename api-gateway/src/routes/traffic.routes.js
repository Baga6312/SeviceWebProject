const router = require('express').Router();
const { createZone, measureDensity, getCongestedZones } = require('../controllers/traffic.controller');

router.post('/zones', createZone);
router.get('/congested', getCongestedZones);
router.post('/density', measureDensity);

module.exports = router;