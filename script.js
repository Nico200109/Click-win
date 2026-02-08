const objectPool = [
  {name:"Smartphone", price:120, img:"./images/smartphone.png", paymentTime:8, description:"Smartphone moderne avec écran HD et caméra 12MP."},
  {name:"Console", price:200, img:"./images/console.png", paymentTime:12, description:"Console dernière génération avec manette incluse."},
  {name:"Séjour Paris", price:500, img:"./images/paris.png", paymentTime:15, description:"Voyage pour 2 personnes avec hôtel 3 nuits inclus."},
  {name:"Casque Audio", price:80, img:"./images/casque.png", paymentTime:6, description:"Casque bluetooth avec réduction de bruit."},
  {name:"Montre Connectée", price:60, img:"./images/montre.png", paymentTime:7, description:"Montre intelligente pour suivre vos activités."}
];

const cards = document.querySelectorAll('.item-card');

// Récupération ou initialisation de l'état
let auctionsState = JSON.parse(localStorage.getItem('auctionsState') || '[]');

if(auctionsState.length !== cards.length){
  auctionsState = cards.map(() => {
    const obj = objectPool[Math.floor(Math.random() * objectPool.length)];
    return { object: obj, price: obj.price, locked: false, countdown: obj.paymentTime };
  });
  localStorage.setItem('auctionsState', JSON.stringify(auctionsState));
}

// Fonction pour afficher un produit sur une carte
function loadObject(card, stateIndex){
  const object = auctionsState[stateIndex].object;
  card.innerHTML = `
    <div class="content">
      <img src="${object.img}" alt="${object.name}">
      <h2>${object.name}</h2>
      <p class="description">${object.description}</p>
      <p class="price">Prix actuel : <span class="price-value">${auctionsState[stateIndex].price}</span> €</p>
      <button class="lock-btn">Bloquer ce prix</button>
      <button class="pay-btn">Payer maintenant (${object.paymentTime}s)</button>
    </div>
    <div class="rotation-overlay"></div>
  `;
}

// Fonction principale d'enchère / prix dynamique
function startAuction(card, stateIndex){
  const state = auctionsState[stateIndex];
  const content = card.querySelector('.content');
  const priceEl = card.querySelector('.price-value');
  const lockBtn = card.querySelector('.lock-btn');
  const payBtn = card.querySelector('.pay-btn');
  const overlay = card.querySelector('.rotation-overlay');

  let price = state.price;
  let locked = state.locked;
  let countdown = state.countdown;

  // Affichage initial
  if(locked){
    lockBtn.style.display = "none";
    payBtn.style.display = "block";
    payBtn.textContent = `Payer maintenant (${countdown}s)`;
  } else {
    payBtn.style.display = "none";
    lockBtn.style.display = "block";
  }

  // Interval unique pour la baisse du prix
  if(card.priceInterval) clearInterval(card.priceInterval);
  card.priceInterval = setInterval(() => {
    if(!locked && price > 10){
      price = Math.max(10, price - 0.5);
      priceEl.textContent = price.toFixed(2);
      state.price = price;
      localStorage.setItem('auctionsState', JSON.stringify(auctionsState));
    } else if(price <= 10){
      clearInterval(card.priceInterval);
      startRotation(card, stateIndex);
    }
  }, 300);

  // Bloquer le prix
  lockBtn.onclick = () => {
    locked = true;
    state.locked = true;
    lockBtn.style.display = "none";
    payBtn.style.display = "block";

    countdown = state.countdown;
    payBtn.textContent = `Payer maintenant (${countdown}s)`;

    if(card.payInterval) clearInterval(card.payInterval);
    card.payInterval = setInterval(() => {
      countdown--;
      state.countdown = countdown;
      localStorage.setItem('auctionsState', JSON.stringify(auctionsState));
      payBtn.textContent = `Payer maintenant (${countdown}s)`;

      if(countdown <= 0){
        clearInterval(card.payInterval);
        locked = false;
        state.locked = false;
        payBtn.style.display = "none";
        lockBtn.style.display = "block";
        startRotation(card, stateIndex);
      }
    }, 1000);

    // Paiement
    payBtn.onclick = () => {
      clearInterval(card.payInterval);
      addWinner({name: state.object.name, price});
      alert(`Paiement simulé ✔️\nObjet : ${state.object.name} à ${price.toFixed(2)} €`);
      locked = false;
      state.locked = false;
      startRotation(card, stateIndex);
    };
  };
}

// Fonction de rotation des produits
function startRotation(card, stateIndex){
  const state = auctionsState[stateIndex];
  const content = card.querySelector('.content');
  const overlay = card.querySelector('.rotation-overlay');

  content.style.display = "none";
  overlay.style.display = "flex";
  overlay.textContent = "Prochain produit : 5";

  let counter = 5;
  const rotationInterval = setInterval(() => {
    counter--;
    overlay.textContent = `Prochain produit : ${counter}`;
    if(counter <= 0){
      clearInterval(rotationInterval);
      const newObject = objectPool[Math.floor(Math.random() * objectPool.length)];
      state.object = newObject;
      state.price = newObject.price;
      state.locked = false;
      state.countdown = newObject.paymentTime;
      localStorage.setItem('auctionsState', JSON.stringify(auctionsState));

      loadObject(card, stateIndex);
      content.style.display = "block";
      overlay.style.display = "none";
      startAuction(card, stateIndex);
    }
  }, 1000);
}

// Ajouter un produit à l’historique
function addWinner(winner){
  const winners = JSON.parse(localStorage.getItem('winners') || '[]');
  winners.unshift({name: winner.name, price: winner.price});
  if(winners.length > 10) winners.pop();
  localStorage.setItem('winners', JSON.stringify(winners));
}

// Initialisation des cartes
cards.forEach((card, index) => {
  loadObject(card, index);
  startAuction(card, index);
});
