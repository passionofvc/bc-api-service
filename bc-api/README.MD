# bc-api-service
api call smart contract from web3

## dependency
npm install

## configuration
edit .env file
```
CONTRACT_ADDRESS='0x5A897417728AC30165B357c461a8C3cf73cf6B0E'
ACCOUNT_ADDRESS=''
ACCOUNT_PASSWORD=''
GAS=2000000
GET_RPC_ENDPOINT='http://localhost=8545'
```


## run server
node index.js


## test
<pre>
bash test_set.sh
bash test_get.sh
</pre>


