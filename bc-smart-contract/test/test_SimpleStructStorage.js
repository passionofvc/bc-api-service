const SimpleStructStorage = artifacts.require('SimpleStructStorage')
const Web3 = require('web3');

contract('SimpleStructStorage', (accounts) => {
  let instance
  const web3 = new Web3('http://localhost:8545');

  before('setup', async () => {
    instance = await SimpleStructStorage.new()
    console.log("instance", instance.address, instance.transactionHash);
  })

  describe('test struct input parameter', () => {
    it('should set struct data', async () => {
      const data = {Id: 100, Name: "test"}
      const {receipt: {transactionHash}} = await instance.set(data)
      //console.log(transactionHash)
      const {Id, Name} = await instance.get()
      assert.equal(Id, 100)
      assert.equal(Name, 'test')
    })
  })
})

