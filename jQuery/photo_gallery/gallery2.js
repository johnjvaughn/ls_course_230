$(function () {
  var FADETIME = 300;

  function cpThumbToMainImg($thumb) {
    //this assumes there is only one main image, 
    //changes the properties of the main image to new src, alt
    var $bigImg = $('main figure img');

    $bigImg.stop().fadeOut(FADETIME, function() {
      $bigImg.prop('src', $thumb.prop('src'));
      $bigImg.prop('alt', $thumb.prop('alt'));
    });
    
    $bigImg.fadeIn(FADETIME);
    $bigImg.next('figcaption').text($thumb.prop('alt'));
  }

  function activateMainImg(index) {
    //this assumes all pictures are already in page, 
    //and makes the correct one visible
    $(document).find('figure').stop().filter(':visible').fadeOut(FADETIME, function() {
      $(this).parent().children('figure').eq(index).fadeIn(FADETIME);
    }); 
  }

  $('ul').on('click', 'a', function(e) {
    e.preventDefault();
    var $li = $(e.currentTarget).closest('li');
    if ($li.hasClass('active')) return;
    $('li.active').removeClass('active');
    $li.addClass('active');
    //cpThumbToMainImg($li.find('img'));
    activateMainImg($li.index());
  });

  $('.controls button').click(function() {
    var $newImg;

    if ($(this).prop('id') === 'prev') {
      $newImg = $('li.active').prev();
      if ($newImg.length === 0) $newImg = $('li:last-child');
    } else {
      $newImg = $('li.active').next();
      if ($newImg.length === 0) $newImg = $('li:first-child');
    }
    $newImg.find('a').click();
  })
});