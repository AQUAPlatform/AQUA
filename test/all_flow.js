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
        const minInvest = web3.toWei(100, "ether");
        const maxInvest = web3.toWei(5000, "ether");
        const wallet = accounts[0];
        const token = await AlphaToken.new();
        async function getALPHA(addr) {
            return (await token.balanceOf.call(addr)).div(ALPHA_UNIT);
        }
        const owner = accounts[0];
        const manager = accounts[1];

        const investor1 = accounts[2];
        //users below not in white list
        const investor2 = accounts[3];

        //developers 
        const developer1 = accounts[4];
        const developer2 = accounts[5];

        async function case_01() {
            //developer vesting
            const vesting_ctl = await VestingCtrl.new(token.address, accounts[0], {from: manager});
            const nowTime = new web3.BigNumber(web3.eth.getBlock(web3.eth.blockNumber).timestamp);
            const TOTAL_SUPPLY = await token.INITIAL_SUPPLY.call();
            const VESTIING_SUPPLY = TOTAL_SUPPLY.div(5);
            const PSALE_SUPPLY = TOTAL_SUPPLY.mul(40).div(100);
            await token.approve(vesting_ctl.address, VESTIING_SUPPLY, {from: owner});
            await vesting_ctl.newVesting(manager, nowTime, 5, 10, VESTIING_SUPPLY.div(4), {from: manager});
            await vesting_ctl.newVesting(developer1, nowTime, 5, 10, VESTIING_SUPPLY.div(4), {from: manager});
            await vesting_ctl.newVesting(developer2, nowTime, 5, 10, VESTIING_SUPPLY.div(2), {from: manager});

            console.log("VESTING DONE");

            //private sale
            const tokenSale = await AlphaTokenSale.new(startTime, endTime, rate, owner, minInvest, maxInvest, token.address, web3.eth.accounts.slice(0, 3), {from: manager});
            await token.approve(tokenSale.address, PSALE_SUPPLY);

            await tokenSale.sendTransaction({from: investor1, value: web3.toWei(10000, "ether")});

            await tokenSale.pause({from: manager});

            console.log("SALE DONE");

            //buyback
            const buyback = await Buyback.new(token.address, wallet, rate.div(2), {from: manager});
            await buyback.sendTransaction({from: owner, value: web3.toWei(10000, "ether")});
            
            const investor1Balance = await token.balanceOf.call(investor1, {from: investor1});
            await token.approve(buyback.address, investor1Balance, {from: investor1});
            await buyback.claim({from: investor1});

            assert.equal(getBalance(buyback.address), 0, "no balance left");

            await buyback.close({from: manager})
            console.log("BUYBACK DONE");

            //wait vesting done
            await sleep(10000);
            await vesting_ctl.release({from: manager});
            await vesting_ctl.release({from: developer1});
            await vesting_ctl.release({from: developer2});

            assert.ok((await token.balanceOf.call(manager)).equals(VESTIING_SUPPLY.div(4)), "manager supply match");
            assert.ok((await token.balanceOf.call(developer1)).equals(VESTIING_SUPPLY.div(4)), "developer1 supply match");
            assert.ok((await token.balanceOf.call(developer2)).equals(VESTIING_SUPPLY.div(2)), "developer2 supply match");
        }

        await case_01();
    });
});