/*const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Example Contract", function () {
    let example;

    beforeEach(async function () {
        const Example = await ethers.getContractFactory("Example");
        example = await Example.deploy(42, 77);
    });

    it("should get the parentVar value from the Child contract", async function () {
        const gasUsed = await example.getParentVar();
        console.log("Gas used (getParentVar):", Number(gasUsed));
    
        // Chai assertion
        expect(gasUsed).to.be.above(0);
    });
    
    it("should get the childVar value from the Child contract", async function () {
        const gasUsed = await example.getChildVar();
        console.log("Gas used (getChildVar):", Number(gasUsed));
    
        // Chai assertion
        expect(gasUsed).to.be.above(0);
    });
    
});
*/