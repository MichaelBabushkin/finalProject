/*jshint esversion: 6 */
 var contractAddressInput;
var glob;
var App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

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

      if( account.toLowerCase() ==="0xcdf57e7b90b86653fc6b4a7509400d9368157ebc".toLowerCase()) {
        adminOption.show();
         console.log("i`m the admin: " +account);
      }
   
  if (window.location.href.indexOf("index") > -1) {
    App.checkContractAddress();
  }
      
  if (window.location.href.indexOf("results") > -1) {
    return App.render();  }
     
    });
  },

  checkContractAddress: function() {
    contractAddressInput = $("#contractAddressInput").val();
     localStorage.setItem("contract",contractAddressInput);
    console.log("where is the pizza? " + localStorage);
    // contractAddressInput.select();
    // contractAddressInput.setSelectionRange(0, 99999);    
    // document.execCommand("copy");
    if(web3.isAddress(contractAddressInput))
    {
      console.log('address exist');
      window.location.assign('candidates.html');
    }else{
      console.log('address do noooooooot exist');
      modal.style.display = "block";
    }
  },       

  render: function() {
    var instance;
    var loader = $("#loader");
    var content = $("#content");
    console.log('in render');
    loader.hide();
    content.show();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
     }
    
    });

////////////////////////////////////////////////try//////////////////////////////////////////////////////////////////

console.log('almost in2'); 
contractAddressInput=localStorage.getItem("contract");
App.contracts.ElectionToken.at(contractAddressInput).then(function(instance) {
  console.log('Im in2');
  electionInstance = instance;
  return electionInstance.candidateAddresses();    // get amount of candidates 
}).then(function(candidateAddresses) {
    localStorage.setItem("cAddresses",JSON.stringify(candidateAddresses));
});

console.log('almost in3'); 
contractAddressInput=localStorage.getItem("contract");
App.contracts.ElectionToken.at(contractAddressInput).then(function(instance) {
  console.log('Im in3');
  var candidateAddress=JSON.parse(localStorage.getItem("storageName"));
  electionInstance = instance;
  return electionInstance.balanceOFFFF();    // get amount of candidates 
}).then(function(balanceOFFFF) {
    localStorage.setItem("balanceOf",JSON.stringify(balanceOFFFF));
});


/////////////////////////////////////////////////end of try///////////////////////////////////////////////////////////
    // Load contract data
    console.log('almost in'); 
    contractAddressInput=localStorage.getItem("contract");
    App.contracts.ElectionToken.at(contractAddressInput).then(function(instance) {
      console.log('Im in');
      electionInstance = instance;
      
      return electionInstance.candidatesCount();    // get amount of candidates 
    }).then(function(candidatesCount) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();  // Remove the content of element

      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();
      var candidateAddress=JSON.parse(localStorage.getItem("storageName"));
      
      // electionInstance.candidateAddresses(i);  // Get candidate address
      var voteCount = JSON.parse(localStorage.getItem("balanceOf"));
      //electionInstance.balanceOf(candidateAddress);   // Get balance by candidate address
      
      for (var i = 0; i < candidatesCount; i++) {
     

        // Render candidate Result
        var candidateTemplate = "<tr><th>" + i + "</th><td>" + candidateAddress[i] + "</td><td>" + voteCount[i] + "</td></tr>";
        candidatesResults.append(candidateTemplate);

        // Render candidate ballot option
        var candidateOption = "<option value='" + i + "' >" + candidateAddress[i] + "</ option>";
        candidatesSelect.append(candidateOption);
    }

  //   return electionInstance.voters(App.account);
  // }).then(function(hasVoted) {
  //   // Do not allow a user to vote   /////// shuld be replaced with token withdrawn
  //   if(hasVoted) {
  //     $('form').hide();
  //   }
  //   loader.hide();
  //   content.show();
  // }).catch(function(error) {
  //   console.warn(error);
  });

  },
  
};

$(document).ready(function() {
    App.init();
  });


  function checkContractAddress() {
    console.log('Kannnnnnn');
      App.init();  
  }

  // function castVote() {
  //   // castVote: function() {
  //     var candidateId = $('#candidatesSelect').find('option:selected').text();
  //     contractAddressInput=localStorage.getItem("contract");
  //     debugger;
  //     App.contracts.ElectionToken.at(contractAddressInput).then(function(instance) { 
  //       instance.vote(candidateId);
  //     }).then(function(result) {
  //       // Wait for votes to update
  //       $("#content").hide();
  //       $("#loader").show();
  //     }).catch(function(err) {
  //       console.error(err);
  //     });
  //   }
    function vote() {
      var candidateId = $('#candidatesSelect').find('option:selected').text();
         contractAddressInput=localStorage.getItem("contract");
      App.contracts.ElectionToken.at(contractAddressInput).then(function(instancer) {
    console.log("i`m here5"  );
    instancer.vote(candidateId);
   listenForEvents();
    })
  }
    // Listen for events emitted from the contract
     function listenForEvents() {
      App.contracts.ElectionToken.at(contractAddressInput).then(function(instance) {
        // Restart Chrome if you are unable to receive this event
        // This is a known issue with Metamask
        // https://github.com/MetaMask/metamask-extension/issues/2393
        console.log('inside eventlisten');
        instance.votedEvent({}, {
          fromBlock: 0,
          toBlock: 'latest'
        }).watch(function(error, event) {
          console.log("event triggered", event);
          // Reload when a new vote is recorded
          App.render();
        });
      });
    }