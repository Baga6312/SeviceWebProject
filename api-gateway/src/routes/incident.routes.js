const router = require('express').Router();
const { declareIncident, getIncidents, updateIncidentStatus } = require('../controllers/incident.controller');
const { authenticate, requireRole } = require('../middleware/auth.middleware');

router.post('/', authenticate, declareIncident);
router.get('/', authenticate, getIncidents);
router.post('/status', authenticate, requireRole('ADMIN'), updateIncidentStatus);

module.exports = router;