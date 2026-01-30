document.querySelectorAll('.item-card').forEach(card => {

  const priceEl = card.querySelector('.price-value');
  const lockBtn = card.querySelector('.lock-btn');
  const payBtn = card.querySelector('.pay-btn');

  let price = parseFloat(priceEl.textContent);
  let locked = false;
  let dropInterval = null;

  // 🔻 baisse du prix toutes les 0,3s
  function startDrop() {
    dropInterval = setInterval(() => {
      if (!locked && price > 10) {
        price = Math.max(10, price - 0.3);
        priceEl.textContent = price.toFixed(2);
      }
    }, 300);
  }

  startDrop();

  // 🔒 bloquer le prix
  lockBtn.onclick = () => {
    locked = true;
    lockBtn.style.display = "none";
    payBtn.style.display = "block";
    card.classList.add("blocked");

    // ⏱ 10 secondes pour payer
    setTimeout(() => {
      card.classList.remove("blocked");
      payBtn.style.display = "none";

      // ⏸ pause 5s avant reprise
      setTimeout(() => {
        locked = false;
        lockBtn.style.display = "block";
      }, 5000);

    }, 10000);
  };

  // 💳 paiement simulé
  payBtn.onclick = () => {
    alert(`Paiement simulé ✔️\nObjet remporté à ${price.toFixed(2)} €`);
    locked = true;
  };
});

// 👀 personnes qui regardent
setInterval(() => {
  document.querySelectorAll('.count').forEach(el => {
    let n = parseInt(el.textContent);
    el.textContent = Math.max(5, n + Math.floor(Math.random() * 3 - 1));
  });
}, 3000);

// 🔁 rotation visuelle des objets toutes les 5s
setInterval(() => {
  const cards = document.querySelectorAll('.item-card');
  cards.forEach(card => {
    card.style.opacity = 0.6;
    setTimeout(() => card.style.opacity = 1, 300);
  });
}, 5000);
