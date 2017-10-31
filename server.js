'use strict';

const express = require('express');

const port = process.env.APP_PORT || 80;
const host = '0.0.0.0';

const appName = process.env.APP_NAME || 'Fail App'

const app = express();

var healthy = true

// Handlers

app.get('/', (req, res) => {
  res.send('This is ' + appName);
});

app.get('/health', (req, res) => {
  if(healthy) {
    res.send('Healthy')
  } else {
    res.status(500)
    res.send('Unhealthy')
  }
})

app.get('/make-healthy', (req, res) => {
  healthy = true
  res.send('Made healthy')
})

app.get('/make-unhealthy', (req, res) => {
  healthy = false
  res.send('Made unhealthy')
})

app.get('/fail', (req, res) => {
  res.send('Failing now')
  console.log('Failing due to request')
  process.exit()
})

// Start webserver

app.listen(port, host);

console.log(`Running on http://${host}:${port}`);

// Fail according to time

if(process.env.FAIL_DELAY) {
  var failTimeout = process.env.FAIL_DELAY * 1

  if(process.env.FAIL_SPLAY) {
    failTimeout = getRandomInt(failTimeout, failTimeout + (process.env.FAIL_SPLAY * 1))
  }

  console.log('The application will fail in ' + failTimeout + ' sec')

  setTimeout(() => {
    console.log('Failing due to FAIL_DELAY')
    process.exit()
  }, failTimeout * 1000)
}

// Functions

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
