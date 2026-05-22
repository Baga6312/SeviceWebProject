const router = require('express').Router();
const { addVehicle, getVehicles, recordPosition, getHistory } = require('../controllers/vehicle.controller');

router.post('/', addVehicle);
router.get('/', getVehicles);
router.post('/position', recordPosition);
router.get('/:vehicleId/history', getHistory);

module.exports = router;
