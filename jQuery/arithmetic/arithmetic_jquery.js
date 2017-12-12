$(document).ready(function () {
  var op_funcs = {
    '+': (a, b) => {return a + b},
    '-': (a, b) => {return a - b},
    '*': (a, b) => {return a * b},
    '/': (a, b) => {return a / b},
  }

  $('form').submit(function (e) {
    e.preventDefault();
    var operand1 = +$(this).find('#operand1').val();
    var operand2 = +$(this).find('#operand2').val();
    var operation = $(this).find('#operation').val();
    var answer = op_funcs[operation](operand1, operand2);
    
    $('#answer').text(String(answer).slice(0, 12));
  });
});