var Election = artifacts.require("./Election.sol");
var Token = artifacts.require("./Token.sol");
var StandardToken = artifacts.require("./StandardToken.sol");
var VTC = artifacts.require("./VTC.sol");

module.exports = function(deployer) {
  deployer.deploy(Election);
  //deployer.deploy(Token);
  deployer.deploy(StandardToken);
  deployer.deploy(VTC);
};

