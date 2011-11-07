/**
 * Globals
 */

var canvas;
var ctx;
var kinetic;
var house;
var state = "object"; /* Initial state */


/**
 * Static data:
 * - objects
 * - rooms
 */

var objects = [
    {
        id          : 0,
        icon        : "chaves_casa_icon.png",
        description : "Chaves da casa",
        location    : "Secretária do quarto",
        coords      : [ 5, 167 ],
        room        : 0,
        info        : "Arrumado a 23 de Outubro",
        picture     : "chaves_casa.png",
        categories  : [ "chaves" ],
    },
    {
        id          : 1,
        icon        : "chaves_carro_icon.png",
        description : "Chaves do carro",
        location    : "Cómoda da despensa",
        coords      : [ 233, 249 ],
        room        : 2,
        info        : "Arrumado a 10 de Outubro",
        picture     : "chaves_carro.png",
        categories  : [ "chaves" ],
    },
    {
        id          : 2,
        icon        : "canivete-icon.png",
        description : "Canivete",
        location    : "Mesa da sala",
        coords      : [ 28, 260 ],
        room        : 1,
        info        : "Arrumado a 9 de Outubro",
        picture     : "canivete.png",
        categories  : [ "ferramentas", "campismo" ],
    },
    {
        id          : 3,
        icon        : "zarathustra-icon.png",
        description : "Nietzsche, Also Sprach Zarathustra",
        location    : "Chão da sala",
        coords      : [ 38, 365 ],
        room        : 1,
        info        : "Arrumado a 9 de Outubro",
        picture     : "zarathustra.png",
        categories  : [ "livros" ],
    },
    {
        id          : 4,
        icon        : "question-icon.png",
        description : "Objecto não identificado",
        location    : "Chão da sala",
        coords      : [ 15, 410 ],
        room        : 1,
        info        : "Arrumado a 9 de Outubro",
        picture     : "question.png",
        categories  : [ "livros" ],
    },
];

var rooms = {
    0 : [ [2,129], [263,2], [263,223], [2,223] ],
    1 : [ [2,225], [154,225], [154,487], [2,487] ],
    2 : [ [157,225], [263,225], [263,350], [157,350] ],
    3 : [ [157,353], [263,353], [263,487], [157,487] ],
};

var roomNames = {
    0 : "Quarto",
    1 : "Sala",
    2 : "Despensa",
    3 : "Cozinha",
};


/**
 * State update
 */

function updateState(newState) {
    state = newState;
    $("#body > div").hide();
    $("#body_" + state).show();
};


/**
 * Incremental search:
 * - update
 * - reset
 * - activate
 */

function incrSearchUpdate() {
    var input         = $("#incr_search").val().toLowerCase();
    var gray          = "rgba(211, 211, 211, 0.8)";
    var inactiveRooms = $.extend(true, {}, rooms);

    ctx.clearRect(0, 0, 270, 660);
    drawHouse();
    ctx.fillStyle = "rgba(200, 0, 0, 0.5)";

    $("#itemlist > div").each(function () {
            if ($(this).find(".description").text().toLowerCase().match(input)) {
                $(this)
                    .animate({ opacity: 1 }, 500)
                    .addClass("selectable")
                    .show();

                var attrs = objects[$(this).find(".id").val()];

                var roomNo = attrs.room;
                delete inactiveRooms[roomNo];

                if (!attrs.imgObj) {
                    attrs.imgObj     = new Image();
                    attrs.imgObj.src = attrs.icon;
                }
                ctx.drawImage(attrs.imgObj, attrs.coords[0], attrs.coords[1],
                    45, 45);
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


/**
 * Canvas manipulation
 * - draw house
 * - fill rooms
 */

function drawHouse() {
    ctx.drawImage(house, 0, 0);
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

function canvasEventListener() {
    var context = kinetic.getContext();

    $.each(rooms, function(i,room) {
        kinetic.beginRegion();
        context.beginPath();
        $.each(room, function(i,v) {
            if (i == 0) context.moveTo(v[0], v[1]);
            else        context.lineTo(v[0], v[1]);
        });
        context.closePath();
        kinetic.addRegionEventListener('mousedown', function() {
            roomClickHandler(i);
        });
        kinetic.closeRegion();
    });
};

function roomClickHandler(i) {
    console.log("Room no. " + i);
};

/**
 * Object list item creation
 */

function createItem(attrs) {
    $("#itemlist").append($('<div class="item selectable"> <span class="icon"> <img src="' + attrs.icon + '"/> </span> <div class="text"> <span class="description">' + attrs.description + '</span> <span class="Location">' + attrs.location + '</span> <input type="hidden" class="roomNo" value="' + attrs.room + '"/> <input type="hidden" class="id" value="' + attrs.id + '"/> </div> </div>').css("opacity", "0.2"));
};


/**
 * Overlay creation and deletion
 */

function createOverlay(id) {
    var o = $("#overlay_template").clone();
    var attrs = objects[id];

    /* Fill out overlay with contents */
    o.find(".picture").attr("src", attrs.picture);
    o.find(".description").text(attrs.description);
    o.find(".location").append(attrs.location);
    o.find(".info").text(attrs.info);
    $.each(attrs.categories, function(i,v) {
        o.find(".categories").append(
            '&nbsp;<span class="category selectable">'
            + v + '</span>\n');
    });

    /* Append it to page */
    o.appendTo("body").addClass("overlay").css("display", "inline");

    /* Clicking on its close button deletes it */
    o.find(".close").click(function() { deleteOverlay(); });

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

/**
 * Main
 */

$(document).ready(function() {

        var timeout = null;

        /* Canvas init */
        canvas  = $("canvas").get(0);
        ctx     = canvas.getContext("2d");
        kinetic = new Kinetic("house");
        kinetic.setStage(canvasEventListener);

        $("canvas").attr("width", "270").attr("height", "660");

        house        = new Image();
        house.src    = "house.png";
        house.onload = drawHouse;

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

        $("#incr_search").focus(function() {
            if ($(".overlay").length > 0) return;
            incrSearchActivate();
        });

        $("#incr_search_clear").click(function() {
            if ($(".overlay").length > 0) return;
            incrSearchReset();
        });

        $("#itemlist > .item").click(function() {
            if ($(this).css("cursor") != "pointer") return;

            var id = $(this).find(".id").val();
            createOverlay(id);
        });
});
