pragma solidity ^0.4.17;
import "zeppelin-solidity/contracts/token/PausableToken.sol";
import "zeppelin-solidity/contracts/token/BurnableToken.sol";


//1 ETH:1000000 ALPHA, 1 Wei:1000 unit
contract AlphaToken is PausableToken, BurnableToken {
  string public name = "Alpha Token";
  string public symbol = "ALPHA";
  uint public decimals = 15;
  uint public INITIAL_SUPPLY = 2 * 35000 * (10 ** 6) * (10 ** decimals);
  
  function AlphaToken() public {
    totalSupply = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
  }
}

