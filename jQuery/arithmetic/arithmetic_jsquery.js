$(document).ready(function () {

  $('form').submit(function (e) {
    e.preventDefault();
    var operand1 = +$(this).find('#operand1').val(),
        operand2 = +$(this).find('#operand2').val(),
        operation = $(this).find('#operation').val(),
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
    $('#answer').text(String(answer).slice(0, 12));
  });
});