// Simulation du nombre de personnes
setInterval(() => {
  document.querySelectorAll('.count').forEach(el => {
    let n = parseInt(el.textContent);
    el.textContent = Math.max(5, n + Math.floor(Math.random() * 3 - 1));
  });
}, 3000);

// Gestion blocage + paiement
document.querySelectorAll('.item-card').forEach(card => {
  const lockBtn = card.querySelector('.lock-btn');
  const payBtn = card.querySelector('.pay-btn');

  lockBtn.onclick = () => {
    card.classList.add("blocked");
    lockBtn.style.display = "none";
    payBtn.style.display = "block";

    setTimeout(() => {
      alert("Temps écoulé ⏱️");
      card.classList.remove("blocked");
      lockBtn.style.display = "block";
      payBtn.style.display = "none";
    }, 10000);
  };

  payBtn.onclick = () => {
    alert("Paiement Stripe simulé ✔️");
  };
});
