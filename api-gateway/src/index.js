const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const { stitchSchemas } = require('@graphql-tools/stitch');
const { schemaFromExecutor, wrapSchema } = require('@graphql-tools/wrap');
const { buildHTTPExecutor } = require('@graphql-tools/executor-http');
const { graphqlHTTP } = require('express-graphql');

const authRoutes = require('./routes/auth.routes');
const vehicleRoutes = require('./routes/vehicle.routes');
const incidentRoutes = require('./routes/incident.routes');
const trafficRoutes = require('./routes/traffic.routes');
const notificationRoutes = require('./routes/notification.routes');

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use((req, res, next) => {
  if (req.path === '/graphql') return next();
  helmet({ crossOriginResourcePolicy: false })(req, res, next);
});
app.use(express.json());
app.use(cookieParser());
app.use(rateLimit({ windowMs: 60000, max: 100 }));

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

async function buildGatewaySchema() {
  const services = [
    { name: 'auth',     url: process.env.AUTH_SERVICE    + '/graphql' },
    { name: 'vehicle',  url: process.env.VEHICLE_SERVICE + '/graphql' },
    { name: 'traffic',  url: process.env.TRAFFIC_SERVICE + '/graphql' },
    { name: 'incident', url: process.env.INCIDENT_SERVICE + '/graphql' },
    { name: 'notif',    url: process.env.NOTIF_SERVICE   + '/graphql' },
  ];

  const subschemas = await Promise.all(
    services.map(async ({ url }) => {
      const executor = buildHTTPExecutor({ endpoint: url });
      const schema = await schemaFromExecutor(executor);
      return { schema: wrapSchema({ schema, executor }), executor };
    })
  );

  return stitchSchemas({ subschemas });
}

async function start() {
  const schema = await buildGatewaySchema();

  app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));


  app.get('/sandbox', (req, res) => {
    res.redirect('https://sandbox.apollo.dev/?endpoint=http://localhost:4000/graphql');
  });

  app.use((req, res) => res.status(404).json({ message: 'Not Found' }));
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
  });

  app.listen(process.env.PORT, () => {
    console.log(`Gateway running on http://localhost:${process.env.PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${process.env.PORT}/graphql`);
    console.log(`Apollo Sandbox: http://localhost:${process.env.PORT}/sandbox`);
  });
}

start();