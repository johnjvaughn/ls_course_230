$(function() {
  var templates = {};
  var $elements = {};
  var contact_arr = [];

  function collectJQElements() {
    $elements.contact_list = $('#contact_list');
    $elements.contact_form = $('#new_contact');
    $elements.control = $("#control");
    $elements.search = $("#search");
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

  function displayContacts(search_str) {
    var contacts;
    if (search_str) {
      search_str = search_str.toLowerCase();
      contacts = contact_arr.filter(function (ctct) {
        return ctct.full_name.toLowerCase().includes(search_str);
      });
    } else {
      contacts = contact_arr;
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

  function removeContact(id) {
    var index = contact_arr.findIndex(function(ctct) {
      return +ctct['id'] === +id;
    });
    contact_arr.splice(index, 1);
  }

  var contact_form = {
    addOrUpdateContact(e) {
      e.preventDefault();
      var id = $(e.target).find('#id').val();
      var request = {
        data: $(e.target).serialize(),
        url: "http://localhost:4567/api/contacts",
      }
      request.url += id ? '/' + id : '';
      request.type = id ? "PUT" : "POST";
      $.ajax(request).done(function(json) {
        var new_contact = json;
        this.hideForm();
        e.target.reset();
        if (id) {
          editContact(new_contact, id);
        } else {
          contact_arr.push(new_contact);
        }
        displayContacts();
      }.bind(this)).fail(ajaxError);
    },
    populateForm: function(id) {
      if (id === undefined) return;
      var contact = contact_arr.find(function (contact) {
        return +contact.id === +id;
      });
      if (contact) {
        $elements.contact_form.find('#id').val(contact.id);
        $elements.contact_form.find('#full_name').val(contact.full_name);
        $elements.contact_form.find('#email').val(contact.email);
        $elements.contact_form.find('#phone_number').val(contact.phone_number);
      }
    },
    showForm: function(id) {
      $elements.control.hide();
      $elements.contact_list.hide();
      this.populateForm(id);
      $elements.contact_form.slideDown();
    },
    hideForm: function() {
      $elements.contact_form.slideUp();
      $elements.control.show();
      $elements.contact_list.show();
    },
    bindEvents: function() {
      $elements.contact_form.on('submit', this.addOrUpdateContact.bind(this));
      $elements.contact_form.find('input#cancel').on('click', this.hideForm);
    },
    init: function() {
      this.bindEvents();
    },
  };

  var contact_list = {
    editDelete: function(e) {
      e.preventDefault();
      var id = Number(e.target.id.replace(/[^\d]+/, ''));
      if (e.target.className === 'edit') {
        contact_form.showForm(id);
      } else if (e.target.className === 'delete') {
        if (!window.confirm("Delete this contact?")) return;
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

  var search_input = {
    doSearch: function(e) {
      displayContacts($(e.target).val());
    },
    bindEvents: function() {
      $elements.search.on('input', this.doSearch.bind(this));
    },
    init: function() {
      this.bindEvents();
    }
  }

  var add_button = {
    displayForm: function(e) {
      e.preventDefault();
      contact_form.showForm();
    },
    bindEvents: function() {
      $('button.add').on('click', this.displayForm.bind(this));
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
  
  function getContacts() {
    $.ajax({
      url: "http://localhost:4567/api/contacts",
      dataType: "json",
    }).done(function(json) {
      contact_arr = json;
      displayContacts();
    }).fail(ajaxError);
  }

  function initializeEvents() {
    add_button.init();
    contact_form.init();
    contact_list.init();
    search_input.init();
  }

  collectJQElements();
  collectTemplatesPartials();
  getContacts();
  initializeEvents();
});
