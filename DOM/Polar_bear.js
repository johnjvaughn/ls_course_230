var imgCount = 0;
var pngCount = 0;

function walk(node, callback) {
  callback(node);
  node.childNodes.forEach(function (childNode) {
    walk(childNode, callback);
  });
}

walk(document, function (node) {
  if (node.nodeName === 'IMG') {
    imgCount += 1;
    if (node.getAttribute('src').slice(-4).toLowerCase() === '.png') {
      pngCount += 1;
    }
  } else if (node.nodeName === 'A') {
    node.style.color = 'red';
  }
});

p(imgCount, 'Number of images (img elements)');
p(pngCount, 'Number of png images (img elements)');
p('Changed all anchor links to red color');

