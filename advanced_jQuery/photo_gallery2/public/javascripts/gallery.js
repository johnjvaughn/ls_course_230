$(function() {
  var templates = {};
  var $elements = {};
  var photo_info_arr = [];
  var photo_index = 0;

  function collectJQElements() {
    $elements.photo_div = $('#slides');
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

  function addPhoto() {
    $elements.photo_div.html(templates.photos({photos: photo_info_arr}));
  }

  function addPhotoInfo() {
    $elements.photo_info.html(templates.photo_information(photo_info_arr[photo_index]));
  }

  function addComments(comments_info_arr) {
    $elements.comments.html(templates.comments({comments: comments_info_arr}));
  }

  var slideshow = {
    displayNewSlide: function() {
      var $figures = $elements.photo_div.find('figure');
      $figures.finish().filter(':visible').fadeOut();
      $figures.eq(photo_index).fadeIn();
      $elements.photo_info.html(templates.photo_information(photo_info_arr[photo_index]));
      getComments(photo_info_arr[photo_index].id);
      $('input[name=photo_id]').val(photo_info_arr[photo_index].id);
    },
    changeSlide: function(e) {
      e.preventDefault();
      if ($(e.target).hasClass('next')) {
        photo_index = (photo_index + 1) % photo_info_arr.length;
      } else if ($(e.target).hasClass('prev')) {
        photo_index -= 1;
        if (photo_index < 0) photo_index = photo_info_arr.length - 1;
      } else {
        return;
      }
      this.displayNewSlide();
    },
    bindEvents: function() {
      $elements.slideshow.on('click', 'a', this.changeSlide.bind(this));
    },
    init: function() {
      this.bindEvents();
    },
  };

  var actions = {
    incrementAction: function(e) {
      var $link = $(e.target);
      e.preventDefault();
      $.ajax({
        url: $link.attr("href"),
        data: { photo_id: $link.data("id") },
        type: "POST",
        dataType: "json",
      }).done(function(json) {
        $link.text(function(i, text) {
          return text.replace(/\d+/, json.total);
        });
        photo_info_arr[photo_index][$link.data("property")] = json.total;
      }).fail(ajaxError);
    },
    bindEvents: function() {
      $elements.photo_info.on('click', '.actions .button', this.incrementAction.bind(this));
    },
    init: function() {
      this.bindEvents();
    },
  }

  var comments_form = {
    submitForm: function(e) {
      var $form = $(e.target);
      e.preventDefault();
      $.ajax({
        url: $form.attr("action"),
        data: $form.serialize(),
        type: $form.attr("method"),
        dataType: "json",
      }).done(function(json) {
        $elements.comments.append(templates.comment(json));
        $form.find('input, textarea').val('');
      }).fail(ajaxError);
    },
    bindEvents: function() {
      $('#comments form').on('submit', this.submitForm.bind(this));
    },
    init: function() {
      this.bindEvents();
    },
  }

  function ajaxError(xhr, status, errorThrown) {
    alert( "AJAX: Sorry, there was a problem!");
    console.log("Error: " + errorThrown);
    console.log("Status: " + status);
    console.dir(xhr );
  }
  
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
    }).fail(ajaxError);
  }

  function initializeEvents() {
    slideshow.init();
    actions.init();
    comments_form.init();
  }

  collectJQElements();
  collectTemplatesPartials();
  getPhotos();
  initializeEvents();
});
