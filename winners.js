const list = document.getElementById("list");
const winners = JSON.parse(localStorage.getItem("winners")) || [];

if (!winners.length) {
  list.innerHTML = "<p>Aucune vente pour le moment.</p>";
} else {
  list.innerHTML = winners
    .map(w => `<p>✔ ${w.name} — ${w.price.toFixed(2)} €</p>`)
    .join("");
}
