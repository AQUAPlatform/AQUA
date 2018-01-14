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

  function supply() onlyOwner public returns (bool) {
    return token.transferFrom(owner, this, token.allowance(owner, this));
  }

  function createTokenContract() internal returns (MintableToken) {
  }

  function buyTokens(address beneficiary) onlyWhite public payable {
    return super.buyTokens(beneficiary);
  }

  function inWhiteList() internal view returns (bool) {
    for (uint i = 0; i < whitelist.length; i++) {
      if (whitelist[i] == msg.sender) {
        return true;
      }
    }
    return false;
  }

modifier onlyWhite() {
  require(inWhiteList());
  _;
}

  /**
   * back the left tokens to owner
   */
  function withdraw() onlyOwner public {
    token.transfer(owner, token.balanceOf(owner));
  }
}
