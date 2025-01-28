const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LoopCheck1Contract", function () {
    let loopCheck1Contract;

    beforeEach(async function () {
        const LoopCheck1Contract = await ethers.getContractFactory("LoopCheck1Contract");
        loopCheck1Contract = await LoopCheck1Contract.deploy();
    });

    it("should test gas cost for loopCheck1 function", async function () {
        const transaction = await loopCheck1Contract.loopCheck1();
        const receipt = await transaction.wait();
        const gasUsed = receipt.cumulativeGasUsed;

        expect(gasUsed).to.be.gt(0);
        console.log("Gas used (loopCheck1):", gasUsed);
    });
});

describe("LoopCheck2Contract", function () {
    let loopCheck2Contract;

    beforeEach(async function () {
        const LoopCheck2Contract = await ethers.getContractFactory("LoopCheck2Contract");
        loopCheck2Contract = await LoopCheck2Contract.deploy();
    });

    it("should test gas cost for loopCheck2 function", async function () {
        const transaction = await loopCheck2Contract.loopCheck2();
        const receipt = await transaction.wait();
        const gasUsed = receipt.cumulativeGasUsed;

        expect(gasUsed).to.be.gt(0);
        console.log("Gas used (loopCheck2):", gasUsed);
    });
});

describe("LoopCheck3Contract", function () {
    let loopCheck3Contract;

    beforeEach(async function () {
        const LoopCheck3Contract = await ethers.getContractFactory("LoopCheck3Contract");
        loopCheck3Contract = await LoopCheck3Contract.deploy();
    });

    it("should test gas cost for loopCheck3 function", async function () {
        const transaction = await loopCheck3Contract.loopCheck3();
        const receipt = await transaction.wait();
        const gasUsed = receipt.cumulativeGasUsed;

        expect(gasUsed).to.be.gt(0);
        console.log("Gas used (loopCheck3):", gasUsed);
    });
});
