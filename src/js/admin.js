// find elements
$(document).ready(function () {

    $("button").on("click", function() {
    let val = $(this).prev("input").val();
        $("#output").text(val);
    });
    });