document.querySelectorAll('.item-card').forEach(card => {

  let priceEl = card.querySelector('.price-value');
  let lockBtn = card.querySelector('.lock-btn');
  let payBtn = card.querySelector('.pay-btn');

  let price = parseInt(priceEl.textContent);
  let locked = false;

  // baisse du prix
  setInterval(() => {
    if (!locked && price > 10) {
      price--;
      priceEl.textContent = price;
    }
  }, 1000);

  // bloquer le prix
  lockBtn.onclick = () => {
    locked = true;
    lockBtn.style.display = "none";
    payBtn.style.display = "block";
    card.classList.add("blocked");

    setTimeout(() => {
      locked = false;
      lockBtn.style.display = "block";
      payBtn.style.display = "none";
      card.classList.remove("blocked");
    }, 10000);
  };

  // paiement simulé
  payBtn.onclick = () => {
    alert("Paiement simulé ✔️");
  };
});

// personnes qui regardent
setInterval(() => {
  document.querySelectorAll('.count').forEach(el => {
    let n = parseInt(el.textContent);
    el.textContent = Math.max(5, n + Math.floor(Math.random() * 3 - 1));
  });
}, 3000);
