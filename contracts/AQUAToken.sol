pragma solidity ^0.4.17;
import "zeppelin-solidity/contracts/token/PausableToken.sol";
import "zeppelin-solidity/contracts/token/BurnableToken.sol";


//1 ETH:1000000 ALPHA, 1 Wei:10000000 unit
contract AQUAToken is PausableToken, BurnableToken {
  string public name = "AQUA Token";
  string public symbol = "ALPHA";
  uint public decimals = 18;
  uint public INITIAL_SUPPLY = 66666 * (50 * 10 ** 4) * (10 ** decimals);
  
  function AQUAToken() public {
    totalSupply = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
  }
}

