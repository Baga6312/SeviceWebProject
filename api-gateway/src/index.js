const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
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

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/incidents', incidentRoutes);
app.use('/api/v1/traffic', trafficRoutes);
app.use('/api/v1/notifications', notificationRoutes);

app.use((req, res, next) => {
  if (!['GET', 'POST'].includes(req.method)) {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway', timestamp: new Date().toISOString() });
});

app.listen(process.env.PORT, () => {
  console.log(`Gateway running on http://localhost:${process.env.PORT}`);
});