// messages to greet a user in the console
var style1="color:red;font-size:1.5rem;font-weight:bold;";
var style2="color:cyan;font-size:1.5rem;font-weight:bold;";
console.log("%c" + "IF YOU ARE IN HERE THEN YOU ARE CHEATING!", style1);
console.log("%c" + "IF YOU ARE A DOJO STUDENT...", style2);
console.log("%c" + "GOOD LUCK THIS IS A CHALLENGE!", style2);

// various constants go here
var theDojo = [ [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ];
var dojoDiv = document.querySelector("#the-dojo");
var titleDiv = document.querySelector("#title")
var guesses = [];
var ninjaCount = 10; // should be a slight challenge
var unchecked = theDojo.length*theDojo[0].length - ninjaCount;
                
// shuffle the dojo
shuffle2d(theDojo);

// shows the dojo
console.table(theDojo);
    
// Creates the rows of buttons for this game
function render(theDojo) {
  var result = "";
  for(var i=0; i<theDojo.length; i++) {
    result += `<div class="row">`;
    for(var j=0; j<theDojo[i].length; j++) {
        result += `<button class="tatami" 
                    onclick="howMany(${i}, ${j})"
                    onContextMenu="mark(${i}, ${j}, event)">
                  </button>`;
    }
    result += "</div>";
  }
  return result;
}
    
// adds the rows of buttons into <div id="the-dojo"></div> 
dojoDiv.innerHTML = render(theDojo);

// call this function when the game ends
function gameOver(condition) {
  var buttons = document.querySelectorAll("button");
  for(var button of buttons) {
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
  var selector = `.row:nth-child(${i+1}) button:nth-child(${j+1})`;
  return document.querySelector(selector);
}

// function is called when a user left clicks a mat
// if the mat has a ninja then they lose!
// if the mat has a 0 then adjacent zeroes are filled
function howMany(i, j) {
  var element = getElementBy(i, j);
  var numNinjas = 0;
  var offsets = [{x: 0, y: -1}, {x: 1, y: -1}, {x: 1, y: 0}, {x: 1, y: 1},
    {x: 0, y: 1}, {x: -1, y: 1}, {x: -1, y: 0}, {x: -1, y: -1}];
  if(element.disabled || element.innerText == "X") {
    return; // break case for recursion
  }
  for(var offset of offsets) {
    var validInY = i+offset.y > -1 && i+offset.y < theDojo.length;
    var validInX = j+offset.x > -1 && j+offset.x < theDojo[i].length;
    if(validInX && validInY) {
      numNinjas += theDojo[i+offset.y][j+offset.x];
    }
  }
  element.innerText = numNinjas;
  element.disabled = true;
  element.blur();
  unchecked--;
  if(numNinjas == 0) {
    for(var offset of offsets) {
      var validInY = i+offset.y > -1 && i+offset.y < theDojo.length;
      var validInX = j+offset.x > -1 && j+offset.x < theDojo[i].length;
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
  var height = arr2d.length;   // will break if arr2d is null
  var width = arr2d[0].length; // will break if arr2d is empty
  for(var i=0; i<height; i++) {
    for(var j=0; j<width; j++) {
      var newY = randInt(height);
      var newX = randInt(width);
      var temp = arr2d[i][j];
      arr2d[i][j] = arr2d[newY][newX];
      arr2d[newY][newX] = temp;
    }
  }
}

// function is called when the user right clicks
// the square gains an "X" to indicate a ninja may be hiding there
// of if it was already marked then unmark it
function mark(i, j, event) {
  event.preventDefault(); // want to prevent normal left click behavior
  theDojo[i][j] ? console.log("Correct") : console.log("Wrong");
  if(!event.target.innerText) {
    event.target.innerText = "X";
  } else {
    event.target.innerText = "";
    event.target.blur();
  }
}