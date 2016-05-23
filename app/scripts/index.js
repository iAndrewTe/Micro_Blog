/**
 * Created by Andrew on 2016-05-22.
 */
$(document).on("click", ".message a", function () {
  $(".toggle-form").animate({height: "toggle", opacity: "toggle"}, "slow");
});
