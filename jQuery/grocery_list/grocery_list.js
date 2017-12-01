$(function () {
  var $list = $('ul.groceries');

  $('form').submit(function (e) {
    e.preventDefault();
    var item = $(this).find('#item').val().trim(),
        quantity = $(this).find('#quantity').val().trim() || '1';
    if (!item) return;
    $list.append('<li>' + quantity + ' ' + item + '</li>');
    this.reset();
  });
});