const emojis = ['🐶', '🍕', '🚀', '🌈', '🎧', '🧩'];
let moves = 0;
let matches = 0;
let flippedCards = [];
let boardLocked = false;

const board = document.getElementById('board');
const movesEl = document.getElementById('moves');
const matchesEl = document.getElementById('matches');
const newGameBtn = document.getElementById('new-game');
const victoryEl = document.getElementById('victory');

function startGame() {
  board.innerHTML = '';
  victoryEl.hidden = true;
  moves = 0;
  matches = 0;
  movesEl.textContent = moves;
  matchesEl.textContent = matches;
  flippedCards = [];

  const allEmojis = [...emojis, ...emojis];
  shuffle(allEmojis);

  allEmojis.forEach((emoji, index) => {
    const card = createCard(emoji, index);
    board.appendChild(card);
  });
}

function createCard(emoji, index) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', 'Skjult kort');
  card.dataset.emoji = emoji;
  card.dataset.index = index;

  const front = document.createElement('div');
  front.classList.add('front');
  front.textContent = emoji;

  const back = document.createElement('div');
  back.classList.add('back');
  back.textContent = '❓';

  card.appendChild(back);
  card.appendChild(front);

  card.addEventListener('click', () => flipCard(card));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      flipCard(card);
    }
  });

  return card;
}

function flipCard(card) {
  if (boardLocked || card.classList.contains('flipped') || card.classList.contains('matched')) return;

  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    boardLocked = true;
    moves++;
    movesEl.textContent = moves;
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  const isMatch = card1.dataset.emoji === card2.dataset.emoji;

  if (isMatch) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    matches++;
    matchesEl.textContent = matches;
    flippedCards = [];
    boardLocked = false;

    if (matches === emojis.length) {
      showVictory();
    }
  } else {
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
      boardLocked = false;
    }, 1000);
  }
}

function showVictory() {
  victoryEl.hidden = false;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

newGameBtn.addEventListener('click', startGame);
startGame();

