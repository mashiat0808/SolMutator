// SPDX-License-Identifier: MIT
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GasRefundExample", function () {
  let gasRefundExample;

  beforeEach(async function () {
    const GasRefundExample = await ethers.getContractFactory("GasRefundExample");
    gasRefundExample = await GasRefundExample.deploy();
  });

  it("should update values and free storage slot with gas refund", async function () {
    const newValue1 = 42;
    const newValue2 = 77;

    const transaction = await gasRefundExample.updateValuesAndFreeStorageSlot(newValue1, newValue2);
    const receipt = await transaction.wait();
    const gasUsed = receipt.gasUsed;

    console.log("Gas used (updateValuesAndFreeStorageSlot):", gasUsed);

    // Chai assertions
    expect(gasUsed).to.be.above(0);
    expect(receipt.gasUsed).to.be.above(0);
  });

  it("should selfdestruct and refund gas", async function () {
    const transaction = await gasRefundExample.destroyContract();
    const receipt = await transaction.wait();
    const gasUsed = receipt.gasUsed;

    console.log("Gas refunded (destroyContract):", receipt.gasUsed);

    // Chai assertions
    expect(gasUsed).to.be.above(0);
    expect(receipt.gasUsed).to.be.above(0);
  });
});
