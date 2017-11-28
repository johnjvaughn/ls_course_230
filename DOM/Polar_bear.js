function walk(node, callback) {
  callback(node);

  for (var i = 0; i < node.childNodes.length; i++) {
    walk(node.childNodes[i], callback);
  }
}

var imgCount = 0;
var pngCount = 0;

walk(document, function(node) {
  if (node.nodeName === 'IMG') {
    imgCount += 1;
    if (node.getAttribute('src').slice(-4).toLowerCase() === '.png') pngCount += 1;
  } else if (node.nodeName === 'A') {
    node.style.color = 'red';
  }
});

p(imgCount, 'Number of images (img elements)');
p(pngCount, 'Number of png images (img elements)');
p('Changed all anchor links to red color');

