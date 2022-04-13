/*card object has a position ID, image ID and image based on the image ID*/
/*7x4 board of cards, adaptable size depending on window size, lighten on hover, darken on hold, flip on click, flip back after 2s
if another card is flipped within 2s, check if they have the same image ID. if yes, don't flip back, add 2 points to the score. if not, do nothing.
also on each sucessful flip check if all the cards are flipped. if yes, stop the timer and win the game. if not, do nothing.
onclick=flip()
var cards = [];
for (let i=0; i<7; i++)
    {
        cards[i] = [];
        for(let j=0;j<4;j++)
            cards[i][j]=
    }
var flippedCards = [];
function flip(cardID) {
    setTimeout (flipBack, 2000);
    flippedCards.push(
}

*/
var matchArray = [];
var timeouts = [];
var score = 0;
var cardArray = [];


function clickPlay() {
    window.location.href = 'game.html';
    let temp = document.getElementsByName("difficulty");
    for (i = 0; i < temp.length; i++) {
        if (temp[i].checked)
            sessionStorage.setItem('difficulty', temp[i].value);
    }
}
function clickBack() {
    window.location.href = 'index.html';
}

function start() {
    createGameBoard();
    fillGameBoard();
}


function createGameBoard() {
    const gameBoard = document.getElementById("game-board");
    console.log(gameBoard);
    difficulty = sessionStorage.getItem('difficulty');
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
    let container = document.getElementsByClassName("container");
    container[0].style.setProperty('width', containerWidth);
    for (i = 0; i < boardSize; i++) {
        let card = document.createElement("div");
        card.className = "card";
        card.style.setProperty('width', cardWidth);
        card.style.setProperty('height', cardHeight);
        gameBoard.appendChild(card);
    }

}
function fillGameBoard() {
    let difficulty = sessionStorage.getItem('difficulty');
    let scoreDisplay = document.getElementById('score-display');
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
    //pairs of numbers from 0 to max/2, each corresponding to an image
    for (i = 0; i < max; i = i + 2) {
        imgArray[i] = i / 2;
        imgArray[i + 1] = i / 2;
    }

    shuffle(imgArray);
    while (hasAdjacentImgs(imgArray)) {
        shuffle(imgArray);
    }

    for (i = 0; i < max; i++) {
        cardArray[i] = {
            id: i,
            htmlCard: htmlCardArray[i],
            img: imgArray[i]
        };

        cardArray[i].htmlCard.innerHTML = "backface";
        cardArray[i].htmlCard.id = i;
        cardArray[i].htmlCard.onclick = (event) => {
            index = event.srcElement.id;
            console.log(`Before flip\ninnerHTML = ${cardArray[index].htmlCard.innerHTML}\nimg = ${cardArray[index].img}`);
            if (cardArray[index].htmlCard.innerHTML == "backface") {
                flip(cardArray[index]);
                scoreDisplay.innerHTML = score;
            }
        };
    }
    for (i = 0; i < max; i++) {
        console.log(cardArray[i]);
    }
}

function flip(card) {
    
    switch (matchArray.length) {
        case 0:
            card.htmlCard.innerHTML = card.img;
            timeouts.push(setTimeout(() => { flipBack(card) }, 3000));
            matchArray.push(card);
            console.log("matchArray length = " + matchArray.length);
            console.log(`After flip\ninnerHTML = ${card.htmlCard.innerHTML}\nimg = ${card.img}`);
            break;
        case 1:
            clearAllTimeouts(timeouts);
            card.htmlCard.innerHTML = card.img;
            matchArray.push(card);
            console.log("matchArray length = " + matchArray.length);
            if ((matchArray[0].img === matchArray[1].img) && (matchArray[0].id != matchArray[1].id)) {
                score = score + 2;
                console.log(`Matched. Score = ${score}`);
                matchArray.length = 0;
            }
            else {
                console.log(`Not matched. Score = ${score}`);
                setTimeout(() => {
                    flipBack(matchArray[1]);
                    flipBack(matchArray[0]);
                }, 1000);
            }
            break;
        default:
            break;

    }
}
function flipBack(card) {
    console.log("In flipBack");
    card.htmlCard.innerHTML = "backface";
    matchArray.length--;
    console.log("matchArray length = " + matchArray.length);
}


/*function flip(card, idArray, score) {
    if(!(matchArray.length >= 2)) {
        if (card.innerHTML === "backface") {
            card.innerHTML = idArray[getCardPosition(card)];
            timeouts.push(setTimeout(() => { flip(card, idArray) }, 2000));
            matchArray.push(idArray[getCardPosition(card)]);
            console.log(matchArray);
            if (matchArray.length === 2) {
                if (matchArray[0] === matchArray[1]) {
                    clearAllTimeouts(timeouts);
                    score = score + 2;
                }
                matchArray.length=0;
            }
        }
        else {
            matchArray.length=0;
            clearAllTimeouts(timeouts);
            card.innerHTML = "backface";
        }
    }  
}*/
function match(card1, card2) {
    /*to do*/

}


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

function hasAdjacentImgs(array) {
    for (i = 0; i < array.length; i++)
        if (array[i] == array[i + 1])
            return true;
    return false;
}


function clearAllTimeouts(timeouts) {
    for (let i = 0; i < timeouts.length; i++) {
        clearTimeout(timeouts[i]);
    }
    timeouts.length = 0;
}