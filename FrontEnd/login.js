// tester et valider la saisie d'email
const validEmail =  function (inputEmail) {

}
// tester et valider la saisie du mot de passe
const validPassword = function (inputPassword) {

}

// envoyer une requete de login à l'API
const requestLogin = (email, password) => {
    return fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((login) => {
        const errorDisplay = document.querySelector(".errorLogin");
        if (login.token) {
          localStorage.setItem("token", login.token);
          window.location.href = "./index.html";
          alert("Bienvenue !");
        } else {
          console.error("Le token n'a pas été trouvé");
          errorDisplay.innerHTML = "Identifiant ou Mot de passe incorrect";
        }
      })
      .catch((error) => {
        console.error("Une erreur s'est produite : " + error);
      });
};

// valider le formulaire avant d'envoyer la requête de login
const form = document.getElementById("loginForm");

// Ecouter l'email et le mot de passe
form.email.addEventListener("change", function () {
  validEmail(this);
});
form.password.addEventListener("change", function () {
  validPassword(this);
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (validEmail(form.email) && validPassword(form.password)) {
    requestLogin(form.email.value, form.password.value);
  }
});
