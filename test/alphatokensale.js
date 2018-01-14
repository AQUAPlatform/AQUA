require("babel-core/register");
require("babel-polyfill");
var AlphaTokenSale = artifacts.require("./AlphaTokenSale.sol");
var AlphaToken = artifacts.require("./AlphaToken.sol");

contract('AlphaTokenSale', function(accounts) {
    async function deploy_test() {
        const startTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 1; // one second in the future
        const endTime = startTime + (86400 * 20); // 20 days
        const rate = new web3.BigNumber(1000);
        const wallet = accounts[0];
        const token = await AlphaToken.deployed();
        console.log("CREATE SALE");
        const tokenSale = await AlphaTokenSale.new(
            [startTime, endTime, rate, wallet, token.address, web3.eth.accounts.slice(0, 4)], 
            {from: accounts[0]}
        );
        console.log("CREATED");
        return [token, tokenSale];
    };

    it("owner could recharge the supply", async function() {
        const contracts = await deploy_test();
        token = contracts[0];
        tokenSale = contracts[1];
        const approve_success = await token.aprove(tokenSale, 1000000, {from: accounts[0]});
        assert.equal(approve_success, true, "approve should be done");
        const supply_success = await token.supply({from: accounts[0]});
        assert.equal(supply_success, true, "supply should be done");
    });

    // it("should allow invest for use in whitelist", function() {
    //     return Promise.all([AlphaToken.deployed(), AlphaTokenSale.deployed()]).then(function(contracts) {
    //         token = contracts[0];
    //         tokenSale = contracts[1];
    //         return takenSale.sendTransaction({from: accounts[1], value: web3.toWei(5,  "ether")}).then(
    //             function() {

    //             }
    //         );
    //     }).then(function(balance) {
    //         assert.equal(balance[0].valueOf(), balance[1].valueOf(), "totalSupply wasn't in the first account");
    //     });
    // });
});
