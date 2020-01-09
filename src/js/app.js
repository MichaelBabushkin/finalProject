/*jshint esversion: 6 */
var App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    window.ethereum.enable();//saved the world, but doesn't define it self any more :D
    App.appUi();
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
    $.getJSON("ElectionToken.json", function(electiontoken) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.ElectionToken = TruffleContract(electiontoken);
      // Connect provider to interact with contract
      App.contracts.ElectionToken.setProvider(App.web3Provider);

      App.checkContractAddress();

      //App.listenForEvents();

      return App.render();
    });
  },

  checkContractAddress: function() {
    //var contractAddressInput = $("#votersInput").val();
    console.log('Im in');
    var contractAddressInput = document.getElementById("contractAddressInput");
    contractAddressInput.select();
    contractAddressInput.setSelectionRange(0, 99999);
    document.execCommand("copy");
    if(web3.isAddress(contractAddressInput.value))
    {
      //window.location.assign("https://www.w3schools.com");
      console.log('address exist');
      window.location.assign('candidates.html');
    }else{
      console.log('address do noooooooot exist');
      modal.style.display = "block";
    }
    //alert("Copied the address: " + contractAddressInput.value);
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.ElectionToken.at(contractAddressInput.value).then(function(instance) {
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
  },

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");
    console.log('in render');
    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
     }
    });

    // Load contract data
    console.log('almost in');
    App.contracts.ElectionToken.at(contractAddressInput.value).then(function(instance) {
      console.log('Im in');
      electionInstance = instance;
      return electionInstance.candidatesCount();    // get amount of candidates 
    }).then(function(candidatesCount) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();  // Remove the content of element

      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();

      for (var i = 1; i <= candidatesCount; i++) {
          var candidateAddress = electionInstance.candidateAddresses(i);  // Get candidate address
          var voteCount = electionInstance.balanceOf(candidateAddress);   // Get balance by candidate address

          // Render candidate Result
          var candidateTemplate = "<tr><th>" + i + "</th><td>" + candidateAddress + "</td><td>" + voteCount + "</td></tr>";
          candidatesResults.append(candidateTemplate);

          // Render candidate ballot option
          var candidateOption = "<option value='" + i + "' >" + candidateAddress + "</ option>";
          candidatesSelect.append(candidateOption);
      }
      return electionInstance.voters(App.account);
    }).then(function(hasVoted) {
      // Do not allow a user to vote   /////// shuld be replaced with token withdrawn
      if(hasVoted) {
        $('form').hide();
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  castVote: function() {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.ElectionToken.deployed().then(function(instance) {
      instance.vote(candidateId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  appUi:function () {
    let = readMore = () => {
        $(".myBtn").on("click", function () {
          // $(document).on("click",".myBtn" ,function () {
          let parent = $(this).prev("p")[0];
          let dots = $(parent).children(".dots")[0];
          let moreText = $(parent).children(".more")[0];
      
          if (!$(dots).is(":visible")) {
            $(dots).show();
            $(this).text("Read more"); 
            $(moreText).slideUp();
          } else {
            $(dots).hide();
            $(this).text("Read less"); 
            $(moreText).slideDown();
          }
        });     
    };
    readMore();
  }
};

// handle click 
$(".menu button").on("click", function(){
	let id = $(this).attr("id");
  switch (id) {
  case "1":
    	alert("This is first: " + id);
    	break;
    case "2":
    	alert("This is second: " + id);
    	break;
    case "3":
    	alert("This is third: " + id);
      break;
      case "4":
        alert("This is first: " + id);
        break;
      case "5":
        let input=$(this).prev("input").val();
        let param1=input[0];
        App.contracts.VTC.deployed().then(function(instance) {
          electionInstance = instance;
          debugger;
          // return electionInstance.candidatesCount();
          alert("Ninja: "|+" "+  electionInstance.increaseSupply(param1) );
        });
        break;
      case "6":
        alert("This is third: " + id);
        break;
        case "7":
          // let input=$(this).prev("input").val().split(",");
          // let input=$(this).prev("input").val();
          // let param1=input[0];
         
          
          // App.contracts.VTC.deployed().then(function(instance) {
          //   electionInstance = instance;
          //   debugger;
          //   // return electionInstance.candidatesCount();
          //   alert("Ninja: "|+" "+  electionInstance.transferAndAddVoterAddress(param1) );
          // });
        break;
        case "8":
          alert("This is second: " + id);
          break;
        case "9":
          alert("This is third: " + id);
          break;
    default:
    	alert("No id :\(");
    break;
  }

})

/*$(document).ready(function() {
    App.init();
  });*/



/**********NEW**********/
/*
$(document).ready(function () {
  console.log('Kannnnnnn');
  $('#start-btn').on("submit",function(event) {
    event.preventDefault();
    Admin.init();
  });
});
*/

function checkContractAddress() {
  console.log('Kannnnnnn');
  //$('#start-btn').on("button",function(event) {
   // event.preventDefault();
    App.init();
  //});
}
/*function checkContractAddress() {
  //var contractAddressInput = $("#votersInput").val();
  var contractAddressInput = document.getElementById("contractAddressInput");
  contractAddressInput.select();
  contractAddressInput.setSelectionRange(0, 99999);
  document.execCommand("copy");
  web3.utils.isAddress(contractAddressInput.value);
  //alert("Copied the address: " + contractAddressInput.value);
}*/

