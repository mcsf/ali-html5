function setNope() {
    $("#browser_nope").removeClass("hidden").addClass("nope");
};

function setOK() {
    $("#browser_ok").removeClass("hidden").addClass("ok");
}

function setInfo(s) {
    $("#browser_info")
        .removeClass("hidden")
        .text("O navegador detectado foi o "
                + s + ".");
};

$(document).ready(function() {
    var browser = jQuery.browser;

    if (browser.mozilla) {
        if (browser.version < 7.0) setNope();
        else setOK();
        setInfo("Mozilla Firefox, versão " + browser.version);
    }

    else if (browser.webkit) {
        if (browser.version < 535.2) setNope();
        else setOK();
        setInfo("Chromium ou outro que usa Webkit, versão " + browser.version);
    }
    else {
        setNope();
    }
});
