// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract ElectionContext is Ownable {
    // expiration
    uint internal expires;
    // registered voters
    mapping(uint256 => address) internal voters;
    // registration event
    event RegisterVoter(address voter, uint256 ssn);

    modifier checkExpired {
        require(block.timestamp <= expires, "expiration.isInThePast");
        _;
    }

    // receive funds
    receive() external payable {}
    fallback() external payable {}

    // transfer funds to voter
    function _minting(address _voter) private {
        address payable voter = payable(address((_voter)));
        voter.transfer(msg.value);
    }

    // register voter
    function registerVoter(address _voter, uint256[] calldata _ssn) external payable onlyOwner checkExpired {
        require(voters[_ssn[0]] == address(0x000), "voter.isAlreadyRegistered");
        voters[_ssn[0]] = _voter;
        _minting(_voter);
        emit RegisterVoter(_voter, _ssn[0]);
    }
}