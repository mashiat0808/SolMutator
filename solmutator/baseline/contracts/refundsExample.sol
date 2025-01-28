// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract GasRefundExample {
   // Example storage variables
   uint256 public value1;
   uint256 public value2;

   // Function to update values and free storage slot
   function updateValuesAndFreeStorageSlot(uint256 _newValue1, uint256 _newValue2) external {
       // Perform some operations with the values
       value1 = _newValue1;
       value2 = _newValue2;

       // Clear the storage slot by zeroing the variables

       assembly {
           sstore(value1.slot, 0)
           sstore(value2.slot, 0)
       }
   }

   // Function to selfdestruct and refund gas
   function destroyContract() external {
       // Ensure the refund doesn't surpass half the gas used
       require(gasleft() > gasleft() / 2, "Refund cannot surpass half the gas used");

        selfdestruct(payable(msg.sender));
   }
}