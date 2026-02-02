function register() {
  const user = {
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  if (!user.username || !user.email || !user.password) {
    alert("Tous les champs sont obligatoires");
    return;
  }

  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("logged", "true");

  window.location.href = "index.html";
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.email !== email || user.password !== password) {
    alert("Identifiants incorrects");
    return;
  }

  localStorage.setItem("logged", "true");
  window.location.href = "index.html";
}

function checkAuth() {
  if (localStorage.getItem("logged") !== "true") {
    window.location.href = "login.html";
  }
}

function logout() {
  localStorage.removeItem("logged");
  window.location.href = "login.html";
}
