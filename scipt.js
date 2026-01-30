const cards = document.querySelectorAll('.item-card');

cards.forEach(card => {
  const priceEl = card.querySelector('.price-value');
  const lockBtn = card.querySelector('.lock-btn');
  const payBtn = card.querySelector('.pay-btn');

  let initialPrice = parseFloat(priceEl.textContent); // prix de départ
  let price = initialPrice;
  let locked = false;
  let interval = null;

  // Fonction pour faire baisser le prix
  function startDrop() {
    interval = setInterval(() => {
      if (!locked && price > 10) {
        price = Math.max(10, price - 0.3);
        priceEl.textContent = price.toFixed(2);
      } else if (price <= 10) {
        clearInterval(interval);
        card.style.opacity = 0.5; // effet transition
        setTimeout(() => {
          price = initialPrice;
          priceEl.textContent = price.toFixed(2);
          card.style.opacity = 1;
          startDrop();
        }, 5000); // pause 5s avant reprise
      }
    }, 300);
  }

  startDrop();

  // Blocage du prix
  lockBtn.onclick = () => {
    locked = true;
    lockBtn.style.display = "none";
    payBtn.style.display = "block";
    card.classList.add("blocked"); // effet pulse

    setTimeout(() => {
      if (!locked) return; // déjà payé
      locked = false;
      payBtn.style.display = "none";
      lockBtn.style.display = "block";
      card.classList.remove("blocked");
    }, 10000); // 10s pour payer
  };

  // Paiement simulé
  payBtn.onclick = () => {
    alert(`Paiement simulé ✔️\nObjet remporté à ${price.toFixed(2)} €`);
    locked = true;
    clearInterval(interval);

    // transition de rotation après paiement
    card.style.opacity = 0.5;
    setTimeout(() => {
      price = initialPrice;
      priceEl.textContent = price.toFixed(2);
      card.style.opacity = 1;
      locked = false;
      payBtn.style.display = "none";
      lockBtn.style.display = "block";
      card.classList.remove("blocked");
      startDrop();
    }, 5000);
  };
});

// Simulation du nombre de spectateurs
setInterval(() => {
  document.querySelectorAll('.count').forEach(el => {
    let n = parseInt(el.textContent);
    el.textContent = Math.max(5, n + Math.floor(Math.random() * 3 - 1));
  });
}, 3000);
