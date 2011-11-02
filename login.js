$(document).ready(function() {

    $(".user").add(".new").click(function() {
	$("#login .prompt").remove();

	$(this).after(
	    $("#hidden > .prompt").clone().fadeIn("slow"));

	$("input:text").focus().keydown(function(e) {
	    var pw = $('<input type="password" />');
	    $(this).replaceWith(pw);
	    pw.focus().keypress(function(e) {
		if (e.which == 13)
		    window.location = "main.html";
	    });

	});

    });

    /*
    $(document).keypress(function(e) {
	console.log("Keycode: " + e.which);
    });
    */

});
