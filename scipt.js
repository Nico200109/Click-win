const objectPool = [
  {name:"Smartphone", price:120, img:"https://via.placeholder.com/300x200", paymentTime:8},
  {name:"Console", price:150, img:"https://via.placeholder.com/300x200", paymentTime:10},
  {name:"Casque audio", price:80, img:"https://via.placeholder.com/300x200", paymentTime:6},
  {name:"Montre connectée", price:60, img:"https://via.placeholder.com/300x200", paymentTime:7},
  {name:"Tablette", price:200, img:"https://via.placeholder.com/300x200", paymentTime:12}
];

const cards = document.querySelectorAll('.item-card');

function loadObject(card, object) {
  card.innerHTML = `
    <div class="content">
      <img src="${object.img}" alt="${object.name}">
      <h2>${object.name}</h2>
      <p class="description">Description de ${object.name}</p>
      <p class="price">Prix actuel : <span class="price-value">${object.price}</span> €</p>
      <p class="viewers">👀 <span class="count">${Math.floor(Math.random()*20+5)}</span> personnes regardent</p>
      <button class="lock-btn">Bloquer le prix</button>
      <button class="pay-btn">Payer maintenant (${object.paymentTime}s)</button>
    </div>
    <div class="rotation-overlay"></div>
  `;
  card.dataset.startPrice = object.price;
  card.dataset.paymentTime = object.paymentTime;
}

function startAuction(card) {
  const content = card.querySelector('.content');
  const priceEl = card.querySelector('.price-value');
  const lockBtn = card.querySelector('.lock-btn');
  const payBtn = card.querySelector('.pay-btn');
  const overlay = card.querySelector('.rotation-overlay');

  let price = parseFloat(card.dataset.startPrice);
  let locked = false;
  const paymentTime = parseInt(card.dataset.paymentTime);

  const priceInterval = setInterval(() => {
    if (!locked && price > 10) {
      price = Math.max(10, price - 0.6);
      priceEl.textContent = price.toFixed(2);
    } else if (price <= 10) {
      clearInterval(priceInterval);
      startRotation(card);
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
      if (countdown > 0) {
        payBtn.textContent = `Payer maintenant (${countdown}s)`;
      } else {
        clearInterval(payInterval);
        locked = false;
        payBtn.style.display = "none";
        lockBtn.style.display = "block";
        startRotation(card);
      }
    }, 1000);

    payBtn.onclick = () => {
      clearInterval(payInterval);
      alert(`Paiement simulé ✔️\nObjet remporté à ${price.toFixed(2)} €`);
      startRotation(card);
    };
  };
}

function startRotation(card) {
  const content = card.querySelector('.content');
  const overlay = card.querySelector('.rotation-overlay');

  content.style.display = "none";
  overlay.style.display = "flex";
  overlay.textContent = "Prochain objet : 5";

  let counter = 5;
  const rotationInterval = setInterval(() => {
    counter--;
    if (counter > 0) {
      overlay.textContent = `Prochain objet : ${counter}`;
    } else {
      clearInterval(rotationInterval);
      const newObject = objectPool[Math.floor(Math.random() * objectPool.length)];
      loadObject(card, newObject);
      content.style.display = "block";
      overlay.style.display = "none";
      startAuction(card);
    }
  }, 1000);
}

cards.forEach(card => {
  const obj = objectPool[Math.floor(Math.random() * objectPool.length)];
  loadObject(card, obj);
  startAuction(card);
});

setInterval(() => {
  document.querySelectorAll('.count').forEach(el => {
    let n = parseInt(el.textContent);
    el.textContent = Math.max(5, n + Math.floor(Math.random() * 3 - 1));
  });
}, 3000);
