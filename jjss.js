jQuery(document).ready(function($) {

  // === Flip Card Backgrounds ===
  var countSquare = $('.square').length;

  for (var i = 0; i < countSquare; i++) {
    var firstImage = $('.square').eq(i);
    var secondImage = $('.square2').eq(i);

    var getImage = firstImage.attr('data-image');
    var getImage2 = secondImage.attr('data-image');

    if (getImage) firstImage.css('background-image', 'url(' + getImage + ')');
    if (getImage2) secondImage.css('background-image', 'url(' + getImage2 + ')');
  }

  
  window.addEventListener("scroll", function() {
  const header = document.querySelector("header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

});
