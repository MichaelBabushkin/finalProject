// // find elements
// var Admin = {
//   web3Provider: null,
//   contracts: {},
//   account: '0x0',
//   hasVoted: false,

//   init: function() {
//     window.ethereum.enable();//saved the world, but doesn't define it self any more :D
//   //   Admin.adminUi();
//     return Admin.initWeb3();
//   },

//   initWeb3: function() {
//     // TODO: refactor conditional
//     if (typeof web3 !== 'undefined') {
//       // If a web3 instance is already provided by Meta Mask.
//       Admin.web3Provider = web3.currentProvider;
//       web3 = new Web3(web3.currentProvider);
//     //  web3.eth.defaultAccount = web3.eth.accounts[0];
//     } else {
//       // Specify default instance if no web3 instance provided
//       Admin.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
//       web3 = new Web3(Admin.web3Provider);
//       //web3.eth.defaultAccount = web3.eth.accounts[0];
//     }
//     return Admin.initContract();
//   },

//   initContract: function() {
//     $.getJSON("ElectionToken.json", function(electiontoken) {
//       // Instantiate a new truffle contract from the artifact
//       Admin.contracts.ElectionToken = TruffleContract(electiontoken);
//       // Connect provider to interact with contract
//       Admin.contracts.ElectionToken.setProvider(Admin.web3Provider);

//       //Admin.listenForEvents();

//       // return Admin.render();
//     });
//   },

//   initContractParams: function() {
//     // var initialSupply = $("#supplyInput").val();   // get input from html input element
//     // initialSupply = Number(initialSupply);

//     // var voterAddresses = $("#votersInput").val();
//     // voterAddresses = JSON.parse(voterAddresses);
//     // var candidateAddresses = $("#candidatesInput").val();
//     // candidateAddresses = JSON.parse(candidateAddresses);

//     // var startDate = $("#dateTimeStart").val();   // get input from html input element
//     // var endDate = $("#dateTimeEnd").val();

//     // startDate = new Date(startDate);      // convert to date format
//     // endDate = new Date(endDate);
//     // startDate = Math.floor(startDate/1000); // omit last 3 digits
//     // endDate = Math.floor(endDate/1000);

//     Admin.contracts.ElectionToken.deployed().then(function(instance) {
//       //instance.initializeContract(initialSupply, voterAddresses, candidateAddresses, startDate, endDate);
//        instance.initializeContract(10, ["0xb91CeE6B40ce509a8e978DcED953E48678cdD6DF","0xcc29248BCA08D1c108EB182102771C22041B056B","0xCe6CD3Ca803f48F4174ef6b0fa288c9c183e6Ac0"], ["0xf882D3e2837eBf0E1990338B05C87a30FE9095cf"], 1578411554, 1588411554);
//     });
//   }

// // voteForCandidate: function() {
// //     Admin.contracts.ElectionToken.deployed().then(function(instancer) {
// //       instancer.vote("0xf882D3e2837eBf0E1990338B05C87a30FE9095cf");
// //     });
// //   }

// };


// // $(document).ready(function() {
// //   Admin.init();
// // });

// $(document).ready(function () {
//   Admin.init();
//     $('#electionForm').on("submit",function(event) {
//       event.preventDefault();
//       Admin.initContractParams();

//       // setTimeout(function(){
//       //   Admin.voteForCandidate();
//       // }, 15000);
      
//   });

// });

// //voteForCandidate: function() {
//   ///  Admin.contracts.ElectionToken.deployed().then(function(instance) {
//       //instance.vote("0xf882D3e2837eBf0E1990338B05C87a30FE9095cf");
    
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
      Admin.initContractParams();
    });
  },

  initContractParams: function() {
    var initialSupply = $("#supplyInput").val();   // get input from html input element
    initialSupply = Number(initialSupply);

    var voterAddresses = $("#votersInput").val();
    voterAddresses = JSON.parse(voterAddresses);
    var candidateAddresses = $("#candidatesInput").val();
    candidateAddresses = JSON.parse(candidateAddresses);

    var startDate = $("#dateTimeStart").val();   // get input from html input element
    var endDate = $("#dateTimeEnd").val();

    startDate = new Date(startDate);      // convert to date format
    endDate = new Date(endDate);
    startDate = Math.floor(startDate/1000); // omit last 3 digits
    endDate = Math.floor(endDate/1000);
  
      // var getInput = prompt("Hey type something here: ");
       localStorage.setItem("storageName",JSON.stringify(candidateAddresses));
    
    //Admin.contracts.ElectionToken.new().then(function(instance) {
    Admin.contracts.ElectionToken.new(initialSupply, voterAddresses, candidateAddresses, startDate, endDate).then(function(instance) {
      console.log(instance.address);
    });
  }


  
};

$(document).ready(function () {
  $('#electionForm').on("submit",function(event) {
    event.preventDefault();
    Admin.init();
  });
});

//["0x6479f9B2e02C2f496fDA03A51aFe8B2c0f08bA18","0xCdF57e7B90b86653Fc6b4A7509400d9368157Ebc","0xB7a71e5ED14f2083E68AD968F98BE7a5FDe29903"]
//["0x90e5bbFEB8271E4E88815801Eb6eD3e2004fc74f","0x1661ED73CE3003eF32B3B51ADbba02254E55fb84"]