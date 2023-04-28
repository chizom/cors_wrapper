const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3001

app.use(cors())

app.get('/', (req, res) => {
    console.log('here')
    res.json({
        message: 'works'
    })
})

const corsHelperRouter = require('./routes/cors_helper')

app.use('/cors_helper', corsHelperRouter)

app.listen(port)