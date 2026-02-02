const objectPool = [
  {name:"Smartphone", price:120, img:"https://via.placeholder.com/300x200"},
  {name:"Console", price:150, img:"https://via.placeholder.com/300x200"},
  {name:"Casque audio", price:80, img:"https://via.placeholder.com/300x200"},
  {name:"Tablette", price:200, img:"https://via.placeholder.com/300x200"}
];

const cards = document.querySelectorAll(".item-card");

/* ================= AUTH ================= */

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

function updateAuthUI() {
  if (localStorage.getItem("loggedIn") === "true") {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  } else {
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  }
}

loginBtn.onclick = () => {
  const name = prompt("Votre prénom ?");
  if (name) {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userName", name);
    updateAuthUI();
  }
};

logoutBtn.onclick = () => {
  localStorage.clear();
  updateAuthUI();
};

updateAuthUI();

/* ================= AUCTION ================= */

function loadObject(card, object) {
  card.innerHTML = `
    <img src="${object.img}">
    <h2>${object.name}</h2>
    <p class="price">Prix : <span class="price-value">${object.price}</span> €</p>
    <p class="viewers">👀 <span class="count">${Math.floor(Math.random()*20+5)}</span> personnes regardent</p>
    <button class="lock-btn">Bloquer le prix</button>
    <button class="pay-btn">Payer</button>
    <div class="rotation-overlay"></div>
  `;

  startAuction(card, object.price);
}

function startAuction(card, startPrice) {
  const priceEl = card.querySelector(".price-value");
  const lockBtn = card.querySelector(".lock-btn");
  const payBtn = card.querySelector(".pay-btn");
  const overlay = card.querySelector(".rotation-overlay");

  let price = startPrice;
  let locked = false;

  const priceInterval = setInterval(() => {
    if (!locked && price > 10) {
      price -= 0.5;
      priceEl.textContent = price.toFixed(2);
    }
    if (price <= 10) {
      clearInterval(priceInterval);
      startRotation(card);
    }
  }, 300);

  lockBtn.onclick = () => {
    if (localStorage.getItem("loggedIn") !== "true") {
      alert("Connectez-vous pour enchérir");
      return;
    }

    locked = true;
    lockBtn.style.display = "none";
    payBtn.style.display = "block";

    payBtn.onclick = () => {
      const winners = JSON.parse(localStorage.getItem("winners") || "[]");
      winners.unshift({
        name: localStorage.getItem("userName"),
        price: price.toFixed(2)
      });
      localStorage.setItem("winners", JSON.stringify(winners));
      startRotation(card);
    };
  };
}

function startRotation(card) {
  const overlay = card.querySelector(".rotation-overlay");
  overlay.style.display = "flex";
  let counter = 5;
  overlay.textContent = `Prochain objet : ${counter}`;

  const interval = setInterval(() => {
    counter--;
    overlay.textContent = `Prochain objet : ${counter}`;
    if (counter === 0) {
      clearInterval(interval);
      overlay.style.display = "none";
      const obj = objectPool[Math.floor(Math.random()*objectPool.length)];
      loadObject(card, obj);
    }
  }, 1000);
}

/* ================= INIT ================= */

cards.forEach(card => {
  const obj = objectPool[Math.floor(Math.random()*objectPool.length)];
  loadObject(card, obj);
});
