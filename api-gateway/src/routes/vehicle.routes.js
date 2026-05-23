const router = require('express').Router();
const { addVehicle, getVehicles, recordPosition, getHistory } = require('../controllers/vehicle.controller');
const { authenticate, requireRole } = require('../middleware/auth.middleware');

router.get('/', authenticate, getVehicles);
router.get('/:vehicleId/history', authenticate, getHistory);
router.post('/', authenticate, requireRole('ADMIN'), addVehicle);
router.post('/position', authenticate, requireRole('ADMIN'), recordPosition);

module.exports = router;