$(function() {
  var CONST = {
    first_delay: 250,
    delay_increment: 1500,
    animation_speed: 250,
  };
  Object.freeze(CONST);

  var $blinds = $('div[id^=blind]');

  function startAnimation() {
    var delay = CONST['first_delay'],
        $blind;

    $blinds.each(function(index) {
      $blind = $blinds.eq(index);
      $blinds.eq(index).delay(delay).animate({
        top: "+=" + $blind.height(), 
        height: 0,
      }, CONST['animation_speed']);
      delay += CONST['delay_increment'];
    });
  }

  $('a').click(function(e) {
    e.preventDefault();
    $blinds.finish().removeAttr('style');
    startAnimation();
  });

  startAnimation();
});