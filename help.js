var help = {
    object : { source   : "object.txt", },
    office : { source   : "stocks.txt", },
    login  : { source   : "login.txt",  },
};

function loadHelp() {
    $.each(help, function(i,v) {
        $.get("doc/" + v.source, function(data) {
            var n      = data.indexOf("\n");
            v.title    = data.substr(0, n);
            v.contents = data.substr(n+1).replace("\n\n", "<br/><br/>");
        }, 'text');
    });
};

/* Filling function for overlay generation */
function helpOverlayFill(o, state) {
    var data = help[state];
    o.find(".help.title").text(data.title);
    o.find(".help.contents").html(data.contents);
};
