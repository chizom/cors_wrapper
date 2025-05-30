// cors_helper.js - Updated Version
const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const router = express.Router();

router.post('/', express.json(), async (req, res) => {
  try {
    const { url, method, bodyParam, headers } = req.body;

    if (!url || !method) {
      return res.status(400).json({ 
        success: false,
        error: {
          code: 'MISSING_PARAMS',
          message: 'URL and method are required'
        }
      });
    }

    // Handle FormData conversion
    let requestData;
    const requestHeaders = {
      ...headers,
      'Content-Type': headers?.['Content-Type'] || 'multipart/form-data'
    };

    if (bodyParam?.formData) {
      const form = new FormData();
      Object.entries(bodyParam.formData).forEach(([key, value]) => {
        if (key === 'files' && Array.isArray(value)) {
          value.forEach(file => form.append(key, file));
        } else {
          form.append(key, value);
        }
      });
      requestData = form;
      Object.assign(requestHeaders, form.getHeaders());
    } else {
      requestData = bodyParam;
    }

    const response = await axios({
      url,
      method,
      data: requestData,
      headers: requestHeaders,
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    res.status(response.status).json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PROXY_ERROR',
        message: error.message,
        details: error.response?.data || null,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
});

module.exports = router