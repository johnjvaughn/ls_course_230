$(function() {
  var $main_header = $('nav').parent(),
      $main_h1 = $('main > h1'),
      $chin_figure = $('img[alt*="chin"]').parent(),
      $baby_figure = $('img[alt*="baby"]').parent(),
      $baby_caption = $('figcaption:contains(baby)'),
      $chin_caption = $('figcaption:contains(chin)');
  $main_header.prependTo($('body'));
  $main_h1.prependTo($main_header);
  $baby_caption.appendTo($baby_figure);
  $chin_caption.appendTo($chin_figure);
  $chin_figure.appendTo($('article'));
  $baby_figure.appendTo($('article'));
});