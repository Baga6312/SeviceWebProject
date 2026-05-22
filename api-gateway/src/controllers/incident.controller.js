const axios = require('axios');
require('dotenv').config();

const declareIncident = async (req, res) => {
  try {
    const { type, description, location, reportedBy } = req.body;
    const response = await axios.post(process.env.INCIDENT_SERVICE + '/graphql', {
      query: `mutation { declareIncident(input: { type: "${type}", description: "${description}", location: "${location}", reportedBy: ${reportedBy} }) { id type status createdAt } }`
    });
    res.json(response.data.data.declareIncident);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const getIncidents = async (req, res) => {
  try {
    const response = await axios.post(process.env.INCIDENT_SERVICE + '/graphql', {
      query: `query { getIncidents { id type description location status reportedBy createdAt } }`
    });
    res.json(response.data.data.getIncidents);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const updateIncidentStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const response = await axios.post(process.env.INCIDENT_SERVICE + '/graphql', {
      query: `mutation { updateIncidentStatus(input: { id: ${id}, status: "${status}" }) { id status updatedAt } }`
    });
    res.json(response.data.data.updateIncidentStatus);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

module.exports = { declareIncident, getIncidents, updateIncidentStatus };