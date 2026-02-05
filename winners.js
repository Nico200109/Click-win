const container = document.getElementById("winners");
const winners = JSON.parse(localStorage.getItem("winners") || "[]");

container.innerHTML = winners.length
  ? winners.map(w =>
    `<div class="item-card">
      <h2>${w.name}</h2>
      <p>💰 ${w.price} €</p>
      <p>${w.time}</p>
    </div>`
  ).join("")
  : "<p>Aucun gagnant pour le moment</p>";
