require("babel-core/register");
require("babel-polyfill");
var AlphaToken = artifacts.require("./AlphaToken.sol");
var VestingCtrl = artifacts.require("./VestingCtrl.sol");

contract('VestingCtrl', function(accounts) {
    const AQUA_UNIT = new web3.BigNumber("1000000000000000000");

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getBalance(addr) {
        return web3.fromWei(web3.eth.getBalance(addr), "ether"); 
    }

    async function deploy_test() {
        const startTime = new web3.BigNumber(web3.eth.getBlock(web3.eth.blockNumber).timestamp + 1); // one second in the future
        const endTime = startTime.plus(86400 * 20); // 20 days
        const rate = new web3.BigNumber(1000000);
        const minInvest = web3.toWei(1, "ether");
        const maxInvest = web3.toWei(5000, "ether");
        const wallet = accounts[0];
        const token = await AlphaToken.new();
        console.log("SALE CREATE");
        const vesting_ctl = await VestingCtrl.new(token.address, accounts[0], {from: accounts[1]});
        console.log("SALE CREATED");
        return [token, vesting_ctl];
    };

    it("vesting should release gradually", async function() {
        const nowTime = new web3.BigNumber(web3.eth.getBlock(web3.eth.blockNumber).timestamp);
        const contracts = await deploy_test();
        const token = contracts[0];
        const vesting_ctl = contracts[1];
        async function getAQUA(addr) {
            return (await token.balanceOf.call(addr)).div(AQUA_UNIT);
        }
        const owner = accounts[0];
        const manager = accounts[1];
        const investor1 = accounts[2];
        const investor2 = accounts[3];

        await token.approve(vesting_ctl.address, AQUA_UNIT.mul(100*1000000), {from: owner});
        console.log("CREATE VESTING");
        await vesting_ctl.newVesting(investor1, nowTime, 10, 20, AQUA_UNIT.mul(100*1000000), {from: manager});
        const t5 = sleep(5000);
        const t11 = sleep(11000);
        const t13 = sleep(13000);
        const t20 = sleep(20000);
        const t21 = sleep(21000);
        var balance0 = 0;
        console.log("AMOUNT", (await vesting_ctl.totalAmount.call({from: investor1})).div(AQUA_UNIT).toString());
        await t5;
        await vesting_ctl.release({from: investor1});
        balance0 = await getAQUA(investor1);
        assert.ok(balance0.equals(0), "No vesting before cliff");
        console.log("BALANCE", balance0.toString());
        await t11;
        await vesting_ctl.release({from: investor1});
        balance0 = await getAQUA(investor1);
        console.log("BALANCE", balance0.toString());
        assert.ok(balance0.greaterThanOrEqualTo(55 * 1000000), "at least 55...");
        await t13;
        await vesting_ctl.release({from: investor1});
        balance0 = await getAQUA(investor1);
        console.log("BALANCE", balance0.toString());
        assert.ok(balance0.greaterThanOrEqualTo(65 * 1000000), "at least 65...");
        await t20;
        await vesting_ctl.release({from: investor1});
        balance0 = await getAQUA(investor1);
        console.log("BALANCE", balance0.toString());
        assert.ok(balance0.equals(100 * 1000000), "at least 100...");
        await t21;
        await vesting_ctl.release({from: investor1});
        balance0 = await getAQUA(investor1);
        console.log("BALANCE", balance0.toString());
        assert.ok(balance0.equals(100 * 1000000), "at least 100...");
    });
});
