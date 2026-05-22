const router = require('express').Router();
const { declareIncident, getIncidents, updateIncidentStatus } = require('../controllers/incident.controller');

router.post('/', declareIncident);
router.get('/', getIncidents);
router.post('/status', updateIncidentStatus);

module.exports = router;