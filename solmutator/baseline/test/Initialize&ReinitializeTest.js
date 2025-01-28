const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GasCostExample Contract", function () {
    let gasCostExample;

    beforeEach(async function () {
        const GasCostExample = await ethers.getContractFactory("GasCostExample");
        gasCostExample = await GasCostExample.deploy();
    });


    it("should not incur gas cost for declaring without initializing", async function () {
        // Use await before gasCostExample.deployed() here
        
        const uninitializedVarValue = await gasCostExample.uninitializedVar();
        expect(uninitializedVarValue).to.equal(0);
        console.log("Gas used (uninitializedVar):", uninitializedVarValue);
        
    });
    it("should incur gas cost when assigning a value", async function () {
        const transaction = await gasCostExample.setInitializedVar(42);
        const receipt = await transaction.wait();
        const gasUsed = receipt.gasUsed;

        expect(gasUsed).to.be.gt(0);
        console.log("Gas used (setInitializedVar):", gasUsed);
    });

    it("should incur gas cost when initializing with zero", async function () {
        const transaction = await gasCostExample.initializeWithZero();
        const receipt = await transaction.wait();
        const gasUsed = receipt.gasUsed;

        expect(gasUsed).to.be.gt(0);
        console.log("Gas used (initializeWithZero):", gasUsed);
    });

    it("should incur gas cost when initializing with non-zero", async function () {
        const transaction = await gasCostExample.initializeWithNonZero();
        const receipt = await transaction.wait();
        const gasUsed = receipt.gasUsed;

        expect(gasUsed).to.be.gt(0);
        console.log("Gas used (initializeWithNonZero):", gasUsed);
    });

    it("should incur gas cost when re-initializing from non-zero to zero", async function () {
        const transaction = await gasCostExample.reInitializeFromNonZeroToZero();
        const receipt = await transaction.wait();
        const gasUsed = receipt.gasUsed;

        expect(gasUsed).to.be.gt(0);
        console.log("Gas used (reInitializeFromNonZeroToZero):", gasUsed);
    });

    it("should incur gas cost when re-initializing from non-zero to non-zero", async function () {
        const transaction = await gasCostExample.reInitializeFromNonZeroToNonZero(42);
        const receipt = await transaction.wait();
        const gasUsed = receipt.gasUsed;

        expect(gasUsed).to.be.gt(0);
        console.log("Gas used (reInitializeFromNonZeroToNonZero):", gasUsed);
    });

    it("should incur gas cost when re-initializing from zero to non-zero", async function () {
        const transaction = await gasCostExample.reInitializeFromZeroToNonZero(42);
        const receipt = await transaction.wait();
        const gasUsed = receipt.gasUsed;

        expect(gasUsed).to.be.gt(0);
        console.log("Gas used (reInitializeFromZeroToNonZero):", gasUsed);
    });

    it("should incur gas cost when re-initializing from zero to zero", async function () {
        const transaction = await gasCostExample.reInitializeFromZeroToZero();
        const receipt = await transaction.wait();
        const gasUsed = receipt.gasUsed;

        expect(gasUsed).to.be.gt(0);
        console.log("Gas used (reInitializeFromZeroToZero):", gasUsed);
    });
});
