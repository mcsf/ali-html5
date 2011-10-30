$(document).ready(function() {

        /**
         * Update header when selecting a menu item
         */
        $(".nav_button").click(function(event) {
            $("#state_text").html($(this).find(".text").html());
        });

});
