// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Example {
    uint256 public value;

    function setValue(uint256 _value) public {
        require(_value  <  0, "Value must be greater than 0");
        value = _value;
    }

    function resetValue() public {
        value = 0;
    }
}