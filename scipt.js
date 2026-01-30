const items = Array.from(document.querySelectorAll('.item-card'));
let currentIndex = 0;

function showItem(index) {
  items.forEach((card, i) => {
    if (i === index) {
      card.style.display = "block";
      card.style.opacity = 1;
    } else {
      card.style.display = "none";
    }
  });
}

function startAuction() {
  const card = items[currentIndex];
  const priceEl = card.querySelector('.price-value');
  const lockBtn = card.querySelector('.lock-btn');
  const payBtn = card.querySelector('.pay-btn');

  let price = parseFloat(priceEl.textContent);
  let locked = false;
  let dropInterval = null;

  showItem(currentIndex);

  // baisse du prix toutes les 0,3s
  function startDrop() {
    dropInterval = setInterval(() => {
      if (!locked && price > 10) {
        price = Math.max(10, price - 0.3);
        priceEl.textContent = price.toFixed(2);
      } else if (price <= 10) {
        // atteindre prix min → stop interval et rotation
        clearInterval(dropInterval);
        rotateToNext();
      }
    }, 300);
  }

  startDrop();

  // blocage prix
  lockBtn.onclick = () => {
    locked = true;
    lockBtn.style.display = "none";
    payBtn.style.display = "block";
    card.classList.add("blocked");

    setTimeout(() => {
      if (!locked) return; // si déjà payé, rien à faire
      locked = false;
      payBtn.style.display = "none";
      card.classList.remove("blocked");
    }, 10000);
  };

  // paiement simulé
  payBtn.onclick = () => {
    alert(`Paiement simulé ✔️\nObjet remporté à ${price.toFixed(2)} €`);
    locked = true;
    clearInterval(dropInterval);
    rotateToNext();
  };
}

// rotation vers le prochain objet avec transition 5s
function rotateToNext() {
  const oldCard = items[currentIndex];
  oldCard.style.opacity = 0;
  setTimeout(() => {
    oldCard.style.display = "none";
    currentIndex = (currentIndex + 1) % items.length;
    startAuction();
  }, 5000); // transition 5 secondes
}

// simulation personnes qui regardent
setInterval(() => {
  document.querySelectorAll('.count').forEach(el => {
    let n = parseInt(el.textContent);
    el.textContent = Math.max(5, n + Math.floor(Math.random() * 3 - 1));
  });
}, 3000);

// lancement
startAuction();
