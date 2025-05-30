// cors_helper.js - Final Robust Version
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', express.json(), async (req, res) => {
  try {
    // Validate required parameters
    if (!req.body.url || !req.body.method) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_PARAMS',
          message: 'URL and method are required'
        }
      });
    }

    // Prepare request config
    const config = {
      url: req.body.url,
      method: req.body.method,
      headers: req.body.headers || {},
      data: req.body.bodyParam || {},
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    };

    // Make the request
    const response = await axios(config);
    
    // Ensure JSON response
    res.setHeader('Content-Type', 'application/json');
    res.status(response.status).json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Proxy error:', error);
    
    // Determine if this is an axios error
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message;
    
    // Always return JSON, even for errors
    res.setHeader('Content-Type', 'application/json');
    res.status(status).json({
      success: false,
      error: {
        code: error.response?.data?.code || 'PROXY_ERROR',
        message: message,
        details: error.response?.data || null
      }
    });
  }
});

module.exports = router;