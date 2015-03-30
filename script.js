/*
  The following is logic to manage a memory game in which users flip over cards
  and try and match pairs.
  Designed so that increasing the grid is simple:
      Add values to the background_images array
      Increase the number_pairs value,
      and add the tiles to the layout
*/

//The array that stores the location of the image files for easy extensibility
var background_images = {
  "1":"url(\"images/colour1.gif\")",
  "2":"url(\"images/colour2.gif\")",
  "3":"url(\"images/colour3.gif\")",
  "4":"url(\"images/colour4.gif\")",
  "5":"url(\"images/colour5.gif\")",
  "6":"url(\"images/colour6.gif\")",
  "7":"url(\"images/colour7.gif\")",
  "8":"url(\"images/colour8.gif\")",
  "9":"url(\"images/apple.jpg\")",//added image
  "10":"url(\"images/cherry.jpeg\")"//added image
}

/*The main variables uses to store the state of the game*/
//The user's most recent guest stored as an object with button's value and id
var last_guessed_tile;
//current Score
var score = 0;
var number_pairs_old = 8;//updated number
//Could get this number from the background_images array but
//it's semantically helpful I think.
var number_pairs = 10;
//Object holding values for whether the user has correctly guessed a given value
//dynamically built in resetCorrectGuesses
var hasGuessed = {};

//Game setup
$(document).ready(function(){
  resetCorrectGuesses();
  hideAllTiles();
})

//void -- Resets the game state variables
function restart() {
  resetCorrectGuesses();
  hideAllTiles();
  score = 0;
  updatePoints(score);
  last_guessed_tile = null;
}

//void -- resets the gameboard
function  hideAllTiles(){
  var buttons = $("#grid").children("button");
  for(var i = 0;i < buttons.length;i++){
    buttons[i].style.backgroundImage = "url('images/card_bg.gif')";
    buttons[i].style.border="none";
  }
}

//void -- Principle logic of the game, processes a user's selection
function guessed(btnID, btnValue){
  //if it's a new guess, show the tile and store the value
  if(!hasGuessed[btnValue]){
    if(last_guessed_tile == null){
      last_guessed_tile = {};
      last_guessed_tile.value = btnValue;
      last_guessed_tile.id = btnID;
      toggleHighlight(btnID);
      showTile(last_guessed_tile.id);
    }
    //If it's a second guess and it's correct, show the second tile, update
    //the score and check if the game is over and act accordingly
    else if(btnValue == last_guessed_tile.value) {
      if(btnID == last_guessed_tile.id){
        console.log("No guessing the same tile!");
        return;
      }
      console.log("You guessed right!");
      showTile(btnID);
      toggleHighlight(last_guessed_tile.id);
      hasGuessed[btnValue] = true;
      score++;
      updatePoints(score);
      if(checkEndState()){
        if(postHighScore()){
          var answer = confirm("CONGRATULATIONS YOU GOT A NEW HIGH SCORE! Would you like to play again?");
          if(answer){
            restart();
          }
        }
        else {
          var answer = confirm("Congrats. You finished the game. Play again?");
          if(answer){
            restart();
          }
        }
      }
      last_guessed_tile = null;
    }
    //Otherwise hide the previous guess and deduct a point
    else {
      console.log("WRONG!");
      if(score != 0){
        score--;
      }
      toggleHighlight(last_guessed_tile.id);
      updatePoints(score);
      hideTile(last_guessed_tile.id);
      last_guessed_tile = null;
    }
  }
  else {
    console.log("You already guessed that!");

  }
}

/*What follow are principally helper methods to help the game logic*/

//void -- Shows a given tile
function showTile(btnID){
  var button = $("#" + btnID)[0];
  button.style.backgroundImage = background_images[button.value.toString()];
}

//void -- Hides a given tile
function hideTile(btnID){
  var button = $("#" + btnID)[0];
  button.style.backgroundImage = "url('images/card_bg.gif')";
}

//Number -- Retuns the number of correct guesses so far
function getCorrectGuesses(){
  var correctGuesses = 0;
  for(var i = 1; i <= number_pairs; i++){
    if(hasGuessed[i] == true){
      correctGuesses++;
    }
  }
  return correctGuesses;
}

//void -- Update the UI with the current score
function updatePoints(points){
  var score_label = $("#currentScore")[0];
  score_label.innerText = points;
}

//void -- resets the correct guesses object to all false
function resetCorrectGuesses(){
  for(var i = 1; i <= number_pairs; i++){
    hasGuessed[i] = false;
  }
}

//void -- toggles a given tile's border from red to none and vice versa
//Used when a user has selected a given tile as a first guess
function toggleHighlight(btnID){
  if($("#"+btnID)[0].style.border == "inset red"){
    $("#"+btnID)[0].style.border = "none";
  }
  else {
    $("#"+btnID)[0].style.border = "inset red";
  }
}

//boolean -- returns whether the game is over or not by checking hasGuessed
function checkEndState(){
  var numberOfCorrectGuesses = 0;
  for(var i = 1; i <= number_pairs;i++){
    if(hasGuessed[i]){
      numberOfCorrectGuesses++;
    }
  }
  if(numberOfCorrectGuesses == number_pairs){
    return true;
  }
  else {
    return false;
  }
}

//boolean -- checks whether the score is a new high score and updates the UI if so
function postHighScore(){
  var highScore = $("#highScore")[0].innerText;
  if(parseInt(highScore) < score){
    $("#highScore")[0].innerText = score;
    return true;
  }
  else {
    return false;
  }
}
