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
 * Debug
 */

var debug_stock_filter = false;

/**
 * Helper functions
 */

function switchState(newState) {
    state = newState;
    $("#body > div").hide();

    switch (state) {
        case "office_u": // _u for urgent
        case "office_w": // _w for warning
            $("#body_office").show();
            stockSearchUpdate();
            break;
        case "office":
            stockSearchUpdate();
        default:
            $("#body_" + state).show();
    }
};


function objectCmp(a,b) {
    if (a.description < b.description) return -1;
    else if (a.description > b.description) return 1;
    else return 0;
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
        house.src    = "layout/house.png";
        house.onload = drawHouse;

        /* Generate Object and Stock lists */
        //objects.push.apply(objects, stocks);
        objects.sort(objectCmp);
        stocks.sort(objectCmp);
        $.each(objects, function(i,v) { v.id = i; createItem(v); });
        $.each(stocks, function(i,v) { v.id = i; createStockItem(v); });

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
            var title;
            if ($(this).find("input:hidden").val())
                title = $(this).find("input:hidden").val();
            else
                title = $(this).find(".text").html();
            $("#state_text").html(title);

            /* Show contents for new state */
            switchState($(this).attr("id").substr(4));
        });

        /* Show "Not Implemented" message for disabled menu items */
        $(".nav_button.selectable").not(".enabled").click(notImplemented);

        /* Load help strings */
        loadHelp();

        /* Show help on click */
        $("#help").click(function() {
            if ($(".overlay").length > 0) return;
            createOverlay(state, "#help_overlay_template", helpOverlayFill);
        });

        /* Return to login screen */
        $("#logout").click(function() {
            window.location = "login.html";
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
            if ($(".overlay").length > 0) return;
            if ($(this).css("cursor") != "pointer") return;
            var id = $(this).find(".id").val();
            createOverlay(id, "#overlay_template", itemOverlayFill);
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
            createOverlay(id, "#stock_overlay_template", stockOverlayFill);
        });

        /* DEBUG */

        $("#debug_stock_filter").click(function() {
            debug_stock_filter = !debug_stock_filter;
            stockSearchUpdate();
        });

        $("#debug_move_0").click(debugMove0);
        $("#debug_move_1").click(debugMove1);

});
