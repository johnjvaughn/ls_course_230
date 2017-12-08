var Autocomplete = {
  wrapInput: function() {
    var wrapper = document.createElement('div');
    wrapper.classList.add('autocomplete-wrapper');
    this.input.parentNode.appendChild(wrapper);
    wrapper.appendChild(this.input);
  },

  createUI: function() {
    var listUI = document.createElement('ul');
    listUI.classList.add('autocomplete-ui');
    this.input.parentNode.appendChild(listUI);
    this.listUI = listUI;

    var overlay = document.createElement('div');
    overlay.classList.add('autocomplete-overlay');
    overlay.style.width = this.input.clientWidth + 'px';
    this.input.parentNode.appendChild(overlay);
    this.overlay = overlay;
  },

  draw: function() {
    var child;

    while (child = this.listUI.lastChild) {
      this.listUI.removeChild(child);
    }

    if (!this.visible) {
      this.overlay.textContent = '';
      return;
    }
    if (this.bestMatchIndex !== null) {
      var selected = this.matches[this.bestMatchIndex];
      this.overlay.textContent = selected.name;
    } else {
      this.overlay.textContent = '';
    }

    this.matches.forEach(function(match, index) {
      var li = document.createElement('li');
      li.classList.add('autocomplete-ui-choice');
      li.textContent = match.name;
      this.listUI.appendChild(li);
    }.bind(this));
  },

  fetchMatches: function(query, callback) {
    var request = new XMLHttpRequest();

    request.addEventListener('load', function() {
      callback(request.response);
    }.bind(this));
    request.open("GET", this.url + encodeURIComponent(query));
    request.responseType = "json";
    request.send();
  },

  reset: function() {
    this.visible = false;
    this.matches = [];
    this.bestMatchIndex = null;
    this.draw();
  },

  valueChanged: function() {
    var value = this.input.value;

    if (value.length > 0) {
      this.fetchMatches(value, function(matches) {
        this.visible = true;
        this.matches = matches;
        this.bestMatchIndex = 0;
        this.draw();
      }.bind(this));
    } else {
      this.reset();
    }
  },

  bindEvents: function() {
    this.input.addEventListener('input', this.valueChanged.bind(this));
  },

  init: function() {
    this.input = document.querySelector('input');
    this.url = '/countries?matching=';
    this.listUI = null;
    this.overlay = null;

    this.wrapInput();
    this.createUI();
    this.bindEvents();
    this.reset();
  },
};

document.addEventListener('DOMContentLoaded', function() {
  Autocomplete.init();
});