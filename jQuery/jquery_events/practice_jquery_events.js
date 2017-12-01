$(function () {
  var keyCode = null;

  $('form').submit(function (e) {
    e.preventDefault();
    var key = $(this).find('input[type="text"]').val();
    keyCode = key.charCodeAt(0);
    p(key + keyCode);
  });

  $(document).off('keypress').on('keypress', function(e) {
    if (e.which !== keyCode) return;
    $('a').trigger('click');
  });

  $('a').click(function (e) {
    e.preventDefault();
    $('#accordion').slideToggle();
  });
});