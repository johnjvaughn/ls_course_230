document.addEventListener('DOMContentLoaded', function() {
  var messageElmt = document.querySelector('main p');
  var guessElmt = document.getElementById('guess');
  var formElmt = document.querySelector('form');
  var buttonElmt = formElmt.querySelector('input[type="submit"]');
  var guessCounter = 0;
  var answer;

  function resetGame() {
    answer = Math.floor(Math.random() * 100) + 1;
    messageElmt.textContent = "Guess a number from 1 to 100";
    guessElmt.value = '';
    buttonElmt.disabled = false;
  }
  
  resetGame();

  formElmt.addEventListener('submit', function(e) {
    e.preventDefault();
    var guess = parseInt(guessElmt.value, 10);
    var message;

    if ((!guessElmt.value.match(/^\d+$/)) || (guess < 1) || (guess > 100)){
      messageElmt.textContent = "Please enter a valid integer from 1 to 100";
      return;
    }

    guessCounter += 1;
    if (answer < guess) {
      message = "My number is lower than " + String(guess);
    } else if (answer > guess) {
      message = "My number is higher than " + String(guess);
    } else {
      message = "You guessed it! It took you " + String(guessCounter) + " guesses.";
      buttonElmt.disabled = true;
    }
    messageElmt.textContent = message;
  });

  var newGameElmt = document.querySelector('main a');
  newGameElmt.addEventListener('click', function(e) {
    e.preventDefault();
    resetGame();
  });

});