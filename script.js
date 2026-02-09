document.addEventListener("DOMContentLoaded", () => {

  const objectPool = [
    {
      name: "Smartphone",
      description: "Écran OLED, 128 Go, débloqué.",
      price: 120,
      img: "images/smartphone.jpg",
      paymentTime: 8
    },
    {
      name: "Console",
      description: "Console dernière génération.",
      price: 150,
      img: "images/console.jpg",
      paymentTime: 10
    },
    {
      name: "Casque audio",
      description: "Réduction de bruit active.",
      price: 80,
      img: "images/casque.jpg",
      paymentTime: 6
    }
  ];

  const cards = document.querySelectorAll(".item-card");
  const intervals = [];
  let state = JSON.parse(localStorage.getItem("state") || "[]");

  if (state.length !== cards.length) {
    state = [...cards].map(() => {
      const obj = objectPool[Math.floor(Math.random() * objectPool.length)];
      return { obj, price: obj.price };
    });
    localStorage.setItem("state", JSON.stringify(state));
  }

  function loadCard(card, i) {
    const o = state[i].obj;
    const viewers = Math.floor(Math.random() * 30) + 10;

    card.innerHTML = `
      <div class="content">
        <img src="${o.img}">
        <h2>${o.name}</h2>
        <p class="description">${o.description}</p>
        <p class="viewers">${viewers} personnes regardent ce produit</p>
        <p class="price"><span class="price-value">${state[i].price.toFixed(2)}</span> €</p>
        <button class="lock-btn">Bloquer le prix</button>
        <button class="pay-btn"></button>
      </div>
      <div class="rotation-overlay"></div>
    `;
  }

  function start(card, i) {
    clearInterval(intervals[i]);

    const priceEl = card.querySelector(".price-value");
    const lockBtn = card.querySelector(".lock-btn");
    const payBtn = card.querySelector(".pay-btn");

    let price = state[i].price;
    let locked = false;
    let countdown = state[i].obj.paymentTime;

    intervals[i] = setInterval(() => {
      if (!locked && price > 10) {
        price -= 0.5;
        price = Math.max(10, price);
        priceEl.textContent = price.toFixed(2);
        state[i].price = price;
        localStorage.setItem("state", JSON.stringify(state));
      }
    }, 300);

    lockBtn.onclick = () => {
      locked = true;
      lockBtn.style.display = "none";
      payBtn.style.display = "block";

      const timer = setInterval(() => {
        countdown--;
        payBtn.textContent = `Payer (${countdown}s)`;
        if (countdown <= 0) {
          clearInterval(timer);
          rotate(card, i);
        }
      }, 1000);

      payBtn.onclick = () => {
        clearInterval(timer);
        rotate(card, i);
      };
    };
  }

  function rotate(card, i) {
    clearInterval(intervals[i]);
    const overlay = card.querySelector(".rotation-overlay");
    card.querySelector(".content").style.display = "none";
    overlay.style.display = "flex";

    let t = 5;
    overlay.textContent = `Nouveau produit dans ${t}`;

    const rot = setInterval(() => {
      t--;
      overlay.textContent = `Nouveau produit dans ${t}`;
      if (t <= 0) {
        clearInterval(rot);
        const obj = objectPool[Math.floor(Math.random() * objectPool.length)];
        state[i] = { obj, price: obj.price };
        localStorage.setItem("state", JSON.stringify(state));
        loadCard(card, i);
        start(card, i);
      }
    }, 1000);
  }

  cards.forEach((card, i) => {
    loadCard(card, i);
    start(card, i);
  });

});
