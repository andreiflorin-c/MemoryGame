// some global variables so they're not passed as parameters all the time
var matchArray = [];
var timeouts = [];
var score = 0;
var cardArray = [];

// play button
function clickPlay() {
    // look for selected difficulty from the radio buttons on the home page
    let temp = document.getElementsByName("difficulty");
    for (i = 0; i < temp.length; i++) {
        if (temp[i].checked)
            // stores difficulty so it can be accessed from the next page
            // also deletes it on browser close, so it's not memorised on next use
            sessionStorage.setItem('difficulty', temp[i].value);
    }
    // switch to game page
    window.location.href = 'game.html';
}

// return from game to home page
function clickBack() {
    window.location.href = 'index.html';
}

// executes when the game page loads
function start() {
    // visual part
    // creates the cards in the board depending on difficulty
    createGameBoard();
    // functional part
    // fills the game board with images and "links" the visual elements to JS objects
    // also makes cards flippable on click
    fillGameBoard();
}

function createGameBoard() {
    // get empty div from HTML to create cards in it
    const gameBoard = document.getElementById("game-board");
    console.log(gameBoard);
    // get difficulty previously stored
    difficulty = sessionStorage.getItem('difficulty');
    // some weird math to get a 3:4 aspect ratio for each card, also setting the board size
    switch (difficulty) {
        case 'Easy':
            //rows = 4, cols = 6;
            boardSize = 24;
            cardHeight = 'calc((100%/4) - 10px)', cardWidth = 'calc((100%/6) - 10px)';
            containerWidth = 'calc(0.75 * (100vh - 93px) * 6/4)';
            break;
        case 'Medium':
            //rows = 5, cols = 8;
            boardSize = 40;
            cardHeight = 'calc((100%/5) - 10px)', cardWidth = 'calc((100%/8) - 10px)';
            containerWidth = 'calc(0.75 * (100vh - 93px) * 8/5)';
            break;
        case 'Hard':
            //rows = 6, cols = 10;
            boardSize = 60;
            cardHeight = 'calc((100%/6) - 10px)', cardWidth = 'calc((100%/10) - 10px)';
            containerWidth = 'calc(0.75 * (100vh - 93px) * 10/6)';
            break;
    }
    // some work-around to properly set the game board width
    let container = document.getElementsByClassName("container");
    container[0].style.setProperty('width', containerWidth);
    // create the empty cards
    for (i = 0; i < boardSize; i++) {
        let card = document.createElement("div");
        card.className = "card";
        card.id = i;
        card.style.setProperty('width', cardWidth);
        card.style.setProperty('height', cardHeight);
        gameBoard.appendChild(card);
    }
}

function fillGameBoard() {
    // get difficulty to figure how many cards to fill
    let difficulty = sessionStorage.getItem('difficulty');
    // get score from HTML to modify it later
    let scoreDisplay = document.getElementById('score-display');
    // get HTML cards to link them to the JS objects
    let htmlCardArray = document.getElementsByClassName("card");
    let imgArray = [];
    switch (difficulty) {
        case 'Easy':
            max = 24;
            break;
        case 'Medium':
            max = 40;
            break;
        case 'Hard':
            max = 60;
            break;
    }
    // pairs of numbers from 0 to max/2, each corresponding to an image
    for (i = 0; i < max; i = i + 2) {
        imgArray[i] = i / 2;
        imgArray[i + 1] = i / 2;
    }
    // shuffle for the first time
    shuffle(imgArray);
    // the game may be too easy if there are identical images next to each other
    // shuffle more times until that's no longer the case
    while (hasAdjacentImgs(imgArray)) {
        shuffle(imgArray);
    }
    // create the JS objects and fill the game board
    for (i = 0; i < max; i++) {
        // JS object with id meaning its position, card element from HTML, and img meaning its randomly-selected image 
        cardArray[i] = {
            id: i,
            htmlCard: htmlCardArray[i],
            img: imgArray[i]
        };
        // all cards are initially hidden
        cardArray[i].htmlCard.innerHTML = "backface";
        // flip and try to match on click
        cardArray[i].htmlCard.onclick = (event) => {
            // when playing the game in the HTML there's no info from JS anymore
            // use info from the HTML that was inserted earlier in createGameBoard()
            index = event.srcElement.id;
            console.log(`Before flip\ninnerHTML = ${cardArray[index].htmlCard.innerHTML}\nimg = ${cardArray[index].img}`);
            // if card is not flipped, flip it
            // otherwise do nothing
            if (cardArray[index].htmlCard.innerHTML == "backface") {
                flip(cardArray[index]);
                // update score
                // +2 after match or stays the same if no match was made
                scoreDisplay.innerHTML = score;
            }
        };
    }
    // for debugging purposes
    for (i = 0; i < max; i++) {
        console.log(cardArray[i]);
    }
}

// where most of the matching algorithm happens
function flip(card) {
    switch (matchArray.length) {
        // no cards are flipped
        // flipping the first card
        case 0:
            // reveal card
            card.htmlCard.innerHTML = card.img;
            // player has 3 seconds to flip another card
            timeouts.push(setTimeout(() => { flipBack(card) }, 3000));
            matchArray.push(card);
            console.log("matchArray length = " + matchArray.length);
            console.log(`After flip\ninnerHTML = ${card.htmlCard.innerHTML}\nimg = ${card.img}`);
            break;
        // one card is already flipped
        // flipping the next card
        case 1:
            // clear all timeouts to prevent some weird behaviours
            // cards will not be flipped back if matched
            // or be flipped back at the same time after 1 second if not matched
            clearAllTimeouts(timeouts);
            // reveal second card
            card.htmlCard.innerHTML = card.img;
            matchArray.push(card);
            console.log("matchArray length = " + matchArray.length);
            // at this point there are two cards in the match array
            // check if they're two distinct cards with the same image
            if ((matchArray[0].id != matchArray[1].id) && (matchArray[0].img === matchArray[1].img)) {
                // successful match
                // add to score, display will be updated after returning from flip
                score = score + 2;
                console.log(`Matched. Score = ${score}`);
                // empty match array for future matches
                matchArray.length = 0;
            }
            else {
                console.log(`Not matched. Score = ${score}`);
                // flip back both cards at the same time
                // after one second so that the player can remember the images
                setTimeout(() => {
                    flipBack(matchArray[1]);
                    flipBack(matchArray[0]);
                }, 1000);
            }
            break;
        // cannot flip more than two cards
        // do nothing if tried
        default:
            break;
    }
}

// flip back a card and eliminate it from the match array
function flipBack(card) {
    console.log("In flipBack");
    // hide card image again
    card.htmlCard.innerHTML = "backface";
    // pop it out of match array
    matchArray.pop();
    console.log("matchArray length = " + matchArray.length);
}

// shuffle image array
function shuffle(array) {
    var i = array.length,
        j = 0,
        temp;

    while (i--) {
        j = Math.floor(Math.random() * (i + 1));
        // swap randomly chosen element with current element
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;

    }
}

// check if image array has identical images next to each other
function hasAdjacentImgs(array) {
    for (i = 0; i < array.length; i++)
        if (array[i] == array[i + 1])
            return true;
    return false;
}

// used in flip
function clearAllTimeouts(timeouts) {
    for (let i = 0; i < timeouts.length; i++) {
        clearTimeout(timeouts[i]);
    }
    timeouts.length = 0;
}