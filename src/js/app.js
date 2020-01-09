/*jshint esversion: 6 */
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
    $.getJSON("Election.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      //  App.listenForEvents();

      //  return App.render();
    });
    $.getJSON("ElectionToken.json", function(electiontoken) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.ElectionToken = TruffleContract(electiontoken);
      // Connect provider to interact with contract
      App.contracts.ElectionToken.setProvider(App.web3Provider);
   
      //App.listenForEvents();
      return App.render();
    });
  },

  // Listen for events emitted from the contract
  // listenForEvents: function() {
  //   App.contracts.Election.deployed().then(function(instance) {
  //     // Restart Chrome if you are unable to receive this event
  //     // This is a known issue with Metamask
  //     // https://github.com/MetaMask/metamask-extension/issues/2393
  //     instance.votedEvent({}, {
  //       fromBlock: 0,
  //       toBlock: 'latest'
  //     }).watch(function(error, event) {
  //       console.log("event triggered", event);
  //       // Reload when a new vote is recorded
  //       App.render();
  //     });
  //   });
  // },

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
     }
    });
////test function
    // App.contracts.ElectionToken.deployed().then(function(instancet) {
    
  
    // });

    // Load contract data

    



   ////////////////////////////////////MY CODE//////////////////////////////////////////////////////////////////////////////////////////// 

var candidates=JSON.parse(localStorage.getItem("storageName"));
var candidatesCount=candidates.length;

var candidatesResults = $("#candidatesResults");
//candidatesResults.empty();

var candidatesSelect = $('#candidatesSelect');
//candidatesSelect.empty();


for (var i = 0; i <= candidatesCount; i++) {
 // electionInstance.candidates(i).then(function(candidate) {
    var id = i+1;
    var name = candidates[i];
    var voteCount = 0;

    // Render candidate Result
    var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>";
    candidatesResults.append(candidateTemplate);

    // Render candidate ballot option
    var candidateOption = "<option value='" + id + "' >" + name + "</ option>";
    candidatesSelect.append(candidateOption);
 
};

    // });
//}
loader.hide();
content.show();

console.log(457896 + " " + candidatesCount);






////////////////////////////////////////NOT MY CODE///////////////////
    App.contracts.Election.deployed().then(function(instance) 
    {
    //   electionInstance = instance;
    //   return electionInstance.candidatesCount();
    // }).then(function(candidatesCount)
    //  {
    //   var candidatesResults = $("#candidatesResults");
    //   candidatesResults.empty();

    //   var candidatesSelect = $('#candidatesSelect');
    //   candidatesSelect.empty();

    //   for (var i = 1; i <= candidatesCount; i++) {
    //     electionInstance.candidates(i).then(function(candidate) {
    //       var id = candidate[0];
    //       var name = candidate[1];
    //       var voteCount = candidate[2];

    //       // Render candidate Result
    //       var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>";
    //       candidatesResults.append(candidateTemplate);

    //       // Render candidate ballot option
    //       var candidateOption = "<option value='" + id + "' >" + name + "</ option>";
    //       candidatesSelect.append(candidateOption);
    //     });
    //   }
    //   return electionInstance.voters(App.account);
    // }).then(function(hasVoted) {
    //   // Do not allow a user to vote   /////// shuld be replaced with token withdrawn
    //   if(hasVoted) {
    //    // $('form').hide();
    //   }
    //   loader.hide();
    //   content.show();
    // }).catch(function(error) {
    //   console.warn(error);
    });



  },


  ////THE VOTING ITSELF
  castVote: function() {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.ElectionToken.at("0x5ec224034af7c3237a8947af54103c0d8ef5dd71").then(function(instancer) {
      debugger;
      console.log("i`m here");
      instancer.vote("0xf882D3e2837eBf0E1990338B05C87a30FE9095cf");


    // App.contracts.Election.deployed().then(function(instance) {
    //   instance.vote(candidateId, { from: App.account });
    // })
    // .then(function(result) {
    //   // Wait for votes to update
    //   $("#content").hide();
    //   $("#loader").show();
    // }).catch(function(err) {
    //   console.error(err);
    });
  },
/////// OUR VERSION
  voteForCandidate: function() {
    App.contracts.ElectionToken.at("0x5ec224034af7c3237a8947af54103c0d8ef5dd71").then(function(instancer) {
      debugger;
      console.log("i`m here");
      instancer.vote("0x90e5bbFEB8271E4E88815801Eb6eD3e2004fc74f");
  
    });
  },

};

// $(document).on("click","#resultForm",function(event){
// App.voteForCandidate();
//   });

$(document).ready(function() {
    App.init();
  });
