const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: null
    }
  },
  crossOriginEmbedderPolicy: false
});

const corsConfig = cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Try again later.' }
});

module.exports = { helmetConfig, corsConfig, limiter };
