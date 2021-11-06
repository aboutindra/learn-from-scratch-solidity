pragma solidity >= 0.4.0 < 0.7.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";

contract AccessControlGreeter is Ownable {
    string private _greeting = "Hello World!";
    address private _owner;

    function greet() external view returns(string memory){
        return _greeting;
    }

    function setGreeting(string calldata greeting) external onlyOwner{
        _greeting = _greeting;
    }

    function owner() public view returns(address){
        return _owner;
    }
}
