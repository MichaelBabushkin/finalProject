/*jshint esversion: 6 */
//bar


var ringer = {
  //countdown_to: "10/31/2014",
  countdown_to: "01/17/2020",
  rings: {
    
    'HOURS': {
      s: 3600000, // mseconds per hour,
      max: 24
    },
    'MINUTES': {
      s: 60000, // mseconds per minute
      max: 60
    },
    'SECONDS': {
      s: 1000,
      max: 60
    }
    
   },
  r_count: 5,
  r_spacing: 10, // px
  r_size: 100, // px
  r_thickness: 2, // px
  update_interval: 11, // ms
 
  init: function(){
   
    $r = ringer;
    $r.cvs = document.createElement('canvas'); 
    
    $r.size = { 
      w: ($r.r_size + $r.r_thickness) * $r.r_count + ($r.r_spacing*($r.r_count-1)), 
      h: ($r.r_size + $r.r_thickness) 
    };
 
    $r.cvs.setAttribute('width',$r.size.w);           
    $r.cvs.setAttribute('height',$r.size.h);
    $r.ctx = $r.cvs.getContext('2d');
    $(document.body).append($r.cvs);
    $r.cvs = $($r.cvs);    
    $r.ctx.textAlign = 'center';
    $r.ctx.position = 'top';
    $r.actual_size = $r.r_size + $r.r_thickness;
    $r.countdown_to_time = new Date($r.countdown_to).getTime();
    $r.cvs.css({ width: $r.size.w+"px", height: $r.size.h+"px" });
    $r.go();
  },
  ctx: null,
  go: function(){
    var idx=0;
    
    $r.time = (new Date().getTime()) - $r.countdown_to_time;

    for(var r_key in $r.rings) $r.unit(idx++,r_key,$r.rings[r_key]);      
    
    setTimeout($r.go,$r.update_interval);
  },
  unit: function(idx,label,ring) {
    var x,y, value, ring_secs = ring.s;
    value = parseFloat($r.time/ring_secs);
    $r.time-=Math.round(parseInt(value)) * ring_secs;
    value = Math.abs(value);
    
    x = ($r.r_size*.5 + $r.r_thickness*.5);
    x +=+(idx*($r.r_size+$r.r_spacing+$r.r_thickness));
    y = $r.r_size*.5;
    y += $r.r_thickness*.5;

    
    // calculate arc end angle
    var degrees = 360-(value / ring.max) * 360.0;
    var endAngle = degrees * (Math.PI / 180);
    
    $r.ctx.save();

    $r.ctx.translate(x,y);
    $r.ctx.clearRect($r.actual_size*-0.5,$r.actual_size*-0.5,$r.actual_size,$r.actual_size);

    // first circle
    $r.ctx.strokeStyle = "rgba(128,128,128,0.2)";
    $r.ctx.beginPath();
    $r.ctx.arc(0,0,$r.r_size/2,0,2 * Math.PI, 2);
    $r.ctx.lineWidth =$r.r_thickness;
    $r.ctx.stroke();
   
    // second circle
    $r.ctx.strokeStyle = "rgba(253, 128, 1, 0.9)";
    $r.ctx.beginPath();
    $r.ctx.arc(0,0,$r.r_size/2,0,endAngle, 1);
    $r.ctx.lineWidth =$r.r_thickness;
    $r.ctx.stroke();
    
    // label
    $r.ctx.fillStyle = "#4eb5f1";
   
    $r.ctx.font = '12px Helvetica';
    $r.ctx.fillText(label, 0, 23);
    $r.ctx.fillText(label, 0, 23);   
    
    $r.ctx.font = 'bold 40px Helvetica';
    $r.ctx.fillText(Math.floor(value), 0, 10);
    
    $r.ctx.restore();
  }
  
};

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

      if( account.toLowerCase() ==="0x3EbBc360ba6F6762316e55972A13E032634871e8".toLowerCase()) {
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
      //window.location.assign('candidates.html');
      window.location.assign('results.html');
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
      var candidatesLayout = $('#candidatesLayOut');
      candidatesLayout.empty();


      for (var i = 0; i < candidatesCount; i++) {
        electionInstance.candidates(i).then(function(candidate) {
          var id = candidate[0];
          var candidateName = candidate[1];
          var candidateDescription = candidate[2];
          var candidateAddress = candidate[3];
          var candidateImgLink = candidate[4];
          var candidateExist = candidate[5];

          electionInstance.balanceOf(candidateAddress).then(function(voteCount){
            if(candidateExist){
              // create article element and set it's class attribute
              var candidateArticleInLayOut = document.createElement("article");//parent
              // create img element and set it's id attribute +
              var candidateImgInLayOut = document.createElement("img");
              var imgID = "img" + id;
              // var candidatePElementInLayOut =  candidateDescription ;
              let wrapper = document.createElement("div");//parent
              var candidatePElementInLayOut =  document.createElement("p");
              $(candidatePElementInLayOut).text(candidateDescription);
              candidateImgInLayOut.setAttribute("id", imgID);//child
              // set the value of the src attribute of the image
              candidateImgInLayOut.setAttribute("src", candidateImgLink);

              candidateArticleInLayOut.setAttribute("class", "col-md-4 article-intro");
              $(wrapper).attr("class","wrapper");
              wrapper.append(candidateImgInLayOut);
              wrapper.append(candidatePElementInLayOut);
              candidateArticleInLayOut.append(wrapper);

              candidatesLayout.append(candidateArticleInLayOut);
              
              // Render candidate Result
              var candidateTemplate = "<tr><th>" + (parseInt(id)+1) + "</th><td>" + candidateName + "</td><td>" +  voteCount + "</td></tr>";
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
  ringer.init();
    App.init();
  });

/*function checkContractAddress() {
  App.init();
}*/

$(document).ready(function(){
  // Add smooth scrolling to all links
  $("a").on('click', function(event) {
    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();
      // Store hash
      var hash = this.hash;
      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){  
        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });
});
// var ctxB = document.getElementById("barChart").getContext('2d');
// var myBarChart = new Chart(ctxB, {
// type: 'bar',
// data: {
// labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
// datasets: [{
// label: '# of Votes',
// data: [12, 19, 3, 5, 2, 3],
// backgroundColor: [
// 'rgba(255, 99, 132, 0.2)',
// 'rgba(54, 162, 235, 0.2)',
// 'rgba(255, 206, 86, 0.2)',
// 'rgba(75, 192, 192, 0.2)',
// 'rgba(153, 102, 255, 0.2)',
// 'rgba(255, 159, 64, 0.2)'
// ],
// borderColor: [
// 'rgba(255,99,132,1)',
// 'rgba(54, 162, 235, 1)',
// 'rgba(255, 206, 86, 1)',
// 'rgba(75, 192, 192, 1)',
// 'rgba(153, 102, 255, 1)',
// 'rgba(255, 159, 64, 1)'
// ],
// borderWidth: 1
// }]
// },
// options: {
// scales: {
// yAxes: [{
// ticks: {
// beginAtZero: true
// }
// }]
// }
// }
// });