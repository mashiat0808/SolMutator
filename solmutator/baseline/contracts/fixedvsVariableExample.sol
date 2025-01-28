// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VariableOptimization {
   // Fixed size variable (cheaper than dynamic)
   uint256 public fixedVar;

   // Fixed-size memory array (saves gas)
   uint256[5] public fixedSizeArray;

   // Additive operation for dynamic array (saves gas)
   uint256[] public dynamicArray;

   // Additive function for dynamic array
   function addToDynamicArray(uint256 newValue) external {
       dynamicArray.push(newValue);
   }

   // Truncating function for dynamic array (more gas)
   function removeFromDynamicArray() external {
       require(dynamicArray.length > 0, "Array is empty");
       dynamicArray.pop();
   }

   // Fixed-size string using bytes32 (more gas-efficient for short strings)
   bytes32 public fixedSizeString;

   // Dynamic string (higher gas cost)
   string public dynamicString;

   // Set fixed-size string
   function setFixedSizeString() public {
       bytes32 bytes32Text = bytes32(".....");
   }

   // Set dynamic string
   function setDynamicString(string memory _value) public  {
       dynamicString = _value;
   }
}