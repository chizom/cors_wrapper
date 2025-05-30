// cors_helper.js - Final Version
const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const router = express.Router();

router.post('/', express.json(), async (req, res) => {
  try {
    // Validate request
    if (!req.body.url || !req.body.method) {
      return res.status(400).json({
        status: 'error',
        code: 'INVALID_REQUEST',
        message: 'Missing URL or method'
      });
    }

    // Prepare axios config
    const config = {
      url: req.body.url,
      method: req.body.method,
      headers: {
        ...req.body.headers,
        'Content-Type': 'multipart/form-data'
      },
      maxContentLength: 50 * 1024 * 1024, // 50MB
      maxBodyLength: 50 * 1024 * 1024 // 50MB
    };

    // Handle FormData conversion
    if (req.body.formData) {
      const form = new FormData();
      
      // Append regular fields
      if (req.body.formData.fields) {
        Object.entries(req.body.formData.fields).forEach(([key, value]) => {
          form.append(key, value);
        });
      }
      
      // Append files
      if (req.body.formData.files) {
        req.body.formData.files.forEach(file => {
          form.append('files', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype
          });
        });
      }
      
      config.data = form;
      config.headers = {
        ...config.headers,
        ...form.getHeaders()
      };
    }

    // Make the request
    const response = await axios(config);
    
    res.status(response.status).json({
      status: 'success',
      data: response.data
    });

  } catch (error) {
    console.error('Proxy error:', error);
    
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message;
    
    res.status(status).json({
      status: 'error',
      code: 'PROXY_ERROR',
      message: message,
      details: error.response?.data || null
    });
  }
});

module.exports = router;