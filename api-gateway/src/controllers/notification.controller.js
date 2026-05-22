const axios = require('axios');
require('dotenv').config();

const sendNotification = async (req, res) => {
  try {
    const { userId, message, type } = req.body;
    const response = await axios.post(process.env.NOTIF_SERVICE + '/graphql', {
      query: `mutation { sendNotification(input: { userId: ${userId}, message: "${message}", type: "${type}" }) { id message isRead createdAt } }`
    });
    res.json(response.data.data.sendNotification);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const response = await axios.post(process.env.NOTIF_SERVICE + '/graphql', {
      query: `query { getNotifications(userId: ${userId}) { id message type isRead createdAt } }`
    });
    res.json(response.data.data.getNotifications);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.body;
    const response = await axios.post(process.env.NOTIF_SERVICE + '/graphql', {
      query: `mutation { markAsRead(id: ${id}) { id isRead } }`
    });
    res.json(response.data.data.markAsRead);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

module.exports = { sendNotification, getNotifications, markAsRead };