const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EventDataLogging Contract", function () {
    let eventDataLogging;

    beforeEach(async function () {
        const EventDataLogging = await ethers.getContractFactory("EventDataLogging");
        eventDataLogging = await EventDataLogging.deploy();
    });

    it("should incur gas cost for direct data storing", async function () {
        const transaction = await eventDataLogging.updateValue(42);
        const receipt = await transaction.wait();
        const gasUsed = receipt.gasUsed;

        expect(gasUsed).to.be.gt(0);
        console.log("Gas used (updateValue):", gasUsed);
    });

    it("should incur gas cost for data logging with events", async function () {
        const transaction = await eventDataLogging.updateValue(42);
        const receipt = await transaction.wait();

        // Retrieve the gas used for emitting the event
        const gasUsed = receipt.gasUsed;
        expect(gasUsed).to.be.gt(0);

        // Check if the ValueUpdated event is emitted
        const events = receipt.events;
        const valueUpdatedEvent = events ? events.find((event) => event.event === "ValueUpdated") : undefined;

        if (valueUpdatedEvent) {
            
            console.log("Gas used (updateValue + event emission):", gasUsed);
        } else {
            console.log("Event not emitted");
        }
    });
});
