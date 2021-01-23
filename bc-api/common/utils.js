'use strict';
const util = require('util');
const config = require('../config');

const nodeEnv = (process.env.NODE_ENV || '').toLowerCase();
const isProd = nodeEnv === 'production';
const isDev  = nodeEnv === 'development';

async function asyncContractCall(obj, method, func) {
   return new Promise((resolve, reject) => {

    // callback for the function invoked
    const cb = (err, result) => {
      if (err) {
        console.error(`error executing function '${method}' with params: ${util.inspect(arguments)}: ${err.message}`);
        return reject(err);
      }

      console.log(`function '${method}' completed successfully with result: ${util.inspect(result)}`);
      return resolve({ result });
    };

    const params = Array.prototype.slice.call(arguments, 3);
    //console.log(obj[method], method, func, params, cb, config.ACCOUNT_ADDRESS, obj[method].apply(obj, params)[func]);
    //return obj[method].apply(obj, params)[func]({from: config.ACCOUNT_ADDRESS, gas: 5000000}, cb);
    return obj[method].apply(obj, params)[func]({from: config.ACCOUNT_ADDRESS}, cb);
  });
}

// a generic function to call async methods on an object
async function callAsyncFunc(obj, func) {
   return new Promise((resolve, reject) => {

    // callback for the function invoked
    const cb = (err, result) => {
      if (err) {
        console.error(`error executing function '${func}' with params: ${util.inspect(arguments)}: ${err.message}`);
        return reject(err);
      }

      console.log(`function '${func}' completed successfully with result: ${util.inspect(result)}`);
      return resolve({ result });
    };

    const params = Array.prototype.slice.call(arguments, 2);
    params.push(cb);

    return obj[func].apply(obj, params);
  });
}

// a generic sleep function
async function sleep(timeSecs) {
  return new Promise(resolve => setTimeout(() => resolve(), timeSecs * 1000));
}


const api = {
  callAsyncFunc,
  asyncContractCall,
  sleep
};

Object.defineProperty(api, 'isProd', { value: isProd });
Object.defineProperty(api, 'isDev', { value: isDev });

module.exports = api;
