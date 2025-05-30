// Updated CORS proxy server (cors_helper.js)
const express = require('express')
const axios = require('axios')
const router = express.Router()

router.post('/', express.json(), async (req, res) => {
  try {
    const { url, method, bodyParam, headers } = req.body
    
    // Validate required fields
    if (!url || !method) {
      return res.status(400).json({ error: 'URL and method are required' })
    }

    const config = {
      url,
      method,
      headers: {
        ...headers,
        // Ensure Content-Type is set properly for FormData
        'Content-Type': headers?.['Content-Type'] || 'multipart/form-data'
      }
    }

    // Handle FormData differently
    if (bodyParam?.formData) {
      const form = new FormData()
      Object.entries(bodyParam.formData).forEach(([key, value]) => {
        form.append(key, value)
      })
      config.data = form
      config.headers = {
        ...config.headers,
        ...form.getHeaders() // Important for FormData
      }
    } else if (Object.keys(bodyParam || {}).length > 0) {
      config.data = bodyParam
    }

    const response = await axios(config)
    res.status(response.status).json(response.data)
    
  } catch (error) {
    console.error('Proxy error:', error)
    res.status(500).json({ 
      error: 'Proxy error',
      message: error.message,
      details: error.response?.data || null
    })
  }
})

module.exports = router