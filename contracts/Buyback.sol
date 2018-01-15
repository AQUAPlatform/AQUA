pragma solidity ^0.4.17;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./AlphaToken.sol";

contract Buyback is Ownable {
  using SafeMath for uint256;
  //wei:unit
  uint256 public rate;
  AlphaToken public token;
  address public wallet;

  function Buyback(address _tokenAddr, address _wallet, uint256 _rate) public {
    // constructor
    rate = _rate;
    wallet = _wallet;
    token = AlphaToken(_tokenAddr);
  }

  function convertBalance(uint256 tokens) view public returns (uint256) {
    return tokens.div(rate);
  }

  //need to approve this contract first
  function claim() public {
    uint256 approved = token.allowance(msg.sender, this);
    uint256 amount = token.balanceOf(msg.sender);
    if (approved > amount) {
      approved = amount;
    }
    token.transferFrom(msg.sender, this, approved);
    token.burn(approved);
    uint256 weiBack = convertBalance(approved);
    msg.sender.transfer(weiBack);
  }

  function close() onlyOwner public {
    selfdestruct(wallet);
  }
}
