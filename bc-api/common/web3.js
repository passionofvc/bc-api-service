
const Web3 = require('web3');
const config = require('../config');


const web3 = new Web3();
//const web3 = new Web3(config.GET_RPC_ENDPOINT);
web3.setProvider(new Web3.providers.HttpProvider(config.GET_RPC_ENDPOINT));
module.exports = web3

