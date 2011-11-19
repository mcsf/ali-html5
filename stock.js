/**
 * Stocks
 */

var stocks = [
    {
        description : "Agrafos (caixa de 100)",
        units       : 4,
        picture     : "staples.png",
        icon        : "staples-icon.png",
        categories  : [ "escritório" ],
        locations   : [
            {
                coords   : [ 180, 270 ],
                location : "Chão da despensa",
                room     : 2,
                units    : 1,
            },
            {
                coords   : [ 220, 290 ],
                location : "Cómoda da despensa",
                room     : 2,
                units    : 3,
            },
        ],
    },
    {
        description : "CDs graváveis",
        units       : 0,
        picture     : "cd.png",
        icon        : "cd-icon.png",
        categories  : [ "escritório", "digital" ],
        locations   : [],
    },
    {
        description : "Cargas de tinta para caneta",
        units       : 3,
        picture     : "pen-ink.png",
        icon        : "pen-ink-icon.png",
        categories  : [ "escritório" ],
        locations   : [
            {
                coords   : [ 180, 270 ],
                location : "Chão da despensa",
                room     : 2,
                units    : 3,
            },
        ],
    },
    {
        description : "Papel para impressora (maço de 50)",
        units       : 7,
        picture     : "paper.png",
        icon        : "paper-icon.png",
        categories  : [ "escritório", "impressora" ],
        locations   : [
            {
                coords   : [ 180, 270 ],
                location : "Chão da despensa",
                room     : 2,
                units    : 7,
            },
        ],
    },
    {
        description : "Post-It &reg; (caixa de 200)",
        units       : 2,
        picture     : "post-it.png",
        icon        : "post-it-icon.png",
        categories  : [ "escritório" ],
        locations   : [
            {
                coords   : [ 180, 270 ],
                location : "Chão da despensa",
                room     : 2,
                units    : 2,
            },
        ],
    },
    {
        description : "Tinteiro para impressora",
        units       : 10,
        picture     : "cartridge.png",
        icon        : "cartridge-icon.png",
        categories  : [ "escritório", "impressora" ],
        locations   : [
            {
                coords   : [ 180, 270 ],
                location : "Chão da despensa",
                room     : 2,
                units    : 10,
            },
        ],
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


/* Stock list item generation */
function createStockItem(attrs) {
    $("#stocklist").append($('<div class="stock selectable"> <img src="objects/' + attrs.icon + '"/> <span class="description">' + attrs.description + '</span>' + renderUnits(attrs.units) + '<input type="hidden" class="id" value="' + attrs.id + '"/></div>'));
};


/* Filling function for overlay generation */
function stockOverlayFill(o, id) {
    var attrs = stocks[id];
    o.find(".picture").attr("src", "objects/" + attrs.picture);
    o.find(".description").html(attrs.description);
    o.find(".units").append(renderUnits(attrs.units));
    $.each(attrs.categories, function(i,v) {
        o.find(".categories").append(
            '&nbsp;<span class="category selectable">'
            + v + '</span>\n');
    });
    o.find("input:checkbox")
        .click(function() {
            stocks[id].manage = !stocks[id].manage;
            stockSearchUpdate();
        })
        .attr("checked", stocks[id].manage);
    o.find(".b_locate").click(function() {
	stockShowLocation(attrs);
    });
};


function stockShowLocation(attrs) {
    if (!attrs.locations || attrs.locations.length == 0) return;
    stocksLocate = attrs.description;
    incrSearchUpdate();
    switchState("object");
    deleteOverlay();
};
