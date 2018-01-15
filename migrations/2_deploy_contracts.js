require("babel-core/register");
require("babel-polyfill");
var AlphaToken = artifacts.require("./AlphaToken");
var AlphaTokenSale = artifacts.require("./AlphaTokenSale");

module.exports = async function(deployer, network, accounts) {
  const startTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 1; // one second in the future
  const endTime = startTime + (86400 * 20); // 20 days
  const rate = new web3.BigNumber(1000000);
  const minInvest = web3.toWei(1, "ether");
  const maxInvest = web3.toWei(5000, "ether");
  const wallet = accounts[0];
  await deployer.deploy(AlphaToken);
  await deployer.deploy(AlphaTokenSale, startTime, endTime, rate, wallet, minInvest, maxInvest, AlphaToken.address, web3.eth.accounts.slice(0, 4));
};
