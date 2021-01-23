var express = require('express');
var app = express();

var store_contract = require('./store_contract_api');
app.use('/store_contract_api', store_contract);

module.exports = app;


