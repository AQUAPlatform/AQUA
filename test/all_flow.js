require("babel-core/register");
require("babel-polyfill");
var AlphaToken = artifacts.require("./AlphaToken.sol");
var AlphaTokenSale = artifacts.require("./AlphaTokenSale.sol");
var VestingCtrl = artifacts.require("./VestingCtrl.sol");
var Buyback = artifacts.require("./Buyback.sol");

contract('ALL', function(accounts) {
    const ALPHA_UNIT = new web3.BigNumber("1000000000000000000");

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getBalance(addr) {
        return web3.fromWei(web3.eth.getBalance(addr), "ether"); 
    }

    it("vesting should release gradually", async function() {
        const startTime = new web3.BigNumber(web3.eth.getBlock(web3.eth.blockNumber).timestamp + 1); // one second in the future
        const endTime = startTime.plus(86400 * 20); // 20 days
        const rate = new web3.BigNumber(1000000);
        const minInvest = web3.toWei(1, "ether");
        const maxInvest = web3.toWei(5000, "ether");
        const wallet = accounts[0];
        const token = await AlphaToken.new();
        async function getALPHA(addr) {
            return (await token.balanceOf.call(addr)).div(ALPHA_UNIT);
        }
        const owner = accounts[0];
        const manager = accounts[1];
        const investor1 = accounts[2];
        const investor2 = accounts[3];
        const developer1 = accounts[4];
        const developer2 = accounts[5];

        //developer vesting
        const vesting_ctl = await VestingCtrl.new(token.address, accounts[0], {from: accounts[1]});
        const nowTime = new web3.BigNumber(web3.eth.getBlock(web3.eth.blockNumber).timestamp);

        //private sale
        const tokenSale = await AlphaTokenSale.new(startTime, endTime, rate, wallet, minInvest, maxInvest, token.address, web3.eth.accounts.slice(0, 3));

        //buyback
        const buyback = await Buyback.new(token.address, wallet, rate, {from: accounts[1]});

    });
});