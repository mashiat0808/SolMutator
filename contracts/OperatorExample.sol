
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.16;

contract Operator1 {
    uint256 private _value = 0;
    // function execution cost = 22322 gas
    function increment() public {
        _value += 1;
    }
}

contract Operator2 {
    uint256 private _value = 0;
    // function execution cost = 22322 gas
    function increment() public {
        _value = _value + 1;
    }
}
contract Operator3 {
    uint256 private _value = 0;
    // function execution cost = 22322 gas
    function increment() public {
        _value++;
    }
}
contract Operator4{
    uint256 private _value = 0;
    // function execution cost = 22322 gas
    function increment() public {
        ++_value;
    }
}