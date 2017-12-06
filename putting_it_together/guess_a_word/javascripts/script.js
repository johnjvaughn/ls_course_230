$(function() {

  var randomWord = function() {
    var game_words = ['apple', 'banana', 'orange', 'pear'];

    return function() {
      var len = game_words.length;
      if (len === 0) return;
      var index = Math.floor(Math.random() * len);

      return game_words.splice(index, 1)[0].toUpperCase();
    };
  }();

  function Game() {
    if (!(this instanceof Game)) {
      return new Game();
    }

    this.CONST = {
      wrongGuessLimit: 6,
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
    this.letters_guessed = [];
    this.wrong_guesses = 0;
    this.game_result = undefined;
    this.reset();
  };
  
  Game.prototype.initializeWord = function() {
    this.$jq.word.children('span').remove();
    this.$jq.guesses.children('span').remove();
    var spans = (new Array(this.answer.length + 1)).join("<span></span>");

    this.$jq.word.append(spans);
  };

  Game.prototype.showTypedLetter = function(letter) {
    var $letter_spans = $('#word > span');

    this.answer.split('').forEach(function(ltr, index) {
      if (ltr === letter || letter === 'all') {
        $letter_spans.eq(index).text(ltr);
      }
    });
  };

  Game.prototype.revealAnswer = function(letter) {
    this.showTypedLetter('all');
    this.$jq.word.addClass('revealed');
  }

  Game.prototype.showApples = function() {
    var vertical = -322 * this.wrong_guesses;

    this.$jq.main.css({
      backgroundPosition: "215px " + String(vertical) + "px, center 20px"
    });
  };

  Game.prototype.updateGuesses = function(letter) {
    this.letters_guessed.push(letter);
    this.$jq.guesses.append('<span>' + letter + '</span>');
  };

  Game.prototype.reset = function() {
    this.$jq.message.empty();
    this.$jq.replay.css('display', 'none');
    this.$jq.word.removeClass('revealed');
    this.$jq.body.removeClass('win lose');
    this.answer = randomWord();
    if (this.answer === undefined) {
      this.$jq.message.text(this.CONST.out_message);
      this.game_result = 'out';
      return;
    }
    this.initializeWord();
    this.letters_guessed = [];
    this.wrong_guesses = 0;
    this.game_result = undefined;
    this.showApples();
  };

  Game.prototype.checkForResult = function() {
    if (this.answer.split('').every(function(ltr) {
      return this.letters_guessed.includes(ltr);
    }, this)) {
      this.game_result = 'win';
    } else if (this.wrong_guesses >= this.CONST.wrongGuessLimit) {
      this.game_result = 'lose';
    }
    return this.game_result;
  };

  Game.prototype.displayResult = function() {
    if (!this.game_result) return;
    if (this.game_result === 'win') {
      this.$jq.message.text(this.CONST.win_message);
      this.$jq.body.addClass('win');
    } else {
      this.$jq.message.text(this.CONST.lose_message);
      this.$jq.body.addClass('lose');
      this.revealAnswer();
    }
    this.$jq.replay.css('display', 'block');
  };

  Game.prototype.processGuess = function(letter) {
    if (this.game_result) return;
    if (this.letters_guessed.includes(letter)) return;
    this.updateGuesses(letter);
    if (this.answer.includes(letter)) {
      this.showTypedLetter(letter);
    } else {
      this.wrong_guesses += 1;
      this.showApples();
    }
    if (this.checkForResult()) this.displayResult();
  };

  var game = new Game();

  $(document).keydown(function(e) {
    if ((game.game_result !== 'out') && e.key.match(/^[a-z]$/i)) {
      game.processGuess(e.key.toUpperCase());
    }
  });

  game.$jq.replay.click(function() {
    game.reset();
  });
});