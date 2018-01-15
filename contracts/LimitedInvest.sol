pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/math/SafeMath.sol";

contract LimitedInvest {
  using SafeMath for uint256;

  uint256 public minInvest;
  uint256 public maxInvest;
  mapping (address => uint256) public investTable;

  function LimitedInvest(uint256 _minInvest, uint256 _maxInvest) public {
    // constructor
    minInvest = _minInvest;
    maxInvest = _maxInvest;
  }

  function validInvest(uint256 amount) view internal returns (uint256) {
    uint256 originInvest = investTable[msg.sender];
    uint256 totalTry = originInvest.add(amount);
    if (totalTry < minInvest) {
      return 0;
    }
    if (totalTry > maxInvest) {
      return maxInvest.sub(originInvest);
    }
    return totalTry.sub(originInvest);
  }

  function applyInvest(uint256 amount) internal {
    investTable[msg.sender] = investTable[msg.sender].add(amount);
  }
}
