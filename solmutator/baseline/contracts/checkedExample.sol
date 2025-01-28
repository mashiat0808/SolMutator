// SPDX-License-Identifier: MIT
pragma solidity >=0.8.16;

contract WithoutUnchecked {
    uint256 private _value = 0;
    // function execution cost = 22322 gas
    function increment() public {
        _value += 1;
    }
}

contract WithUnchecked {
    uint256 private _value = 0;
    // function execution cost = 22225 gas
    function increment() public {
        unchecked {
            _value += 1;
        }
    }
}