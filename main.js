/* Globals */
var canvas;
var ctx;
var state = "object"; /* Initial state */

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


function drawHouse() {

    var img = new Image();
    img.src = "house.png";
    img.onload = function() {
        ctx.drawImage(img, 0, 0);

        ctx.fillStyle = "rgba(200, 0, 0, 0.5)";
        ctx.fillRect (9, 186, 15, 15);

        ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
        ctx.fillRect (256, 274, 15, 15);
    };

};


$(document).ready(function() {

        var timeout = null;

        /* Canvas init */
        canvas  = $("canvas").get(0);
        ctx     = canvas.getContext("2d");
        $("canvas").attr("width", "300").attr("height", "660");

        drawHouse();

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
