const { expect } = require("chai");
const { ethers } = require("hardhat");
const {ether} = require('ethers');
describe("VariableOptimization Contract", function () {
    let variableOptimization;

    beforeEach(async function () {
        const VariableOptimization = await ethers.getContractFactory("VariableOptimization");
        variableOptimization = await VariableOptimization.deploy();
    });

    it("should test gas cost for fixed size variable", async function () {
        
        const transaction = await variableOptimization.setFixedSizeString();
        const receipt = await transaction.wait();
        const gasUsed = receipt.gasUsed;

        expect(gasUsed).to.be.gt(0);
        console.log("Gas used (setFixedSizeString):", gasUsed);
    });

    it("should test gas cost for dynamic variable", async function () {
        const transaction = await variableOptimization.setDynamicString("Hello");
        const receipt = await transaction.wait();
        const gasUsed = receipt.gasUsed;

        expect(gasUsed).to.be.gt(0);
        console.log("Gas used (setDynamicString):", gasUsed);
    });

    it("should test gas cost for adding to dynamic array", async function () {
        const transaction = await variableOptimization.addToDynamicArray(42);
        const receipt = await transaction.wait();
        const gasUsed = receipt.gasUsed;

        expect(gasUsed).to.be.gt(0);
        console.log("Gas used (addToDynamicArray):", gasUsed);
    });

    it("should test gas cost for removing from dynamic array", async function () {
        // First, add an element to the dynamic array
        await variableOptimization.addToDynamicArray(42);

        const transaction = await variableOptimization.removeFromDynamicArray();
        const receipt = await transaction.wait();
        const gasUsed = receipt.gasUsed;

        expect(gasUsed).to.be.gt(0);
        console.log("Gas used (removeFromDynamicArray):", gasUsed);
    });
});
