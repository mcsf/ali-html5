/* Globals */
var canvas;
var ctx;
var state = "object"; /* Initial state */


var objects = [
    {
        icon        : "chaves_casa_icon.png",
        description : "Chaves da casa",
        location    : "Secretária do quarto",
    },
    {
        icon        : "chaves_carro_icon.png",
        description : "Chaves do carro",
        location    : "Cómoda da despensa",
    },
];


function updateState(newState) {
    state = newState;
    $("#body > div").hide();
    $("#body_" + state).show();
};


function incrSearchUpdate() {
    var input = $("#incr_search").val().toLowerCase();

    $("#itemlist > div").each(function () {
            //if ($(this).text().toLowerCase().match(input)) {
            if ($(this).find(".description").text().toLowerCase().match(input)) {
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

    $("#itemlist > div").each(function() {
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
        ctx.fillRect (18, 167, 15, 15);
        ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
        ctx.fillRect (233, 249, 15, 15);
    };
};


function createItem(attrs) {
    var item = $('<div class="item"> <span class="icon"> <img src="' + attrs.icon + '"/> </span> <div class="text"> <span class="description">' + attrs.description + '</span> <span class="Location">' + attrs.location + '</span> </div> </div>');
    $("#itemlist").append(item);
};


$(document).ready(function() {

        var timeout = null;

        /* Canvas init */
        canvas  = $("canvas").get(0);
        ctx     = canvas.getContext("2d");
        $("canvas").attr("width", "270").attr("height", "660");

        drawHouse();

        $.each(objects, function(i,v) {
            createItem(v);
        });

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
