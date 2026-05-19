const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');

const app = express();
app.use(helmet());
app.use(express.json());

app.use((req, res, next) => {
  if (!['GET', 'POST'].includes(req.method)) {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  next();
});

app.use(rateLimit({ windowMs: 60000, max: 100 }));

app.use('/api/v1/auth', authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Gateway running on http://localhost:${process.env.PORT}`);
});