
$(function() {
  var $output = $('p');
  var $writeIn = $(this).find('input[type="text"]');
  var OUTPUT = 'Your favorite fruit is ';

  // $('a').on('click', function(e) {
  $('a').click(function(e) {
    e.preventDefault();
    var $thisLink = $(this);
    $output.text(OUTPUT + $thisLink.text());
    $writeIn.val('');
  });

  // $('form').on('submit', function(e) {
  $('form').submit(function(e) {
    e.preventDefault();
    $output.text(OUTPUT + $writeIn.val());
  });
});