pragma solidity ^0.4.17;
import "zeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./AlphaToken.sol";

contract AlphaTokenSale is Crowdsale, Ownable {
  mapping(address => bool) public whiteset;
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
    for (uint i = 0; i < _whitelist.length; i++) {
      whiteset[_whitelist[i]] = true;
    }
    token = AlphaToken(tokenAddr);
  }

  function createTokenContract() internal returns (MintableToken) {
  }

  function buyTokens(address beneficiary) onlyWhite public payable {
    //TODO: give back some eth when tokens is not enough
    require(beneficiary != address(0));
    require(validPurchase());

    uint256 weiAmount = msg.value;

    // calculate token amount to be created
    uint256 tokens = weiAmount.mul(rate);

    // update state
    weiRaised = weiRaised.add(weiAmount);

    token.transferFrom(owner, beneficiary, tokens);
    TokenPurchase(msg.sender, beneficiary, weiAmount, tokens);
    forwardFunds();
  }

  function inWhiteList() internal view returns (bool) {
    return whiteset[msg.sender];
  }

  modifier onlyWhite() {
    require(inWhiteList());
    _;
  }
}
