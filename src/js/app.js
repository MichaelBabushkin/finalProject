/*jshint esversion: 6 */
var contractAddressInput;
var glob;
var App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,
  contractAddress: null,

  init: function() {
    window.ethereum.enable();//saved the world, but doesn't define it self any more :D
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    //////////////HIDE ADMIN OPTION ////////////////////
    var adminOption = $("#goToAdminPage");
    adminOption.hide();
   
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    //  web3.eth.defaultAccount = web3.eth.accounts[0];
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
      //web3.eth.defaultAccount = web3.eth.accounts[0];
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("ElectionToken.json", function(electiontoken) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.ElectionToken = TruffleContract(electiontoken);
      // Connect provider to interact with contract
      App.contracts.ElectionToken.setProvider(App.web3Provider);
      var adminOption = $("#goToAdminPage");
      var account =  web3.eth.accounts[0];

      if( account.toLowerCase() ==="0x662a603853f835c9e571D898ECD1c3009A85F7c8".toLowerCase()) {
        adminOption.show();
         console.log("i`m the admin: " +account);
      }
   
  if (window.location.href.indexOf("index") > -1) {
    //alert("your url contains the name index");
    App.checkContractAddress();
  }
      
  if (window.location.href.indexOf("results") > -1) {
   // alert("your url contains the name results");
    return App.render();  }
     
    });
  },

  checkContractAddress: function() {
    contractAddressInput = $("#contractAddressInput").val();
    localStorage.setItem("contract",contractAddressInput);
    console.log("where is the pizza? " + localStorage);
    if(web3.isAddress(contractAddressInput))
    {
      App.contractAddress = contractAddressInput;
      console.log('address exist');
      window.location.assign('candidates.html');
    }else{
      console.log('address do not exist');
      //modal.style.display = "block";
    }
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    contractAddressInput=localStorage.getItem("contract");
    App.contracts.ElectionToken.at(contractAddressInput).then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event);
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  render: function() {
    var instance;
    var loader = $("#loader");
    var content = $("#content");

    loader.hide();
    content.show();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    contractAddressInput=localStorage.getItem("contract");
    App.contracts.ElectionToken.at(contractAddressInput).then(function(instance) {
      electionInstance = instance;   
      return electionInstance.candidatesCount();    // get amount of candidates 
    }).then(function(candidatesCount) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();  // Remove the content of element      
      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();

      for (var i = 0; i <= candidatesCount; i++) {
        electionInstance.candidates(i).then(function(candidate) {
          var id = candidate[0];
          var candidateAddress = candidate[3];
          var candidateName = candidate[1];
          var candidateDescription = candidate[2];
          var candidateExist = candidate[4];

          electionInstance.balanceOf(candidateAddress).then(function(voteCount){
            if(candidateExist){
              // Render candidate Result
              var candidateTemplate = "<tr><th>" + id + "</th><td>" + candidateName + "</td><td>" +  voteCount + "</td></tr>";
              candidatesResults.append(candidateTemplate);  
              // Render candidate ballot option
              var candidateOption = "<option value='" + candidateAddress + "' >" + candidateName + "</ option>";
              candidatesSelect.append(candidateOption);
            }
          });
        });
      }
    });
  },

  castVote: function() {
    var candidateAddress = $('#candidatesSelect').val();
    contractAddressInput=localStorage.getItem("contract");
    App.contracts.ElectionToken.at(contractAddressInput).then(function(instance) {
      instance.vote(candidateAddress);
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
      App.listenForEvents();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(document).ready(function() {
    App.init();
  });

/*function checkContractAddress() {
  App.init();
}*/
