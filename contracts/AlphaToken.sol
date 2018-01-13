pragma solidity ^0.4.17;
import "zeppelin-solidity/contracts/token/MintableToken.sol";

contract AlphaToken is MintableToken {
  string public name = "Alpha Token";
  string public symbol = "ALPHA";
  uint public decimals = 2;
  uint public INITIAL_SUPPLY = 10**8 * (10 ** decimals);
  
  function AlphaToken() public {
    totalSupply = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
  }
}

