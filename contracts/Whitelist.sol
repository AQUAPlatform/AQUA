pragma solidity ^0.4.17;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract Whitelist is Ownable {
  mapping(address => bool) public whiteset;

  function Whitelist(address[] _whitelist) public {
    // constructor
    for (uint i = 0; i < _whitelist.length; i++) {
      whiteset[_whitelist[i]] = true;
    }
  }

  function makeWhite(address[] _whitelist) onlyOwner public {
    for (uint i = 0; i < _whitelist.length; i++) {
      whiteset[_whitelist[i]] = true;
    }
  }

  function remove(address[] _blacklist) onlyOwner public {
    for (uint i = 0; i < _blacklist.length; i++) {
      whiteset[_blacklist[i]] = false;
    }
  }

  function inWhiteList() internal view returns (bool) {
    return whiteset[msg.sender];
  }

  modifier onlyWhite() {
    require(inWhiteList());
    _;
  }

}
