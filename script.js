// messages to greet a user in the console
const style1="color:red;font-size:1.5rem;font-weight:bold;";
console.log("%c" + "IF YOU ARE IN HERE THEN YOU ARE CHEATING!", style1);
// const style2="color:cyan;font-size:1.5rem;font-weight:bold;";
// console.log("%c" + "IF YOU ARE A DOJO STUDENT...", style2);
// console.log("%c" + "GOOD LUCK THIS IS A CHALLENGE!", style2);

// various constants go here
const theDojo = [ [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ];
const titleDiv = document.querySelector("#title");
const timerDiv = document.querySelector("#timer");
const dojoDiv = document.querySelector("#the-dojo");
let ninjaCount = 10; // should be a slight challenge
let unchecked = theDojo.length*theDojo[0].length - ninjaCount;
let inputMode = "CHECK";

// in game timer
let timer = null;

// allow the user on mobile to set their mode
function setMode(element) {
  let buttons = document.querySelectorAll("#controls button");
  buttons.forEach(btn => btn.disabled = false);
  element.disabled = true;
  inputMode = element.innerText.toUpperCase();
}

// helper function to provide button html
function makeButton(i, j) {
return `<button class="tatami"` + 
  `onclick="howMany(${i}, ${j}, event)"` +
  `onContextMenu="mark(event)"></button>`;
}
    
// Creates the rows of buttons for this game
function render(theDojo) {
  let result = "";
  for(let i=0; i<theDojo.length; i++) {
    result += `<div class="row">`;
    for(let j=0; j<theDojo[i].length; j++) {
        result += makeButton(i, j);
    }
    result += "</div>";
  }
  return result;
}

// call this function when the game ends
function gameOver(condition) {
  clearInterval(timer);
  let buttons = document.querySelectorAll("#the-dojo button");
  for(let button of buttons) {
    button.disabled = true;
  }
  switch(condition) {
    case "WIN":
      titleDiv.innerText = "You are good at finding ninjas!";
      break;
    case "LOSE":
      titleDiv.innerText = "Sorry you have lost :(";
      break;
    default:
      console.error("Error: gameOver(condition) requires \"WIN\" or \"LOSE\"");
  }
}

// helper function to select an element based on it's i and j
function getElementBy(i, j) {
  const selector = `.row:nth-child(${i+1}) button:nth-child(${j+1})`;
  return document.querySelector(selector);
}

// offsets to give us all of the positions around us
const offsets = [{x: 0, y: -1}, {x: 1, y: -1}, {x: 1, y: 0}, {x: 1, y: 1},
  {x: 0, y: 1}, {x: -1, y: 1}, {x: -1, y: 0}, {x: -1, y: -1}];
// function is called when a user left clicks a mat
// if the mat has a ninja then they lose!
// if the mat has a 0 then adjacent zeroes are filled
function howMany(i, j, event) {
  setTimer(0); // don't start counting until the user starts guessing
  if(inputMode === "MARK") {
    return mark(event);
  }
  // doing it this way so we can recursively search
  const element = getElementBy(i, j);
  let numNinjas = 0;
  if(element.disabled || element.innerText === "X") {
    return; // break case for recursion
  }
  for(let offset of offsets) {
    let validInY = i+offset.y > -1 && i+offset.y < theDojo.length;
    let validInX = j+offset.x > -1 && j+offset.x < theDojo[i].length;
    if(validInX && validInY) {
      numNinjas += theDojo[i+offset.y][j+offset.x];
    }
  }
  element.innerText = numNinjas;
  element.disabled = true;
  element.blur();
  unchecked--;
  if(numNinjas === 0) {
    element.innerText = "";
    for(let offset of offsets) {
      let validInY = i+offset.y > -1 && i+offset.y < theDojo.length;
      let validInX = j+offset.x > -1 && j+offset.x < theDojo[i].length;
      if(validInX && validInY) {
        howMany(i+offset.y, j+offset.x, getElementBy(i+offset.y, j+offset.x));
      }
    }
  }
  if(theDojo[i][j] != 0) {
    element.style.backgroundColor = "red";
    return gameOver("LOSE");
  } else if(unchecked < 1) {
    dojoDiv.style.backgroundColor = "#eee";
    return gameOver("WIN");
  }
}

// returns a value between 0 and `max` non-inclusively
function randInt(max) {
  return Math.floor(Math.random() * max);
}

// shuffles the values of a 2d array in place
// assumes a rectangular playfield at least 1x1
function shuffle2d(arr2d) {
  const height = arr2d.length;   // will break if arr2d is null
  const width = arr2d[0].length; // will break if arr2d is empty
  for(let i=0; i<height; i++) {
    for(let j=0; j<width; j++) {
      let y = randInt(height);
      let x = randInt(width);
      [arr2d[i][j], arr2d[y][x]] = [arr2d[y][x], arr2d[i][j]];
    }
  }
}

// function is called when the user right clicks
// the square gains an "X" to indicate a ninja may be hiding there
// of if it was already marked then unmark it
function mark(event) {
  event.preventDefault();
  if(!event.target.innerText) {
    event.target.style.color = "#f00";
    event.target.innerText = "X";
  } else {
    event.target.style.color = "#000";
    event.target.innerText = "";
    event.target.blur();
  }
}

// the game needed more challenge... double the ninjas!
function hardMode(ninjaCount = 20) {
  if(timer) {
    clearInterval(timer);
    timerDiv.innerText = 0;
  }
  timerDiv.style.color = "#fff"; 
  document.querySelector("body").style.backgroundColor = "#222";
  const button = document.querySelector("button.hard-mode")
  button.disabled = true;
  button.classList.add("dark-mode");
  button.innerText = "Wait I was joking!"
  titleDiv.classList.add("dark-mode");
  titleDiv.innerText = "HARDCORE MODE";
  unchecked = theDojo.length*theDojo[0].length - ninjaCount;
  for(let i=0; i<theDojo.length; i++) {
    for(let j=0; j<theDojo[i].length; j++) {
      if(ninjaCount > 0) {
        ninjaCount--;
        theDojo[i][j] = 1;
      } else {
        theDojo[i][j] = 0;
      }
    }
  }
  shuffle2d(theDojo);
  dojoDiv.innerHTML = render(theDojo);
}

function setTimer(startValue) {
  if(!timer) {
    timerDiv.innerText = startValue;
    timer = setInterval( () => {
      let time = parseInt(timerDiv.innerText) + 1;
      timerDiv.innerText = time; 
    }, 1000);
  }
}

// basically starts the whole game
function gameStart() {
  // make sure the controls button works as advertised 
  document.querySelector("#controls button").disabled = true;
  shuffle2d(theDojo);
  // uncomment to show the ninja locations
  // console.table(theDojo);
  // draw the game into index.html
  dojoDiv.innerHTML = render(theDojo);
}

gameStart();