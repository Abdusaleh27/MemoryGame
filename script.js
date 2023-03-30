const gameContainer = document.querySelector(".game");

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple",
];

//keeps track of how many cards are facing up at the same time
let counter = {
  red: 0,
  blue: 0,
  green: 0,
  orange: 0,
  purple: 0,
};

let lastCardClicked = gameContainer;
let freshPair = true;
const startButton = document.querySelector(".start");
const restartButton = document.querySelector(".restart");
const currentScore = document.querySelector(".currentScore");
let gameStarted = false;
let gameOver = false;
let score = 0;
let maxPairs = COLORS.length / 2;
let pairs = 0;
// game needs to be start to enable clicking
gameContainer.classList.add("disableclick");
// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;
  
  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// TODO: Implement this function!
let target;
let color;
let lastColor;
function handleCardClick(event) {
  target = event.target;
  color = target.className;
  lastColor = lastCardClicked.className;
  target.style.backgroundColor = color;
  // prevents counting double click on the same card as a pair
  if (target !== lastCardClicked) {
    if (lastColor === color && counter[color] < 2 && !freshPair) {
      //this checks if we got a pair of the same color
      // and prevents pairing up with any other card
      score++;
      currentScore.innerText = updateScore(score);
      pairs++;
      if (pairs >= maxPairs) {
        gameOver = true;
        endGame();
      }
      freshPair = true;
      counter[color] = 2;
      lastCardClicked = gameContainer;
    } else if (freshPair && counter[color] < 1) {
      // this is executed when a card is clicked and is not paired up
      //
      score++;
      currentScore.innerText = updateScore(score);
      freshPair = false;
      counter[color] = 1;
      lastCardClicked = target;
    } else {
      // when the cards mismatch they face down again and reset counters
      gameContainer.classList.add("disableclick"); // prevents clicking too fast

      setTimeout(function () {
        if (counter[color] < 2 && counter[lastColor] < 2 && !freshPair) {
          lastCardClicked.style.backgroundColor = "rgb(84, 48, 167)";
          target.style.backgroundColor = "rgb(84, 48, 167)";
          counter[color] = 0;
          counter[lastCardClicked.className] = 0;
          freshPair = true;
          lastCardClicked = gameContainer;
          score++;
          currentScore.innerText = updateScore(score);
        }
        gameContainer.classList.remove("disableclick");
      }, 1000);
    }
  }
}

function startGame(event) {
  if (!gameStarted && !gameOver) {
    gameStarted = true;
    gameContainer.classList.remove("disableclick");
  } else if (gameOver) {
    //restarting the game when game over
    //location.reload();
    resetGame();
    gameStarted = true;
    //gameContainer.classList.remove("disableclick");
    console.log("new Game");
    gameOver = false;
    pairs = 0;
  }
}

function restartGame() {
  if (gameStarted) {
    resetGame();
  }
}

function resetGame() {
  gameContainer.innerHTML = "";
  shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
  for (let count in counter) {
    counter[count] = 0;
  }
  currentScore.innerText = updateScore("--");
  score = 0;
}

function updateScore(newScore) {
  return `Current Score: ${newScore}`;
}

const finish = document.createElement("h1");
function endGame() {
  setTimeout(function () {
    finish.className = "endGame";
    finish.innerText = "Game Over!";
    gameContainer.appendChild(finish);
    gameOver = true;
    gameStarted = false;
  }, 1000);
}
// when the DOM loads
createDivsForColors(shuffledColors);
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);
