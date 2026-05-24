const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const vehicleRoutes = require('./routes/vehicle.routes');
const incidentRoutes = require('./routes/incident.routes');
const trafficRoutes = require('./routes/traffic.routes');
const notificationRoutes = require('./routes/notification.routes');
const cookieParser = require('cookie-parser');


const app = express();
app.use(cors({ origin: 'http://localhost:3000' , credentials: true }));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json());
app.use(cookieParser());
app.use(rateLimit({ windowMs: 60000, max: 100 }));



app.use((req, res, next) => {
  if (!['GET', 'POST'].includes(req.method)) {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  next();
});


app.get('/health', async (req, res) => {
  try {
    await Promise.all([
      axios.get(`${process.env.AUTH_SERVICE}/health`),
      axios.get(`${process.env.NOTIF_SERVICE}/health`),
      axios.get(`${process.env.VEHICLE_SERVICE}/health`),
      axios.get(`${process.env.TRAFFIC_SERVICE}/health`),
      axios.get(`${process.env.INCIDENT_SERVICE}/health`),
    ]);
    res.json({ status: 'ok' });
  } catch (e) {
    res.status(503).json({ status: 'degraded', error: e.message });
  }
});



app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/incidents', incidentRoutes);
app.use('/api/v1/traffic', trafficRoutes);
app.use('/api/v1/notifications', notificationRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});



app.listen(process.env.PORT, () => {
  console.log(`Gateway running on http://localhost:${process.env.PORT}`);
});