const list = document.getElementById("winnersList");
const winners = JSON.parse(localStorage.getItem("winners") || "[]");

list.innerHTML = "";

if (winners.length === 0) {
  list.innerHTML = "<p>Aucun gagnant pour le moment</p>";
}

winners.forEach(w => {
  const div = document.createElement("div");
  div.className = "item-card";
  div.innerHTML = `
    <h3>${w.user}</h3>
    <p>${w.object}</p>
    <strong>${w.price} €</strong>
  `;
  list.appendChild(div);
});
