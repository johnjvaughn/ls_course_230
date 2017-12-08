document.addEventListener('DOMContentLoaded', function() {
  var store = document.getElementById('store');
  var request = new XMLHttpRequest();

  request.open('GET', 'https://ls-230-web-store-demo.herokuapp.com/products');
  request.send();
  request.addEventListener('load', function(event) {
    store.innerHTML = request.response;
  });

  store.addEventListener('click', function(e) {
    var target = e.target;
    if (target.tagName !== 'A') return;
    e.preventDefault();

    var request = new XMLHttpRequest();
    var path = target.getAttribute('href').replace(/^file.*\:/, '');
    request.open('GET', 'https://ls-230-web-store-demo.herokuapp.com' + path);
    request.send();
    request.addEventListener('load', function(event) {
      store.innerHTML = request.response;
    });

  });

  store.addEventListener('submit', function(e) {
    e.preventDefault();
    var form = e.target;
    var data = new FormData(form);
    var request = new XMLHttpRequest();
    var path = form.getAttribute('action');

    request.open('POST', 'https://ls-230-web-store-demo.herokuapp.com' + path);
    request.setRequestHeader("Authorization", "token AUTH_TOKEN");
    request.addEventListener('load', function() {
      store.innerHTML = request.response;
    });
    request.send(data);
  });

});
