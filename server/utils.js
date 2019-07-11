/*******************************************************************************
 * Licensed Materials - Property of IBM
 * "Restricted Materials of IBM"
 *
 * Copyright IBM Corp. 2018 All Rights Reserved
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Functions that can be used anywhere in the codebase
const http = require('http');
const https = require('https');
const fs = require('fs-extra');
const request = require('request');


// variable to do a async timeout
module.exports.timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Function check if a file exists (is accessable)
 * Essentially an async version of fs.exists
 * @param file, the file
 * @return true if file is accessable, false if not
 */
module.exports.fileExists = async function fileExists(file) {
  try {
    await fs.access(file);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Function to make a HTTP request using a promise instead of callback
 * @param options, the HTTP request options
 * @param body, the HTTP request body (optional)
 * @param secure, true for https requests, false for http requests (optional, default is http)
 * @return res, the response from the HTTP request
 */

module.exports.asyncHttpRequest = function asyncHttpRequest(options, body, secure = false) {
  return new Promise(function (resolve, reject) {
    let protocol = secure ? https : http;
    let req = protocol.request(options, function(res) {
      res.body = '';
      res.on('error', function(err) {
        return reject(err);
      });
      res.on('data', function (data) {
        res.body += data
      });
      res.on('end', function() {
        return resolve(res);
      });
    }).on('error', function(err) {
      return reject(err);
    });
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

/**
 * Function to make a HTTP file download request using a promise
 * @param url, the URL target for the download
 * @param destination, destination file descriptor
 * @return res, the response from the HTTP request
 * @return promise, resolved if the download completed ok
 */
module.exports.asyncHttpDownload = function asyncHttpDownload(url, destination) {
  return new Promise(function (resolve, reject) {
    let stream = request.get({followAllRedirects: true, url: url})
      .on('error', function(err) {
        return reject(err);
      })
      .pipe(destination);
    stream.on('finish', function () {
      return resolve();
    });
  });
}

/**
 * Function which takes two Javascript Objects and updates the first
 *  with the fields in the second
 * @param objectToUpdate, an object which should be updated with the new fields/values
 * @param fieldsToAddToObject, an object which contains fields/values to add to the object
 * @return the updated object
 */
module.exports.updateObject = function updateObject(objectToUpdate, fieldsToAddToObject) {
  for (let key in fieldsToAddToObject) {
    objectToUpdate[key] = fieldsToAddToObject[key];
  }
  return objectToUpdate;
}