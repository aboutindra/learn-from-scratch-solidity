pragma solidity >= 0.4.0 < 0.7.0;

contract DynamicGreeter {
    string private _greeting = "Hello World!";

    function DynamicGreeter() external view returns(string memory){
        return _greeting;
    }

    function setDynamicGreeter(string calldata greeting) external {
        _greeting = greeting;
    }
}
