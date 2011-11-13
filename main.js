/**
 * Globals
 */

var canvas;
var ctx;
var kinetic;
var house;

var labels = {}; /* Initial filters */
var state = "object"; /* Initial state */

var stateNames = {
    "object"   : "Objecto",
    "office"   : "Escritório",
    "office_u" : "Artigos esgotados",
    "office_w" : "Artigos em fim de stock",
};

var stocksLocate;

/**
 * Debug
 */

var debug_stock_filter = false;

/**
 * Helper functions
 */

function switchState(newState) {
    var name;
    state = newState;

    /* Update title */
    $("#state_text").html(stateNames[state]);

    /* Hide all other screens */
    $("#body > div").hide();

    /* Decorate corresponding menu item */
    var item = $("#nav_" + state);
    item.siblings().removeClass("selected");
    item.addClass("selected");

    /* Custom stuff for special states */
    switch (state) {
        case "office_u":
        case "office_w":
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
        stocks.sort(objectCmp);
        $.each(stocks, function(i,v) {
            v.id = i;
            v.stocks = true;
            createStockItem(v);
        });
        objects.push.apply(objects, stocks);
        objects.sort(objectCmp);
        $.each(objects, function(i,v) { v.id = i; createItem(v); });

        /* Set to initial state */
        switchState(state);
        $(".nav_button.selectable.enabled").first().addClass("selected");
        incrSearchReset();
        stockSearchReset();

        /* Update header when selecting a menu item */
        $(".nav_button.selectable.enabled").click(function() {
            if ($(".overlay").length > 0) return;

            /* Show title and contents for new state */
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
