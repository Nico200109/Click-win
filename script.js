const objectPool = [
  {name:"Smartphone", price:120, img:"https://via.placeholder.com/300x200"},
  {name:"Console", price:150, img:"https://via.placeholder.com/300x200"},
  {name:"Casque audio", price:80, img:"https://via.placeholder.com/300x200"},
  {name:"Tablette", price:200, img:"https://via.placeholder.com/300x200"},
  {name:"Voyage", price:900, img:"https://via.placeholder.com/300x200"}
];

const cards = document.querySelectorAll(".item-card");

function isLogged() {
  return localStorage.getItem("user") !== null;
}

function loadAuction(card, index) {
  let state = JSON.parse(localStorage.getItem("auction_"+index));

  if (!state) {
    const obj = objectPool[Math.floor(Math.random()*objectPool.length)];
    state = { object: obj, price: obj.price };
    localStorage.setItem("auction_"+index, JSON.stringify(state));
  }

  render(card, state);
  startAuction(card, index);
}

function render(card, state) {
  card.innerHTML = `
    <img src="${state.object.img}">
    <h2>${state.object.name}</h2>
    <p class="price">Prix : <span class="price-value">${state.price.toFixed(2)}</span> €</p>
    <p class="viewers">👀 <span class="count">${Math.floor(Math.random()*10+5)}</span> personnes regardent</p>
    <button class="lock-btn">Bloquer le prix</button>
    <button class="pay-btn"></button>
    <div class="rotation-overlay"></div>
  `;
}

function startAuction(card, index) {
  const priceEl = card.querySelector(".price-value");
  const lockBtn = card.querySelector(".lock-btn");
  const payBtn = card.querySelector(".pay-btn");
  const overlay = card.querySelector(".rotation-overlay");

  let state = JSON.parse(localStorage.getItem("auction_"+index));

  const interval = setInterval(() => {
    if (state.price > 10) {
      state.price -= 0.5;
      priceEl.textContent = state.price.toFixed(2);
      localStorage.setItem("auction_"+index, JSON.stringify(state));
    }
  }, 300);

  lockBtn.onclick = () => {
    if (!isLogged()) return alert("Connectez-vous pour enchérir");

    clearInterval(interval);
    lockBtn.style.display = "none";
    payBtn.style.display = "block";

    let t = 10;
    payBtn.textContent = `Payer (${t}s)`;

    const payTimer = setInterval(() => {
      t--;
      payBtn.textContent = `Payer (${t}s)`;
      if (t === 0) {
        clearInterval(payTimer);
        rotate(card, index);
      }
    }, 1000);

    payBtn.onclick = () => {
      clearInterval(payTimer);
      const winners = JSON.parse(localStorage.getItem("winners") || "[]");
      const user = JSON.parse(localStorage.getItem("user"));
      winners.unshift({ user:user.name, object:state.object.name, price:state.price.toFixed(2) });
      localStorage.setItem("winners", JSON.stringify(winners));
      rotate(card, index);
    };
  };
}

function rotate(card, index) {
  const overlay = card.querySelector(".rotation-overlay");
  overlay.style.display = "flex";

  let c = 5;
  overlay.textContent = `Prochain objet : ${c}`;

  const r = setInterval(() => {
    c--;
    overlay.textContent = `Prochain objet : ${c}`;
    if (c === 0) {
      clearInterval(r);
      localStorage.removeItem("auction_"+index);
      loadAuction(card, index);
    }
  }, 1000);
}

cards.forEach((card, i) => loadAuction(card, i));
