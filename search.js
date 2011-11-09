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
                .show();

            var roomNo = attrs.room;
            delete inactiveRooms[roomNo];

            if (!attrs.imgObj) {
                attrs.imgObj     = new Image();
                attrs.imgObj.src = "objects/" + attrs.icon;
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


