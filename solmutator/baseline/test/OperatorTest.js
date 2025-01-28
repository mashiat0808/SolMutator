const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Operator1 Contract", function () {
    let operator1;

    beforeEach(async function () {
        const Operator1 = await ethers.getContractFactory("Operator1");
        operator1 = await Operator1.deploy();
    });

    it("should increment value using Operator1 and estimate gas cost", async function () {
        const transaction = await operator1.increment();
        const receipt = await transaction.wait();
        const gasUsed = receipt.gasUsed;

        expect(gasUsed).to.be.gt(0);
        console.log("Gas used (Operator1):", gasUsed);

      
    });
});

describe("Operator2 Contract", function () {
    let operator2;

    beforeEach(async function () {
        const Operator2 = await ethers.getContractFactory("Operator2");
        operator2 = await Operator2.deploy();
    });

    it("should increment value using Operator2 and estimate gas cost", async function () {
        const transaction = await operator2.increment();
        const receipt = await transaction.wait();
        const gasUsed = receipt.gasUsed;

        expect(gasUsed).to.be.gt(0);
        console.log("Gas used (Operator2):", gasUsed);

    });
});

describe("Operator3 Contract", function () {
    let operator3;

    beforeEach(async function () {
        const Operator3 = await ethers.getContractFactory("Operator3");
        operator3 = await Operator3.deploy();
    });

    it("should increment value using Operator3 and estimate gas cost", async function () {
        const transaction = await operator3.increment();
        const receipt = await transaction.wait();
        const gasUsed = receipt.gasUsed;

        expect(gasUsed).to.be.gt(0);
        console.log("Gas used (Operator3):", gasUsed);


    });
});

describe("Operator4 Contract", function () {
    let operator4;

    beforeEach(async function () {
        const Operator4 = await ethers.getContractFactory("Operator4");
        operator4 = await Operator4.deploy();
    });

    it("should increment value using Operator4 and estimate gas cost", async function () {
        const transaction = await operator4.increment();
        const receipt = await transaction.wait();
        const gasUsed = receipt.gasUsed;

        expect(gasUsed).to.be.gt(0);
        console.log("Gas used (Operator4):", gasUsed);

    });
});
