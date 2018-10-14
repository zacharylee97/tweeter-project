$(document).ready(function() {
  $(".textbox").on("keyup", function() {
    let chars = $(this).val().length;
    let charLeft = 140 - chars;
    let counter = $(this).parent().children(".counter");
    counter.text(charLeft);
    if (charLeft < 0) {
      counter.css("color", "red");
    } else {
      counter.css("color", "black");
    }
  });
});