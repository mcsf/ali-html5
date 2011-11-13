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
            v.contents = data.substr(n+1)
                            /* Empty line means new paragraph */
                            .replace(/\n\n/g, "<br/><br/>")
                            /* Use *asterisks* for bold */
                            .replace(/\*([^*]*)\*/g, "<b>$1</b>")
                            /* Use _underscores_ for italic */
                            .replace(/_([^_]*)_/g, "<i>$1</i>");
        }, 'text');
    });
};

/* Filling function for overlay generation */
function helpOverlayFill(o, state) {
    var data = help[state];
    o.find(".help.title").text(data.title);
    o.find(".help.contents").html(data.contents);
};


function notImplemented() {
    if ($(".overlay").length > 0) return;
    createOverlay(0, "#na_overlay_template", naOverlayFill);
};

function naOverlayFill() {};
