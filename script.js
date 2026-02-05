const objectPool = [
  {name:"Smartphone", price:120, img:"https://via.placeholder.com/300x200"},
  {name:"Console", price:150, img:"https://via.placeholder.com/300x200"},
  {name:"Casque audio", price:80, img:"https://via.placeholder.com/300x200"},
  {name:"Tablette", price:200, img:"https://via.placeholder.com/300x200"},
  {name:"Voyage", price:500, img:"https://via.placeholder.com/300x200"},
  {name:"TV 4K", price:400, img:"https://via.placeholder.com/300x200"}
];

const SPEED = 0.02; // €/ms
const MIN_PRICE = 10;
const PAY_TIME = 10;

function initCard(card) {
  const slot = card.dataset.slot;
  let state = JSON.parse(localStorage.getItem("auction_"+slot));

  if (!state) {
    const obj = objectPool[Math.floor(Math.random()*objectPool.length)];
    state = {
      object: obj,
      startPrice: obj.price,
      startTime: Date.now(),
      locked: false
    };
    localStorage.setItem("auction_"+slot, JSON.stringify(state));
  }

  render(card, state);
  start(card, slot);
}

function render(card, state) {
  card.innerHTML = `
    <div class="content">
      <img src="${state.object.img}">
      <h2>${state.object.name}</h2>
      <p class="description">Objet premium en enchère</p>
      <p class="price">Prix actuel : <span class="price-value"></span> €</p>
      <p class="viewers">👀 <span class="count">${Math.floor(Math.random()*20+5)}</span> personnes regardent</p>
      <button class="lock-btn">Bloquer le prix</button>
      <button class="pay-btn">Payer maintenant</button>
    </div>
    <div class="rotation-overlay"></div>
  `;
}

function start(card, slot) {
  const priceEl = card.querySelector(".price-value");
  const lockBtn = card.querySelector(".lock-btn");
  const payBtn = card.querySelector(".pay-btn");
  const overlay = card.querySelector(".rotation-overlay");

  let state = JSON.parse(localStorage.getItem("auction_"+slot));

  function update() {
    if (!state.locked) {
      const elapsed = Date.now() - state.startTime;
      let price = Math.max(
        MIN_PRICE,
        state.startPrice - elapsed * SPEED
      );
      priceEl.textContent = price.toFixed(2);

      if (price <= MIN_PRICE) rotate();
    }
  }

  const interval = setInterval(update, 100);

  lockBtn.onclick = () => {
    state.locked = true;
    localStorage.setItem("auction_"+slot, JSON.stringify(state));
    lockBtn.style.display = "none";
    payBtn.style.display = "block";
    startPayCountdown();
  };

  function startPayCountdown() {
    let t = PAY_TIME;
    payBtn.textContent = `Payer maintenant (${t}s)`;
    const timer = setInterval(() => {
      t--;
      payBtn.textContent = `Payer maintenant (${t}s)`;
      if (t <= 0) {
        clearInterval(timer);
        rotate();
      }
    }, 1000);

    payBtn.onclick = () => {
      clearInterval(timer);
      saveWinner(state.object.name, priceEl.textContent);
      rotate();
    };
  }

  function rotate() {
    clearInterval(interval);
    overlay.style.display = "flex";
    let c = 5;
    overlay.textContent = `Prochain objet : ${c}`;
    const rot = setInterval(() => {
      c--;
      overlay.textContent = `Prochain objet : ${c}`;
      if (c <= 0) {
        clearInterval(rot);
        localStorage.removeItem("auction_"+slot);
        initCard(card);
      }
    }, 1000);
  }
}

function saveWinner(name, price) {
  const winners = JSON.parse(localStorage.getItem("winners") || "[]");
  winners.unshift({name, price, time: new Date().toLocaleString()});
  localStorage.setItem("winners", JSON.stringify(winners.slice(0,10)));
}

document.querySelectorAll(".item-card").forEach(initCard);
