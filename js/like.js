(function () {
  "use strict";

  var dugme = document.querySelector(".like-dugme");
  if (!dugme) {
    return;
  }

  var tekst = dugme.querySelector(".like-tekst");
  var kljuc = "like:" + window.location.pathname.replace(/index\.html$/, "");
  var oznaceno = false;

  try {
    oznaceno = window.localStorage.getItem(kljuc) === "da";
  } catch (e) {
    oznaceno = false;
  }

  function prikazi() {
    dugme.setAttribute("aria-pressed", String(oznaceno));
    tekst.textContent = oznaceno ? "Liked" : "Like";
  }

  dugme.addEventListener("click", function () {
    oznaceno = !oznaceno;
    prikazi();
    try {
      window.localStorage.setItem(kljuc, oznaceno ? "da" : "ne");
    } catch (e) {
      return;
    }
  });

  prikazi();
})();
