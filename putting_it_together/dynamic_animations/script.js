$(function() {

  function resetElement($element) {
    var data = $element.data();

    $element.css({
      left: +data.start_x,
      top: +data.start_y,
    })
  }

  function createElement(data) {
    var $element = $("<div />", {
      'class': data.type,
      data: data,
    });

    resetElement($element);
    return $element;
  }

  function animateElement() {
    var $element = $(this);
    var data = $element.data();

    resetElement($element);
    $element.animate({
      left: +data.end_x,
      top: +data.end_y,
    }, +data.duration);
  }
  
  function getFormObject($form) {
    var obj = {};

    $form.serializeArray().forEach(function(input) {
      obj[input.name] = input.value;
    });

    return obj;
  }
  
  $('form').submit(function(e) {
    e.preventDefault();
    var $canvas = $('#animations');
    var form_data = getFormObject($(this));

    $canvas.append(createElement(form_data));
  });

  $('#controls').on('click', 'a', function(e) {
    e.preventDefault();
    var $all_shapes = $('#animations div');
    
    $all_shapes.stop();
    if ($(e.currentTarget).text() === 'Start') {
      $all_shapes.each(animateElement);
    }
  });
});