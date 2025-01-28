/*const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WithoutStreamlining Contract", function () {
  let withoutStreamlining;

  beforeEach(async function () {
    const WithoutStreamlining = await ethers.getContractFactory("WithoutStreamlining");
    withoutStreamlining = await WithoutStreamlining.deploy();
  });

  it("should test gas cost for without streamlining function", async function () {
    const transaction = await withoutStreamlining.calculateProduct(5, 7);
    const receipt = await transaction.wait();

    const gasUsed = receipt.gasUsed;
    console.log("Gas used (WithoutStreamlining):", gasUsed);

    // Assert that gasUsed is greater than 0
    expect(gasUsed).to.be.gt(0);
  });
});

describe("WithStreamlining Contract", function () {
    let withStreamlining;
  
    beforeEach(async function () {
      const WithStreamlining = await ethers.getContractFactory("WithStreamlining");
      withStreamlining = await WithStreamlining.deploy();
    });
  
    it("should test gas cost with streamlining function", async function () {
      const transaction = await withStreamlining.calculateProduct(5, 7);
      const receipt = await withStreamlining.provider.waitForTransaction(transaction.hash);
  
      const gasUsed = receipt.gasUsed;
      console.log("Gas used (withStreamlining):", gasUsed);
  
      // Assert that gasUsed is greater than 0
      expect(gasUsed).to.be.gt(0);
    });
});
*/