pragma solidity >= 0.4.0 < 0.7.0;

contract OwnableGreeter {
    string private _greeting = "Hello World!";
    address private _owner;

    function ownableGreeter() external view returns(string memory){
        return _greeting;
    }

    function setOwnableGreeter(string calldata greeting) external {
        _greeting = greeting;
    }

    function owner() public view returns(address){
        return _owner;
    }

}
