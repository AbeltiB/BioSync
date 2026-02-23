const express = require('express');
const config = require('./config');
const apiRoutes = require('./routes/api');

const app = express();

// Middleware
app.use(express.json());

// Simple API key authentication
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== config.apiKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

// Mount routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => res.send('OK'));

module.exports = app;