const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GasComparison Contract", function () {
    let gasComparison;

    beforeEach(async function () {
        const GasComparison = await ethers.getContractFactory("GasComparison");
        gasComparison = await GasComparison.deploy();
    });

    it("should test gas cost for loopWithUint8 function iter=5", async function () {
        const iterations = 5;
        const transaction = await gasComparison.loopWithUint8(iterations);
        const receipt = await transaction.wait();
        const gasUsed = receipt.gasUsed;

        expect(gasUsed).to.be.gt(0);
        console.log("Gas used (loopWithUint8 iter=5):", gasUsed);
    });

    it("should test gas cost for loopWithUint256 function iter=5", async function () {
        const iterations = 5;
        const transaction = await gasComparison.loopWithUint256(iterations);
        const receipt = await transaction.wait();
        const gasUsed = receipt.gasUsed;

        expect(gasUsed).to.be.gt(0);
        console.log("Gas used (loopWithUint256 iter=5):", gasUsed);
    });

    it("should test gas cost for loopWithUint8 function iter=50", async function () {
        const iterations = 50;
        const transaction = await gasComparison.loopWithUint8(iterations);
        const receipt = await transaction.wait();
        const gasUsed = receipt.gasUsed;

        expect(gasUsed).to.be.gt(0);
        console.log("Gas used (loopWithUint8 iter=50):", gasUsed);
    });

    it("should test gas cost for loopWithUint256 function iter=50", async function () {
        const iterations = 50;
        const transaction = await gasComparison.loopWithUint256(iterations);
        const receipt = await transaction.wait();
        const gasUsed = receipt.gasUsed;

        expect(gasUsed).to.be.gt(0);
        console.log("Gas used (loopWithUint256 iter=50):", gasUsed);
    });
});
