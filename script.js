/* =========================================================================
   Le moteur du site : il lit la liste PROJETS (dans projets.js)
   et fabrique les cartes, la recherche, les filtres et la fenêtre détails.
   Tu n'as normalement pas besoin de toucher à ce fichier.
   ========================================================================= */

(function () {
  "use strict";

  var grille   = document.getElementById("grille");
  var vide     = document.getElementById("vide");
  var recherche= document.getElementById("recherche");
  var filtres  = document.getElementById("filtres");
  var modale   = document.getElementById("modale");

  var filtreActif = "tous";

  /* --------------------------- petits utilitaires ------------------------- */
  function degrade(p) {
    return "linear-gradient(135deg," + p.couleurs[0] + "," + p.couleurs[1] + ")";
  }
  function libelleAction(p) {
    return p.action === "telecharger" ? "Télécharger" : "Ouvrir";
  }
  function sansAccents(t) {
    return (t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  /* ------------------------------ les chiffres ---------------------------- */
  function afficherStats() {
    var enLigne = PROJETS.filter(function (p) { return p.action === "jouer"; }).length;
    var jeux    = PROJETS.filter(function (p) { return p.categorie === "jeu"; }).length;
    var data = [
      [PROJETS.length, "projets"],
      [enLigne, "jouables en ligne"],
      [jeux, "jeux"]
    ];
    document.getElementById("stats").innerHTML = data.map(function (d) {
      return '<div class="stat"><b>' + d[0] + "</b><span>" + d[1] + "</span></div>";
    }).join("");
  }

  /* ------------------------------- les cartes ----------------------------- */
  function carteHTML(p, index) {
    var badge = p.action === "telecharger" ? "Téléchargement" : "En ligne";
    var tags = (p.tags || []).map(function (t) {
      return '<span class="tag">' + t + "</span>";
    }).join("");

    return (
      '<article class="carte' + (p.vedette ? " vedette" : "") + '">' +
        '<div class="cover" style="background:' + degrade(p) + '">' +
          '<span class="badge">' + badge + "</span>" +
          "<span>" + p.emoji + "</span>" +
        "</div>" +
        '<div class="carte-corps">' +
          "<h3>" + p.titre + "</h3>" +
          '<div class="tags">' + tags + "</div>" +
          "<p>" + p.resume + "</p>" +
          '<div class="actions">' +
            '<a class="btn btn-primaire large" href="' + p.lien + '"' +
              (p.action === "telecharger" ? " download" : ' target="_blank" rel="noopener"') +
            ">" + libelleAction(p) + "</a>" +
            '<button class="btn btn-fantome" type="button" data-details="' + index + '">Détails</button>' +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function afficher() {
    var q = sansAccents(recherche.value.trim());

    var liste = PROJETS.filter(function (p) {
      var okFiltre =
        filtreActif === "tous" ||
        filtreActif === p.categorie ||
        filtreActif === p.action;

      var texte = sansAccents(p.titre + " " + p.resume + " " + (p.tags || []).join(" "));
      var okRecherche = q === "" || texte.indexOf(q) !== -1;

      return okFiltre && okRecherche;
    });

    grille.innerHTML = liste.map(function (p) {
      return carteHTML(p, PROJETS.indexOf(p));
    }).join("");

    vide.hidden = liste.length > 0;
  }

  /* ------------------------------ la modale ------------------------------- */
  function ouvrirModale(p) {
    document.getElementById("modale-cover").style.background = degrade(p);
    document.getElementById("modale-emoji").textContent = p.emoji;
    document.getElementById("modale-titre").textContent = p.titre;
    document.getElementById("modale-details").textContent = p.details || p.resume;

    document.getElementById("modale-tags").innerHTML =
      (p.tags || []).concat(p.annee ? [p.annee] : []).map(function (t) {
        return '<span class="tag">' + t + "</span>";
      }).join("");

    var encart = document.getElementById("modale-install");
    if (p.install) {
      document.getElementById("modale-install-texte").textContent = p.install;
      encart.hidden = false;
    } else {
      encart.hidden = true;
    }

    var action = document.getElementById("modale-action");
    action.textContent = libelleAction(p);
    action.href = p.lien;
    if (p.action === "telecharger") {
      action.setAttribute("download", "");
      action.removeAttribute("target");
    } else {
      action.removeAttribute("download");
      action.target = "_blank";
      action.rel = "noopener";
    }

    modale.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function fermerModale() {
    modale.hidden = true;
    document.body.style.overflow = "";
  }

  /* ------------------------------ le thème -------------------------------- */
  function appliquerTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("theme", t); } catch (e) {}
  }

  var themeSauve = null;
  try { themeSauve = localStorage.getItem("theme"); } catch (e) {}
  if (themeSauve) {
    appliquerTheme(themeSauve);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    appliquerTheme("sombre");
  }

  document.getElementById("btn-theme").addEventListener("click", function () {
    var actuel = document.documentElement.getAttribute("data-theme");
    appliquerTheme(actuel === "sombre" ? "clair" : "sombre");
  });

  /* ------------------------------ les écoutes ----------------------------- */
  recherche.addEventListener("input", afficher);

  filtres.addEventListener("click", function (e) {
    var chip = e.target.closest(".chip");
    if (!chip) return;
    filtreActif = chip.dataset.filtre;
    Array.prototype.forEach.call(filtres.children, function (c) {
      c.classList.toggle("actif", c === chip);
    });
    afficher();
  });

  grille.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-details]");
    if (btn) ouvrirModale(PROJETS[Number(btn.dataset.details)]);
  });

  modale.addEventListener("click", function (e) {
    if (e.target.closest("[data-fermer]")) fermerModale();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modale.hidden) fermerModale();
  });

  /* ------------------------------- démarrage ------------------------------ */
  document.getElementById("annee").textContent = new Date().getFullYear();
  afficherStats();
  afficher();
})();
