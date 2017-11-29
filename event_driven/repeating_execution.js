//1.
var intervalID;


(function startCounting() {
  var num = 1;
  intervalID = setInterval(function () {
    console.log(num);
    num += 1;
  }, 1000);
})();

p("1. startCounting was called (will stop after 8 secs)");

function stopCounting() {
  clearInterval(intervalID);
  p("2. stopCounting was called");
}

setTimeout(stopCounting, 8000);

