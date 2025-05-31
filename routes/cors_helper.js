const express = require('express')
const request = require('request');
const bodyParser = require('body-parser')
const axios = require('axios');
const FormData = require('form-data');
const multer = require('multer');
const { response } = require('express');

const jsonParser = bodyParser.json()
const router = express.Router()

// Configure multer for handling multipart/form-data
const upload = multer();

// Handle JSON requests
router.post('/', jsonParser, async (req, res) => {
  try {
    const requestUrl = req.body.url;
    const requestMethod = req.body.method;
    const requestBodyParam = req.body.bodyParam;
    const requestHeaders = req.body.headers;

    let axiosConfig = {
      url: requestUrl,
      method: requestMethod,
      headers: requestHeaders,
    };

    // Check if the requestBodyParam is not an empty object
    if (requestBodyParam && Object.keys(requestBodyParam).length !== 0) {
      axiosConfig.data = requestBodyParam;
    }

    const response = await axios(axiosConfig);
    res.status(200).json(response.data);
  } catch (err) {
    console.error('JSON request error:', err.message);
    res.status(500).json({ 
      error: true, 
      message: err.response?.data || err.message 
    });
  }
});

// Handle FormData requests
router.post('/formdata', upload.any(), async (req, res) => {
  try {
    const { url, method, headers } = req.body;
    
    if (!url || !method) {
      return res.status(400).json({ 
        error: true, 
        message: 'URL and method are required' 
      });
    }

    // Create new FormData for the outgoing request
    const formData = new FormData();
    
    // Add text fields from req.body (except url, method, headers)
    Object.keys(req.body).forEach(key => {
      if (!['url', 'method', 'headers'].includes(key)) {
        formData.append(key, req.body[key]);
      }
    });
    
    // Add files from req.files
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        formData.append(file.fieldname, file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype
        });
      });
    }

    // Parse headers if they're a JSON string
    let parsedHeaders = {};
    if (headers) {
      try {
        parsedHeaders = typeof headers === 'string' ? JSON.parse(headers) : headers;
      } catch (e) {
        console.warn('Failed to parse headers:', e);
      }
    }

    // Merge FormData headers with custom headers
    const finalHeaders = {
      ...parsedHeaders,
      ...formData.getHeaders()
    };

    const axiosConfig = {
      url: url,
      method: method.toUpperCase(),
      data: formData,
      headers: finalHeaders,
      maxBodyLength: Infinity,
      maxContentLength: Infinity
    };

    const response = await axios(axiosConfig);
    res.status(response.status).json(response.data);
    
  } catch (err) {
    console.error('FormData request error:', err.message);
    res.status(500).json({ 
      error: true, 
      message: err.response?.data || err.message 
    });
  }
});

module.exports = router;