const objectPool = [
  {
    name: "Smartphone",
    price: 120,
    img: "https://via.placeholder.com/300x200",
    description: "Smartphone dernière génération, écran OLED et excellente autonomie.",
    paymentTime: 8
  },
  {
    name: "Console",
    price: 150,
    img: "https://via.placeholder.com/300x200",
    description: "Console de jeux nouvelle génération, performances élevées.",
    paymentTime: 10
  },
  {
    name: "Casque audio",
    price: 80,
    img: "https://via.placeholder.com/300x200",
    description: "Casque sans fil avec réduction de bruit active.",
    paymentTime: 6
  },
  {
    name: "Montre connectée",
    price: 60,
    img: "https://via.placeholder.com/300x200",
    description: "Montre connectée pour le sport et la santé.",
    paymentTime: 7
  },
  {
    name: "Télévision",
    price: 350,
    img: "https://via.placeholder.com/300x200",
    description: "Télévision 4K UHD avec couleurs HDR.",
    paymentTime: 12
  }
];

const cards = document.querySelectorAll(".item-card");

if (cards.length === 0) {
  console.error("Aucune carte trouvée (.item-card)");
}

let state = [];

function initState() {
  state = Array.from(cards).map(() => {
    const obj = objectPool[Math.floor(Math.random() * objectPool.length)];
    return {
      object: obj,
      price: obj.price,
      locked: false
    };
  });
}

function renderCard(card, i) {
  const o = state[i].object;
  card.innerHTML = `
    <img src="${o.img}" alt="${o.name}">
    <h2>${o.name}</h2>
    <p class="description">${o.description}</p>
    <p class="price">
      Prix actuel :
      <strong><span class="price-value">${state[i].price.toFixed(2)}</span> €</strong>
    </p>
    <p class="viewers">👀 ${Math.floor(Math.random() * 20 + 5)} personnes regardent</p>
    <button class="lock-btn">Bloquer le prix</button>
    <button class="pay-btn" style="display:none">Payer</button>
    <div class="rotation-overlay" style="display:none"></div>
  `;
}

function startPriceDrop(card, i) {
  const priceEl = card.querySelector(".price-value");
  const lockBtn = card.querySelector(".lock-btn");
  const payBtn = card.querySelector(".pay-btn");
  const overlay = card.querySelector(".rotation-overlay");

  let interval = setInterval(() => {
    if (!state[i].locked && state[i].price > 10) {
      state[i].price -= 0.5;
      state[i].price = Math.max(10, state[i].price);
      priceEl.textContent = state[i].price.toFixed(2);
    }

    if (state[i].price <= 10) {
      clearInterval(interval);
      rotate(card, i);
    }
  }, 300);

  lockBtn.onclick = () => {
    state[i].locked = true;
    lockBtn.style.display = "none";
    payBtn.style.display = "block";

    let countdown = state[i].object.paymentTime;
    payBtn.textContent = `Payer (${countdown}s)`;

    const payInterval = setInterval(() => {
      countdown--;
      payBtn.textContent = `Payer (${countdown}s)`;

      if (countdown <= 0) {
        clearInterval(payInterval);
        rotate(card, i);
      }
    }, 1000);

    payBtn.onclick = () => {
      clearInterval(payInterval);
      rotate(card, i);
    };
  };
}

function rotate(card, i) {
  const overlay = card.querySelector(".rotation-overlay");
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.textContent = "Nouvel objet dans 5";

  let t = 5;
  const rot = setInterval(() => {
    t--;
    overlay.textContent = `Nouvel objet dans ${t}`;

    if (t <= 0) {
      clearInterval(rot);
      const obj = objectPool[Math.floor(Math.random() * objectPool.length)];
      state[i] = { object: obj, price: obj.price, locked: false };
      renderCard(card, i);
      startPriceDrop(card, i);
    }
  }, 1000);
}

initState();

cards.forEach((card, i) => {
  renderCard(card, i);
  startPriceDrop(card, i);
});
