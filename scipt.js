const objectPool = [
  {name:"Smartphone", price:120, img:"https://via.placeholder.com/300x200", paymentTime:8},
  {name:"Console", price:150, img:"https://via.placeholder.com/300x200", paymentTime:10},
  {name:"Casque audio", price:80, img:"https://via.placeholder.com/300x200", paymentTime:6},
  {name:"Montre connectée", price:60, img:"https://via.placeholder.com/300x200", paymentTime:7},
  {name:"Tablette", price:200, img:"https://via.placeholder.com/300x200", paymentTime:12}
];

const cards = document.querySelectorAll('.item-card');

function saveState(index, obj) {
  localStorage.setItem('auctionState' + index, JSON.stringify(obj));
}

function loadState(index) {
  const saved = localStorage.getItem('auctionState' + index);
  return saved ? JSON.parse(saved) : null;
}

function loadObject(card, object, price=null, countdown=null) {
  card.innerHTML = `
    <div class="content">
      <img src="${object.img}" alt="${object.name}">
      <h2>${object.name}</h2>
      <p class="description">Description de ${object.name}</p>
      <p class="price">Prix actuel : <span class="price-value">${(price??object.price).toFixed(2)}</span> €</p>
      <p class="viewers">👀 <span class="count">${Math.floor(Math.random()*20+5)}</span> personnes regardent</p>
      <button class="lock-btn">Bloquer le prix</button>
      <button class="pay-btn">Payer maintenant (${object.paymentTime}s)</button>
    </div>
    <div class="rotation-overlay"></div>
  `;
  card.dataset.startPrice = object.price;
  card.dataset.paymentTime = object.paymentTime;
}

function getCurrentObject(card){
  return {
    name: card.querySelector('h2').textContent,
    img: card.querySelector('img').src,
    paymentTime: parseInt(card.dataset.paymentTime)
  };
}

function startAuction(card, restoredState=null) {
  const content = card.querySelector('.content');
  const priceEl = card.querySelector('.price-value');
  const lockBtn = card.querySelector('.lock-btn');
  const payBtn = card.querySelector('.pay-btn');
  const overlay = card.querySelector('.rotation-overlay');

  let price = restoredState ? restoredState.price : parseFloat(card.dataset.startPrice);
  let locked = restoredState ? restoredState.locked : false;
  let countdown = restoredState ? restoredState.countdown : 0;
  let rotating = false;
  const paymentTime = parseInt(card.dataset.paymentTime);

  const priceInterval = setInterval(() => {
    if(!locked && !rotating && price > 10) {
      price = Math.max(10, price-0.6);
      priceEl.textContent = price.toFixed(2);
      saveState(card.dataset.index, {object:getCurrentObject(card), price, locked:false, countdown:0, rotating:false});
    } else if(price <= 10 && !rotating){
      startRotation(card);
    }
  }, 300);

  if(!locked) { lockBtn.style.display="block"; payBtn.style.display="none"; }
  else { lockBtn.style.display="none"; payBtn.style.display="block"; countdown=restoredState.countdown; payBtn.textContent=`Payer maintenant (${countdown}s)`; }

  lockBtn.onclick = () => {
    locked = true; lockBtn.style.display="none"; payBtn.style.display="block"; countdown=paymentTime; payBtn.textContent=`Payer maintenant (${countdown}s)`;
    const payInterval = setInterval(()=>{
      countdown--;
      if(countdown>0){ payBtn.textContent=`Payer maintenant (${countdown}s)`; saveState(card.dataset.index,{object:getCurrentObject(card),price,locked:true,countdown,rotating:false}); }
      else { clearInterval(payInterval); locked=false; payBtn.style.display="none"; lockBtn.style.display="block"; startRotation(card);}
    },1000);

    payBtn.onclick = () => { clearInterval(payInterval); alert(`Paiement simulé ✔️\nObjet remporté à ${price.toFixed(2)} €`); locked=false; startRotation(card);}
  };
}

function startRotation(card){
  const content = card.querySelector('.content');
  const overlay = card.querySelector('.rotation-overlay');

  let rotating = true; let counter=5;
  content.style.display="none"; overlay.style.display="flex"; overlay.textContent=`Prochain objet : ${counter}`;
  const rotationInterval = setInterval(()=>{
    counter--;
    if(counter>0){ overlay.textContent=`Prochain objet : ${counter}`; saveState(card.dataset.index,{object:getCurrentObject(card),price:parseFloat(card.querySelector('.price-value').textContent),locked:false,countdown:0,rotating:true}); }
    else { clearInterval(rotationInterval); const newObj = objectPool[Math.floor(Math.random()*objectPool.length)]; loadObject(card,newObj); content.style.display="block"; overlay.style.display="none"; startAuction(card);}
  },1000);
}

cards.forEach((card,index)=>{
  const restored = loadState(index);
  if(restored){ loadObject(card,restored.object,restored.price,restored.countdown); if(restored.rotating) startRotation(card); else startAuction(card,restored);}
  else{ const obj = objectPool[Math.floor(Math.random()*objectPool.length)]; loadObject(card,obj); startAuction(card);}
});

setInterval(()=>{
  document.querySelectorAll('.count').forEach(el=>{ let n=parseInt(el.textContent); el.textContent=Math.max(5,n+Math.floor(Math.random()*3-1)); });
},3000);
