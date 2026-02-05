const list = document.getElementById("winnerList");

function renderWinners() {
  const winners = JSON.parse(localStorage.getItem("winners") || "[]");
  list.innerHTML = "";

  winners.forEach(winner => {
    const div = document.createElement("div");
    div.className = "winner-card";
    div.innerHTML = `
      <div class="winner-name">${winner.name}</div>
      <div class="winner-price">${winner.price.toFixed(2)} €</div>
    `;
    list.appendChild(div);
  });
}

// Chargement initial
renderWinners();

/*
  Mise à jour UNIQUEMENT
  quand un nouvel achat est enregistré
*/
window.addEventListener("storage", (event) => {
  if (event.key !== "winners") return;

  const winners = JSON.parse(event.newValue || "[]");
  const latest = winners[0];
  if (!latest) return;

  const div = document.createElement("div");
  div.className = "winner-card";
  div.innerHTML = `
    <div class="winner-name">${latest.name}</div>
    <div class="winner-price">${latest.price.toFixed(2)} €</div>
  `;

  list.prepend(div);

  if (list.children.length > 10) {
    list.removeChild(list.lastChild);
  }
});
