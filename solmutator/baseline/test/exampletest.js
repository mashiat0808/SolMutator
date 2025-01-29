const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Example", function () {
    let contract;

    beforeEach(async function () {
        const Example = await ethers.getContractFactory("Example");
        contract = await Example.deploy();
        await contract.deployed();
    });

    it("should set the value correctly", async function () {
        await contract.setValue(42);
        expect(await contract.value()).to.equal(42);
    });

    it("should revert if setValue is called with 0", async function () {
        await expect(contract.setValue(0)).to.be.revertedWith("Value must be greater than 0");
    });

    it("should reset the value to 0", async function () {
        await contract.setValue(42);
        await contract.resetValue();
        expect(await contract.value()).to.equal(0);
    });
});