//1.
function setLog(num) {
  setTimeout(function() {
    console.log(num);
  }, num * 1000);
}

function delayLog() {
  for (var i = 1; i <= 10; i += 1) {
    setLog(i);
  }
}
p("1. Count 1 to 10 over 10 seconds");
delayLog();

//2.
setTimeout(function() {
  p("1, 5, 2, 7, 3, 6, 4, 8", "2. order of log statements");
  setTimeout(function() {   //1
    console.log("Once");    //5
  }, 1000);

  setTimeout(function() {   //2
    console.log("upon");    //7
  }, 3000);

  setTimeout(function() {   //3
    console.log("a");       //6
  }, 2000);

  setTimeout(function() {   //4
    console.log("time");    //8
  }, 4000);
}, 11000);

//3.
// setTimeout(function() {
//   setTimeout(function() {
//     q();    //7
//   }, 15);

//   d();  //3

//   setTimeout(function() {
//     n();  //5
//   }, 5);

//   z();  //4
// }, 10);

// setTimeout(function() {
//   s();  //6
// }, 20);

// setTimeout(function() {
//   f();  //2
// });

// g();  //1
setTimeout(function() {
  p("g, f, d, z, n, s, q", '3. order of execution of functions');
}, 16000);

//4.
function afterNSeconds(callback, delaySecs) {
  setTimeout(callback, delaySecs * 1000);
}

var doSomething = function() {
  p("afterNSeconds Demo", '4.');
}

afterNSeconds(doSomething, 17);