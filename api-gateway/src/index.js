const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const vehicleRoutes = require('./routes/vehicle.routes');
const incidentRoutes = require('./routes/incident.routes');
const trafficRoutes = require('./routes/traffic.routes');
const notificationRoutes = require('./routes/notification.routes');

const app = express();
app.use(helmet());
app.use(express.json());
app.use(rateLimit({ windowMs: 60000, max: 100 }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/incidents', incidentRoutes);
app.use('/api/v1/traffic', trafficRoutes);
app.use('/api/v1/notifications', notificationRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Gateway running on http://localhost:${process.env.PORT}`);
}); 