$(function() {
  var templates = {};
  var $elements = {};
  var tags_available = [];
  var contact_arr = [];

  function getItem(name) {
    var item = window.localStorage.getItem(name);
    return JSON.parse(item);
  }
  
  function setItem(name, val) {
    var item = JSON.stringify(val);
    window.localStorage.setItem(name, item);
  }

  function collectJQElements() {
    $elements.contact_list = $('#contact_list');
    $elements.contact_form = $('#new_contact');
    $elements.tag_form = $('#new_tag');
    $elements.control = $("#control");
    $elements.search = $("#search");
    $elements.tag_select = $("#control select");
    $elements.searches = $(".search");
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

  function populateTags() {
    $elements.tag_select.html(templates.tags({tags: tags_available}));
  }

  function readTags() {
    var tag_list = getItem('tags') || [];
    contact_arr.forEach(function (ctct) {
      if (ctct.tags) {
        ctct.tags.split(',').forEach(function (tag_name) {
          if (!tag_list.includes(tag_name)) tag_list.push(tag_name);
        });
      }
    });
    setItem('tags', tag_list);
    tags_available = tag_list.map(function (tag_name, index) {
      return { id: index, name: tag_name };
    });
  }

  function readContacts(json) {
    contact_arr = json;
  }

  function displayContacts() {
    var search_str = $elements.search.val();
    var tags = $elements.tag_select.val();
    var contacts = contact_arr;
    var c_tags;

    if (tags && tags.length > 0) {
      contacts = contacts.filter(function (ctct) {
        c_tags = ctct.tags.split(',');
        return (tags.some(function (tag) {
          return c_tags.includes(tag);
        }));
      });
    }
    if (search_str) {
      search_str = search_str.toLowerCase();
      contacts = contacts.filter(function (ctct) {
        return ctct.full_name.toLowerCase().includes(search_str);
      });
    }

    $elements.contact_list.html(templates.contacts({contacts: contacts}));
  }

  function editContact(contact, id) {
    contact['id'] = +id;
    var index = contact_arr.findIndex(function(ctct) {
      return +ctct['id'] === +id;
    });
    Object.assign(contact_arr[index], contact);
  }

  function addContact(contact) {
    contact_arr.push(contact);
  }

  function removeContact(id) {
    var index = contact_arr.findIndex(function(ctct) {
      return +ctct['id'] === +id;
    });
    contact_arr.splice(index, 1);
  }

  function showForm($form) {
    $elements.control.hide();
    $elements.contact_list.hide();
    $form.slideDown();
  }

  function hideForm($form) {
    $form.slideUp();
    $form.get(0).reset();
    $elements.control.show();
    $elements.contact_list.show();
  }

  var tag_form = {
    addTag: function (e) {
      e.preventDefault();
      var name = $(e.target).find('#name').val();
      var tagList = getItem("tags");
      if (!tagList.includes(name)) {
        tagList.push(name);
        setItem("tags", tagList);
        var new_tag = {
          id: tags_available.length,
          name: name,
        }
        tags_available.push(new_tag);
      }
      hideForm($elements.tag_form);
      populateTags();
      displayContacts();
    },
    cancel: function (e) {
      e.preventDefault();
      hideForm($elements.tag_form);
    },
    bindEvents: function () {
      $elements.tag_form.one('submit', this.addTag.bind(this));
      $elements.tag_form.find('input#cancel').one('click', this.cancel);
    },
    init: function () {
      this.bindEvents();
      showForm($elements.tag_form);
    },
  };

  var contact_form = {
    correctSerialData: function (e) {
      var data = $(e.target).serializeArray();
      var tags = "";
      data = data.filter(function (d) {
        if (d.name === "tags") {
          tags += d.value + ",";
          return false;
        }
        return true;
      });
      tags = tags.replace(/\,$/, '');
      data.push({ name: "tags", value: tags });
      return jQuery.param(data);;
    },
    addContact: function (e, data) {
      var request = {
        data: data,
        url: "http://localhost:4567/api/contacts",
        type: "POST",
      }
      $.ajax(request).done(function(new_contact) {
        addContact(new_contact);
        displayContacts();
      }.bind(this)).fail(ajaxError);
    },
    updateContact: function (e, data, id) {
      var request = {
        data: data,
        url: "http://localhost:4567/api/contacts/" + id,
        type: "PUT",
      }
      $.ajax(request).done(function(new_contact) {
        editContact(new_contact, id);
        displayContacts();
      }.bind(this)).fail(ajaxError);
    },
    processForm: function (e) {
      e.preventDefault();
      var id = $(e.target).find('#id').val();
      var data = this.correctSerialData(e);
      hideForm($elements.contact_form);
      if (id) {
        this.updateContact(e, data, id);
      } else {
        this.addContact(e, data);
      }
    },
    populateForm: function (id) {
      var tags = [];
      var contact_tags = [];

      if (id === undefined) {
        $elements.contact_form.find('h3').text("Create Contact");
        $elements.contact_form.find('#id').val("");
      } else {
        var contact = contact_arr.find(function (contact) {
          return +contact.id === +id;
        });
        if (contact) {
          $elements.contact_form.find('h3').text("Edit Contact");
          $elements.contact_form.find('#id').val(contact.id);
          $elements.contact_form.find('#full_name').val(contact.full_name);
          $elements.contact_form.find('#email').val(contact.email);
          $elements.contact_form.find('#phone_number').val(contact.phone_number);
          if (contact.tags) contact_tags = contact.tags.split(',');
        }
      }
      tags = tags_available.slice().map(function (tag) {
        tag.selected = (contact_tags.includes(tag.name));
        return tag;
      });
      $elements.contact_form.find('#tags').html(templates.tags({tags: tags}));
    },
    cancel: function (e) {
      e.preventDefault();
      hideForm($elements.contact_form);
    },
    bindEvents: function () {
      $elements.contact_form.one('submit', this.processForm.bind(this));
      $elements.contact_form.find('input#cancel').one('click', this.cancel);
    },
    init: function (id) {
      this.populateForm(id);
      this.bindEvents();
      showForm($elements.contact_form);
    },
  };

  var contact_list = {
    editDelete: function(e) {
      e.preventDefault();
      var id = Number(e.target.id.replace(/[^\d]+/, ''));
      if (e.target.className === 'edit') {
        contact_form.init(id);
      } else if (e.target.className === 'delete') {
        if (!window.confirm("Do you want to delete the contact ?")) {
          return;
        }
        var request = {
          url: "http://localhost:4567/api/contacts/" + id,
          type: "DELETE",
        }
        $.ajax(request).done(function(json) {
          removeContact(id);
          displayContacts();
        });
      }
    },
    bindEvents: function() {
      $elements.contact_list.on('click', 'button', this.editDelete.bind(this));
    },
    init: function() {
      this.bindEvents();
    }
  };

  var search_inputs = {
    doSearch: function(e) {
      e.preventDefault();
      displayContacts();
    },
    bindEvents: function() {
      $elements.searches.on('input', this.doSearch.bind(this));
    },
    init: function() {
      this.bindEvents();
    }
  }

  var add_buttons = {
    displayForm: function(e) {
      e.preventDefault();
      if (e.target.className === 'add') {
        contact_form.init.call(contact_form);
      } else {
        tag_form.init.call(tag_form);
      }
    },
    bindEvents: function() {
      $('#control').on('click', 'button', this.displayForm.bind(this));
    },
    init: function() {
      this.bindEvents();
    },
  };

  function ajaxError(xhr, status, errorThrown) {
    alert( "AJAX: Sorry, there was a problem!");
    console.log("Error: " + errorThrown);
    console.log("Status: " + status);
    console.dir(xhr);
  }
  
  function loadData() {
    $.ajax({
      url: "http://localhost:4567/api/contacts",
      dataType: "json",
    }).done(function(json) {
      readContacts(json);
      readTags();
      populateTags();
      displayContacts();
    }).fail(ajaxError);
  }

  function initializeEvents() {
    add_buttons.init();
    contact_list.init();
    search_inputs.init();
  }

  collectJQElements();
  collectTemplatesPartials();
  loadData();
  initializeEvents();
});
