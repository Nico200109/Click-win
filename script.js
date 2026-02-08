const objectPool = [
  {name:"Smartphone", price:120, img:"./images/smartphone.png", paymentTime:8, description:"Smartphone moderne avec écran HD et caméra 12MP."},
  {name:"Console", price:200, img:"./images/console.png", paymentTime:12, description:"Console dernière génération avec manette incluse."},
  {name:"Séjour Paris", price:500, img:"./images/paris.png", paymentTime:15, description:"Voyage pour 2 personnes avec hôtel 3 nuits inclus."},
  {name:"Casque Audio", price:80, img:"./images/casque.png", paymentTime:6, description:"Casque bluetooth avec réduction de bruit."},
  {name:"Montre Connectée", price:60, img:"./images/montre.png", paymentTime:7, description:"Montre intelligente pour suivre vos activités."}
];

const cards = document.querySelectorAll('.item-card');

// Initialisation ou récupération du state
let auctionsState = JSON.parse(localStorage.getItem('auctionsState') || '[]');
if (auctionsState.length !== cards.length) {
  auctionsState = cards.map(() => {
    const obj = objectPool[Math.floor(Math.random() * objectPool.length)];
    return { object: obj, price: obj.price, locked: false, countdown: obj.paymentTime, lastUpdate: Date.now() };
  });
  localStorage.setItem('auctionsState', JSON.stringify(auctionsState));
}

// Affichage d'un produit
function loadObject(card, stateIndex) {
  const object = auctionsState[stateIndex].object;
  card.innerHTML = `
    <div class="content">
      <img src="${object.img}" alt="${object.name}">
      <h2>${object.name}</h2>
      <p class="description">${object.description}</p>
      <p class="price">Prix actuel : <span class="price-value">${auctionsState[stateIndex].price.toFixed(2)}</span> €</p>
      <button class="lock-btn">Bloquer ce prix</button>
      <button class="pay-btn">Payer maintenant (${object.paymentTime}s)</button>
    </div>
    <div class="rotation-overlay"></div>
  `;
}

// Baisse de prix basée sur le temps réel
function startAuction(card, stateIndex) {
  const state = auctionsState[stateIndex];
  const content = card.querySelector('.content');
  const priceEl = card.querySelector('.price-value');
  const lockBtn = card.querySelector('.lock-btn');
  const payBtn = card.querySelector('.pay-btn');
  const overlay = card.querySelector('.rotation-overlay');

  let locked = state.locked;
  let countdown = state.countdown;
  let lastUpdate = state.lastUpdate;

  lockBtn.style.display = locked ? 'none' : 'block';
  payBtn.style.display = locked ? 'block' : 'none';
  payBtn.textContent = `Payer maintenant (${countdown}s)`;

  // Interval unique pour la baisse du prix
  if (card.priceInterval) clearInterval(card.priceInterval);
  card.priceInterval = setInterval(() => {
    if (!locked) {
      const now = Date.now();
      const elapsed = (now - lastUpdate) / 1000; // secondes
      lastUpdate = now;
      let newPrice = Math.max(10, state.price - 0.5 * elapsed); // baisse 0.5€/s
      state.price = newPrice;
      priceEl.textContent = newPrice.toFixed(2);
      state.lastUpdate = lastUpdate;
      localStorage.setItem('auctionsState', JSON.stringify(auctionsState));

      if (newPrice <= 10) {
        clearInterval(card.priceInterval);
        startRotation(card, stateIndex);
      }
    }
  }, 200);

  // Bloquer le prix
  lockBtn.onclick = () => {
    locked = true;
    state.locked = true;
    lockBtn.style.display = 'none';
    payBtn.style.display = 'block';
    countdown = state.countdown;
    payBtn.textContent = `Payer maintenant (${countdown}s)`;

    if (card.payInterval) clearInterval(card.payInterval);
    card.payInterval = setInterval(() => {
      countdown--;
      state.countdown = countdown;
      payBtn.textContent = `Payer maintenant (${countdown}s)`;
      localStorage.setItem('auctionsState', JSON.stringify(auctionsState));

      if (countdown <= 0) {
        clearInterval(card.payInterval);
        locked = false;
        state.locked = false;
        payBtn.style.display = 'none';
        lockBtn.style.display = 'block';
        startRotation(card, stateIndex);
      }
    }, 1000);

    payBtn.onclick = () => {
      clearInterval(card.payInterval);
      addWinner({name: state.object.name, price: state.price});
      alert(`Paiement simulé ✔️\nObjet : ${state.object.name} à ${state.price.toFixed(2)} €`);
      locked = false;
      state.locked = false;
      startRotation(card, stateIndex);
    };
  };
}

// Rotation automatique
function startRotation(card, stateIndex) {
  const state = auctionsState[stateIndex];
  const content = card.querySelector('.content');
  const overlay = card.querySelector('.rotation-overlay');

  content.style.display = 'none';
  overlay.style.display = 'flex';
  overlay.textContent = 'Prochain produit : 5';

  let counter = 5;
  const rotationInterval = setInterval(() => {
    counter--;
    overlay.textContent = `Prochain produit : ${counter}`;
    if (counter <= 0) {
      clearInterval(rotationInterval);
      const newObject = objectPool[Math.floor(Math.random() * objectPool.length)];
      state.object = newObject;
      state.price = newObject.price;
      state.locked = false;
      state.countdown = newObject.paymentTime;
      state.lastUpdate = Date.now();
      localStorage.setItem('auctionsState', JSON.stringify(auctionsState));

      loadObject(card, stateIndex);
      content.style.display = 'block';
      overlay.style.display = 'none';
      startAuction(card, stateIndex);
    }
  }, 1000);
}

// Historique des ventes
function addWinner(winner) {
  const winners = JSON.parse(localStorage.getItem('winners') || '[]');
  winners.unshift({name: winner.name, price: winner.price});
  if (winners.length > 10) winners.pop();
  localStorage.setItem('winners', JSON.stringify(winners));
}

// Initialisation de toutes les cartes
cards.forEach((card, index) => {
  loadObject(card, index);
  startAuction(card, index);
});
