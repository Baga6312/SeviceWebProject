const jwt = require('jsonwebtoken');
const Redis = require('ioredis');
require('dotenv').config();

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const authenticate = async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    try {
      const blacklisted = await redis.get(`blacklist:${token}`);
      if (blacklisted) return res.status(401).json({ message: 'Token revoked' });
    } catch (redisErr) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Redis unavailable, skipping blacklist check:', redisErr.message || redisErr);
      }
    }

    if (!process.env.JWT_SECRET && process.env.NODE_ENV !== 'production') {
      console.warn('JWT_SECRET is not set in api-gateway process.env; jwt.verify may fail');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.headers['x-user-id'] = decoded.id;
    req.headers['x-user-role'] = decoded.role;
    next();
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug('Authentication failed for token:', token, 'error:', e.message);
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  next();
};

module.exports = { authenticate, requireRole };