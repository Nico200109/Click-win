const objectPool = [
  {name:"Smartphone", price:120, img:"https://via.placeholder.com/300x200"},
  {name:"Console", price:150, img:"https://via.placeholder.com/300x200"},
  {name:"Tablette", price:200, img:"https://via.placeholder.com/300x200"},
  {name:"Casque audio", price:80, img:"https://via.placeholder.com/300x200"},
  {name:"Voyage", price:500, img:"https://via.placeholder.com/300x200"}
];

const cards = document.querySelectorAll('.item-card');

function getState(slot) {
  return JSON.parse(localStorage.getItem("auction_" + slot));
}

function saveState(slot, state) {
  localStorage.setItem("auction_" + slot, JSON.stringify(state));
}

function randomObject() {
  return objectPool[Math.floor(Math.random() * objectPool.length)];
}

function loadCard(card, state) {
  card.innerHTML = `
    <div class="content">
      <img src="${state.img}">
      <h2>${state.name}</h2>
      <p class="description">Offre limitée</p>
      <p class="price">Prix actuel : <span class="price-value">${state.price.toFixed(2)}</span> €</p>
      <p class="viewers">👀 ${state.viewers} personnes regardent</p>
      <button class="lock-btn">Bloquer le prix</button>
      <button class="pay-btn">Payer maintenant</button>
    </div>
    <div class="rotation-overlay"></div>
  `;
}

function startAuction(card, slot) {
  let state = getState(slot);
  if (!state) return;

  const priceEl = card.querySelector('.price-value');
  const lockBtn = card.querySelector('.lock-btn');
  const payBtn = card.querySelector('.pay-btn');
  const overlay = card.querySelector('.rotation-overlay');

  let interval = setInterval(() => {
    if (!state.locked && state.price > 10) {
      state.price -= 0.5;
      priceEl.textContent = state.price.toFixed(2);
      saveState(slot, state);
    }

    if (state.price <= 10) {
      clearInterval(interval);
      rotate(card, slot);
    }
  }, 300);

  lockBtn.onclick = () => {
    state.locked = true;
    saveState(slot, state);
    lockBtn.style.display = "none";
    payBtn.style.display = "block";

    let countdown = 10;
    payBtn.textContent = `Payer (${countdown}s)`;

    let payTimer = setInterval(() => {
      countdown--;
      payBtn.textContent = `Payer (${countdown}s)`;
      if (countdown <= 0) {
        clearInterval(payTimer);
        rotate(card, slot);
      }
    }, 1000);

    payBtn.onclick = () => {
      clearInterval(payTimer);
      alert(`Objet remporté à ${state.price.toFixed(2)} €`);
      rotate(card, slot);
    };
  };
}

function rotate(card, slot) {
  const overlay = card.querySelector('.rotation-overlay');
  overlay.style.display = "flex";
  let count = 5;
  overlay.textContent = `Prochain objet : ${count}`;

  let timer = setInterval(() => {
    count--;
    overlay.textContent = `Prochain objet : ${count}`;
    if (count <= 0) {
      clearInterval(timer);
      initSlot(card, slot);
    }
  }, 1000);
}

function initSlot(card, slot) {
  const obj = randomObject();
  const state = {
    name: obj.name,
    price: obj.price,
    img: obj.img,
    locked: false,
    viewers: Math.floor(Math.random() * 20 + 5)
  };
  saveState(slot, state);
  loadCard(card, state);
  startAuction(card, slot);
}

cards.forEach(card => {
  const slot = card.dataset.slot;
  let state = getState(slot);
  if (!state) {
    initSlot(card, slot);
  } else {
    loadCard(card, state);
    startAuction(card, slot);
  }
});
