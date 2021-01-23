const SimpleStructStorage = artifacts.require("SimpleStructStorage");

module.exports = function (deployer) {
  deployer.deploy(SimpleStructStorage);
};
