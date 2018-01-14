require("babel-core/register");
require("babel-polyfill");
var AlphaToken = artifacts.require("./AlphaToken.sol");
var AlphaTokenSale = artifacts.require("./AlphaTokenSale.sol");

contract('AlphaTokenSale', function(accounts) {
    async function deploy_test() {
        const startTime = new web3.BigNumber(web3.eth.getBlock(web3.eth.blockNumber).timestamp + 1); // one second in the future
        const endTime = startTime.plus(86400 * 20); // 20 days
        const rate = new web3.BigNumber(1000);
        const wallet = accounts[0];
        const token = await AlphaToken.new();
        console.log("SALE CREATE");
        // const tokenSale = await AlphaTokenSale.at("0x6143b9a2fc80b78208fb6e600a795661061d260d");
        const tokenSale = await AlphaTokenSale.new(startTime, endTime, rate, wallet, token.address, web3.eth.accounts.slice(0, 5));
        console.log("SALE CREATED");
        return [token, tokenSale];
    };

    it("owner prove the supply", async function() {
        const contracts = await deploy_test();
        const token = contracts[0];
        const tokenSale = contracts[1];
        const owner = accounts[0];
        const dest = accounts[1];
        const ownerBalanceBefore = await token.balanceOf.call(owner);
        const balanceBefore = await token.balanceOf.call(dest);
        const supplyAmount = new web3.BigNumber('3500000000000000000000000');
        console.log("APPROVE");
        const approve_info = await token.approve(tokenSale.address, supplyAmount, {from: owner});
        console.log("APPROVE DONE");
        console.log("allowance", (await token.allowance.call(owner, tokenSale.address)).toString());
        // await token.transferFrom(owner, dest, supplyAmount, {from: dest});
        await tokenSale.sendTransaction({from: dest, value: web3.toWei(2, "ether")});
        console.log("allowance", (await token.allowance.call(owner, tokenSale.address)).toString());
        const balanceAfter = await token.balanceOf.call(dest);
        const ownerBalanceAfter = await token.balanceOf.call(owner);
        assert.equal(balanceAfter.sub(balanceBefore).toString(), ownerBalanceBefore.sub(ownerBalanceAfter).toString(), "token transfer from owner to invester"); 
        console.log(balanceBefore.toString(), balanceAfter.toString(), ownerBalanceBefore.sub(ownerBalanceAfter).toString());
    });
});
