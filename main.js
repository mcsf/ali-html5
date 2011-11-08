/**
 * Globals
 */

var canvas;
var ctx;
var kinetic;
var house;

var labels = {}; /* Initial filters */
var state = "object"; /* Initial state */


/**
 * Helper functions
 */

function switchState(newState) {
    state = newState;
    $("#body > div").hide();
    $("#body_" + state).show();
};


/**
 * Main
 */

$(document).ready(function() {

        var timeout = null;

        /* Init for canvas stuff */
        canvas       = $("canvas").get(0);
        ctx          = canvas.getContext("2d");
        kinetic      = new Kinetic("house");
        kinetic.setStage(canvasEventListener);
        $("canvas").attr("width", "270").attr("height", "660");
        house        = new Image();
        house.src    = "house.png";
        house.onload = drawHouse;

        /* Generate Object and Stock lists */
        $.each(objects, function(i,v) { createItem(v); });
        $.each(stocks, function(i,v) { createStockItem(v); });

        /* Set to initial state */
        switchState(state);
        $(".nav_button.selectable.enabled").first().addClass("selected");
        incrSearchReset();
        stockSearchReset();

        /* Update header when selecting a menu item */
        $(".nav_button.selectable.enabled").click(function() {
            if ($(".overlay").length > 0) return;

            /* Decorate selected menu item */
            $(this).siblings().removeClass("selected");
            $(this).addClass("selected");

            /* Update header title for new state */
            $("#state_text").html($(this).find(".text").html());

            /* Show contents for new state */
            switchState($(this).attr("id").substr(4));
        });


        /* Mouse actions for Object search */

        /* Incremental search upon typing */
        $("#incr_search").keydown(function() {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(function(){ incrSearchUpdate(); }, 100);
        });

        /* Activate search bar upon focus */
        $("#incr_search").focus(function() {
            if ($(".overlay").length > 0) return;
            incrSearchActivate();
        });

        /* Reset search state upon clicking on clear button */
        $("#incr_search_clear").click(function() {
            if ($(".overlay").length > 0) return;
            incrSearchReset();
        });

        /* Show object details upon click */
        $("#itemlist > .item").click(function() {
            if ($(this).css("cursor") != "pointer") return;
            var id = $(this).find(".id").val();
            createOverlay(id, itemOverlayFill);
        });


        /* Mouse actions for Stock search */

        /* Incremental search upon typing */
        $("#stock_search").keydown(function() {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(function(){ stockSearchUpdate(); }, 100);
        });

        /* Activate search bar upon focus */
        $("#stock_search").focus(function() {
            if ($(".overlay").length > 0) return;
            stockSearchActivate();
        });

        /* Reset search state upon clicking on clear button */
        $("#stock_search_clear").click(function() {
            if ($(".overlay").length > 0) return;
            stockSearchReset();
        });

        /* Show stock details upon click */
        $("#stocklist > .stock").click(function() {
            if ($(this).css("cursor") != "pointer") return;
            var id = $(this).find(".id").val();
            createOverlay(id, stockOverlayFill);
        });
});
