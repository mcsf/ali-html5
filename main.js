/* Initial state */
var state = "object";

function updateState(newState) {
    state = newState;
    $("#body > div").hide();
    $("#body_" + state).show();
};

$(document).ready(function() {

        updateState(state);

        /**
         * Update header when selecting a menu item
         */
        $(".nav_button.selectable").click(function(event) {
            /* Decorate selected menu item */
            $(this).siblings().removeClass("selected");
            $(this).addClass("selected");

            /* Update header title for new state */
            $("#state_text").html($(this).find(".text").html());

            /* Show contents for new state */
            updateState($(this).get(0).id.substr(4));
        });

});
