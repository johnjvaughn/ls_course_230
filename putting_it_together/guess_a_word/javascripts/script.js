$(function() {

  var randomWord = function() {
    var game_words = ['apple', 'banana', 'orange', 'pear', 'strawberry', 'grape',
                      'watermelon', 'blueberry', 'kiwi', 'clementine'];

    return function() {
      var len = game_words.length;
      if (len === 0) return;
      var index = Math.floor(Math.random() * len);
      return game_words.splice(index, 1)[0].toUpperCase();
    };
  }();

  function isLetter(key) {
    return (!!key.match(/^[a-z]$/i));
  }

  function Game() {
    if (!(this instanceof Game)) {
      return new Game();
    }

    this.CONST = {
      wrong_guess_limit: 6,
      lose_message: "Sorry! You're out of guesses",
      win_message: "You win!",
      out_message: "Sorry, I've run out of words!",
    };
    Object.freeze(this.CONST);
    this.$jq = {
      word: $('#word'),
      guesses: $('#guesses'),
      message: $('.message'),
      replay: $('.replay'),
      body: $('body'),
      main: $('main'),
    };
    Object.freeze(this.$jq);
    this.letters_guessed = [];
    this.wrong_guesses = 0;
    this.game_result = undefined;
    this.reset();
    this.bindKeyPress();
  };
  
  Game.prototype = {
    initBoard: function() {
      this.$jq.word.children('span').remove();
      this.$jq.guesses.children('span').remove();
      var spans = (new Array(this.answer.length + 1)).join("<span></span>");

      this.$jq.word.append(spans);
    },
    showApples: function() {
      var spriteOffset = String(-322 * this.wrong_guesses) + "px";
      this.$jq.main.css({
        backgroundPosition: "215px " + spriteOffset + ", center 20px"
      });
    },
    reset: function() {
      this.$jq.message.empty();
      this.$jq.replay.css('display', 'none').off('click');
      this.$jq.body.removeClass();
      this.answer = randomWord();
      if (this.answer === undefined) {
        this.$jq.message.text(this.CONST.out_message);
        this.game_result = 'out';
        return;
      }
      this.letters_guessed = [];
      this.wrong_guesses = 0;
      this.game_result = undefined;
      this.initBoard();
      this.showApples();
    },
    checkForResult: function() {
      if (this.answer.split('').every(function(ltr) {
        return this.letters_guessed.includes(ltr);
      }, this)) {
        this.game_result = 'win';
      } else if (this.wrong_guesses >= this.CONST.wrong_guess_limit) {
        this.game_result = 'lose';
      }
      return this.game_result;
    },
    showTypedLetter: function(letter) {
      var $letter_spans = this.$jq.word.children('span');
      this.answer.split('').forEach(function(ltr, index) {
        if (ltr === letter || letter === 'all') {
          $letter_spans.eq(index).text(ltr);
        }
      });
    },
    playAnother: function(e) {
      e.preventDefault();
      this.reset();
    },
    revealAnswer: function(letter) {
      this.showTypedLetter('all');
    },
    displayResult: function() {
      if (!this.game_result) return;
      if (this.game_result === 'win') {
        this.$jq.message.text(this.CONST.win_message);
      } else {
        this.$jq.message.text(this.CONST.lose_message);
        this.revealAnswer();
      }
      this.$jq.body.addClass(this.game_result);
      this.$jq.word.children('span').addClass('word_' + this.game_result);
      this.$jq.replay.css('display', 'block');
      this.$jq.replay.click(this.playAnother.bind(this));
    },
    updateGuesses: function(letter) {
      this.letters_guessed.push(letter);
      this.$jq.guesses.append('<span>' + letter + '</span>');
    },
    processKeyPress: function(e) {
      if (this.game_result) return;
      var char = e.key ? e.key : String.fromCharCode(e.which);
      if (!isLetter(char)) return;
      var letter = char.toUpperCase();

      if (this.letters_guessed.includes(letter)) return;
      this.updateGuesses(letter);
      if (this.answer.includes(letter)) {
        this.showTypedLetter(letter);
      } else {
        this.wrong_guesses += 1;
        this.showApples();
      }
      if (this.checkForResult()) this.displayResult();
    },
    bindKeyPress: function() {
      $(document).keypress(this.processKeyPress.bind(this));
    },
  };

  var game = new Game();
});