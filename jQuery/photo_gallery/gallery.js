$(function () {
  function cpThumbToMainImg($thumb) {
    var $bigImg = $('main figure img');
    var FADETIME = 300;

    $bigImg.stop().fadeOut(FADETIME, function() {
      $bigImg.prop('src', $thumb.prop('src'));
      $bigImg.prop('alt', $thumb.prop('alt'));
    });
    
    $bigImg.fadeIn(FADETIME);
    $bigImg.next('figcaption').text($thumb.prop('alt'));
  }

  $('ul').on('click', 'a', function(e) {
    e.preventDefault();
    var $li = $(e.currentTarget).closest('li');
    if ($li.hasClass('active')) return;
    $('li.active').removeClass('active');
    $li.addClass('active');
    cpThumbToMainImg($li.find('img'));
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