const products = [
  { name: "Smartphone", price: 120, min: 60, img: "./images/smartphone.png" },
  { name: "Console", price: 200, min: 100, img: "./images/console.png" }
];

const cards = document.querySelectorAll(".item-card");
let intervals = [];

function startProduct(card, index) {
  const product = products[index];
  let currentPrice = product.price;

  card.innerHTML = `
    <img src="${product.img}" alt="${product.name}">
    <h2>${product.name}</h2>
    <p class="price">Prix actuel : <span>${currentPrice.toFixed(2)}</span> €</p>
    <button class="lock-btn">Réserver ce prix</button>
    <button class="pay-btn">Acheter maintenant</button>
  `;

  const priceSpan = card.querySelector("span");
  const lockBtn = card.querySelector(".lock-btn");
  const payBtn = card.querySelector(".pay-btn");

  // 🔥 Sécurité : on nettoie l'ancien interval
  if (intervals[index]) clearInterval(intervals[index]);

  intervals[index] = setInterval(() => {
    if (currentPrice > product.min) {
      currentPrice -= 0.2;
      priceSpan.textContent = currentPrice.toFixed(2);
    }
  }, 2000);

  lockBtn.onclick = () => {
    clearInterval(intervals[index]);
    lockBtn.style.display = "none";
    payBtn.style.display = "block";
  };

  payBtn.onclick = () => {
    alert(`Achat simulé : ${product.name} à ${currentPrice.toFixed(2)} €`);
  };
}

cards.forEach((card, i) => startProduct(card, i));
