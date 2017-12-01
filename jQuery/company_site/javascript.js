$(function() {

  $('#team li > a').click(function (e) {
    e.preventDefault();
    var $elmt = $(this);
    $elmt.siblings('.modal').css({
      top: $(window).scrollTop() + 30
    });

    $elmt.nextAll("div").fadeIn(400);
  });

  $('.modal_layer, a.close').click(function(e) {
    e.preventDefault();
    $(".modal, .modal_layer").filter(':visible').fadeOut(400);
  });


  
});