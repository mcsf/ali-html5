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


/**
 * Very ugly.
 * Put everything in a single object once there's time.
 */

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

var roomColors = {
    0 : "#e6ea8c",
    1 : "#8ceab1",
    2 : "#c0ea8c",
    3 : "#978cea",
};


/**
 * Stocks
 */

var stocks = [
    {
        id          : 0,
        description : "Agrafos (caixa de 100)",
        units       : 4,
        picture     : "staples.png",
        icon        : "staples-icon.png",
        categories  : [ "escritório" ],
    },
    {
        id          : 1,
        description : "CDs graváveis",
        units       : 0,
        picture     : "cd.png",
        icon        : "cd-icon.png",
        categories  : [ "escritório" ],
    },
    {
        id          : 2,
        description : "Cargas de tinta para caneta",
        units       : 3,
        picture     : "pen-ink.png",
        icon        : "pen-ink-icon.png",
        categories  : [ "escritório" ],
    },
    {
        id          : 3,
        description : "Papel para impressora (maço de 50)",
        units       : 7,
        picture     : "paper.png",
        icon        : "paper-icon.png",
        categories  : [ "escritório" ],
    },
    {
        id          : 4,
        description : "Post-It &reg; (caixa de 200)",
        units       : 2,
        picture     : "post-it.png",
        icon        : "post-it-icon.png",
        categories  : [ "escritório" ],
    },
    {
        id          : 5,
        description : "Tinteiro para impressora",
        units       : 10,
        picture     : "cartridge.png",
        icon        : "cartridge-icon.png",
        categories  : [ "escritório" ],
    },
];


/**
 * State update
 */

function updateState(newState) {
    state = newState;
    $("#body > div").hide();
    $("#body_" + state).show();
};


/**
 * Utility function for incremental search
 */

function contains(obj, key) {
    var found = false;
    $.each(obj, function(k,v) {
        if (key == k) {
            found = true;
            return;
        }
    });
    return found;
};

/**
 * Incremental search for object list:
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

    $("#itemlist > div").each(function () {
        var attrs = objects[$(this).find(".id").val()];

        if (attrs.description.toLowerCase().match(input)
            && ($.isEmptyObject(labels)
                || contains(labels, attrs.room))) {

            $(this)
                .animate({ opacity: 1 }, 500)
                .addClass("selectable")
                .show();

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

    $.each(labels, function(i,v) {
        delete labels[i];
    });
    $("#labels").find("span").remove();
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
 * Incremental search for stocks list:
 * - update
 * - reset
 * - activate
 */

function stockSearchUpdate() {
    var input = $("#stock_search").val().toLowerCase();

    $("#stocklist > div").each(function () {
        var attrs = stocks[$(this).find(".id").val()];

        if (attrs.description.toLowerCase().match(input)) {
            $(this).show();
        }
        else {
            $(this).hide();
        }
    });
};

function stockSearchReset() {
    $("#stock_search").val("Buscar...").css("color", "#D3D3D3");
    $("#stocklist > div").each(function() {
        $(this).show();
    });
};

function stockSearchActivate() {
    var obj = $("#stock_search");
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
    if (!labels[i]) {
        labels[i] = true;

        var label = $(
            '<span class="label" style="background-color:'
            + roomColors[i] + ';">' + roomNames[i]
            + '&nbsp;<a>&nbsp;X</a><input type="hidden" value="'
            + i + '"/></span>'
        );

        label.find("a").click(function() {
            var id = $(this).parent().find("input").val();
            delete labels[id];
            $(this).parent().remove();
            if ($.isEmptyObject(labels))
                incrSearchReset();
            else {
                incrSearchActivate();
                incrSearchUpdate();
            }
        });

        $("#labels").append(label);
        incrSearchActivate();
        incrSearchUpdate();
    }
};

/**
 * Object list item creation
 */

function createItem(attrs) {
    $("#itemlist").append($('<div class="item selectable"> <span class="icon"> <img src="' + attrs.icon + '"/> </span> <div class="text"> <span class="description">' + attrs.description + '</span> <span class="Location">' + attrs.location + '</span> <input type="hidden" class="roomNo" value="' + attrs.room + '"/> <input type="hidden" class="id" value="' + attrs.id + '"/> </div> </div>').css("opacity", "0.2"));
};


/**
 * Stocks list creation
 */

function createStockItem(attrs) {
    $("#stocklist").append($('<div class="stock selectable"> <img src="' + attrs.icon + '"/> <span class="description">' + attrs.description + '</span>' + renderUnits(attrs.units) + '<input type="hidden" class="id" value="' + attrs.id + '"/></div>'));
};

/**
 * Helper function for stocks list creation
 */

function renderUnits(n) {
    var s = '<span class="units ';

    /* Additional classes */
    if (n == 0) s += "urgent ";
    else if (n < 4) s += "warning ";

    s += '">';

    /* Text */
    if (n == 0) s += "Esgotado";
    else s += "Em stock: " + n + " uds.";

    s += '</span>';

    return s;
};


/**
 * Overlay for Object
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
 * Overlay for Stocks
 */

function createStockOverlay(id) {
    var o = $("#stock_overlay_template").clone();
    var attrs = stocks[id];

    /* Fill out overlay with contents */
    o.find(".picture").attr("src", attrs.picture);
    o.find(".description").text(attrs.description);
    o.find(".units").append(renderUnits(attrs.units));
    $.each(attrs.categories, function(i,v) {
        o.find(".categories").append(
            '&nbsp;<span class="category selectable">'
            + v + '</span>\n');
    });

    /* Append it to page */
    o.appendTo("body").addClass("overlay").css("display", "inline");

    /* Clicking on its close button deletes it */
    o.find(".close").click(function() { deleteStockOverlay(); });

    /* Hitting "Escape" will do the same */
    $(document).keydown(deleteStockOverlayOnEscape);

    /* Disable every clickable element that's not part of the new overlay */
    $(".selectable").not("input").not("#state *").css("cursor", "auto");
    $("input.selectable").attr("disabled", "true");
    $(".overlay .selectable").css("cursor", "pointer");

    /* Clicking outside overlay deletes it */
    setTimeout(function(){
        $("*").bind('click', deleteStockOverlay);
        $(".overlay").add(".overlay *")
            .unbind('click', deleteStockOverlay)
            .click(function(event){
                event.stopPropagation();
            });
    }, 100);
};

function deleteStockOverlay() {
    $(".selectable").not("input").css("cursor", "pointer");
    $("input.selectable").removeAttr("disabled");
    $(".overlay").remove();
    $("*").unbind('click', deleteStockOverlay);
    $(document).unbind('keydown', deleteStockOverlayOnEscape);
};

function deleteStockOverlayOnEscape(event) {
    if (event.which == 27) deleteStockOverlay();
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

        $.each(stocks, function(i,v) {
            createStockItem(v);
        });

        updateState(state);
        $(".nav_button.selectable.enabled").first().addClass("selected");
        incrSearchReset();
        stockSearchReset();

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

        /**
         * Procurar > Objecto > Overlay
         */

        $("#itemlist > .item").click(function() {
            if ($(this).css("cursor") != "pointer") return;

            var id = $(this).find(".id").val();
            createOverlay(id);
        });


        /**
         * Stocks > Incremental search
         */

        $("#stock_search").keydown(function() {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(function(){ stockSearchUpdate(); }, 100);
        });

        $("#stock_search").focus(function() {
            if ($(".overlay").length > 0) return;
            stockSearchActivate();
        });

        $("#stock_search_clear").click(function() {
            if ($(".overlay").length > 0) return;
            stockSearchReset();
        });

        /**
         * Stocks > Escritório > Overlay
         */

        $("#stocklist > .stock").click(function() {
            if ($(this).css("cursor") != "pointer") return;

            var id = $(this).find(".id").val();
            createStockOverlay(id);
        });
});
