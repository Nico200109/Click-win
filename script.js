const products = [
  {
    name: "Smartphone",
    start: 120,
    min: 60,
    img: "./images/smartphone.png"
  },
  {
    name: "Console",
    start: 200,
    min: 110,
    img: "./images/console.png"
  },
  {
    name: "Séjour à Paris",
    start: 350,
    min: 200,
    img: "./images/paris.png"
  }
];

let currentIndex = 0;
let priceInterval;
let currentPrice;

const card = document.querySelector(".card");

function loadProduct(index) {
  const p = products[index];
  currentPrice = p.start;

  card.innerHTML = `
    <img src="${p.img}">
    <h2>${p.name}</h2>
    <p class="price">Prix actuel : <span>${currentPrice.toFixed(2)}</span> €</p>
    <button class="lock">Bloquer ce prix</button>
    <button class="pay">Payer maintenant</button>
  `;

  const priceSpan = card.querySelector("span");
  const lockBtn = card.querySelector(".lock");
  const payBtn = card.querySelector(".pay");

  clearInterval(priceInterval);

  priceInterval = setInterval(() => {
    if (currentPrice > p.min) {
      currentPrice -= 0.5;
      priceSpan.textContent = currentPrice.toFixed(2);
    }
  }, 2000);

  lockBtn.onclick = () => {
    clearInterval(priceInterval);
    lockBtn.style.display = "none";
    payBtn.style.display = "block";
  };

  payBtn.onclick = () => {
    alert(`Paiement simulé à ${currentPrice.toFixed(2)} €`);
  };
}

// 🔁 rotation automatique
setInterval(() => {
  currentIndex = (currentIndex + 1) % products.length;
  loadProduct(currentIndex);
}, 20000);

loadProduct(currentIndex);
