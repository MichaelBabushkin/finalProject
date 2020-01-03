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
  
  // handle click 
  $(".menu button").on("click", function(){
      let id = $(this).attr("id");
    switch (id) {
    case "1":
          let input1=$(this).prev("input").val();
                  
          alert("This is first: " + input1);
          break;
      case "2":
        let input2=$(this).prev("input").val();
          alert("This is second: " + input2);
          break;
      case "3":
        let input3=$(this).prev("input").val();
          alert("This is third: " + input3);
        break;
        case "4":
          let input4=$(this).prev("input").val();
          alert("This is first: " + input4);
          break;
        case "5":
          let input5=$(this).prev("input").val();
          alert("This is first: " + input5);
        //   Admin.contracts.ElectionToken.deployed().then(function(instance) {
        //     instance.increaseSupply(param1,{}, {
        //             //    arguments: [arg],
        //               fromBlock: 0, 
        //               toBlock: 'latest'
        //             })

        // //    electionInstance = instance;
        // //   //  return electionInstance.increaseSupply();
        // //     alert("Ninja: "+ electionInstance.increaseSupply(param1,{}, {}).totalSupply);
        //   });
          break;
          case "7":
            // let input=$(this).prev("input").val().split(",");
            // let input=$(this).prev("input").val();
            // let param1=input[0];
           
            // Admin.contracts.ELECTIONTOKEN.deployed().then(function(instance) {
            //   electionInstance = instance;
            //   debugger;
            //   // return electionInstance.candidatesCount();
            //   alert("Ninja: "|+" "+  electionInstance.transferAndAddVoterAddress(param1) );
            // });
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

    $("button").on("click","submit", function() {
    let val = $(this).prev("input").val();
        $("#output").text(val);
    });
    });