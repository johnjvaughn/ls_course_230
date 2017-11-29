var cursorBlink = null;

document.addEventListener('DOMContentLoaded', function() {
  var textFieldElmt = document.querySelector('.text-field');

  textFieldElmt.addEventListener('click', function(e) {
    e.stopPropagation();
    this.classList.add('focused');
    cursorBlink = cursorBlink || setInterval(function() {
      textFieldElmt.classList.toggle('cursor');
    }, 500);
  });


});

document.addEventListener('click', function() {
  var textFieldElmt = document.querySelector('.text-field');
  clearInterval(cursorBlink);
  cursorBlink = null;
  textFieldElmt.classList.remove('focused', 'cursor');
});

document.addEventListener('keydown', function(e) {
  var textFieldElmt = document.querySelector('.text-field');
  if (!textFieldElmt.classList.contains('focused')) return;
  var contentElmt = document.querySelector('.content');
  if (e.key === "Backspace") {
    contentElmt.textContent = contentElmt.textContent.slice(0, -1);
  } else if (e.key.length === 1) {
    contentElmt.textContent += e.key;
  }
});