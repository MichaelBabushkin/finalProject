var Election = artifacts.require("./Election.sol");
var Token = artifacts.require("./VTC.sol");

module.exports = function(deployer) {
  deployer.deploy(Election);
};

// module.exports = function(deployer) {
//   deployer.deploy(Token);
// };