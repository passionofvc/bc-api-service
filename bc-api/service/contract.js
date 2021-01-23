'use strict';

const util = require('util');
const web3 = require('../common/web3');
const utils = require('../common/utils');
const config = require('../config');
const abi = require('../build/contracts/SimpleStructStorage.json').abi;


const callAsyncFunc = utils.callAsyncFunc;
const asyncContractCall = utils.asyncContractCall;
const contractInstance = new web3.eth.Contract(abi, config.CONTRACT_ADDRESS);


// generic function to unlock the account before invoking a
// 'sendTransaction' type call on the contract, and then lock the account
// unlock -> send -> lock
async function callSendTransactionApi(asyncFunc, config) {
  let funcResult;

  try {

    if (!utils.isDev) {
      const unlockRes = await callAsyncFunc(web3.personal, 'unlockAccount', config.ACCOUNT_ADDRESS, config.ACCOUNT_PASSWORD);
      if (!unlockRes.result) {
        throw new Error(`error unlocking account: ${config.ACCOUNT_ADDRESS}`);
      }
    }

    // get balance
    console.log('config.ACCOUNT_ADDRESS', config);
    const balanceRes = await callAsyncFunc(web3.eth, 'getBalance', config.ACCOUNT_ADDRESS);
    const balanceInWei = balanceRes.result;

    // call the actual function
    funcResult = await asyncFunc(balanceInWei);

    if (!utils.isDev) {
      const lockRes = await callAsyncFunc(web3.personal, 'lockAccount', config.ACCOUNT_ADDRESS, config.ACCOUNT_PASSWORD);
      if (!lockRes) {
        throw new Error(`error locking account: ${config.ACCOUNT_ADDRESS}`);
      }
    }

  }
  catch(err) {
    console.log(err);
    console.error(`error invoking a callSendTransactionApi: ${err.message}`);
    throw err;
  }

  return funcResult;
}

// store contractInfo
async function storeContractInfo(opts) {
    console.log(opts)
    const apiRequest = await callSendTransactionApi(async balanceInWei => {
    // find out the cost for this api call
    const api = await asyncContractCall(contractInstance.methods, 'set', 'estimateGas', {"Id":opts.Id, "Name":opts.Name});
    const priceInWei = api.result;
    console.log(`got estimated gas price: ${priceInWei}`);

    // check that we have enough balance
    if (balanceInWei < priceInWei) {
      throw new Error(`current balance (${balanceInWei} wei) is lower than the estimate cost for the request (${priceInWei} wei). stopping request`);
    }

    config.GAS = priceInWei;
    return await asyncContractCall(contractInstance.methods, 'set', 'send', {"Id":opts.Id, "Name":opts.Name});

  }, config);

  return { txHash: apiRequest.result };

}

// get a contract Info
async function getContractInfo(Id) {
  let getContract;
  try {
    //getContract = await asyncContractCall(contractInstance.methods, 'get', 'call' ,Id);
    getContract = await asyncContractCall(contractInstance.methods, 'get', 'call');
  }
  catch(err) {
    console.error(`error getting contract Info from blockchain: ${err.message}, Id:${Id}`);
    throw err;
  }

  let res = getContract.result;

  res = {
    Id: res[0],
    Name: res[1],
  };

  return res;
}

module.exports = {
  storeContractInfo,
  getContractInfo,
};
