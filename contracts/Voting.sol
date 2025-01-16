// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Vote {
        uint256 votingId;
        address voter;
    }

    mapping(uint256 => mapping(address => bool)) private hasVoted; // votingId -> voter -> hasVoted
    mapping(uint256 => uint256) public voteCount; // votingId -> total votes

    event VoteSubmitted(uint256 indexed votingId, address indexed voter);

    /**
     * @dev Allows a user to vote for a specific votingId.
     * @param _votingId The ID of the voting event.
     */
    function vote(uint256 _votingId) external {
        require(!hasVoted[_votingId][msg.sender], "You have already voted for this voting ID.");
        
        hasVoted[_votingId][msg.sender] = true;
        voteCount[_votingId]++;

        emit VoteSubmitted(_votingId, msg.sender);
    }

    /**
     * @dev Checks if a user has voted for a specific voting ID.
     * @param _votingId The ID of the voting event.
     * @param _voter The address of the voter.
     * @return True if the voter has already voted, otherwise false.
     */
    function checkIfVoted(uint256 _votingId, address _voter) external view returns (bool) {
        return hasVoted[_votingId][_voter];
    }

    /**
     * @dev Returns the total votes for a specific voting ID.
     * @param _votingId The ID of the voting event.
     * @return Total number of votes for the voting ID.
     */
    function getTotalVotes(uint256 _votingId) external view returns (uint256) {
        return voteCount[_votingId];
    }
}
