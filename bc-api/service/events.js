'use strict';

//const web3 = require('../common/web3');
const Web3 = require('web3');
const config = require('../config');
const web3 = new Web3(new Web3.providers.WebsocketProvider(config.GETH_WS_ENDPOINT));

const options = {
    fromBlock: '0x0',
    address: config.CONTRACT_ADDRESS
};

let subscription;
const subscribeLogEvent = () => {
    subscription = web3.eth.subscribe('logs', options, function(error, result){
    if(error || result == null){
        console.log('Error when watching incoming transactions: ', error.message);
        return;
    }
    console.log('subscribe', result);
  })

  subscription.on('data', function(log){
    console.log(log);
  });
}

const unsubscribeLogEvent =()=> {
  if(subscription == null){
      return;
  }
  // unsubscribes the subscription
  subscription.unsubscribe(function(error, success){
    if(success)
        console.log('Successfully unsubscribed!');
  });
}

module.exports = {
  subscribeLogEvent,
  unsubscribeLogEvent,
}

