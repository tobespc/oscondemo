const express = require('express');
var sleep = require('sleep');
    

module.exports =  function (app) {
  const router = express.Router();

  router.get('/', async function (req, res, next) {
    // this block changes the response time

    sleep.sleep(5)//sleep for 5 seconds
    res.json({
      status: '** OSCON **'
    });
  });

  app.use('/osconendpoint', router);
}