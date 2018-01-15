pragma solidity ^0.4.17;
import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "./AlphaToken.sol";
import "./LimitedInvest.sol";
import "./Whitelist.sol";

/**
 * @title AlphaTokenSale
 * @dev AlphaTokenSale is a base contract for managing a token AlphaTokenSale.
 * AlphaTokenSales have a start and end timestamps, where investors can make
 * token purchases and the AlphaTokenSale will assign them tokens based
 * on a token per ETH rate. Funds collected are forwarded to a wallet
 * as they arrive.
 */
contract AlphaTokenSale is LimitedInvest, Whitelist, Pausable {
  using SafeMath for uint256;

  // The token being sold
  AlphaToken public token;

  // start and end timestamps where investments are allowed (both inclusive)
  uint256 public startTime;
  uint256 public endTime;

  // address where funds are collected
  address public wallet;

  // how many token units a buyer gets per wei
  uint256 public rate;

  // amount of raised money in wei
  uint256 public weiRaised;

  address public tokenAddr;


  /**
   * event for token purchase logging
   * @param purchaser who paid for the tokens
   * @param beneficiary who got the tokens
   * @param value weis paid for purchase
   * @param amount amount of tokens purchased
   */
  event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);


  function AlphaTokenSale(
                          uint256 _startTime, 
                          uint256 _endTime, 
                          uint256 _rate, 
                          address _wallet, 
                          uint256 _minInvest,
                          uint256 _maxInvest,
                          address _tokenAddr, 
                          address[] _whitelist) LimitedInvest(_minInvest, _maxInvest) Whitelist(_whitelist) public {
    require(_startTime >= now);
    require(_endTime >= _startTime);
    require(_rate > 0);
    require(_wallet != address(0));

    startTime = _startTime;
    endTime = _endTime;
    rate = _rate;
    wallet = _wallet;
    tokenAddr = _tokenAddr;

    token = AlphaToken(tokenAddr);
  }

  // fallback function can be used to buy tokens
  function () external payable {
    buyTokens(msg.sender);
  }

  // low level token purchase function
  function buyTokens(address beneficiary) whenNotPaused onlyWhite public payable {
    //TODO: give back some eth when tokens is not enough
    require(beneficiary != address(0));
    require(validPurchase());


    uint256 weiAmount = validInvest(msg.value);
    uint256 toReturn = msg.value.sub(weiAmount);

    uint256 available = token.allowance(wallet, this);

    // calculate token amount to be created
    uint256 tokens = weiAmount.mul(rate);

    if (tokens > available) {
      tokens = available;
      weiAmount = tokens.div(rate);
      toReturn = msg.value.sub(weiAmount);
    }

    // update state
    weiRaised = weiRaised.add(weiAmount);
    applyInvest(weiAmount);

    token.transferFrom(wallet, beneficiary, tokens);
    TokenPurchase(msg.sender, beneficiary, weiAmount, tokens);
    forwardFunds(weiAmount);
    if (toReturn > 0) {
      backwardFunds(toReturn);
    }
  }

  // send ether to the fund collection wallet
  // override to create custom fund forwarding mechanisms
  function forwardFunds(uint256 _funds) internal {
    wallet.transfer(_funds);
  }

  function backwardFunds(uint256 _funds) internal {
    msg.sender.transfer(_funds);
  }

  // @return true if the transaction can buy tokens
  function validPurchase() internal view returns (bool) {
    bool withinPeriod = now >= startTime && now <= endTime;
    bool nonZeroPurchase = msg.value != 0;
    return withinPeriod && nonZeroPurchase;
  }

  // @return true if AlphaTokenSale event has ended
  function hasEnded() public view returns (bool) {
    return paused || (now > endTime);
  }


}
