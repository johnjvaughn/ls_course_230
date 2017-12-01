function $(id_selector) {
  return document.getElementById(id_selector);
}

window.onload = function() {
  $("calculator").onsubmit = function(e) {
    var numerator = +$("operand1").value,
        denominator = +$("operand2").value,
        operator = $("operation").value,
        result = 0;

    e.preventDefault();

    if (operator === "+") {
      result = numerator + denominator;
    }
    if (operator === "-") {
      result = numerator - denominator;
    }
    if (operator === "*") {
      result = numerator * denominator;
    }
    if (operator === "/") {
      result = numerator / denominator;
    }

    $("answer").innerHTML = result;
  };
};