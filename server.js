const express = require('express');
const cors = require('cors');
const axios = require('axios');
const FormData = require('form-data');
const multer = require('multer');

const app = express();
const port = process.env.PORT || 3001;

// Configure multer for file uploads
const upload = multer();

// Enable CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Parse JSON bodies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log('Content-Type:', req.headers['content-type']);
    next();
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'CORS Helper Server is running',
        timestamp: new Date().toISOString(),
        endpoints: {
            'GET /': 'This message',
            'POST /cors_helper': 'Handle CORS requests (JSON and FormData)'
        }
    });
});

// Main CORS helper endpoint
app.post('/cors_helper', (req, res) => {
    const contentType = req.headers['content-type'] || '';
    
    console.log('CORS helper endpoint hit');
    console.log('Content-Type:', contentType);
    
    if (contentType.includes('multipart/form-data')) {
        // Handle FormData
        upload.any()(req, res, async (err) => {
            if (err) {
                console.error('Multer error:', err);
                return res.status(500).json({ 
                    error: true, 
                    message: 'File upload error: ' + err.message 
                });
            }
            
            await handleFormDataRequest(req, res);
        });
    } else {
        // Handle JSON
        handleJsonRequest(req, res);
    }
});

// Handle JSON requests
async function handleJsonRequest(req, res) {
    try {
        console.log('Processing JSON request');
        console.log('Request body keys:', Object.keys(req.body));
        
        const { url, method, headers, bodyParam } = req.body;
        
        if (!url || !method) {
            return res.status(400).json({
                error: true,
                message: 'URL and method are required'
            });
        }
        
        const axiosConfig = {
            url: url,
            method: method.toUpperCase(),
            headers: headers || {},
        };
        
        if (bodyParam && Object.keys(bodyParam).length > 0) {
            axiosConfig.data = bodyParam;
        }
        
        console.log('Making request to:', url);
        const response = await axios(axiosConfig);
        
        res.status(response.status).json(response.data);
        
    } catch (error) {
        console.error('JSON request error:', error.message);
        res.status(500).json({
            error: true,
            message: error.response?.data || error.message
        });
    }
}

// Handle FormData requests
async function handleFormDataRequest(req, res) {
    try {
        console.log('Processing FormData request');
        console.log('Body fields:', Object.keys(req.body));
        console.log('Files count:', req.files ? req.files.length : 0);
        
        const { url, method, headers } = req.body;
        
        if (!url || !method) {
            return res.status(400).json({
                error: true,
                message: 'URL and method are required'
            });
        }
        
        // Create FormData for the target request
        const formData = new FormData();
        
        // Add text fields (excluding proxy config)
        Object.keys(req.body).forEach(key => {
            if (!['url', 'method', 'headers'].includes(key)) {
                formData.append(key, req.body[key]);
            }
        });
        
        // Add files
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                formData.append(file.fieldname, file.buffer, {
                    filename: file.originalname,
                    contentType: file.mimetype
                });
            });
        }
        
        // Parse headers
        let parsedHeaders = {};
        if (headers) {
            try {
                parsedHeaders = typeof headers === 'string' ? JSON.parse(headers) : headers;
            } catch (e) {
                console.warn('Failed to parse headers:', e.message);
            }
        }
        
        // Combine headers
        const finalHeaders = {
            ...parsedHeaders,
            ...formData.getHeaders()
        };
        
        console.log('Making FormData request to:', url);
        
        const response = await axios({
            url: url,
            method: method.toUpperCase(),
            data: formData,
            headers: finalHeaders,
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        });
        
        res.status(response.status).json(response.data);
        
    } catch (error) {
        console.error('FormData request error:', error.message);
        res.status(500).json({
            error: true,
            message: error.response?.data || error.message
        });
    }
}

// 404 handler
app.use('*', (req, res) => {
    console.log('404 - Route not found:', req.method, req.originalUrl);
    res.status(404).json({
        error: true,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
        availableRoutes: ['GET /', 'POST /cors_helper']
    });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    res.status(500).json({
        error: true,
        message: 'Internal server error'
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});