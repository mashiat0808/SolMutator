// tests/WithoutUnchecked.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WithoutUnchecked Contract", function () {
  let withoutUnchecked;

  beforeEach(async function () {
    const WithoutUnchecked = await ethers.getContractFactory("WithoutUnchecked");
    withoutUnchecked = await WithoutUnchecked.deploy();
  });

  it("should test gas cost for increment function", async function () {
    const transaction = await withoutUnchecked.increment();
    const receipt = await transaction.wait();

    const gasUsed = receipt.gasUsed;
    console.log("Gas used (WithoutUnchecked):", gasUsed);

    // Assert that gasUsed is greater than 0
    expect(gasUsed).to.be.gt(0);
  });
});

describe("WithUnchecked Contract", function () {
    let withUnchecked;
  
    beforeEach(async function () {
      const WithUnchecked = await ethers.getContractFactory("WithUnchecked");
      withUnchecked = await WithUnchecked.deploy();
    });
  
    it("should test gas cost for increment function", async function () {
      const transaction = await withUnchecked.increment();
      const receipt = await transaction.wait();
  
      const gasUsed = receipt.gasUsed;
      console.log("Gas used (WithUnchecked):", gasUsed);
  
      // Assert that gasUsed is greater than 0
      expect(gasUsed).to.be.gt(0);
    });
  });