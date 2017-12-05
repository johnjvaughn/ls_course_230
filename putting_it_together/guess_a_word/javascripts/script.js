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

  function initializeWord(len) {
    $('#word > span, #guesses > span').remove();
    var $wordElmt = $('#word');
    for (var i = 1; i <= len; i += 1) {
      $wordElmt.append("<span></span>");
    }
  }

  function showLetter(word, letter) {
    var $letter_spans = $('#word > span');

    word.split('').forEach(function(ltr, index) {
      if (ltr === letter) {
        $letter_spans.eq(index).text(letter);
      }
    });
  }

  function showApples(wrongGuesses) {
    var vertical = -322 * wrongGuesses;

    $('main').css({
      backgroundPosition: "215px " + String(vertical) + "px, center 20px"
    });
  }

  function Game() {
    if (!(this instanceof Game)) {
      return new Game();
    }

    this.answer = randomWord();
    console.log(this.answer);
    this.lettersGuessed = [];
    this.wrongGuesses = 0;
    this.wrongGuessLimit = 6;
    this.loseMessage = "Sorry! You're out of guesses";
    this.winMessage = "You win!";
    this.gameResult = '';
    initializeWord(this.answer.length);
  }
  
  Game.prototype.updateGuesses = function(letter) {
    this.lettersGuessed.push(letter);
    $('#guesses').append('<span>' + letter + '</span>');
  }

  Game.prototype.displayResult = function(result) {
    if (!result) return;
    $('.message').text(result === 'win' ? this.winMessage : this.loseMessage);
    $('.replay').css('display', 'block');
  }

  Game.prototype.replay = function() {
    $('.message').empty();
    $('.replay').css('display', 'none');
    this.answer = randomWord();
    if (this.answer === undefined) {
      $('.message').text(this.outMessage);
      this.gameResult = 'out';
      return;
    }
    initializeWord(this.answer.length);
    this.lettersGuessed = [];
    this.wrongGuesses = 0;
    this.gameResult = '';
    showApples(this.wrongGuesses);
  }

  Game.prototype.checkIfOver = function() {
    var result = '';
    
    if (this.answer.split('').every(function(ltr) {
      return this.lettersGuessed.includes(ltr);
    }, this)) {
      result = 'win';
    } else if (this.wrongGuesses >= this.wrongGuessLimit) {
      this.displayResult('lose');
      result = 'lose';
    }
    this.displayResult(result);
    return result;
  }

  Game.prototype.processGuess = function(letter) {
    if (this.gameResult) return;
    if (this.lettersGuessed.includes(letter)) return;
    this.updateGuesses(letter);
    if (this.answer.includes(letter)) {
      showLetter(this.answer, letter);
    } else {
      this.wrongGuesses += 1;
      showApples(this.wrongGuesses);
    }
    this.gameResult = this.checkIfOver();
  }

  var game = new Game();

  $(document).keydown(function(e) {
    if ((game.gameResult !== 'out') && e.key.match(/^[a-z]$/i)) {
      game.processGuess(e.key.toUpperCase());
    }
    console.log(game);
  });

  $('.replay').click(function() {
    game.replay();
  });
});