
$(function () {
  //1.
  var $h1 = $('h1');
  p($h1, '1. h1 elements:');

  //2.
  var $first_h1 = $('#site_title');
  p($first_h1, '2. first h1 element:');

  //3.
  var $article_list_items = $('article li');
  p($article_list_items, '3. li descendants of article:');

  //4.
  p($article_list_items.eq(2), '4. third li in article:');

  //5.
  var $tableElmt = $('table');
  p($tableElmt, 'table element:');

  var $odd_rows = $tableElmt.find('tr').filter(':odd');
  p($odd_rows, '5. table\'s odd-numbered tr elements:');

  //6.
  var $ac_ante = $('li').filter(function () {
    return $(this).text() === 'ac ante';
  });
  p($ac_ante.parents('li'), '6. ac ante li parent:');

  //7.
  p($ac_ante.next(), '7. ac ante next element:');

  //8.
  var $tableCells = $tableElmt.find('td');
  p($tableCells, '8. all table cells:');
  p($tableCells.last(), 'just the last table cell:');

  //9.
  var $nonProtected = $tableCells.not(".protected");
  p($nonProtected, '9. non-protected table cells');

  //10.
  var $anchors = $('a[href^="#"]');
  p($anchors, '10. anchors with href starting with "#":');

  //11.
  var $containsBlock = $('[class*=block]');
  p($containsBlock, '11. elements with class name containing "block":');
});