var ConvertLib = artifacts.require("./ConvertLib.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");
var AlphaToken = artifacts.require("./AlphaToken")

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.link(ConvertLib, AlphaToken);
  deployer.deploy(AlphaToken);
  deployer.deploy(MetaCoin);
};
