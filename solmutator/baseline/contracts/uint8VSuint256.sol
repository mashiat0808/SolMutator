// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GasComparison {
    uint8 public uint8Value;
    uint256 public uint256Value;

    function setUint8Value(uint8 _value) external {
        uint8Value = _value;
    }

    function setUint256Value(uint256 _value) external {
        uint256Value = _value;
    }

    function loopWithUint8(uint8 iterations) external {
        for (uint8 i = 0; i < iterations; i++) {
            uint8Value += 1;
        }
    }

    function loopWithUint256(uint8 iterations) external {
        for (uint8 i = 0; i < iterations; i++) {
            uint256Value += 1;
        }
    }
}
