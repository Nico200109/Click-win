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

// Récupération ou initialisation des prix dans localStorage
let auctionsState = JSON.parse(localStorage.getItem('auctionsState') || '[]');

cards.forEach((card, index) => {
  // Si pas d'état existant, on initialise
  if(!auctionsState[index]){
    const obj = objectPool[Math.floor(Math.random() * objectPool.length)];
    auctionsState[index] = { object: obj, price: obj.price };
  }

  // On charge l'objet dans la carte
  loadObject(card, index);
  startAuction(card, index);
});

function loadObject(card, stateIndex){
  const state = auctionsState[stateIndex];
  const object = state.object;

  card.innerHTML = `
    <div class="content">
      <img src="${object.img}" alt="${object.name}">
      <h2>${object.name}</h2>
      <p class="description">Description de ${object.name}</p>
      <p class="price">Prix actuel : <span class="price-value">${state.price}</span> €</p>
      <p class="viewers">👀 <span class="count">${Math.floor(Math.random()*20+5)}</span> personnes regardent</p>
      <button class="lock-btn">Bloquer le prix</button>
      <button class="pay-btn">Payer maintenant (${object.paymentTime}s)</button>
    </div>
    <div class="rotation-overlay"></div>
  `;
}

function startAuction(card, stateIndex){
  const state = auctionsState[stateIndex];
  const priceEl = card.querySelector('.price-value');
  const lockBtn = card.querySelector('.lock-btn');
  const payBtn = card.querySelector('.pay-btn');
  const overlay = card.querySelector('.rotation-overlay');

  let price = state.price;
  let locked = false;
  let paymentTime = state.object.paymentTime;

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
    lockBtn.style.display = "none";
    payBtn.style.display = "block";

    let countdown = paymentTime;
    payBtn.textContent = `Payer maintenant (${countdown}s)`;

    const payInterval = setInterval(() => {
      countdown--;
      payBtn.textContent = `Payer maintenant (${countdown}s)`;
      if(countdown <= 0){
        clearInterval(payInterval);
        locked = false;
        lockBtn.style.display = "block";
        payBtn.style.display = "none";
        startRotation(card, stateIndex);
      }
    }, 1000);

    payBtn.onclick = () => {
      clearInterval(payInterval);
      addWinner({name: state.object.name, price});
      alert(`Paiement simulé ✔️\nObjet remporté à ${price.toFixed(2)} €`);
      locked = false;
      lockBtn.style.display = "block";
      payBtn.style.display = "none";
      startRotation(card, stateIndex);
    };
  };
}

function startRotation(card, stateIndex){
  const overlay = card.querySelector('.rotation-overlay');
  const content = card.querySelector('.content');
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
      auctionsState[stateIndex].object = newObject;
      auctionsState[stateIndex].price = newObject.price;
      localStorage.setItem('auctionsState', JSON.stringify(auctionsState));
      loadObject(card, stateIndex);
      content.style.display = "block";
      overlay.style.display = "none";
      startAuction(card, stateIndex);
    }
  }, 1000);
}

// Ajouter un gagnant
function addWinner(winner){
  const winners = JSON.parse(localStorage.getItem('winners') || '[]');
  winners.unshift({name: winner.name, price: winner.price});
  if(winners.length > 10) winners.pop();
  localStorage.setItem('winners', JSON.stringify(winners));
}

// Simuler spectateurs
setInterval(() => {
  document.querySelectorAll('.count').forEach(el => {
    let n = parseInt(el.textContent);
    el.textContent = Math.max(5, n + Math.floor(Math.random()*3 - 1));
  });
}, 3000);
