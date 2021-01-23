'use strict';

const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'));

const abi = require('./build/contracts/SimpleStructStorage.json').abi;
const contractInstance = new web3.eth.Contract(abi, '0xcd1D3e07CeDfBeC1C94e95667Ee642F8efA60A78');

contractInstance.methods.set({ Id : 1, Name:'test'}).estimateGas({from:'0x183370df202691468bb0d05feb350f6f8db05a93' ,gas: 5000000}, function(error, gasAmount){
    console.log('Method run gas', gasAmount);
});

contractInstance.methods.set({'Id':1, 'Name':'test'}).send({from:'0x183370df202691468bb0d05feb350f6f8db05a93', gas: 5000000}, function(error, reciept){
    console.log('tx', reciept);
});


contractInstance.methods.get().call({from:'0x183370df202691468bb0d05feb350f6f8db05a93', gas: 5000000}, function(error, data){
    console.log('data', data);
});
