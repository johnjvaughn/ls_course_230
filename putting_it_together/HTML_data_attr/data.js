$(function() {
  $('a').click(function(e) {
    e.preventDefault();
    $('article:visible').hide();
    $('article[data-block=' + $(this).data('block') + ']').show();
  });
});