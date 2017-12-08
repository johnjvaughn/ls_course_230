var form = document.getElementById('form');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  // var keysAndValues = [];

  // for (var i = 0; i < form.elements.length; i += 1) {
  //   var element = form.elements[i];
  //   var key = encodeURIComponent(element.name);
  //   var value = encodeURIComponent(element.value);
  //   keysAndValues.push(key + '=' + value);
  // }

  // var data = keysAndValues.join('&');
  var data = new FormData(form);
  var request = new XMLHttpRequest();
  request.open('POST', 'http://ls-230-book-catalog.herokuapp.com/books');
  // request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  request.addEventListener('load', function() {
    if (request.status === 201) {
      console.log('This book was added to the catalog: ' + request.responseText);
    }
  });

  request.send(data);
});
