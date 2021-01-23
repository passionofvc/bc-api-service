# sample dev smart contract

## dependency
<pre>
truffle
ganache-cli
web3
</pre>

```
npm install -g truffle
npm install -g ganache-cli
npm install -g web3
```

## run local node
```
ganache-cli -p 8545 -h 0.0.0.0
```

## run truffle test
```
rm -rf build && truffle compile
truffle migrate --reset
truffle test
```
