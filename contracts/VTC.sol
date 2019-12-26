pragma solidity ^0.5;
import "./StandardToken.sol";

contract VTC is StandardToken {
    address public owner;

    mapping (address => uint) public votesToUse;

    mapping (address => uint) public upvotesReceivedThisWeek;

    uint public totalUpvotesReceivedThisWeek;

    address[] public voterAddresses;

    address[] public projectAddresses;

    mapping (address => bool) voterAddressInitialized;

    mapping (address => bool) projectAddressInitialized;

    modifier onlyOwner()
    {
        require(msg.sender == owner);
        _;
    }

    //constructor(uint256 _totalSupply) public{
    constructor() public{
    //    totalSupply = _totalSupply;
        owner = msg.sender;

        balances[owner] = totalSupply;
        addVoterAddress(owner);
    }

    function transferAndAddVoterAddress(address _to, uint256 _value) public{
        transfer(_to, _value);
        addVoterAddress(_to);
    }

    function addVoterAddress(address _address) internal {
        if (!voterAddressInitialized[_address]) {
            voterAddresses.push(_address);
        }
    }

    function addProjectAddress(address _address) internal {
        if (!projectAddressInitialized[_address]) {
            projectAddresses.push(_address);
        }
    }

    function distributeVotes(uint votesToDistribute)public onlyOwner {
        require(votesToDistribute > 0);

        for (uint i = 0; i < voterAddresses.length; i++) {
            address voterAddress = voterAddresses[i];
            votesToUse[voterAddress] += (balanceOf(voterAddress) * votesToDistribute) / totalSupply;
        }
    }

    function vote(address voterAddress, address projectAddress)public{
        require(msg.sender == voterAddress);
        require(votesToUse[voterAddress] >= 1);

        addProjectAddress(projectAddress);
        upvotesReceivedThisWeek[projectAddress] += 1;
        votesToUse[voterAddress] -= 1;
        totalUpvotesReceivedThisWeek += 1;
    }

    function distributeTokens(uint newTokens)public onlyOwner {
        require(newTokens > 0);
        require(totalUpvotesReceivedThisWeek > 0);

        uint previousOwnerBalance = balanceOf(owner);

       // increaseSupply(newTokens, owner);

        for (uint i = 0; i < projectAddresses.length; i++) {
            address projectAddress = projectAddresses[i];
            uint tokensToTransfer = (upvotesReceivedThisWeek[projectAddress] * newTokens) / totalUpvotesReceivedThisWeek;
            transferAndAddVoterAddress(projectAddress, tokensToTransfer);
            upvotesReceivedThisWeek[projectAddress] = 0;
        }

        totalUpvotesReceivedThisWeek = 0;

        // make sure we didn't redistribute more tokens than created
        assert(balanceOf(owner) >= previousOwnerBalance);
    }
    ///////// issue that not only owner can increase supply
    function increaseSupply(uint value)public onlyOwner returns (bool) {
        require(msg.sender == owner);
        totalSupply = safeAdd(totalSupply, value);
        balances[msg.sender] = safeAdd(balances[msg.sender], value);
        emit Transfer(address(0), msg.sender, value); //changed it. need to check if work properly
        return true;
    }

    function safeAdd(uint a, uint b) internal returns (uint) {
        require(a + b >= a);
        return a + b;
    }

    function burn(uint value)public onlyOwner returns (bool) {
        totalSupply = safeSub(totalSupply, value);
        balances[owner] = safeSub(balances[owner], value);
        emit Transfer(owner, address(0), value);//changed it. need to check if work properly
        return true;
    }

    function safeSub(uint a, uint b) internal returns (uint) {
        assert(b <= a);
        return a - b;
    }
}

/*stackexchange.com: ###  Whats the best way to distribute tokens  ### */
/*
// addresses = list of voters, _value = token amount
function distributeToken(address[] addresses, uint256 _value) onlyOwner {
     for (uint i = 0; i < addresses.length; i++) {
         balances[owner] -= _value;
         balances[addresses[i]] += _value;
         Transfer(owner, addresses[i], _value);
     }
}
*/