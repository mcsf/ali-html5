/* Initial state */
var state = "object";

function updateState(newState) {
    state = newState;
    $("#body > div").hide();
    $("#body_" + state).show();
};

function incrSearchUpdate() {
    var input = $("#incr_search").val().toLowerCase();

    $("#list > li").each(function () {
            if ($(this).text().toLowerCase().match(input)) {
                $(this).animate({ opacity: 1 }, 500);
                $(this).show();
            }
            else {
                $(this).hide();
            }
    });
};

function incrSearchReset() {
    var obj = $("#incr_search");
    obj.val("Buscar...");
    obj.css("color", "#D3D3D3");

    $("#list > li").each(function() {
        $(this).animate({ opacity: 0.2 }, 500);
        $(this).show();
    });
};

function incrSearchActivate() {
    var obj = $("#incr_search");
    obj.val("");
    obj.css("color", $("body").css("color"));
};


$(document).ready(function() {

        var timeout = null;

        updateState(state);
        incrSearchReset($("#incr_search"));

        /**
         * Update header when selecting a menu item
         */
        $(".nav_button.selectable").click(function() {
            /* Decorate selected menu item */
            $(this).siblings().removeClass("selected");
            $(this).addClass("selected");

            /* Update header title for new state */
            $("#state_text").html($(this).find(".text").html());

            /* Show contents for new state */
            updateState($(this).get(0).id.substr(4));
        });

        /**
         * Procurar > Objecto > Incremental search
         */

        $("#incr_search").keydown(function() {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(function(){ incrSearchUpdate(); }, 100);
        });

        $("#incr_search").click(function() { incrSearchActivate(); });
        $("#incr_search_clear").click(function() { incrSearchReset(); });
});
