// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EventDataLogging {
    uint256 public storedValue;

    // Define an event to log value updates
    event ValueUpdated(uint256 newValue);

    function updateValue(uint256 newValue) external {
        // Directly store the data in the contract
        storedValue = newValue;

        // Emit an event to log the value update
        emit ValueUpdated(newValue);
    }

    function getStoredValue() external view returns (uint256) {
        // Retrieve the stored data directly
        return storedValue;
    }
}
