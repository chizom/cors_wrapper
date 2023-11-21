const express = require('express')
const request = require('request');
const bodyParser = require('body-parser')
const axios = require('axios');
const { response } = require('express');
const jsonParser = bodyParser.json()
const router = express.Router()


router.post('/', jsonParser, (req, res, body) => {
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
  if (Object.keys(requestBodyParam).length !== 0) {
    axiosConfig.data = requestBodyParam;
  }

  axios(axiosConfig)
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

module.exports = router;
