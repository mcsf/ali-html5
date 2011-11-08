function deleteOverlay() {
    $(".selectable").not("input").css("cursor", "pointer");
    $("input.selectable").removeAttr("disabled");
    $(".overlay").remove();
    $("*").unbind('click', deleteOverlay);
    $(document).unbind('keydown', deleteOverlayOnEscape);
};

function deleteOverlayOnEscape(event) {
    if (event.which == 27) deleteOverlay();
};
