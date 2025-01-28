const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GasComparisonContract", function () {
    let gasComparisonContract;

    beforeEach(async function () {
        const GasComparisonContract = await ethers.getContractFactory("GasComparisonContract");
        gasComparisonContract = await GasComparisonContract.deploy();
    });

    it("should test gas cost for setBytes32Text function", async function () {
        const transaction = await gasComparisonContract.setBytes32Text();
        const receipt = await transaction.wait();
        const gasUsed = receipt.cumulativeGasUsed;

        expect(gasUsed).to.be.gt(0);
        console.log("Gas used (setBytes32Text):", gasUsed);
    });

    it("should test gas cost for setStringText function", async function () {
        const transaction = await gasComparisonContract.setStringText();
        const receipt = await transaction.wait();
        const gasUsed = receipt.cumulativeGasUsed;

        expect(gasUsed).to.be.gt(0);
        console.log("Gas used (setStringText):", gasUsed);
    });
});
