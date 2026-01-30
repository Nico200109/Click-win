// Récupération de toutes les cartes
const cards = document.querySelectorAll('.item-card');

// Création d'un état pour chaque carte
const state = Array.from(cards).map(card => ({
  card: card,
  priceEl: card.querySelector('.price-value'),
  lockBtn: card.querySelector('.lock-btn'),
  payBtn: card.querySelector('.pay-btn'),
  price: parseFloat(card.querySelector('.price-value').textContent),
  locked: false,
  interval: null
}));

// Fonction pour démarrer l'enchère d'une carte
function startCard(cardState) {
  const { card, priceEl, lockBtn, payBtn } = cardState;

  // Afficher la carte
  card.style.display = "block";

  // Cache initial des boutons
  payBtn.style.display = "none";
  lockBtn.style.display = "block";
  card.classList.remove("blocked");

  // Baisse du prix toutes les 0,3 s
  cardState.interval = setInterval(() => {
    if (!cardState.locked && cardState.price > 10) {
      cardState.price = Math.max(10, cardState.price - 0.3);
      priceEl.textContent = cardState.price.toFixed(2);
    } else if (cardState.price <= 10) {
      // Stop l'intervalle et rotation après 5s
      clearInterval(cardState.interval);
      setTimeout(() => rotateCard(cardState), 5000);
    }
  }, 300);

  // Bloquer le prix
  lockBtn.onclick = () => {
    cardState.locked = true;
    lockBtn.style.display = "none";
    payBtn.style.display = "block";
    card.classList.add("blocked");

    setTimeout(() => {
      if (!cardState.locked) return; // si déjà payé
      cardState.locked = false;
      payBtn.style.display = "none";
      lockBtn.style.display = "block";
      card.classList.remove("blocked");
    }, 10000);
  };

  // Paiement simulé
  payBtn.onclick = () => {
    alert(`Paiement simulé ✔️\nObjet remporté à ${cardState.price.toFixed(2)} €`);
    cardState.locked = true;
    clearInterval(cardState.interval);
    rotateCard(cardState);
  };
}

// Rotation d'une carte
function rotateCard(cardState) {
  const card = cardState.card;
  // cache avec transition
  card.style.opacity = 0;
  setTimeout(() => {
    card.style.display = "none";
    card.style.opacity = 1;
    // réinitialiser le prix pour la prochaine enchère si tu veux
    cardState.price = parseFloat(cardState.priceEl.textContent);
    cardState.priceEl.textContent = cardState.price.toFixed(2);
    startCard(cardState); // relance l'enchère
  }, 5000);
}

// Lancer toutes les cartes
state.forEach(cardState => startCard(cardState));

// Simulation du nombre de spectateurs
setInterval(() => {
  document.querySelectorAll('.count').forEach(el => {
    let n = parseInt(el.textContent);
    el.textContent = Math.max(5, n + Math.floor(Math.random() * 3 - 1));
  });
}, 3000);
