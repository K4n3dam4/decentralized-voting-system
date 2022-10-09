pragma solidity ^0.8.17;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Voter is Ownable {
    mapping(string => address) voters;

    // selfdestruct if sender is owner
    function kill() public onlyOwner {
        selfdestruct(payable(address(owner())));
    }
}