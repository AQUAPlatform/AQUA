require("babel-core/register");
require("babel-polyfill");
var AlphaToken = artifacts.require("./AlphaToken.sol");
var Buyback = artifacts.require("./Buyback.sol");

contract('Buyback', function(accounts) {
    const AQUA_UNIT = new web3.BigNumber("1000000000000000000");
    async function deploy_test() {
        const rate = new web3.BigNumber(1000000);
        const wallet = accounts[0];
        const token = await AlphaToken.new();
        console.log("SALE CREATE");
        const buyback = await Buyback.new(token.address, wallet, rate, {from: accounts[1]});
        console.log("SALE CREATED");
        return [token, buyback];
    };

    function getBalance(addr) {
        return web3.fromWei(web3.eth.getBalance(addr), "ether"); 
    }

    it("buyback overflow", async function() {
        const contracts = await deploy_test();
        const token = contracts[0];
        async function getAQUA(addr) {
            return (await token.balanceOf.call(addr)).div(AQUA_UNIT);
        }
        const buyback = contracts[1];
        const owner = accounts[0];
        const manager = accounts[1];
        const investor1 = accounts[2];
        const investor2 = accounts[3];
        console.log("OWNER BALANCE", web3.fromWei(web3.eth.getBalance(owner), "ether").toString());
        await buyback.sendTransaction({from: owner, value: web3.toWei(11, "ether")});
        console.log("BUYBACK BALANCE", getBalance(buyback.address).toString());
        await token.transfer(investor1, AQUA_UNIT.mul(10000000), {from: owner});
        await token.transfer(investor2, AQUA_UNIT.mul(10000000), {from: owner});
        console.log("balance: investor1", (await getAQUA(investor1)).toString());
        console.log("balance: investor2", (await getAQUA(investor2)).toString());
        console.log(web3.fromWei(await buyback.convertBalance.call(AQUA_UNIT.mul(5000000)), "ether").toString());
        await token.approve(buyback.address, AQUA_UNIT.mul(5000000), {from: investor1});
        await token.approve(buyback.address, AQUA_UNIT.mul(10000000), {from: investor2});
        await buyback.claim({from: investor1});
        console.log("BUYBACK BALANCE", getBalance(buyback.address).toString());
        await buyback.claim({from: investor2});
        console.log("BUYBACK BALANCE", getBalance(buyback.address).toString());
        console.log("balance: investor1", (await getAQUA(investor1)).toString());
        console.log("balance: investor2", (await getAQUA(investor2)).toString());
        assert.equal(await getAQUA(investor1), 5000000, "complete buyback for investor1");
        assert.equal(await getAQUA(investor2), 4000000, "partial buyback for investor2");
        assert.equal(getBalance(buyback.address), 0, "balance of buyback is zero finally");
        await buyback.close({from: manager});
        console.log("OWNER BALANCE", getBalance(owner).toString());
    });

    it("buyback not complete", async function() {
        const contracts = await deploy_test();
        const token = contracts[0];
        async function getAQUA(addr) {
            return (await token.balanceOf.call(addr)).div(AQUA_UNIT);
        }
        const buyback = contracts[1];
        const owner = accounts[0];
        const manager = accounts[1];
        const investor1 = accounts[2];
        const investor2 = accounts[3];
        console.log("OWNER BALANCE", web3.fromWei(web3.eth.getBalance(owner), "ether").toString());
        await buyback.sendTransaction({from: owner, value: web3.toWei(20, "ether")});
        console.log("BUYBACK BALANCE", getBalance(buyback.address).toString());
        await token.transfer(investor1, AQUA_UNIT.mul(10000000), {from: owner});
        await token.transfer(investor2, AQUA_UNIT.mul(10000000), {from: owner});
        console.log("balance: investor1", (await getAQUA(investor1)).toString());
        console.log("balance: investor2", (await getAQUA(investor2)).toString());
        console.log(web3.fromWei(await buyback.convertBalance.call(AQUA_UNIT.mul(5000000)), "ether").toString());
        await token.approve(buyback.address, AQUA_UNIT.mul(5000000), {from: investor1});
        await token.approve(buyback.address, AQUA_UNIT.mul(10000000), {from: investor2});
        await buyback.claim({from: investor1});
        console.log("BUYBACK BALANCE", getBalance(buyback.address).toString());
        await buyback.claim({from: investor2});
        console.log("BUYBACK BALANCE", getBalance(buyback.address).toString());
        console.log("balance: investor1", (await getAQUA(investor1)).toString());
        console.log("balance: investor2", (await getAQUA(investor2)).toString());
        const balanceBeforeClose = getBalance(owner);  
        await buyback.close({from: manager});
        const balanceAfterClose = getBalance(owner);  
        assert.equal(balanceAfterClose.sub(balanceBeforeClose), 5, "remaining eth should be transfered to OWNER")
    });
});
