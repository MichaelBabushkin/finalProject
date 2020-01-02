var Election = artifacts.require("./Election.sol");
var Token = artifacts.require("./Token.sol");
var StandardToken = artifacts.require("./StandardToken.sol");
var VTC = artifacts.require("./VTC.sol");
var context = artifacts.require("./context.sol");
var ElectionToken = artifacts.require("./ElectionToken.sol");
var erc20 = artifacts.require("./erc20.sol");
var erc20Detailed = artifacts.require("./erc20Detailed.sol");
var ierc20 = artifacts.require("./ierc20.sol");
var Owned = artifacts.require("./Owned.sol");
var safeMath = artifacts.require("./safeMath.sol");

module.exports = function(deployer) {
  deployer.deploy(Election);
  deployer.deploy(StandardToken);
  deployer.deploy(VTC);
  deployer.deploy(context);
  deployer.deploy(ElectionToken);
  deployer.deploy(erc20);
  deployer.deploy(erc20Detailed);
  deployer.deploy(ierc20);
  deployer.deploy(Owned);
  deployer.deploy(safeMath);
};

