pragma solidity >=0.4.22 <0.6.0;

import "./erc20.sol";
import "./erc20Detailed.sol";
import "./Owned.sol";

contract ElectionToken is erc20, erc20Detailed, Owned{
    
    address[] public voterAddresses;
    address[] public candidateAddresses;

    mapping (address => bool) voterAddressInitialized;
    mapping (address => bool) candidateAddressInitialized;
    
    mapping (address => bool) voted;
    
    constructor(uint256 _initialSupply, address[] memory _voterAddresses, address[] memory _candidateAddresses) erc20Detailed("VotingToken", "VTC", 0)public{    //_initialTokenSupply = number of voters
        _mint(msg.sender, _initialSupply);  
        bool flag = addVotersList(_voterAddresses);
        addCandidatesList(_candidateAddresses);
        require(flag,"Not all voters were registered");
        distributeTokens();
    }

    
    function addVoterAddress(address _address) internal onlyOwner{
        require(!voterAddressInitialized[_address],"Voter already exists");
        voterAddressInitialized[_address] = true;
        voterAddresses.push(_address);
    }
    
    function addVotersList(address[] memory addresses) public onlyOwner returns (bool){
        for(uint i = 0; i < addresses.length; i++){
            addVoterAddress(addresses[i]);
        }
        return true;
    }

    function addCandidateAddress(address _address) internal onlyOwner{
        candidateAddressInitialized[_address] = true;
        candidateAddresses.push(_address);
    }

    function addCandidatesList(address[] memory addresses) public onlyOwner{
        for(uint i = 0; i < addresses.length; i++){
            require(!candidateAddressInitialized[addresses[i]],"Candidate already exists");
            addCandidateAddress(addresses[i]);
        }
    }
    
    function distributeTokens() public onlyOwner{
        for(uint i = 0; i < voterAddresses.length; i++){
            require(totalSupply() > 0,"Supply is over");
            transfer(voterAddresses[i],1);
        }
    }
    
    function vote(address candidateAddress) public {
        //require(!timeLimit(),"Election ended");
        require(candidateAddressInitialized[candidateAddress],"Is not a Candidate");
        require(voterAddressInitialized[msg.sender],"User isn't authorized voter");
        require(!voted[msg.sender],"User already voted");
        require(balanceOf(msg.sender) > 0,"Voter doesn't have a token");
        voted[msg.sender] = true;
        transfer(candidateAddress,1);
    }
    
    function getResults() public view returns (address[] memory , uint256[] memory ){
        uint256[] memory results = new uint256[](candidateAddresses.length);
        for(uint i = 0; i < candidateAddresses.length; i++){
            results[i] = balanceOf(candidateAddresses[i]);
        }
        return (candidateAddresses,results);
    }
    
    function endElection() public onlyOwner{
        for(uint i = 0; i < voterAddresses.length; i++){
            require(!voted[voterAddresses[i]],"Voter already voted,doesn't have a token");
            _burnFrom(voterAddresses[i], 1);
        }
    }
    
    //******for test******
    function isAVoter(address _address)public view returns (bool){
        require(voterAddressInitialized[_address],"no such voter");
        return true;
    }
    
    function isACandidates(address _address)public view returns (bool){
        require(candidateAddressInitialized[_address],"no such Candidate");
        return true;
    }
    function balanceOFFFF(address _address)public view returns (uint256){
        return balanceOf(_address);
    }
    function showTokenSupply()public view returns (uint256){
        return totalSupply();
    }

}