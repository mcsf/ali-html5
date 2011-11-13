$(document).ready(function() {

    loadHelp();

    /* Show help on click */
    $("#help").click(function() {
        if ($(".overlay").length > 0) return;
        createOverlay("login", "#help_overlay_template", helpOverlayFill);
    });

    /* Preferences option is not implemented */
    $("#prefs").click(notImplemented);

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

});
