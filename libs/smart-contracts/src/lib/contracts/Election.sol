// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Election is Ownable {
    uint public expires;
    string public name;

    struct Voter {
        bool registered;
        bool voted;
        uint candidate;
        uint weight;
        address id;
    }

    struct Candidate {
        string name;
        uint voteCount;
    }

    struct Result {
        string name;
        uint voteCount;
    }

    mapping(address => Voter) private voters;

    Candidate[] public candidates;

    Result[] public result;

    constructor(string memory _name, string[] memory _candidates, uint _expires) {
        expires = _expires;
        name = _name;

        for(uint i = 0; i < _candidates.length; i++) {
            candidates.push(Candidate({
            name: _candidates[i],
            voteCount: 0
            }));
        }
    }

    /**
     * @dev Check whether election is open or expired.
     */
    modifier checkExpired {
        require(1000 * block.timestamp <= expires, "election.expired");
        _;
    }
    modifier checkUnexpired {
        require(1000 * block.timestamp >= expires, "election.notexpired");
        _;
    }

    /**
     * @dev Register voter.
     * @param _voter address of voter
     */
    function registerVoter(address _voter) payable external onlyOwner checkExpired {
        require(voters[_voter].id == address(0x000), "voter.isAlreadyRegistered");

        // create voter
        voters[_voter] = Voter({
        registered: true,
        voted: false,
        candidate: 0,
        weight: 0,
        id: _voter
        });

        // transfer funds to wallet
        address payable voter = payable(address(_voter));
        voter.transfer(msg.value);
    }

    /**
     * @dev Give 'voter' the right to vote on this ballot. May only be called by owner, i.e., administrator.
     * @param _voter address of voter
     */
    function addVotingWeight(address _voter) external onlyOwner checkExpired {
        voters[_voter].weight = 1;
    }

    /**
     * @dev Lets voters vote on their candidate
     * @param _candidate index of candidate in the candidates array
     */
    function vote(uint _candidate) external checkExpired {
        Voter storage voter = voters[msg.sender];
        require(voter.weight != 0, "voter.notEligible");
        require(voter.voted != true, "voter.hasVoted");
        voter.voted = true;
        voter.candidate = _candidate;

        candidates[_candidate].voteCount += voter.weight;
    }

    function calcResult() external onlyOwner checkUnexpired {
        for(uint i = 0; i < candidates.length; i++) {
            result.push(Result({
            name: candidates[i].name,
            voteCount: candidates[i].voteCount
            }));
        }
    }

    function getResults() public view returns(Result[] memory result_) {
        result_ = result;
    }

    function getVoters(address _voter) external view onlyOwner returns(Voter memory voter_) {
        voter_ = voters[_voter];
    }

    function discardContract() payable external onlyOwner {
        selfdestruct(payable(address(owner())));
    }
}