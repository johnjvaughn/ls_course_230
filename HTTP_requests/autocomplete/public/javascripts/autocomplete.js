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
    var selected;

    while (child = this.listUI.lastChild) {
      this.listUI.removeChild(child);
    }

    if (!this.visible) {
      this.overlay.textContent = '';
      return;
    }
    if (this.matches.length > 0 && this.bestMatchIndex !== null) {
      selected = this.matches[this.bestMatchIndex];
      this.overlay.textContent = selected.name;
    } else {
      this.overlay.textContent = '';
    }

    this.matches.forEach(function(match, index) {
      var li = document.createElement('li');
      li.classList.add('autocomplete-ui-choice');
      if (index === this.selectedIndex) {
        li.classList.add('selected');
        this.input.value = match.name;
      }
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
    this.selectedIndex = null;
    this.previousValue = null;
    this.draw();
  },

  valueChanged: function() {
    var value = this.input.value;
    this.previousValue = value;

    if (value.length > 0) {
      this.fetchMatches(value, function(matches) {
        this.visible = true;
        this.matches = matches;
        this.bestMatchIndex = 0;
        this.selectedIndex = null;
        this.draw();
      }.bind(this));
    } else {
      this.reset();
    }
  },

  handleKeydown: function(e) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (this.selectedIndex === null) this.selectedIndex = -1;
        this.selectedIndex = (this.selectedIndex + 1) % this.matches.length;
        this.bestMatchIndex = null;
        this.draw();
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (this.selectedIndex === null || this.selectedIndex === 0) {
          this.selectedIndex = this.matches.length;
        }
        this.selectedIndex -= 1;
        this.bestMatchIndex = null;
        this.draw();
        break;
      case 'Tab':
        if (this.bestMatchIndex !== null && this.bestMatchIndex < this.matches.length) {
          e.preventDefault();
          this.input.value = this.matches[this.bestMatchIndex].name;
        }
        this.reset();
        break;
      case 'Escape':
        this.input.value = this.previousValue;
        this.reset();
        break;
      case 'Enter':
        this.reset();
        break;
      default:
        return;
    }
  },

  handleClick: function(e) {
    if (!e.target.matches('li')) return;
    this.input.value = e.target.textContent;
    this.reset();
  },

  bindEvents: function() {
    this.input.addEventListener('input', this.valueChanged.bind(this));
    this.input.addEventListener('keydown', this.handleKeydown.bind(this));
    this.listUI.addEventListener('mousedown', this.handleClick.bind(this));
  },

  init: function() {
    this.input = document.querySelector('input');
    this.url = '/countries?matching=';
    this.listUI = null;
    this.overlay = null;

    this.wrapInput();
    this.createUI();
    this.valueChanged = debounce(this.valueChanged.bind(this), 300);
    this.bindEvents();
    this.reset();
  },
};

document.addEventListener('DOMContentLoaded', function() {
  Autocomplete.init();
});
