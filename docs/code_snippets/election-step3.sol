/**
* @dev Register voter. May only be called by owner, i.e., administrator.
 * @param _voter address of voter
 */
function registerVoter(address _voter) payable external onlyOwner checkExpired {
    require(voters[_voter].id == address(0x000), "error.contract.isAlreadyRegistered");
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
    if (msg.sender != owner()) {
        Voter storage voter = voters[msg.sender];
        require(voter.weight != 0, "error.contract.uneligible");
        require(voter.voted != true, "error.contract.hasVoted");
        voter.voted = true;
        voter.candidate = _candidate;

        candidates[_candidate].voteCount += voter.weight;
    }
}
/**
* @dev Close election, calculate results. May only be called by owner, i.e., administrator.
 */
function closeElection() external onlyOwner {
    expires = block.timestamp;
    for(uint i = 0; i < candidates.length; i++) {
        result.push(Result({
        name: candidates[i].name,
        voteCount: candidates[i].voteCount
        }));
    }
}