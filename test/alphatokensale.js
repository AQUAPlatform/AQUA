require("babel-core/register");
require("babel-polyfill");
var AlphaToken = artifacts.require("./AlphaToken.sol");
var AlphaTokenSale = artifacts.require("./AlphaTokenSale.sol");

contract('AlphaTokenSale', function(accounts) {
    async function deploy_test() {
        const startTime = new web3.BigNumber(web3.eth.getBlock(web3.eth.blockNumber).timestamp + 1); // one second in the future
        const endTime = startTime.plus(86400 * 20); // 20 days
        const rate = new web3.BigNumber(1000);
        const minInvest = web3.toWei(1, "ether");
        const maxInvest = web3.toWei(5000, "ether");
        const wallet = accounts[0];
        const token = await AlphaToken.new();
        console.log("SALE CREATE");
        // const tokenSale = await AlphaTokenSale.at("0x6143b9a2fc80b78208fb6e600a795661061d260d");
        const tokenSale = await AlphaTokenSale.new(startTime, endTime, rate, wallet, minInvest, maxInvest, token.address, web3.eth.accounts.slice(0, 3));
        console.log("SALE CREATED");
        return [token, tokenSale];
    };

    it("investor in whitelist could participate in the sale", async function() {
        const contracts = await deploy_test();
        const token = contracts[0];
        const tokenSale = contracts[1];
        const owner = accounts[0];
        const investor = accounts[1];
        const ownerETHBefore = web3.eth.getBalance(owner);
        const investorETHBefore = web3.eth.getBalance(investor);
        const ownerBalanceBefore = await token.balanceOf.call(owner);
        const balanceBefore = await token.balanceOf.call(investor);
        const supplyAmount = new web3.BigNumber('35000000000000000000000000');
        console.log("APPROVE");
        const approve_info = await token.approve(tokenSale.address, supplyAmount, {from: owner});
        console.log("APPROVE DONE");
        console.log("allowance", (await token.allowance.call(owner, tokenSale.address)).toString());
        // await token.transferFrom(owner, investor, supplyAmount, {from: investor});
        await tokenSale.sendTransaction({from: investor, value: web3.toWei(40000, "ether")});
        console.log("allowance", (await token.allowance.call(owner, tokenSale.address)).toString());
        const balanceAfter = await token.balanceOf.call(investor);
        const ownerBalanceAfter = await token.balanceOf.call(owner);
        assert.equal(balanceAfter.sub(balanceBefore).toString(), ownerBalanceBefore.sub(ownerBalanceAfter).toString(), "token transfer from owner to invester"); 
        console.log(balanceBefore.toString(), balanceAfter.toString(), ownerBalanceBefore.sub(ownerBalanceAfter).toString());
        console.log(web3.fromWei(investorETHBefore.sub(web3.eth.getBalance(investor)), "ether").toString());
        assert.equal(web3.fromWei(investorETHBefore.sub(web3.eth.getBalance(investor)), "ether").toString().slice(0, 5), "5000.", "35000 ETH exchange to 35000,000,000 ALPHA");
    });

    it("investor not in whitelist could not participate in the sale", async function() {
        const contracts = await deploy_test();
        const token = contracts[0];
        const tokenSale = contracts[1];
        const owner = accounts[0];
        const investor = accounts[3];
        const ownerETHBefore = web3.eth.getBalance(owner);
        const investorETHBefore = web3.eth.getBalance(investor);
        const ownerBalanceBefore = await token.balanceOf.call(owner);
        const balanceBefore = await token.balanceOf.call(investor);
        const supplyAmount = new web3.BigNumber('35000000000000000000000000');
        console.log("APPROVE");
        const approve_info = await token.approve(tokenSale.address, supplyAmount, {from: owner});
        console.log("APPROVE DONE");
        console.log("allowance", (await token.allowance.call(owner, tokenSale.address)).toString());
        // await token.transferFrom(owner, investor, supplyAmount, {from: investor});
        try {
            await tokenSale.sendTransaction({from: investor, value: web3.toWei(40000, "ether")});
            throw "Should not success when investor not in whitelist";
        } catch(err) {
            console.log(investor, "not in whitelist");
        }
        console.log("allowance", (await token.allowance.call(owner, tokenSale.address)).toString());
        console.log(web3.fromWei(investorETHBefore.sub(web3.eth.getBalance(investor)), "ether").toString());
        assert.equal(web3.fromWei(investorETHBefore.sub(web3.eth.getBalance(investor)), "ether").toString().slice(0, 2), "0.", "failed investment should return the eth");
    });
});
