pragma solidity ^0.4.17;
import "zeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./AlphaToken.sol";

contract AlphaTokenSale is Crowdsale, Ownable {
  address[] public whitelist;
  address public tokenAddr;

  function AlphaTokenSale(
      uint256 _startTime, 
      uint256 _endTime, 
      uint256 _rate, 
      address _wallet, 
      address _tokenAddr,
      address[] _whitelist) Crowdsale(_startTime, _endTime, _rate, _wallet) public {
    // constructor
      tokenAddr = _tokenAddr;
      whitelist = _whitelist;
      token = AlphaToken(tokenAddr);
  }

  function supply() onlyOwner public {
    token.transferFrom(owner, this, token.allowance(owner, this));
  }

  function createTokenContract() internal returns (MintableToken) {
  }

  /**
   * back the left tokens to owner
   */
  function withdraw() onlyOwner public {
    token.transfer(owner, token.balanceOf(owner));
  }
}
