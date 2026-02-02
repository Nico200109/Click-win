const objectPool = [
  {name:"Smartphone", price:120, img:"https://via.placeholder.com/300x200"},
  {name:"Console", price:150, img:"https://via.placeholder.com/300x200"},
  {name:"Casque audio", price:80, img:"https://via.placeholder.com/300x200"},
  {name:"Tablette", price:200, img:"https://via.placeholder.com/300x200"},
  {name:"Voyage", price:500, img:"https://via.placeholder.com/300x200"},
  {name:"TV 4K", price:700, img:"https://via.placeholder.com/300x200"}
];

const cards = document.querySelectorAll(".item-card");

/* ================= AUTH ================= */

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

function updateAuthUI() {
  const logged = localStorage.getItem("loggedIn") === "true";
  loginBtn.style.display = logged ? "none" : "inline-block";
  logoutBtn.style.display = logged ? "inline-block" : "none";
}

loginBtn.onclick = () => {
  const name = prompt("Votre prénom ?");
  if (name) {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userName", name);
    updateAuthUI();
  }
};

logoutBtn.onclick = () => {
  localStorage.removeItem("loggedIn");
  updateAuthUI();
};

updateAuthUI();

/* ================= AUCTION STATE ================= */

function getAuctionState(index) {
  return JSON.parse(localStorage.getItem(`auction_${index}`));
}

function saveAuctionState(index, state) {
  localStorage.setItem(`auction_${index}`, JSON.stringify(state));
}

/* ================= AUCTION ================= */

function loadAuction(card, index) {
  let state = getAuctionState(index);

  if (!state) {
    const obj = objectPool[Math.floor(Math.random() * objectPool.length)];
    state = {
      object: obj,
      price: obj.price,
      locked: false
    };
    saveAuctionState(index, state);
  }

  renderCard(card, index, state);
  startAuction(card, index);
}

function renderCard(card, index, state) {
  card.innerHTML = `
    <img src="${state.object.img}">
    <h2>${state.object.name}</h2>
    <p class="price">Prix : <span class="price-value">${state.price.toFixed(2)}</span> €</p>
    <p class="viewers">👀 <span class="count">${Math.floor(Math.random()*20+5)}</span> personnes regardent</p>
    <button class="lock-btn">Bloquer le prix</button>
    <button class="pay-btn" style="display:none;">Payer</button>
    <div class="rotation-overlay"></div>
  `;
}

function startAuction(card, index) {
  const priceEl = card.querySelector(".price-value");
  const lockBtn = card.querySelector(".lock-btn");
  const payBtn = card.querySelector(".pay-btn");
  const overlay = card.querySelector(".rotation-overlay");

  let state = getAuctionState(index);
  let price = state.price;
  let locked = state.locked;

  if (locked) {
    lockBtn.style.display = "none";
    payBtn.style.display = "block";
  }

  const interval = setInterval(() => {
    state = getAuctionState(index);
    if (!state.locked && state.price > 10) {
      state.price -= 0.5;
      priceEl.textContent = state.price.toFixed(2);
      saveAuctionState(index, state);
    }

    if (state.price <= 10) {
      clearInterval(interval);
      startRotation(card, index);
    }
  }, 300);

  lockBtn.onclick = () => {
    if (localStorage.getItem("loggedIn") !== "true") {
      alert("Connectez-vous pour enchérir");
      return;
    }

    state.locked = true;
    saveAuctionState(index, state);
    lockBtn.style.display = "none";
    payBtn.style.display = "block";

    payBtn.onclick = () => {
      const winners = JSON.parse(localStorage.getItem("winners") || "[]");
      winners.unshift({
        name: localStorage.getItem("userName"),
        object: state.object.name,
        price: state.price.toFixed(2)
      });
      localStorage.setItem("winners", JSON.stringify(winners));
      startRotation(card, index);
    };
  };
}

function startRotation(card, index) {
  const overlay = card.querySelector(".rotation-overlay");
  overlay.style.display = "flex";

  let counter = 5;
  overlay.textContent = `Prochain objet : ${counter}`;

  const interval = setInterval(() => {
    counter--;
    overlay.textContent = `Prochain objet : ${counter}`;

    if (counter === 0) {
      clearInterval(interval);
      const obj = objectPool[Math.floor(Math.random() * objectPool.length)];
      const newState = {
        object: obj,
        price: obj.price,
        locked: false
      };
      saveAuctionState(index, newState);
      loadAuction(card, index);
    }
  }, 1000);
}

/* ================= INIT ================= */

cards.forEach((card, index) => {
  loadAuction(card, index);
});
