pragma solidity ^0.5;

contract Token {
    /* This is a slight change to the ERC20 base standard.
    function totalSupply() constant returns (uint256 supply);
    is replaced with:
    uint256 public totalSupply;
    This automatically creates a getter function for the totalSupply.
    This is moved to the base contract since public getter functions are not
    currently recognised as an implementation of the matching abstract
    function by the compiler.
    */
    /// total amount of tokens
    uint256 public totalSupply;

    /// @param _owner The address from which the balance will be retrieved
    /// @return The balance
    function balanceOf(address _owner)public view returns (uint256 balance) ;

    /// @notice send `_value` token to `_to` from `msg.sender`
    /// @param _to The address of the recipient
    /// @param _value The amount of token to be transferred
    /// @return Whether the transfer was successful or not
    function transfer(address _to, uint256 _value)public returns (bool success);

    /// @notice send `_value` token to `_to` from `_from` on the condition it is approved by `_from`
    /// @param _from The address of the sender
    /// @param _to The address of the recipient
    /// @param _value The amount of token to be transferred
    /// @return Whether the transfer was successful or not
    function transferFrom(address _from, address _to, uint256 _value)public returns (bool success);

    /// @notice `msg.sender` approves `_spender` to spend `_value` tokens
    /// @param _spender The address of the account able to transfer the tokens
    /// @param _value The amount of tokens to be approved for transfer
    /// @return Whether the approval was successful or not
    function approve(address _spender, uint256 _value)public returns (bool success);

    /// @param _owner The address of the account owning tokens
    /// @param _spender The address of the account able to transfer the tokens
    /// @return Amount of remaining tokens allowed to spent
    function allowance(address _owner, address _spender)public view returns (uint256 remaining);

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}

contract StandardToken is Token {

    function transfer(address _to, uint256 _value)public returns (bool success) {
        //Default assumes totalSupply can't be over max (2^256 - 1).
        //If your token leaves out totalSupply and can issue more tokens as time goes on, you need to check if it doesn't wrap.
        //Replace the if with this one instead.
        //require(balances[msg.sender] >= _value && balances[_to] + _value > balances[_to]);
        require(balances[msg.sender] >= _value);
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value)public returns (bool success) {
        //same as above. Replace this line with the following if you want to protect against wrapping uints.
        //require(balances[_from] >= _value && allowed[_from][msg.sender] >= _value && balances[_to] + _value > balances[_to]);
        require(balances[_from] >= _value && allowed[_from][msg.sender] >= _value);
        balances[_to] += _value;
        balances[_from] -= _value;
        allowed[_from][msg.sender] -= _value;
        emit  Transfer(_from, _to, _value);
        return true;
    }

    function balanceOf(address _owner)public view returns (uint256 balance) {
        return balances[_owner];
    }

    function approve(address _spender, uint256 _value)public returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender)public view returns (uint256 remaining) {
      return allowed[_owner][_spender];
    }

    mapping (address => uint256) balances;
    mapping (address => mapping (address => uint256)) allowed;
}


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

    constructor(uint256 _totalSupply) public{

        totalSupply = _totalSupply;
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

        increaseSupply(newTokens, owner);

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

    function increaseSupply(uint value, address to)public onlyOwner returns (bool) {
        totalSupply = safeAdd(totalSupply, value);
        balances[to] = safeAdd(balances[to], value);
        emit Transfer(address(0), to, value); //changed it. need to check if work properly
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