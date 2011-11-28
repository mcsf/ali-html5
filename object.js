/**
 * Static data:
 * - objects
 * - rooms
 */

var objects = [
    {
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
        icon        : "zarathustra-icon.png",
        description : "Nietzsche, Also Sprach Zarathustra",
        location    : "Bancada da cozinha",
        coords      : [ 205, 430 ],
        room        : 3,
        info        : "Arrumado a 20 de Novembro",
        picture     : "zarathustra.png",
        categories  : [ "livros" ],
        kind        : 'book',
    },
    {
        icon        : "lotr-movie-icon.png",
        description : "Lord of the Rings: Fellowship of the Ring",
        location    : "Chão da sala",
        coords      : [ 68, 375 ],
        room        : 1,
        info        : "Arrumado a 20 de Novembro",
        picture     : "lotr-movie.png",
        categories  : [ "filmes", "dvd" ],
        kind        : 'film',
    },
    {
        icon        : "lotr-book-icon.png",
        description : "Lord of the Rings: Fellowship of the Ring",
        location    : "Chão da sala",
        coords      : [ 48, 405 ],
        room        : 1,
        info        : "Arrumado a 20 de Novembro",
        picture     : "lotr-book.png",
        categories  : [ "livros" ],
        kind        : 'book',
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

var kinds = {
    book : { name  : "Livro", color : "#fdd", },
    film : { name  : "Filme", color : "#ddf", },
};

/* Object list item generation */
function createItem(attrs) {
    var units = attrs.units ? " (" + attrs.units + " uds.)" : "";
    var kind  = "";

    if (attrs.kind) {
        kind = '<span class="kind" style="background:'
                + kinds[attrs.kind].color
                + '">' + kinds[attrs.kind].name + "</span>";
    }

    $("#itemlist").append($('<div class="item selectable"> <span class="icon"> <img src="objects/' + attrs.icon + '"/></span> <div class="text"><span class="description">'+kind+attrs.description + '</span> <span class="location">' + attrs.location + units + '</span> <input type="hidden" class="roomNo" value="' + attrs.room + '"/> <input type="hidden" class="id" value="' + attrs.id + '"/> </div> </div>').css("opacity", "0.2"));
};


/* Filling function for overlay generation */
function itemOverlayFill(o, id) {
    var attrs = objects[id];
    o.find(".picture").attr("src", "objects/" + attrs.picture);
    o.find(".description").html(attrs.description);
    o.find(".location").append(attrs.location);
    o.find(".info").text(attrs.info);
    $.each(attrs.categories, function(i,v) {
        o.find(".categories").append(
            '&nbsp;<span class="category selectable">'
            + v + '</span>\n');
    });
};
