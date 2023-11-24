// before game starts, while entering player's name
const playGameButton = document.querySelector('button');

playGameButton.addEventListener('click', (e) => {
    const player1_name = document.getElementById('player1Name').value;
    const player2_name = document.getElementById('player2Name').value;

    const first_player = document.getElementById('firstPlayer');
    const second_player = document.getElementById('secondPlayer');
    first_player.innerHTML = player1_name;
    second_player.innerHTML = player2_name;

    let gridDisplay = document.getElementById('grid');
    gridDisplay.classList.add('open');
    
    let playerScoreDisplay = document.querySelector('.player_score');
    playerScoreDisplay.classList.add('open');

    let enterPlayerNamesDisplay = document.querySelector('.enter_playerName_class');
    enterPlayerNamesDisplay.classList.remove('open');

});



// when game started
const cardArray = [
    {
        name: 'pizza',
        img: 'images/pizza.png'
    },
    {
        name: 'burger',
        img: 'images/burger.png'
    },
    {
        name: 'fries',
        img: 'images/fries.png'
    },
    {
        name: 'hotdog',
        img: 'images/hotdog.png'
    },
    {
        name: 'shake',
        img: 'images/shake.png'
    },
    {
        name: 'donut',
        img: 'images/donut.png'
    },
]

function shuffleCardComparison() {
    let a = Math.random();
    let b = Math.random();
    if(a - b < 0)
        return -1; // negative value
    else if(a - b > 0)
        return 1; // positive value
    else
        return 0;
}

cardArray.sort(shuffleCardComparison)

const gridDisplay = document.getElementById('grid')

const createBoard = () => {
    
    const imgCardArray = [];

    for(let i = 0; i < 6; i++) {
       for(let j = 0; j < 2; j++) {
            const cardImage = document.createElement('img');
            const cardId = `${i}_${j === 0 ? 'a' : 'b'}`;

            cardImage.setAttribute('src', 'images/blank_card.png');
            cardImage.setAttribute('data-id', cardId);

            cardImage.classList.add('card-image');
            cardImage.addEventListener('click', handleCardClick);

            imgCardArray.push(cardImage);
       }
    }
    imgCardArray.sort(() => 0.5 - Math.random());

    imgCardArray.forEach(item => gridDisplay.appendChild(item));
    
}

createBoard()

console.log(gridDisplay)

let counter = 0;
let prevId = null;
let plus_score_player1 = 0;
let plus_score_player2 = 0;
let minus_score_player1 = 0;
let minus_score_player2 = 0;
let score = 0;
let isPlayer1 = true;
let replacedCard_set = new Set();

const result1Display = document.getElementById('result1');
const result2Display = document.getElementById('result2');

function handleCardClick(e) {
    const clickedCard = e.target;
    const cardId = clickedCard.getAttribute('data-id');
    // console.log(`Clicked card with id: ${cardId}`);
    if(replacedCard_set.has(cardId.substr(0, 1))) {
        // console.log("Already Selected 2 times, this card is out of current Game round.");
        return;
    }
    if(counter === 0) {
        prevId = cardId;
        counter++;
        const cardImage1 = document.querySelector(`[data-id = "${cardId}"]`);
        cardImage1.setAttribute('src', cardArray[parseInt(cardId.substr(0, 1))].img );
    } else if(counter === 1) {
        counter = 0;
        if( (cardId.substr(0, 1) === prevId.substr(0, 1)) ) {
            if( cardId.substr(2, 1) !== prevId.substr(2, 1)) {
                // correct ans -> 2 cards which look same are selected, user's score must increase
                
                if(isPlayer1 === true) {
                    plus_score_player1 = plus_score_player1 + 3;
                    score = plus_score_player1 + minus_score_player1;
                    result1Display.innerHTML = score;
                }
                    
                else {
                    plus_score_player2 = plus_score_player2 + 3;
                    score = plus_score_player2 + minus_score_player2;
                    result2Display.innerHTML = score;
                }
                    
                // also, we need to remove the 2 correct cards, for game to move on furthur
                // replace Correct Cards With White Card
                replaceCards(prevId, cardId);
                return;
            } 
        }
        // for wrong pick, reduce the score
        else {       
            
            if(isPlayer1 === true) {
                minus_score_player1 = minus_score_player1 - 1;
                score = plus_score_player1 + minus_score_player1;
                result1Display.innerHTML = score;
            }
                
            else {
                minus_score_player2 = minus_score_player2 - 1;
                score = plus_score_player2 + minus_score_player2;
                result2Display.innerHTML = score;
            }
        }
        
        // display the card, doesnt matter correct or wrong pick
        const cardImage2 = document.querySelector(`[data-id = "${cardId}"]`);
        cardImage2.setAttribute('src', cardArray[parseInt(cardId.substr(0, 1))].img );

       

        // set 2 sec timeout, then flip back both flipped cards with blank cards
        setTimeout(() => {
            // we have prevId and cardId, we need to flip them
            const cardImage1 = document.querySelector(`[data-id = "${prevId}"]`);
            cardImage1.setAttribute('src', 'images/blank_card.png');
            cardImage2.setAttribute('src', 'images/blank_card.png');
        }, 500)

        isPlayer1 = (isPlayer1 === true) ? false : true;
        // console.log(isPlayer1);

    }
}

function replaceCards(prevId, cardId) {
    const cardImage1 = document.querySelector(`[data-id = "${prevId}"]`);
    const cardImage2 = document.querySelector(`[data-id = "${cardId}"]`);
    // here, first we need to show the correct image of that card, after showing that
    // replace it with the white card
    cardImage1.setAttribute('src', cardArray[parseInt(prevId.substr(0, 1))].img);
    cardImage2.setAttribute('src', cardArray[parseInt(cardId.substr(0, 1))].img);

    setTimeout(()=>{ 
        // console.log("flipping to white cards in 0.5 sec...");
        cardImage1.setAttribute('src', 'images/white_card.png');
        cardImage2.setAttribute('src', 'images/white_card.png');
    }, 500)

    cardImage1.setAttribute('data-id', `${prevId}_replaced`);
    cardImage2.setAttribute('data-id', `${cardId}_replaced`);
    
    // we also need to mark the `i` value of these same card Images, so that they cant be 
    // selected again, we need to store them in a set
    replacedCard_set.add(`${cardId.substr(0, 1)}_replaced`);
    checkForWinner();
}

function checkForWinner() {
    if(replacedCard_set.size === cardArray.length) {
        console.log("We got a Winner");
        const firstPlayerFinalScore = parseInt(document.getElementById('result1').textContent);
        const secondPlayerFinalScore = parseInt(document.getElementById('result2').textContent);

        const player1Name = document.getElementById('firstPlayer').textContent;
        const player2Name = document.getElementById('secondPlayer').textContent;


        if (firstPlayerFinalScore > secondPlayerFinalScore) {
            alert(`${player1Name} is the winner!`);
        } else if (secondPlayerFinalScore > firstPlayerFinalScore) {
            alert(`${player2Name} is the winner!`);
        } else {
            alert("It's a tie!");
        }
    }
}


