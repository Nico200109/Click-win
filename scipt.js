console.log("JS chargé");

document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll(".item-card").forEach(card => {

    const priceEl = card.querySelector(".price-value");
    const lockBtn = card.querySelector(".lock-btn");

    let price = parseInt(priceEl.textContent);
    let locked = false;

    setInterval(() => {
      if (!locked && price > 10) {
        price--;
        priceEl.textContent = price;
      }
    }, 700);

    lockBtn.addEventListener("click", () => {
      locked = true;
      lockBtn.textContent = "Prix bloqué";
      lockBtn.disabled = true;
    });

  });

});
