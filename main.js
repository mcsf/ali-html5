$(document).ready(function() {

        /**
         * Update header when selecting a menu item
         */
        $(".nav_button.selectable").click(function(event) {
            $("#state_text").html($(this).find(".text").html());

            $(this).siblings().removeClass("selected");
            $(this).addClass("selected");

            //alert($(this).get(0).id);
        });

});
