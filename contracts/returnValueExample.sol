// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WithoutStreamlining {
    function calculateProduct(uint256 a, uint256 b) external pure returns (uint256) {
        // Without naming the return value directly
        return a * b;
    }

}
contract WithStreamlining {
    function calculateProduct(uint256 a, uint256 b) external pure returns (uint256 product) {

       // Naming the return value directly

       product = a * b;

}
}

