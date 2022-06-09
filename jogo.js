// funcoes de criacao de cards

function createImage(imgPath = "./img/box.png", front = false) {
  let face = {
    face: front ? "face da carta" : "verso da carta",
    classe: front ? "card-front" : "card-back",
  };
  const img = document.createElement("img");
  img.src = imgPath;
  img.classList.add(face.classe);
  img.alt = face.face;

  return img;
}

function createCard(frontPath) {
  const card = document.createElement("div");
  card.classList.add("card");

  const img_front = createImage(frontPath, true);
  const img_back = createImage();

  card.appendChild(img_front);
  card.appendChild(img_back);

  return card;
}

function createAllCards(data, main) {
  data = [...data, ...data];

  for (let i = 0; i < data.length; i++) {
    const card = createCard(data[i].image);
    card.dataset.character_id = data[i].id;

    boardSize(data.length, card);

    main.appendChild(card);
  }
}

// ====================
// logica do jogo
function flipcard() {
  if (lockBoard) {
    return;
  }
  if (this === firstCard) {
    return;
  }

  this.classList.add("flip");
  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }
  secondCard = this;

  checkForMath();
}

function checkForMath() {
  if (firstCard.dataset.character_id === secondCard.dataset.character_id) {
    disableCards();
    pontuacao -= 1;

    checkVictory();

    return;
  }
  unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipcard);
  secondCard.removeEventListener("click", flipcard);

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    resetBoard();
  }, 1500);
}

function checkVictory() {
  if (pontuacao < 1) {
    somDeHIT.play();
    fim.classList.remove("hidden");
    confetti({
      particleCount: 100,
      startVelocity: 30,
      spread: 360,
    });
  }
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function shuffle(cards, data) {
  cards.forEach((card) => {
    let randomPosition = Math.floor(Math.random() * data.length);

    card.style.order = randomPosition;
  });
}

function boardSize(size, element) {
  element.classList.remove("dificil");
  element.classList.remove("intermediario");

  if (size === 18) {
    element.classList.add("intermediario");
  } else if (size === 24) {
    element.classList.add("dificil");
  }
}

// =====================================
// inicializacao do tabuleiro
function init(data, main) {
  resetBoard();
  boardSize(data.length * 2, main);

  createAllCards(data, main);

  const cards = document.querySelectorAll(".card");

  shuffle(cards, data);

  cards.forEach((card) => {
    card.addEventListener("click", flipcard);
  });
}

// ------------------------------------
//  variaveis globais do jogo
// telas inicial e final
const inicio = document.querySelector(".inicio");
const fim = document.querySelector(".fim");

// opçoes de nivel apresentadas
const facil = document.querySelector("#facil");
const intermediario = document.querySelector("#intermediario");
const dificil = document.querySelector("#dificil");

const main = document.getElementsByClassName("memory-game")[0];

btn_init = document.querySelector("#comeco");
btn_end = document.querySelector("#fim");

const somDeHIT = new Audio();
somDeHIT.src = "./efeitos/clear.wav";

let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;
let pontuacao = 0;
// --------------------------------------

function resetGame() {
  resetBoard();

  let lista = facil.checked
    ? dataFacil
    : intermediario.checked
    ? dataIntermediario
    : dataDificil;

  pontuacao = lista.length;

  init(lista, main);

  inicio.classList.add("hidden");
}

btn_init.addEventListener("click", resetGame);

btn_end.addEventListener("click", () => {
  inicio.classList.remove("hidden");
  main.innerHTML = "";

  fim.classList.add("hidden");
});
