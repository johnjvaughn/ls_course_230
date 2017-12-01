// $(document).ready(function () {
document.addEventListener('DOMContentLoaded', function() {
  var formElmt = document.querySelector('form');
  formElmt.addEventListener('submit', function(e) {
    e.preventDefault();
    var operand1 = +this.querySelector('#operand1').value,
        operand2 = +this.querySelector('#operand2').value,
        operation = this.querySelector('#operation').value,
        answer;

    switch (operation) {
      case '+':
        answer = operand1 + operand2;
        break;
      case '-':
        answer = operand1 - operand2;
        break;
      case '*':
        answer = operand1 * operand2;
        break;
      case '/':
        answer = operand1 / operand2;
        break;    
      default:
        answer = 'error';
        break;
    }
    document.getElementById('answer').textContent = String(answer).slice(0, 12);
  });
});