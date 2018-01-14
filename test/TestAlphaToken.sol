pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/AlphaToken.sol";

contract TestAlphaToken {

  function testInitialBalanceUsingDeployedContract() public {
    AlphaToken alpha = AlphaToken(DeployedAddresses.AlphaToken());

    Assert.equal(alpha.balanceOf(tx.origin), alpha.totalSupply(), "Owner should have all AlphaToken initially: deployed");
  }

  function testInitialBalanceWithNewAlphaToken() public {
    AlphaToken alpha = new AlphaToken();

    Assert.equal(alpha.balanceOf(this), alpha.totalSupply(), "Owner should have all AlphaToken initially: new");
  }

}
