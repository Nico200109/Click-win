const objectPool = [
  {name:"Smartphone", price:120, img:"https://via.placeholder.com/300x200", paymentTime:8},
  {name:"Tablette", price:200, img:"https://via.placeholder.com/300x200", paymentTime:12},
  {name:"Console", price:150, img:"https://via.placeholder.com/300x200", paymentTime:10},
  {name:"Casque audio", price:80, img:"https://via.placeholder.com/300x200", paymentTime:6},
  {name:"Montre connectée", price:60, img:"https://via.placeholder.com/300x200", paymentTime:7},
  {name:"Voyage Paris", price:500, img:"https://via.placeholder.com/300x200", paymentTime:15},
  {name:"Télévision", price:350, img:"https://via.placeholder.com/300x200", paymentTime:12},
  {name:"Enceinte HiFi", price:120, img:"https://via.placeholder.com/300x200", paymentTime:8},
  {name:"Réfrigérateur", price:600, img:"https://via.placeholder.com/300x200", paymentTime:20}
];

const cards = document.querySelectorAll('.item-card');

// Récupération ou initialisation des états
let auctionsState = JSON.parse(localStorage.getItem('auctionsState') || '[]');

// Si vide, on initialise pour chaque carte
if(auctionsState.length !== cards.length){
  auctionsState = cards.map(() => {
    const obj = objectPool[Math.floor(Math.random() * objectPool.length)];
    return {
      object: obj,
      price: obj.price,
      locked: false,
      countdown: obj.paymentTime
    };
  });
  localStorage.setItem('auctionsState', JSON.stringify(auctionsState));
}

function loadObject(card, stateIndex){
  const object = auctionsState[stateIndex].object;
  card.innerHTML = `
    <div class="content">
      <img src="${object.img}" alt="${object.name}">
      <h2>${object.name}</h2>
      <p class="description">Description de ${object.name}</p>
      <p class="price">Prix actuel : <span class="price-value">${auctionsState[stateIndex].price}</span> €</p>
      <p class="viewers">👀 <span class="count">${Math.floor(Math.random()*20+5)}</span> personnes regardent</p>
      <button class="lock-btn">Bloquer le prix</button>
      <button class="pay-btn">Payer maintenant (${object.paymentTime}s)</button>
    </div>
    <div class="rotation-overlay"></div>
  `;
}

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

  // Affichage initial des boutons
  if(locked){
    lockBtn.style.display = "none";
    payBtn.style.display = "block";
    payBtn.textContent = `Payer maintenant (${countdown}s)`;
  }

  const priceInterval = setInterval(() => {
    if(!locked && price > 10){
      price = Math.max(10, price - 0.6);
      priceEl.textContent = price.toFixed(2);
      state.price = price;
      localStorage.setItem('auctionsState', JSON.stringify(auctionsState));
    } else if(price <= 10){
      clearInterval(priceInterval);
      startRotation(card, stateIndex);
    }
  }, 300);

  lockBtn.onclick = () => {
    locked = true;
    state.locked = true;
    lockBtn.style.display = "none";
    payBtn.style.display = "block";

    countdown = state.countdown;
    payBtn.textContent = `Payer maintenant (${countdown}s)`;

    const payInterval = setInterval(() => {
      countdown--;
      state.countdown = countdown;
      localStorage.setItem('auctionsState', JSON.stringify(auctionsState));

      if(countdown > 0){
        payBtn.textContent = `Payer maintenant (${countdown}s)`;
      } else {
        clearInterval(payInterval);
        locked = false;
        state.locked = false;
        payBtn.style.display = "none";
        lockBtn.style.display = "block";
        startRotation(card, stateIndex);
      }
    }, 1000);

    payBtn.onclick = () => {
      clearInterval(payInterval);
      const wonObject = state.object;
      addWinner({name: wonObject.name, price});
      alert(`Paiement simulé ✔️\nObjet remporté à ${price.toFixed(2)} €`);
      locked = false;
      state.locked = false;
      startRotation(card, stateIndex);
    };
  };
}

function startRotation(card, stateIndex){
  const state = auctionsState[stateIndex];
  const content = card.querySelector('.content');
  const overlay = card.querySelector('.rotation-overlay');

  content.style.display = "none";
  overlay.style.display = "flex";
  overlay.textContent = "Prochain objet : 5";

  let counter = 5;
  const rotationInterval = setInterval(() => {
    counter--;
    overlay.textContent = `Prochain objet : ${counter}`;
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

function addWinner(winner){
  const winners = JSON.parse(localStorage.getItem('winners') || '[]');
  winners.unshift({name: winner.name, price: winner.price});
  if(winners.length > 10) winners.pop();
  localStorage.setItem('winners', JSON.stringify(winners));
}

// Initialisation des 2 cartes
cards.forEach((card, index) => {
  loadObject(card, index);
  startAuction(card, index);
});

// Simulation spectateurs
setInterval(() => {
  document.querySelectorAll('.count').forEach(el => {
    let n = parseInt(el.textContent);
    el.textContent = Math.max(5, n + Math.floor(Math.random()*3 - 1));
  });
}, 3000);
