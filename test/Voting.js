const { expect } = require("chai");

describe("Voting", function () {
    let voting, owner;

    beforeEach(async function () {
        const Voting = await ethers.getContractFactory("Voting");
        voting = await Voting.deploy();
        await voting.deployed();

        [owner] = await ethers.getSigners();
    });

    it("Should allow a user to vote and track votes", async function () {
        await voting.vote(1);
        expect(await voting.getTotalVotes(1)).to.equal(1);

        await expect(voting.vote(1)).to.be.revertedWith("You have already voted for this voting ID.");
    });

    it("Should correctly check if a user has voted", async function () {
        expect(await voting.checkIfVoted(1, owner.address)).to.equal(false);
        await voting.vote(1);
        expect(await voting.checkIfVoted(1, owner.address)).to.equal(true);
    });
});
