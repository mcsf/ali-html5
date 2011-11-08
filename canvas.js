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
