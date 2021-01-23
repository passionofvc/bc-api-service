'use strict';

const util = require('util');
const http = require('http');
const https = require('https');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('express-cors');
const expressValidator = require('express-validator');
const HttpStatus = require('http-status-codes');

const api = require('./api');
const utils = require('./common/utils');
const {subscribeLogEvent, unsubscribeLogEvent} = require('./service/events');

const port = process.env.PORT || 443;
const app = express();
const serverOptions = {};

if (utils.isProd) {
    // in prod we will make nginx to use ssl and foward https protocol
    app.use((req, res, next) => {
        if (req.headers['X-Forwarded-Proto'] !== 'https') {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: 'use https'});
        }
        return next();
    });
}
else { // dev
    // accept self-signed cdertificates only in development
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    serverOptions.cert = fs.readFileSync('./cert/server.crt');
    serverOptions.key = fs.readFileSync('./cert/server.key');
}

app.use(cors());
app.use(bodyParser.json());
app.use(expressValidator());

// middleware to log all incoming requests
app.use((req, res, next) => {
    console.log(`url: ${req.method} ${req.originalUrl} ${util.inspect(req.body || {})}, headers: ${util.inspect(req.headers)}`);
    return next();
});

// attach API to server
app.use('/api', api);

app.get('/', (req, res) => {
    return res.end(`Sample BlockChain api Service start...`);
});

if (utils.isProd) {
    // in prod we will make nginx to use ssl.
    // so no need to use https here with a custom certificate for now.
    // enforcing https in prod is being done on the first middleware (see above)
    http.createServer(app).listen(port, err => {
        if (err) return console.error(err);
        console.info(`server is listening on port ${port}`);
    });
}
else {
    // this is development environment, use a local ssl server with self signed certificates
    http.createServer(app).listen(port, err => {
    //https.createServer(serverOptions, app).listen(port, err => {
        if (err) return console.error(err);
        console.info(`server is listening on port ${port}`);
        subscribeLogEvent();
    });
}

process.on('uncaughtException', err => {
    console.error(`uncaught exception: ${err.message}`);
    setTimeout(() =>  process.exit(1), 1000);
});

process.on('SIGINT', function() {
    console.log('SIGINT process exit');
    unsubscribeLogEvent();
    process.exit();
});
