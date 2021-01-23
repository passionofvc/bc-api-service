'use strict';
require('dotenv').config()

// gentric place to read and parse all configuration values
const config = {
  CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
  ACCOUNT_ADDRESS:  process.env.ACCOUNT_ADDRESS,
  ACCOUNT_PASSWORD: process.env.ACCOUNT_PASSWORD,
  GAS: process.env.GAS,
  GETH_RPC_ENDPOINT: process.env.GETH_RPC_ENDPOINT,
  GETH_WS_ENDPOINT: process.env.GETH_WS_ENDPOINT,
}

if (typeof config.GAS === 'string') {
  config.GAS = parseInt(config.GAS);
}
if (typeof config.GAS !== 'number') {
  // if not exists, use default value
  config.GAS = 2000000;
}

// validate configuration
[
  'CONTRACT_ADDRESS',
  'ACCOUNT_ADDRESS',
  'ACCOUNT_PASSWORD',
  'GETH_RPC_ENDPOINT',
  'GETH_WS_ENDPOINT',
  'GAS'
].forEach(param => validate(param));


function validate(param) {
  if (!config[param]) {
    console.error(`EXISTING PROCESS: configuration param missing: '${param}'`);
    process.nextTick(() => process.exit(1));
  }
}

module.exports = config;
