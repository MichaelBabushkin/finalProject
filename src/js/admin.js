// find elements
var Admin = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    hasVoted: false,
  
    init: function() {
      window.ethereum.enable();//saved the world, but doesn't define it self any more :D
    //   Admin.adminUi();
      return Admin.initWeb3();
    },
  
    initWeb3: function() {
      // TODO: refactor conditional
      if (typeof web3 !== 'undefined') {
        // If a web3 instance is already provided by Meta Mask.
        Admin.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
      //  web3.eth.defaultAccount = web3.eth.accounts[0];
      } else {
        // Specify default instance if no web3 instance provided
        Admin.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        web3 = new Web3(Admin.web3Provider);
        //web3.eth.defaultAccount = web3.eth.accounts[0];
      }
      return Admin.initContract();
    },
  
    initContract: function() {
      $.getJSON("ElectionToken.json", function(electiontoken) {
        // Instantiate a new truffle contract from the artifact
        Admin.contracts.ElectionToken = TruffleContract(electiontoken);
        // Connect provider to interact with contract
        Admin.contracts.ElectionToken.setProvider(Admin.web3Provider);
  
        //Admin.listenForEvents();
  
        // return Admin.render();
      });
    },
  
    // Listen for events emitted from the contract
    // listenForEvents: function() {
    //   Admin.contracts.ElectionToken.deployed().then(function(instance) {
    //     // Restart Chrome if you are unable to receive this event
    //     // This is a known issue with Metamask
    //     // https://github.com/MetaMask/metamask-extension/issues/2393
    //     instance.increaseSupply(10,{}, {
    //         // arguments: [arg],
    //       fromBlock: 0, 
    //       toBlock: 'latest'
    //     }).watch(function(error, event) {
    //       console.log("event triggered", event);
    //       // Reload when a new vote is recorded
    //       Admin.render();
    //     });
    //   });
    // },
  
  };
  

  $(document).ready(function() {
      Admin.init();
    });

$(document).ready(function () {

    $('#electionForm').on("submit",function(event) {
      event.preventDefault();
      // get all the inputs into an array.
      var $inputs = $('#electionForm :input');
  
      // not sure if you wanted this, but I thought I'd add it.
      // get an associative array of just the values.
      var values = {};
      $inputs.each(function(el) {
       
        if (el<5) {
          values["input" + el] = $(this).val();
        }
         
      });
      Admin.contracts.ElectionToken.deployed().then(function(instance) {
        instance.initContract(values.input1, values.input2, values.input3, 1578145360, 1578245360)
          ,{}, {
                 // arguments: [arg],
                fromBlock: 0, 
                toBlock: 'latest'
              }
      });
  });

})