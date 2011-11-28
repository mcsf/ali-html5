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

function removeLabel(i) {
    delete labels[i];
    incrSearchActivate();
    incrSearchUpdate();
};

function roomClickHandler(i) {
    /* Clicking on a new room creates new label */
    if (!labels[i]) {
        labels[i] = true;

        var label = $(
            '<span class="label" style="background-color:'
            + roomColors[i] + ';">' + roomNames[i]
            + '&nbsp;<a>&nbsp;X</a><input type="hidden" value="'
            + i + '"></span>'
        );

        /* Clicking on the label's cross deletes it */
        label.find("a").click(function() {
            $(this).parent().remove();
            removeLabel(i);
        });

        $("#labels").append(label);
        incrSearchActivate();
        incrSearchUpdate();
    }
    /* Clicking on a selected room deletes a label */
    else {
        $('#labels input:hidden:[value="'+i+'"]').parent().remove();
        removeLabel(i);
    }
};
