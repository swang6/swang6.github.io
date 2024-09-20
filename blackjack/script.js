// Game variables
let bankroll = 100;
let currentBet = 0;
let playerHand = [];
let dealerHand = [];
let deck = [];
let gameInProgress = false;

// Card values and suits
const cardValues = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'J': 10, 'Q': 10, 'K': 10, 'A': 11
};
const suits = ['♠', '♥', '♦', '♣'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// DOM elements
const bankrollDisplay = document.getElementById('bankroll');
const betDisplay = document.getElementById('current-bet');
const dealerCardsDiv = document.getElementById('dealer-cards');
const playerCardsDiv = document.getElementById('player-cards');
const dealButton = document.getElementById('deal');
const hitButton = document.getElementById('hit');
const standButton = document.getElementById('stand');
const doubleButton = document.getElementById('double');
const bet1Button = document.getElementById('bet-1');
const clearBetButton = document.getElementById('clear-bet');

// Initialize deck
function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push({ rank, suit });
        }
    }
    deck = shuffle(deck);
}

// Shuffle deck
function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// Deal card
function dealCard() {
    return deck.pop();
}

// Display card
function displayCard(card) {
    return `${card.rank}${card.suit}`;
}

// Calculate hand value with Ace handling (1 or 11)
function calculateHandValue(hand) {
    let value = 0;
    let aceCount = 0;
    for (let card of hand) {
        value += cardValues[card.rank];
        if (card.rank === 'A') aceCount++;
    }
    // Convert Ace to 1 if value exceeds 21
    while (value > 21 && aceCount > 0) {
        value -= 10;
        aceCount--;
    }
    return value;
}

// Update UI
function updateUI() {
    bankrollDisplay.textContent = bankroll;
    betDisplay.textContent = currentBet;
    playerCardsDiv.innerHTML = playerHand.map(card => `<div class="card">${displayCard(card)}</div>`).join('');
    dealerCardsDiv.innerHTML = dealerHand.slice(0, 1).map(card => `<div class="card">${displayCard(card)}</div>`).join('') + '<div class="card">?</div>';
}

// Handle bet
bet1Button.addEventListener('click', () => {
    if (!gameInProgress && bankroll > 0) {
        currentBet += 1;
        bankroll -= 1;
        updateUI();
        dealButton.disabled = false;
    }
});

// Clear bet
clearBetButton.addEventListener('click', () => {
    bankroll += currentBet;
    currentBet = 0;
    updateUI();
    dealButton.disabled = true;
});

// Deal cards
dealButton.addEventListener('click', () => {
    if (currentBet > 0) {
        createDeck();
        playerHand = [dealCard(), dealCard()];
        dealerHand = [dealCard(), dealCard()];
        gameInProgress = true;
        updateUI();
        dealButton.disabled = true;
        hitButton.disabled = false;
        standButton.disabled = false;
        doubleButton.disabled = false;
    }
});

// Hit
hitButton.addEventListener('click', () => {
    playerHand.push(dealCard());
    if (calculateHandValue(playerHand) > 21) {
        endGame(false); // Player busts
    } else {
        updateUI();
    }
});

// Stand
standButton.addEventListener('click', () => {
    dealerTurn();
});

// Dealer's turn
function dealerTurn() {
    while (calculateHandValue(dealerHand) < 17) {
        dealerHand.push(dealCard());
    }
    updateUI();
    determineWinner();
}

// Determine winner
function determineWinner() {
    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(dealerHand);

    if (playerValue > 21) {
        endGame(false); // Player busts
    } else if (dealerValue > 21 || playerValue > dealerValue) {
        endGame(true); // Player wins
    } else if (dealerValue === playerValue) {
        endGame(null); // Push
    } else {
        endGame(false); // Dealer wins
    }
}

// End game
function endGame(playerWon) {
    hitButton.disabled = true;
    standButton.disabled = true;
    doubleButton.disabled = true;

    if (playerWon === true) {
        bankroll += currentBet * 2;
    } else if (playerWon === null) {
        bankroll += currentBet; // Push, return bet
    }

    currentBet = 0;
    gameInProgress = false;
    updateUI();
    dealButton.disabled = false;
}

updateUI(); // Initialize UI
