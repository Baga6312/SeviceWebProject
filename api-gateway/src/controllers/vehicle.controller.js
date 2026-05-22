const axios = require('axios');
require('dotenv').config();

const addVehicle = async (req, res) => {
  try {
    const { plate, type, ownerId } = req.body;
    const response = await axios.post(process.env.VEHICLE_SERVICE + '/graphql', {
      query: `mutation { addVehicle(input: { plate: "${plate}", type: "${type}", ownerId: ${ownerId} }) { id plate type status } }`
    });
    res.json(response.data.data.addVehicle);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const getVehicles = async (req, res) => {
  try {
    const response = await axios.post(process.env.VEHICLE_SERVICE + '/graphql', {
      query: `query { getVehicles { id plate type status createdAt } }`
    });
    res.json(response.data.data.getVehicles);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const recordPosition = async (req, res) => {
  try {
    const { vehicleId, lat, lng } = req.body;
    const response = await axios.post(process.env.VEHICLE_SERVICE + '/graphql', {
      query: `mutation { recordPosition(input: { vehicleId: ${vehicleId}, lat: ${lat}, lng: ${lng} }) { id vehicleId lat lng timestamp } }`
    });
    res.json(response.data.data.recordPosition);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const getHistory = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const response = await axios.post(process.env.VEHICLE_SERVICE + '/graphql', {
      query: `query { getHistory(vehicleId: ${vehicleId}) { id lat lng timestamp } }`
    });
    res.json(response.data.data.getHistory);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

module.exports = { addVehicle, getVehicles, recordPosition, getHistory };