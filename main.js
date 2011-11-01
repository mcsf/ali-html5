/* Globals */
var canvas;
var ctx;
var house;
var state = "object"; /* Initial state */


var objects = [
    {
        icon        : "chaves_casa_icon.png",
        description : "Chaves da casa",
        location    : "Secretária do quarto",
        room        : 0,
    },
    {
        icon        : "chaves_carro_icon.png",
        description : "Chaves do carro",
        location    : "Cómoda da despensa",
        room        : 2,
    },
];

var rooms = {
    0 : [ [2,129], [263,2], [263,223], [2,223] ],
    1 : [ [2,225], [154,225], [154,487], [2,487] ],
    2 : [ [157,225], [263,225], [263,350], [157,350] ],
    3 : [ [157,353], [263,353], [263,487], [157,487] ],
};


function updateState(newState) {
    state = newState;
    $("#body > div").hide();
    $("#body_" + state).show();
};


function incrSearchUpdate() {
    var input         = $("#incr_search").val().toLowerCase();
    var gray          = "rgba(211, 211, 211, 0.8)";
    var inactiveRooms = $.extend(true, {}, rooms);

    ctx.clearRect(0, 0, 270, 660);
    drawHouse();

    $("#itemlist > div").each(function () {
            if ($(this).find(".description").text().toLowerCase().match(input)) {
                $(this)
                    .animate({ opacity: 1 }, 500)
                    .addClass("selectable")
                    .show();

                var roomNo = $(this).find(".roomNo").val();
                delete inactiveRooms[roomNo];
            }
            else {
                $(this).hide();
            }
    });

    $.each(inactiveRooms, function(i,v) {
        fillRoom({ roomValue: v, style: gray });
    });

};

function incrSearchReset() {
    $("#incr_search").val("Buscar...").css("color", "#D3D3D3");

    $("#itemlist > div").each(function() {
        $(this)
            .animate({ opacity: 0.2 }, 500)
            .removeClass("selectable")
            .show();
    });

    ctx.clearRect(0, 0, 270, 660);
    drawHouse();
};

function incrSearchActivate() {
    var obj = $("#incr_search");
    if (obj.val() == "Buscar...") { // Ugly
        obj.val("").css("color", $("body").css("color"));
    }
};


function drawHouse() {
    ctx.drawImage(house, 0, 0);
    ctx.fillStyle = "rgba(200, 0, 0, 0.5)";
    ctx.fillRect (18, 167, 15, 15);
    ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
    ctx.fillRect (233, 249, 15, 15);
};

function fillRoom(params) {
    if (params.style) ctx.fillStyle = params.style;

    var room;
    if (params.roomNo) room = rooms[roomNo];
    else if (params.roomValue) room = params.roomValue;

    if (room) {
        ctx.beginPath();
        $.each(room, function(i,v) {
            if (i == 0) ctx.moveTo(v[0], v[1]);
            else        ctx.lineTo(v[0], v[1]);
        });
        ctx.fill();
    }
};


function createItem(attrs) {
    $("#itemlist").append($('<div class="item selectable"> <span class="icon"> <img src="' + attrs.icon + '"/> </span> <div class="text"> <span class="description">' + attrs.description + '</span> <span class="Location">' + attrs.location + '</span> <input type="hidden" class="roomNo" value="' + attrs.room + '"/> </div> </div>'));
};


function enterOverlay(attrs) {
    var o = $("#overlay_template").clone();

    o.find(".description").append("hello");

    o.appendTo("body").addClass("overlay").css("display", "inline");
    o.find(".close").click(function() { exitOverlay(); });

    $(".selectable").not("input").not("#state *").css("cursor", "auto");
    $("input.selectable").attr("disabled", "true");
    $(".overlay .selectable").css("cursor", "pointer");
};

function exitOverlay() {
    $(".selectable").css("cursor", "pointer");
    $("input.selectable").removeAttr("disabled");
    $(".overlay").remove();
};

$(document).ready(function() {

        var timeout = null;

        /* Canvas init */
        canvas  = $("canvas").get(0);
        ctx     = canvas.getContext("2d");
        $("canvas").attr("width", "270").attr("height", "660");

        house        = new Image();
        house.src    = "house.png";
        house.onload = function() { drawHouse(); };

        $.each(objects, function(i,v) {
            createItem(v);
        });

        updateState(state);
        $(".nav_button.selectable.enabled").first().addClass("selected");
        incrSearchReset($("#incr_search"));

        /**
         * Update header when selecting a menu item
         */
        $(".nav_button.selectable.enabled").click(function() {
            if ($(".overlay").length > 0) return;
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

        $("#incr_search").click(function() {
            if ($(".overlay").length > 0) return;
            incrSearchActivate();
        });

        $("#incr_search_clear").click(function() {
            if ($(".overlay").length > 0) return;
            incrSearchReset();
        });

        $("#itemlist > .item").click(function() {
            if ($(this).css("cursor") != "pointer") return;
                /*
            createOverlay({
                description : $(this).find(".description").text(),
                location    : $(this).find(".location").text(),
            });
            */
            enterOverlay();
        });
});
