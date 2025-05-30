// cors_helper.js - Minimal Version
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', express.raw({ type: '*/*' }), async (req, res) => {
  try {
    // Get the raw body and headers
    const { url, method, headers, body } = JSON.parse(req.body.toString());
    
    // Forward everything exactly as received
    const response = await axios({
      url,
      method,
      headers,
      data: body,
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
    
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({
      error: 'Proxy error',
      message: error.message,
      details: error.response?.data || null
    });
  }
});

module.exports = router;