// find elements
var Admin = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    hasVoted: false,
  
    init: function() {
      window.ethereum.enable();//saved the world, but doesn't define it self any more :D
      Admin.adminUi();
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
      $.getJSON("VTC.json", function(vtc) {
        // Instantiate a new truffle contract from the artifact
        Admin.contracts.VTC = TruffleContract(vtc);
        // Connect provider to interact with contract
        Admin.contracts.VTC.setProvider(Admin.web3Provider);
  
        Admin.listenForEvents();
  
        return Admin.render();
      });
    },
  
    // Listen for events emitted from the contract
    listenForEvents: function() {
      Admin.contracts.VTC.deployed().then(function(instance) {
        // Restart Chrome if you are unable to receive this event
        // This is a known issue with Metamask
        // https://github.com/MetaMask/metamask-extension/issues/2393
        instance.increaseSupply({}, {
          fromBlock: 0,
          toBlock: 'latest'
        }).watch(function(error, event) {
          console.log("event triggered", event);
          // Reload when a new vote is recorded
          Admin.render();
        });
      });
    },
    

    adminUi:function () {
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
          let param1=input;
          //Admin.contracts.VTC.deployed().then(function(instance) {
           // electionInstance = instance;
          //  debugger;
            // return electionInstance.candidatesCount();
            alert("Ninja: "+  param1 );
        //   });
          break;
        case "6":
          alert("This is third: " + id);
          break;
          case "7":
            // let input=$(this).prev("input").val().split(",");
            // let input=$(this).prev("input").val();
            // let param1=input[0];
           
            
            // Admin.contracts.VTC.deployed().then(function(instance) {
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
  
  $(document).ready(function() {
      Admin.init();
    });




$(document).ready(function () {

    $("button").on("click", function() {
    let val = $(this).prev("input").val();
        $("#output").text(val);
    });
    });