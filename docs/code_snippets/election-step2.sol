// expiration date as unix epoch
uint public expires;
// election name
string public name;
// registered voters
mapping(address => Voter) private voters;
// candidates
Candidate[] public candidates;
// results
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
    require(block.timestamp <= expires, "error.contract.expired");
    _;
}
