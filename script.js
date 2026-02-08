const objectPool = [
  {
    name:"Smartphone",
    price:120,
    img:"images/smartphone.png",
    paymentTime:8,
    desc:"Smartphone dernière génération avec écran haute définition."
  },
  {
    name:"Tablette",
    price:200,
    img:"images/tablette.png",
    paymentTime:12,
    desc:"Tablette tactile idéale pour le travail et le divertissement."
  },
  {
    name:"Console",
    price:150,
    img:"images/console.png",
    paymentTime:10,
    desc:"Console de jeux pour des heures de fun en solo ou entre amis."
  },
  {
    name:"Casque audio",
    price:80,
    img:"images/casque.png",
    paymentTime:6,
    desc:"Casque audio immersif avec réduction de bruit."
  },
  {
    name:"Montre connectée",
    price:60,
    img:"images/montre.png",
    paymentTime:7,
    desc:"Montre connectée pour suivre votre activité quotidienne."
  },
  {
    name:"Voyage Paris",
    price:500,
    img:"images/paris.png",
    paymentTime:15,
    desc:"Séjour inoubliable à Paris pour deux personnes."
  },
  {
    name:"Télévision",
    price:350,
    img:"images/television.png",
    paymentTime:12,
    desc:"Télévision écran large avec qualité d’image exceptionnelle."
  },
  {
    name:"Enceinte HiFi",
    price:120,
    img:"images/enceinte.png",
    paymentTime:8,
    desc:"Enceinte HiFi pour un son puissant et clair."
  },
  {
    name:"Réfrigérateur",
    price:600,
    img:"images/refrigerateur.png",
    paymentTime:20,
    desc:"Réfrigérateur spacieux et économe en énergie."
  }
];

const cards = document.querySelectorAll('.item-card');
const intervals = [];
let auctionsState = JSON.parse(localStorage.getItem('auctionsState') || '[]');

if (auctionsState.length !== cards.length) {
  auctionsState = cards.map(() => createItem());
  localStorage.setItem('auctionsState', JSON.stringify(auctionsState));
}

function createItem(exclude = "") {
  let obj;
  do {
    obj = objectPool[Math.floor(Math.random() * objectPool.length)];
  } while (obj.name === exclude);

  return {
    object: obj,
    price: obj.price,
    locked: false,
    countdown: obj.paymentTime,
    watchers: Math.floor(Math.random() * 20) + 5
  };
}

function loadObject(card, i) {
  const o = auctionsState[i];
  card.innerHTML = `
    <div class="content">
      <img src="${o.object.img}">
      <h2>${o.object.name}</h2>
      <p class="desc">${o.object.desc}</p>
      <p class="watchers">👀 ${o.watchers} personnes regardent</p>
      <p class="price">Prix : <span class="price-value">${o.price.toFixed(2)}</span> €</p>
      <button class="lock-btn">Bloquer le prix</button>
      <button class="pay-btn"></button>
    </div>
    <div class="rotation-overlay"></div>
  `;
}

function startAuction(card, i) {
  clearInterval(intervals[i]);

  const state = auctionsState[i];
  const priceEl = card.querySelector('.price-value');
  const lockBtn = card.querySelector('.lock-btn');
  const payBtn = card.querySelector('.pay-btn');

  intervals[i] = setInterval(() => {
    if (!state.locked && state.price > 10) {
      state.price = Math.max(10, state.price - 0.6);
      priceEl.textContent = state.price.toFixed(2);
      localStorage.setItem('auctionsState', JSON.stringify(auctionsState));
    }
    if (state.price <= 10) rotate(card, i);
  }, 300);

  lockBtn.onclick = () => {
    state.locked = true;
    lockBtn.style.display = "none";
    payBtn.style.display = "block";

    let t = state.countdown;
    payBtn.textContent = `Payer (${t}s)`;

    const timer = setInterval(() => {
      t--;
      payBtn.textContent = `Payer (${t}s)`;
      if (t <= 0) {
        clearInterval(timer);
        rotate(card, i);
      }
    }, 1000);

    payBtn.onclick = () => {
      clearInterval(timer);
      addWinner({name: state.object.name, price: state.price});
      rotate(card, i);
    };
  };
}

function rotate(card, i) {
  clearInterval(intervals[i]);

  const overlay = card.querySelector('.rotation-overlay');
  const content = card.querySelector('.content');

  content.style.display = "none";
  overlay.style.display = "flex";

  let t = 5;
  overlay.textContent = `Prochain objet : ${t}`;

  const r = setInterval(() => {
    t--;
    overlay.textContent = `Prochain objet : ${t}`;
    if (t <= 0) {
      clearInterval(r);
      const old = auctionsState[i].object.name;
      auctionsState[i] = createItem(old);
      localStorage.setItem('auctionsState', JSON.stringify(auctionsState));
      loadObject(card, i);
      startAuction(card, i);
    }
  }, 1000);
}

function addWinner(w) {
  const winners = JSON.parse(localStorage.getItem('winners') || '[]');
  winners.unshift(w);
  if (winners.length > 10) winners.pop();
  localStorage.setItem('winners', JSON.stringify(winners));
}

cards.forEach((card, i) => {
  loadObject(card, i);
  startAuction(card, i);
});
