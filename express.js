'use strict'
 
const express = require('express')
const bodyParser = require('body-parser')
const crypto = require('crypto')

// Replace with your Xero Webhook Key
const xero_webhook_key = 'XERO_WEBHOOK_KEY'
 
// Create a new instance of express
const app = express()
 
// Set the body parser options
var options = {
  type: 'application/json'
};

// Using the options above, create a bodyParser middleware that returns raw responses.
var itrBodyParser = bodyParser.raw(options)
 
// Create a route that receives our webhook & pass it our itrBodyParser
app.post('/webhook', itrBodyParser, function (req, res) {

  console.log("Body: "+req.body.toString())
  console.log("Xero Signature: "+req.headers['x-xero-signature'])

  let hmac = crypto.createHmac("sha256", xero_webhook_key).update(req.body.toString()).digest("base64");
  console.log("Resp Signature: "+hmac)

  if (req.headers['x-xero-signature'] == hmac) {
  	res.statusCode = 200
  } else {
  	res.statusCode = 401
  }

  console.log("Response Code: "+res.statusCode)

  res.send()
})
 
// Tell our app to listen on port 3000
app.listen(3000, function (err) {
  if (err) {
    throw err
  }
 
  console.log('Server started on port 3000')
})