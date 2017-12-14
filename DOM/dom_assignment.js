//1.
var h1 = document.querySelector('h1');
//h1.classList.add('heading');
h1.setAttribute('class', 'heading');
p(h1, "1. added 'heading' to class of h1 element");

//2.
var ul = document.querySelector('ul#list');
ul.setAttribute('class', 'bulleted');
p(ul, "2. added 'bulleted' class to ul element");

//3.
var toggle = document.getElementById('toggle');
var notice = document.getElementById('notice');
toggle.onclick = function(e) {
  e.preventDefault();
  notice.classList.toggle('hidden');
}
p(toggle, '3. set onclick attribute to show/hide notice element');

//4.
notice.onclick = function(e) {
  e.preventDefault();
  this.setAttribute('class', 'hidden');
}
p(notice, '4. set onclick attribute on notice to hide it');

//5.
var mult = document.getElementById('multiplication');
var nums = mult.innerText.match(/\d+/g);
mult.innerText += " = " + String(+nums[0] * +nums[1]);
p(mult, '5. changed text of multiplication element to result');

//6.
document.body.id = 'styled';
p(document.body, '6. applied \'styled\' ID to body element');

//test
p(document.querySelector('h2'));
p(document.querySelectorAll('h2'));