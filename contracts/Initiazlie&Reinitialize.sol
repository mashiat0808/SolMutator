// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract GasCostExample {
    uint public uninitializedVar;
    uint public initializedVar;
    uint public zeroInitializedVar;
    uint public nonZeroInitializedVar;
    uint public nonZeroToZeroVar;
    uint public nonZeroToNonZeroVar;
    uint public zeroToNonZeroVar;
    uint public zeroToZeroVar;

    constructor() {
        // No gas cost for declaring without initializing
    }

    function initializeWithZero() external {
        zeroInitializedVar = 0;
    }

    function initializeWithNonZero() external {
        nonZeroInitializedVar = 42;
    }

    function reInitializeFromNonZeroToZero() external {
        nonZeroToZeroVar = 45;
        nonZeroToZeroVar = 0;
    }

    function reInitializeFromNonZeroToNonZero(uint _value) external {
        nonZeroToNonZeroVar = _value;
        nonZeroToNonZeroVar = 45;
    }

    function reInitializeFromZeroToNonZero(uint _value) external {
        zeroToNonZeroVar = 0;
        zeroToNonZeroVar = _value;
    }

    function reInitializeFromZeroToZero() external {
        zeroToZeroVar = 0;
        zeroToZeroVar = 0;
    }

    function setInitializedVar(uint _value) external {
        initializedVar = _value;
        // Gas cost incurred for assigning a value
    }
}