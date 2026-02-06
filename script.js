// --- Pool d'objets avec images locales et descriptions ---
const objectPool = [
  {name:"Smartphone", price:120, img:"images/smartphone.png", paymentTime:8, description:"Smartphone dernier modèle, écran HD, batterie longue durée, idéal pour apps et jeux."},
  {name:"Tablette", price:200, img:"images/tablette.png", paymentTime:12, description:"Tablette légère et rapide, parfaite pour lecture, vidéos et navigation Internet."},
  {name:"Console", price:150, img:"images/console.png", paymentTime:10, description:"Console de jeu moderne, stockage 500GB, compatible jeux récents et multijoueur."},
  {name:"Casque audio", price:80, img:"images/casque.png", paymentTime:6, description:"Casque audio sans fil, son clair et puissant, confortable pour longues sessions."},
  {name:"Montre connectée", price:60, img:"images/montre.png", paymentTime:7, description:"Montre connectée avec suivi d'activité, notifications et design élégant."},
  {name:"Voyage Paris", price:500, img:"images/paris.png", paymentTime:15, description:"Séjour de 3 jours à Paris, hôtel 4 étoiles, visites et transport inclus."},
  {name:"Télévision", price:350, img:"images/television.png", paymentTime:12, description:"TV LED 55 pouces, résolution 4K, Smart TV avec applications et connectivité."},
  {name:"Enceinte HiFi", price:120, img:"images/enceinte.png", paymentTime:8, description:"Enceinte HiFi portable, son riche et puissant, design moderne et élégant."},
  {name:"Réfrigérateur", price:600, img:"images/refrigerateur.png", paymentTime:20, description:"Réfrigérateur grande capacité, classe énergétique A++, portes réversibles."}
];

// --- Initialisation des cartes et états ---
const cards = document.querySelectorAll('.item-card');
let auctionsState = JSON.parse(localStorage.getItem('auctionsState') || '[]');
const intervals = [];

if(auctionsState.length !== cards.length){
  auctionsState = cards.map(() => {
    const obj = objectPool[Math.floor(Math.random() * objectPool.length)];
    return {
      object: obj,
      price: obj.price,
      locked: false,
      countdown: obj.paymentTime,
      viewers: Math.floor(Math.random()*20 + 5)
    };
  });
  localStorage.setItem('auctionsState', JSON.stringify(auctionsState));
}

// --- Fonction pour charger un objet dans une carte ---
function loadObject(card, index){
  const state = auctionsState[index];
  const object = state.object;

  card.innerHTML = `
    <div class="content">
      <img src="${object.img}" alt="${object.name}">
      <h2>${object.name}</h2>
      <p class="description">${object.description}</p>
      <p class="price">Prix actuel : <span class="price-value">${state.price.toFixed(2)}</span> €</p>
      <p class="viewers">👀 <span class="viewer-count">${state.viewers}</span> personnes regardent</p>
      <div class="buttons" style="display:flex; gap:10px;">
        <button class="lock-btn">🔒 Bloquer le prix</button>
        <button class="pay-btn" style="display:none"></button>
      </div>
    </div>
    <div class="rotation-overlay"></div>
  `;
}

// --- Démarrage d'une enchère sur une carte ---
function startAuction(card, index){
  const state = auctionsState[index];
  const priceEl = card.querySelector('.price-value');
  const lockBtn = card.querySelector('.lock-btn');
  const payBtn = card.querySelector('.pay-btn');
  const overlay = card.querySelector('.rotation-overlay');
  const viewerEl = card.querySelector('.viewer-count');

  let price = state.price;
  let locked = state.locked;
  let countdown = state.countdown;

  clearInterval(intervals[index]);
  intervals[index] = setInterval(() => {
    if(!locked && price > 10){
      price -= 0.6;
      price = Math.max(price, 10);
      priceEl.textContent = price.toFixed(2);
      state.price = price;
      localStorage.setItem('auctionsState', JSON.stringify(auctionsState));
    } else if(price <= 10){
      clearInterval(intervals[index]);
      startRotation(card, index);
    }
  }, 300);

  // Spectateurs dynamiques
  setInterval(() => {
    state.viewers += Math.floor(Math.random()*3 -1);
    state.viewers = Math.max(3, state.viewers);
    viewerEl.textContent = state.viewers;
    localStorage.setItem('auctionsState', JSON.stringify(auctionsState));
  }, 2500);

  lockBtn.onclick = () => {
    if(locked) return;
    locked = true;
    state.locked = true;

    lockBtn.textContent = "⏳ Prix bloqué";
    lockBtn.style.backgroundColor = "#3498db";

    payBtn.style.display = "block";
    payBtn.textContent = `Payer maintenant (${countdown}s)`;

    const payInterval = setInterval(() => {
      countdown--;
      state.countdown = countdown;
      payBtn.textContent = `Payer maintenant (${countdown}s)`;
      localStorage.setItem('auctionsState', JSON.stringify(auctionsState));

      if(countdown <= 0){
        clearInterval(payInterval);
        locked = false;
        state.locked = false;
        lockBtn.textContent = "🔒 Bloquer le prix";
        lockBtn.style.backgroundColor = "";
        startRotation(card, index);
      }
    }, 1000);

    payBtn.onclick = () => {
      clearInterval(payInterval);
      const wonObject = state.object;
      addWinner({name: wonObject.name, price});
      alert(`Objet remporté à ${price.toFixed(2)} € 🎉`);
      locked = false;
      state.locked = false;
      lockBtn.textContent = "🔒 Bloquer le prix";
      lockBtn.style.backgroundColor = "";
      startRotation(card, index);
    };
  };
}

// --- Rotation automatique après enchère ou paiement ---
function startRotation(card, index){
  clearInterval(intervals[index]);
  const state = auctionsState[index];
  const overlay = card.querySelector('.rotation-overlay');
  const content = card.querySelector('.content');

  content.style.display = "none";
  overlay.style.display = "flex";

  let counter = 5;
  overlay.textContent = `Prochain objet : ${counter}`;

  const rotationInterval = setInterval(() => {
    counter--;
    overlay.textContent = `Prochain objet : ${counter}`;
    if(counter <= 0){
      clearInterval(rotationInterval);

      const obj = objectPool[Math.floor(Math.random() * objectPool.length)];
      auctionsState[index] = {
        object: obj,
        price: obj.price,
        locked: false,
        countdown: obj.paymentTime,
        viewers: Math.floor(Math.random()*20+5)
      };
      localStorage.setItem('auctionsState', JSON.stringify(auctionsState));
      loadObject(card, index);
      startAuction(card, index);
      overlay.style.display = "none";
      content.style.display = "block";
    }
  }, 1000);
}

// --- Fonction pour ajouter un gagnant ---
function addWinner(winner){
  const winners = JSON.parse(localStorage.getItem('winners') || '[]');
  winners.unshift({name: winner.name, price: winner.price});
  if(winners.length > 10) winners.pop();
  localStorage.setItem('winners', JSON.stringify(winners));
}

// --- Initialisation des 2 cartes ---
cards.forEach((card, index) => {
  loadObject(card, index);
  startAuction(card, index);
});
