'use strict';

const util = require('util');
const express = require('express');
const HttpStatus = require('http-status-codes');
const validate = require('jsonschema').validate;

const schema = require('./schema');
const store = require('../service/contract');

const app = express();


app.get('/:Id', async (req, res) => {

  req.checkParams('Id', 'Invalid Id').notEmpty();

  const errors = await req.getValidationResult();
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: `there have been validation errors: ${util.inspect(errors.array())}` });
  }

  const Id = decodeURIComponent(req.params.Id);

  const opts = {
    Id,
  };

  console.log(`getting store contract info for ${util.inspect(opts)}`);

  let result;
  try {
    result = await store.getContractInfo(opts.Id);
  } catch(err) {
    console.error(`error getting store contract: ${err.message}`);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }

  if (!result) {
    console.warn(`id '${opts.Id}' not found`);
    return res.status(HttpStatus.NOT_FOUND).json({ error: `'${opts.Id}' not found` });
  }

  console.log(`response store contract result: ${util.inspect(result)}`);
  return res.json(result);
});


app.post('/', async (req, res) => {
  if (!validate(req.body, schema.storeContractInfo.post).valid) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: `invalid schema - expected schema is ${util.inspect(schema.storeContractInfo.post)}` });
  }
  let result;
  try {
    result = await store.storeContractInfo(req.body);
  } catch(err) {
    console.error(`error storing contract info: ${err.message}`);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }

  console.log(`response result: ${util.inspect(result)}`);
  return res.json(result);
});

module.exports = app;
