// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Parent {
   uint256 public parentVar;

   constructor(uint256 _parentVar) {
       parentVar = _parentVar;
   }
}

// Child contract inherits from Parent
contract Child is Parent {
   uint256 public childVar;

   constructor(uint256 _parentVar, uint256 _childVar) Parent(_parentVar) {
       childVar = _childVar;
   }
}

// Example of using the Child contract
contract Example {
   Child public myChild;

   constructor(uint256 _parentVar, uint256 _childVar) {
       // Creating an instance of Child initializes both parentVar and childVar
       myChild = new Child(_parentVar, _childVar);
   }

   function getParentVar() external view returns (uint256) {
       // Accessing parentVar from the Child contract
       return myChild.parentVar();
   }

   function getChildVar() external view returns (uint256) {
       // Accessing childVar from the Child contract
       return myChild.childVar();
   }
}