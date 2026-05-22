const axios = require('axios');
require('dotenv').config();

const createZone = async (req, res) => {
  try {
    const { name, lat, lng, radius } = req.body;
    const response = await axios.post(process.env.TRAFFIC_SERVICE + '/graphql', {
      query: `mutation { createZone(input: { name: "${name}", lat: ${lat}, lng: ${lng}, radius: ${radius} }) { id name lat lng radius } }`
    });
    res.json(response.data.data.createZone);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const measureDensity = async (req, res) => {
  try {
    const { zoneId, density } = req.body;
    const response = await axios.post(process.env.TRAFFIC_SERVICE + '/graphql', {
      query: `mutation { measureDensity(input: { zoneId: ${zoneId}, density: ${density} }) { id zoneId density level timestamp } }`
    });
    res.json(response.data.data.measureDensity);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const getCongestedZones = async (req, res) => {
  try {
    const response = await axios.post(process.env.TRAFFIC_SERVICE + '/graphql', {
      query: `query { getCongestedZones { id zoneId density level timestamp } }`
    });
    res.json(response.data.data.getCongestedZones);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

module.exports = { createZone, measureDensity, getCongestedZones };