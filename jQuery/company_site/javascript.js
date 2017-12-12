$(function() {

  $('#team li > a').click(function (e) {
    e.preventDefault();
    var $elmt = $(this);
    $elmt.siblings('.modal').css({
      top: $(window).scrollTop() + 30
    });

    $elmt.nextAll("div").fadeIn(400);
  });

  function closeModal() {
    $modal = $(".modal").filter(':visible');
    $modal.animate({
      left: "-1000",
      opacity: 0,
    }, 1000, function () {
      $(this).hide().css({
        left: "50%",
        opacity: 1,
      });
    });
    $(".modal_layer").filter(':visible').fadeOut(800);
  }

  $('.modal_layer, a.close').click(function(e) {
    e.preventDefault();
    closeModal();
  });

  $(document).keydown(function(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

});