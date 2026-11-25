(function () {
  "use strict";

  var forma = document.getElementById("forma");
  if (!forma) {
    return;
  }

  var statusPoruka = document.getElementById("forma-status");
  var MAX_PORUKA = 500;

  forma.noValidate = true;

  function danas() {
    var d = new Date();
    var mesec = String(d.getMonth() + 1).padStart(2, "0");
    var dan = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + mesec + "-" + dan;
  }

  var pravila = {
    name: function (el) {
      var v = el.value.trim();
      if (!v) {
        return "Unesite ime i prezime.";
      }
      if (!/^[A-Za-zÀ-ÖØ-öø-ž\u0400-\u04FF][A-Za-zÀ-ÖØ-öø-ž\u0400-\u04FF'.-]*(\s+[A-Za-zÀ-ÖØ-öø-ž\u0400-\u04FF][A-Za-zÀ-ÖØ-öø-ž\u0400-\u04FF'.-]*)+$/.test(v)) {
        return "Unesite ime i prezime (najmanje dve reči, bez brojeva).";
      }
      return "";
    },

    email: function (el) {
      var v = el.value.trim();
      if (!v) {
        return "Unesite email adresu.";
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
        return "Email adresa nije ispravna (primer: ime@domen.rs).";
      }
      return "";
    },

    telefon: function (el) {
      var v = el.value.trim();
      if (!v) {
        return "Unesite broj telefona.";
      }
      if (!/^\+?[0-9\s\-/()]+$/.test(v)) {
        return "Telefon može da sadrži samo cifre, razmake i znakove + - / ( ).";
      }
      var cifre = v.replace(/\D/g, "");
      if (cifre.length < 8 || cifre.length > 15) {
        return "Telefon treba da ima između 8 i 15 cifara.";
      }
      return "";
    },

    datum: function (el) {
      if (el.validity.badInput) {
        return "Unesite ispravan datum.";
      }
      if (el.value && el.value < danas()) {
        return "Datum probne vožnje ne može biti u prošlosti.";
      }
      return "";
    },

    poruka: function (el) {
      var v = el.value.trim();
      if (!v) {
        return "Napišite kratku poruku.";
      }
      if (v.length < 10) {
        return "Poruka je prekratka (najmanje 10 karaktera).";
      }
      return "";
    },

    uslovi: function (el) {
      return el.checked ? "" : "Morate prihvatiti uslove.";
    }
  };

  var polja = Object.keys(pravila)
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);

  var datum = document.getElementById("datum");
  if (datum) {
    datum.min = danas();
  }

  var poruka = document.getElementById("poruka");
  var brojac = null;
  if (poruka) {
    brojac = document.createElement("small");
    brojac.className = "brojac";
    poruka.insertAdjacentElement("afterend", brojac);
    azurirajBrojac();
  }

  function azurirajBrojac() {
    if (brojac) {
      brojac.textContent = poruka.value.length + " / " + MAX_PORUKA;
    }
  }

  function mesto(el) {
    if (el.type === "checkbox") {
      return forma.querySelector('label[for="' + el.id + '"]');
    }
    return el;
  }

  function prikaziGresku(el, tekst) {
    var id = el.id + "-greska";
    var span = document.getElementById(id);

    if (!tekst) {
      if (span) {
        span.remove();
      }
      el.removeAttribute("aria-invalid");
      el.removeAttribute("aria-describedby");
      return;
    }

    if (!span) {
      span = document.createElement("span");
      span.id = id;
      span.className = "greska";
      mesto(el).insertAdjacentElement("afterend", span);
    }
    span.textContent = tekst;
    el.setAttribute("aria-invalid", "true");
    el.setAttribute("aria-describedby", id);
  }

  function proveri(el) {
    var tekst = pravila[el.id](el);
    prikaziGresku(el, tekst);
    return tekst === "";
  }

  polja.forEach(function (el) {
    var dogadjaj = el.type === "checkbox" ? "change" : "blur";
    el.addEventListener(dogadjaj, function () {
      proveri(el);
    });
    el.addEventListener("input", function () {
      if (el.getAttribute("aria-invalid") === "true") {
        proveri(el);
      }
    });
  });

  if (poruka) {
    poruka.addEventListener("input", azurirajBrojac);
  }

  forma.addEventListener("input", function () {
    if (statusPoruka) {
      statusPoruka.hidden = true;
    }
  });

  forma.addEventListener("reset", function () {
    setTimeout(function () {
      polja.forEach(function (el) {
        prikaziGresku(el, "");
      });
      azurirajBrojac();
    }, 0);
  });

  forma.addEventListener("submit", function (e) {
    e.preventDefault();

    var prvoNevazece = null;
    polja.forEach(function (el) {
      if (!proveri(el) && !prvoNevazece) {
        prvoNevazece = el;
      }
    });

    if (prvoNevazece) {
      prvoNevazece.focus();
      return;
    }

    var ime = document.getElementById("name").value.trim().split(/\s+/)[0];
    forma.reset();
    if (statusPoruka) {
      statusPoruka.textContent = "Hvala, " + ime + "! Forma je ispravno popunjena.";
      statusPoruka.hidden = false;
      statusPoruka.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
})();
