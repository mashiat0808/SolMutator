// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LoopCheck1Contract {
    function loopCheck1() public {
        uint256[] memory localArr = new uint256[](3); // Declare and initialize the array

        // Initialize the array with some values
        localArr[0] = 1;
        localArr[1] = 2;
        localArr[2] = 3;

        uint length = localArr.length;
        for (uint i; i < length;) {
            unchecked { ++i; }
        }   
    }
}

contract LoopCheck2Contract {
    function loopCheck2() public {
        uint256[] memory localArr = new uint256[](3); // Declare and initialize the array

        // Initialize the array with some values
        localArr[0] = 1;
        localArr[1] = 2;
        localArr[2] = 3;

        uint i;
        uint length = localArr.length;
        for (; i < length;) {
            unchecked { ++i; }
        }  
    }
}

contract LoopCheck3Contract {
    function loopCheck3() public {
        uint256[] memory localArr = new uint256[](3); // Declare and initialize the array

        // Initialize the array with some values
        localArr[0] = 1;
        localArr[1] = 2;
        localArr[2] = 3;

        
        uint length = localArr.length;
        for (uint i = 0; i < length; i++) {
            unchecked { ++i; }
        }
    }
}

