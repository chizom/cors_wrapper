const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3001

// Enable CORS for all routes
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

app.get('/', (req, res) => {
    console.log('Root endpoint hit')
    res.json({
        message: 'CORS Helper Server is running',
        endpoints: [
            'GET / - This message',
            'POST /cors_helper - Handle JSON requests',
            'POST /cors_helper/formdata - Handle FormData requests'
        ]
    })
})

// Import and use the CORS helper router
const corsHelperRouter = require('./routes/cors_helper')
app.use('/cors_helper', corsHelperRouter)

// Add a catch-all route for debugging
app.use('*', (req, res) => {
    console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        error: true,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
        availableRoutes: [
            'GET /',
            'POST /cors_helper',
            'POST /cors_helper/formdata'
        ]
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});