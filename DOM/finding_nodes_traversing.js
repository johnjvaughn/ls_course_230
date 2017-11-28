//1.
var hElements = document.querySelectorAll('h2');
var hArray = Array.prototype.slice.call(hElements);

p(hArray.map(function (element) {
  return  element.textContent.trim().split(/\s+/).length;
}), '1. Word counts for each h2 element');

//2.
var toc = document.querySelector('.toc');
p(toc, '2. A. Table of contents div by querySelector(\'.toc\')');

toc = document.querySelector('#toc');
p(toc, '2. B. Table of contents div by querySelector(\'#toc\')');

toc = document.getElementById('toc');
p(toc, '2. C. Table of contents div by getElementById(\'toc\')');

//3.
var tocLinks = toc.querySelectorAll('a');
[].slice.call(tocLinks).forEach(function (node, index) {
  if (index % 2 === 0) node.style.color = 'green';
});

//4.
var thumbCaps = document.querySelectorAll('div.thumbcaption');
var thumbTexts = [].slice.call(thumbCaps).map(function (node) {
  return node.textContent.trim();
});

p(thumbTexts, '4. Text of all thumbnail captions');

//5.
var trElmts = document.querySelectorAll('.biota tr');
var collect = false;
var classifyObj = {};
var i;
var text;
var terms;

for (i = 0; i < trElmts.length; i += 1) {
  text = trElmts[i].textContent.trim();
  if (collect) {
    if (text.includes(':')) {
      terms = text.trim().split(':');
      if (terms.length === 2) classifyObj[terms[0].trim()] = terms[1].trim();
    } else if (text.includes('Binomial name')) {
      break;
    }
  } else if (text.includes('Scientific classification')) {
    collect = true;
  }
}

p(classifyObj, '5. Scientific classification');
