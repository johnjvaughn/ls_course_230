var cursorInterval;
var focusedTextField;

document.addEventListener('DOMContentLoaded', function() {
  var textField = document.querySelector('.text-field');

  textField.addEventListener('click', function(event) {
    event.stopPropagation();

    focusedTextField = textField;
    textField.classList.add('focused');

    cursorInterval = setInterval(function() {
      textField.classList.toggle('cursor');
    }, 500);
  });
});

document.addEventListener('keyup', function(event) {
  if (focusedTextField) {
    var contentDiv = focusedTextField.querySelector('.content');
    if (event.which === 8) {
      contentDiv.textContent = contentDiv.textContent.substr(0, contentDiv.textContent.length - 1);
    } else if (event.key.length === 1) {
      contentDiv.textContent = contentDiv.textContent + event.key;
    }
  }
});

document.addEventListener('click', function(event) {
  clearInterval(cursorInterval);
  if (focusedTextField) {
    focusedTextField.classList.remove('focused');
    focusedTextField.classList.remove('cursor');
    focusedTextField = null;
  }
});