function walk(node, callback) {
  callback(node);

  for (var i = 0; i < node.childNodes.length; i++) {
    walk(node.childNodes[i], callback);
  }
}

var h1 = document.body.childNodes[1];
h1.style.color = 'red';
h1.style.fontSize = '48px';
p(h1, 'styled h1 heading');

var firstWords = [];

walk(document.body, function(node) {
  if (node.nodeName === 'P') {
    firstWords.push(node.textContent.trim().split(/\s+/)[0]);
    if (firstWords.length > 1) node.classList.add('stanza');
  }
});

p(firstWords.length, 'Number of paragraphs');

p(firstWords, 'First word of each paragraph');