var Candidates = {

    init: function() {
        window.ethereum.enable();//saved the world, but doesn't define it self any more :D
        Candidates.candidatesUi();
        
      },


candidatesUi:function () {
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
}
$(document).ready(function() {
    Candidates.init();
    
  });
