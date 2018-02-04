pragma solidity ^0.4.17;

import "zeppelin-solidity/contracts/token/TokenVesting.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "./AQUAToken.sol";

contract VestingCtrl is Ownable {
  using SafeMath for uint256;

  //binded token
  AQUAToken public token;
  //balance providor, VestingCtrl can operate the balance approved by the wallet
  address public wallet;

  mapping(address => address[]) public vestingTable;

  function VestingCtrl(address _tokenAddr, address _wallet) public {
    // constructor
    wallet = _wallet;
    token = AQUAToken(_tokenAddr);
  }

  //only support unrevokable vesting
  function newVesting(address _beneficiary, uint256 _start, uint256 _cliff, uint256 _duration, uint256 _amount) onlyOwner public {
    TokenVesting vesting = new TokenVesting(_beneficiary, _start, _cliff, _duration, false);
    address[] storage originVesting = vestingTable[_beneficiary];
    originVesting.push(address(vesting));
    vestingTable[_beneficiary] = originVesting;
    token.transferFrom(wallet, address(vesting), _amount);
  }

  function releasableAmount() public view returns (uint256) {
    address[] storage vestings = vestingTable[msg.sender];
    uint256 amount = 0;
    for (uint256 i = 0; i < vestings.length; i++) {
      TokenVesting vst = TokenVesting(vestings[i]);
      amount = amount.add(vst.releasableAmount(token));
    }
    return amount;
  }

  function release() public {
    address[] storage vestings = vestingTable[msg.sender];
    for (uint256 i = 0; i < vestings.length; i++) {
      TokenVesting vst = TokenVesting(vestings[i]);
      if (vst.releasableAmount(token) > 0) {
        vst.release(token);
      }
    }
  }

  function vestedAmount() public view returns (uint256) {
    address[] storage vestings = vestingTable[msg.sender];
    uint256 amount = 0;
    for (uint256 i = 0; i < vestings.length; i++) {
      TokenVesting vst = TokenVesting(vestings[i]);
      amount = amount.add(vst.vestedAmount(token));
    }
    return amount;
  }

  function totalAmount() public view returns (uint256) {
    address[] storage vestings = vestingTable[msg.sender];
    uint256 amount = 0;
    for (uint256 i = 0; i < vestings.length; i++) {
      amount = amount.add(token.balanceOf(vestings[i]));
    }
    return amount;
  }

  function outstanding() public view returns (uint256) {
    return totalAmount() - vestedAmount();
  }
}
