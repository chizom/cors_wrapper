const express = require('express');
const axios = require('axios');
const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.post('/cors_helper', async (req, res) => {
  try {
    const { url, method, headers = {}, body } = req.body;
    
    if (!url || !method) {
      return res.status(400).json({ error: 'URL and method are required' });
    }

    const response = await axios({
      url,
      method,
      headers,
      data: body,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 30000 // 30 second timeout
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Proxy error:', error);
    const status = error.response?.status || 500;
    res.status(status).json({
      error: 'Proxy error',
      message: error.message,
      details: error.response?.data || null
    });
  }
});

module.exports = app;