pragma solidity ^0.8.0;

import "openzeppelin-solidity/contracts/access/Ownable.sol";

contract AccessControlGreeter is Ownable {
    string private _greeting = "Hello World!";

    function ownableGreeter() external view returns(string memory){
        return _greeting;
    }

    function setOwnableGreeter(string calldata greeting) external onlyOwner{
        _greeting = greeting;
    }

}
