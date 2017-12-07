$(function() {
  var templates = {};
  var $elements = {};
  var photo_info_arr;
  var photo_index = 0;

  function collectJQElements() {
    $elements.photos = $('#slides');
    $elements.photo_info = $('section > header');
    $elements.comments = $('div#comments > ul');
    $elements.slideshow = $('#slideshow');
  }

  function collectTemplatesPartials() {
    $('script[type="text/x-handlebars"]').each(function() {
      var $template = $(this);
      var template_name = $template.attr("id");
      templates[template_name] = Handlebars.compile($template.html());
      if ($template.attr("data-type") === "partial") {
        Handlebars.registerPartial(template_name, templates[template_name]);
      }
      $template.remove();
    });
  }

  var addPhoto = function() {
    $elements.photos.html(templates.photos({photos: photo_info_arr}));
  };

  function addPhotoInfo() {
    $elements.photo_info.html(templates.photo_information(photo_info_arr[photo_index]));
  }

  var addComments = function(comments_info_arr) {
    $elements.comments.html(templates.comments({comments: comments_info_arr}));
  }

  var slideshow = {
    changePhoto: function(e) {
      e.preventDefault();
      if ($(e.target).hasClass('next')) {
        photo_index = (photo_index + 1) % photo_info_arr.length;
      } else if ($(e.target).hasClass('prev')) {
        photo_index -= 1;
        if (photo_index < 0) photo_index = photo_info_arr.length - 1;
      } else {
        return;
      }
      var $current_fig = $('#slides figure:visible');
      var $new_fig = $current_fig.parent().children('figure').eq(photo_index);
      $current_fig.fadeOut();
      $new_fig.fadeIn();
      $elements.photo_info.html(templates.photo_information(photo_info_arr[photo_index]));
      getComments(photo_info_arr[photo_index].id)
    },
    bindEvents: function() {
      $elements.slideshow.on('click', 'a', changePhoto);
    },
    init: function() {
      this.bindEvents();
    },
  }

  var ajaxError = function( xhr, status, errorThrown ) {
    alert( "AJAX: Sorry, there was a problem!" );
    console.log( "Error: " + errorThrown );
    console.log( "Status: " + status );
    console.dir( xhr );
  };

  function getComments(id) {
    $.ajax({
      url: "/comments",
      data: { photo_id: id },
      dataType: "json",
    }).done(addComments).fail(ajaxError);
  }

  function getPhotos() {
    $.ajax({
      url: "/photos",
      dataType: "json",
    }).done(function(json) {
      photo_info_arr = json;
      addPhoto();
      addPhotoInfo();
      getComments(photo_info_arr[photo_index].id);
      slideshow.init();
    }).fail(ajaxError);
  }

  collectJQElements();
  collectTemplatesPartials();
  getPhotos();
  
});
