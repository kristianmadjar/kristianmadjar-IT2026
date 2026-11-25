(function () {
  "use strict";

  var linkovi = Array.prototype.slice.call(
    document.querySelectorAll(".galerija a")
  );
  if (linkovi.length === 0) {
    return;
  }

  var trenutni = 0;
  var prethodniFokus = null;
  var dodirX = null;

  var lb = document.createElement("div");
  lb.className = "lightbox";
  lb.hidden = true;
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.setAttribute("aria-label", "Pregled slike");
  lb.innerHTML =
    '<button type="button" class="lb-zatvori" aria-label="Zatvori">&times;</button>' +
    '<button type="button" class="lb-nazad" aria-label="Prethodna slika">&#10094;</button>' +
    '<figure class="lb-okvir">' +
    '<img class="lb-slika" alt="" />' +
    '<figcaption class="lb-opis"></figcaption>' +
    "</figure>" +
    '<button type="button" class="lb-napred" aria-label="Sledeća slika">&#10095;</button>';
  document.body.appendChild(lb);

  var slika = lb.querySelector(".lb-slika");
  var opis = lb.querySelector(".lb-opis");
  var dugmad = lb.querySelectorAll("button");
  var btnZatvori = lb.querySelector(".lb-zatvori");
  var btnNazad = lb.querySelector(".lb-nazad");
  var btnNapred = lb.querySelector(".lb-napred");

  function prikazi(i) {
    trenutni = (i + linkovi.length) % linkovi.length;

    var link = linkovi[trenutni];
    var tekst = link.querySelector("img").alt;

    slika.src = link.href;
    slika.alt = tekst;
    opis.textContent = tekst + " (" + (trenutni + 1) + " / " + linkovi.length + ")";

    [trenutni - 1, trenutni + 1].forEach(function (k) {
      new Image().src = linkovi[(k + linkovi.length) % linkovi.length].href;
    });
  }

  function otvori(i) {
    prethodniFokus = document.activeElement;
    prikazi(i);
    lb.hidden = false;
    document.body.classList.add("lb-otvoren");
    btnZatvori.focus();
  }

  function zatvori() {
    lb.hidden = true;
    document.body.classList.remove("lb-otvoren");
    if (prethodniFokus) {
      prethodniFokus.focus();
    }
  }

  function sledeca() {
    prikazi(trenutni + 1);
  }

  function prethodna() {
    prikazi(trenutni - 1);
  }

  linkovi.forEach(function (link, i) {
    link.addEventListener("click", function (e) {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) {
        return;
      }
      e.preventDefault();
      otvori(i);
    });
  });

  btnZatvori.addEventListener("click", zatvori);
  btnNazad.addEventListener("click", prethodna);
  btnNapred.addEventListener("click", sledeca);

  lb.addEventListener("click", function (e) {
    if (e.target === lb) {
      zatvori();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (lb.hidden) {
      return;
    }

    if (e.key === "Escape") {
      zatvori();
    } else if (e.key === "ArrowRight") {
      sledeca();
    } else if (e.key === "ArrowLeft") {
      prethodna();
    } else if (e.key === "Tab") {
      var prvo = dugmad[0];
      var poslednje = dugmad[dugmad.length - 1];
      if (e.shiftKey && document.activeElement === prvo) {
        e.preventDefault();
        poslednje.focus();
      } else if (!e.shiftKey && document.activeElement === poslednje) {
        e.preventDefault();
        prvo.focus();
      }
    }
  });

  lb.addEventListener(
    "touchstart",
    function (e) {
      dodirX = e.changedTouches[0].clientX;
    },
    { passive: true }
  );

  lb.addEventListener(
    "touchend",
    function (e) {
      if (dodirX === null) {
        return;
      }
      var razlika = e.changedTouches[0].clientX - dodirX;
      dodirX = null;
      if (Math.abs(razlika) > 50) {
        if (razlika < 0) {
          sledeca();
        } else {
          prethodna();
        }
      }
    },
    { passive: true }
  );
})();
