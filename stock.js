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
 * Stocks list creation
 */

function createStockItem(attrs) {
    $("#stocklist").append($('<div class="stock selectable"> <img src="' + attrs.icon + '"/> <span class="description">' + attrs.description + '</span>' + renderUnits(attrs.units) + '<input type="hidden" class="id" value="' + attrs.id + '"/></div>'));
};


/**
 * Overlay for Stocks
 */

function createStockOverlay(id) {
    var o = $("#stock_overlay_template").clone();
    var attrs = stocks[id];

    /* Fill out overlay with contents */
    o.find(".picture").attr("src", attrs.picture);
    o.find(".description").html(attrs.description);
    o.find(".units").append(renderUnits(attrs.units));
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
