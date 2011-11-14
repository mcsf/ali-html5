function debugToggle() {
    var t = $(this).text();
    $("#debug").toggleClass("hidden");
    $(this).text(t == "mostrar" ? "esconder" : "mostrar");
};

/**
 * Move:
 * - Object: "Canivete"
 * - Destination : "Mesa da cozinha"
 */
function debugMove0() {
    $.each(objects, function(i,v) {
	if (v.description != "Canivete") return;
	v.location  = "Mesa da cozinha";
	v.coords    = [ 200, 365 ];
	v.room	    = 3;

	$("#itemlist > .item").each(function(i) {
	    if ($(this).find(".description").text() == "Canivete") {
		$(this).find(".location").text("Mesa da cozinha");
	    }
	});
    });
    incrSearchUpdate();
};


/**
 * Move:
 * - Object: "Canivete"
 * - Destination : "Mesa da sala"
 */
function debugMove1() {
    $.each(objects, function(i,v) {
	if (v.description != "Canivete") return;
	v.location  = "Mesa da sala";
	v.coords    = [ 28, 260 ];
	v.room	    = 1;

	$("#itemlist > .item").each(function(i) {
	    if ($(this).find(".description").text() == "Canivete") {
		$(this).find(".location").text("Mesa da sala");
	    }
	});
    });
    incrSearchUpdate();
};
