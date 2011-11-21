function createOverlay(id, template, fillFn) {
    var o = $(template).clone();

    /* Fill it */
    fillFn(o, id);

    /* Append it to page */
    o.appendTo("body").addClass("overlay").css("display", "inline");

    /* Clicking on its close button deletes it */
    o.find(".close").click(function(e) { deleteOverlay(e); });

    /* Hitting "Escape" will do the same */
    $(document).keydown(deleteOverlayOnEscape);

    /* Disable every clickable element that's not part of the new overlay */
    $(".selectable").not("input").not("#state *").css("cursor", "auto");
    $("input.selectable").attr("disabled", "true");
    $(".overlay .selectable").css("cursor", "pointer");

    /* Clicking outside overlay deletes it */
    setTimeout(function(){
        $("*").bind('click', deleteOverlay);
        $(".overlay").add(".overlay *")
            .unbind('click', deleteOverlay)
            .click(function(event){
                event.stopPropagation();
            });
    }, 100);
};

function deleteOverlay(e) {
    if (e) e.stopPropagation();
    $(".selectable").not("input").css("cursor", "pointer");
    $("input.selectable").removeAttr("disabled");
    $(".overlay").remove();
    $("*").unbind('click', deleteOverlay);
    $(document).unbind('keydown', deleteOverlayOnEscape);
};

function deleteOverlayOnEscape(event) {
    if (event.which == 27) deleteOverlay(event);
};

function notify(msg) {
    var o = $('<div class="notifier"><p></p></div>');

    $("#nav_and_body").append(o);

    if ($(".overlay").length > 0) o.addClass("right");
    o.find("p").text(msg);
    o.css("visibility", "visible").show().fadeOut(1000);

    setTimeout(function() { o.remove(); }, 5000);
};
