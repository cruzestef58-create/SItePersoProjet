/* =========================================================================
   Le moteur du site : il lit la liste PROJETS (dans projets.js)
   et fabrique la vitrine, les tuiles, la recherche, les filtres et la
   fenêtre détails.
   Tu n'as normalement pas besoin de toucher à ce fichier.
   ========================================================================= */

(function () {
  "use strict";

  var grille    = document.getElementById("grille");
  var vide      = document.getElementById("vide");
  var recherche = document.getElementById("recherche");
  var filtres   = document.getElementById("filtres");
  var modale    = document.getElementById("modale");
  var vitrine   = document.getElementById("vitrine");

  var filtreActif = "tous";

  /* --------------------------- petits utilitaires ------------------------- */
  function degrade(p) {
    return "linear-gradient(135deg," + p.couleurs[0] + "," + p.couleurs[1] + ")";
  }
  function libelleAction(p) {
    return p.action === "telecharger" ? "Télécharger" : "Ouvrir";
  }
  // "telechargements/Abysse.exe?v=4" -> "Abysse.exe"
  // garantit le bon nom du fichier telecharge malgre le "?v=" anti-cache.
  function nomFichier(lien) {
    return lien.split("?")[0].split("/").pop();
  }
  function sansAccents(t) {
    return (t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  function tagsHTML(liste) {
    return (liste || []).map(function (t) {
      return '<span class="tag">' + t + "</span>";
    }).join("");
  }
  // le lien d'action d'un projet, avec les bons attributs selon son type
  function lienHTML(p, classes, libelle) {
    return '<a class="' + classes + '" href="' + p.lien + '"' +
      (p.action === "telecharger"
        ? ' download="' + nomFichier(p.lien) + '"'
        : ' target="_blank" rel="noopener"') +
      ">" + (libelle || libelleAction(p)) + "</a>";
  }

  /* ------------------------- la vitrine du haut --------------------------- */
  function afficherVitrine() {
    var p = PROJETS.filter(function (x) { return x.vedette; })[0] || PROJETS[0];
    var i = PROJETS.indexOf(p);

    vitrine.innerHTML =
      '<div class="vitrine-fond" style="background:' + degrade(p) + '"></div>' +
      '<div class="vitrine-inner">' +
        '<span class="vitrine-etiquette">À la une</span>' +
        '<div class="vitrine-emoji">' + p.emoji + "</div>" +
        "<h1>" + p.titre + "</h1>" +
        '<p class="vitrine-phrase">' + p.resume + "</p>" +
        '<div class="tags">' + tagsHTML(p.tags) + "</div>" +
        '<div class="actions">' +
          lienHTML(p, "btn btn-primaire") +
          '<button class="btn btn-fantome" type="button" data-details="' + i + '">En savoir plus</button>' +
        "</div>" +
      "</div>";
  }

  /* ------------------------------- les tuiles ----------------------------- */
  function tuileHTML(p, index) {
    var enLigne = p.action !== "telecharger";
    return (
      '<article class="tuile">' +
        '<div class="cover">' +
          '<div class="cover-degrade" style="background:' + degrade(p) + '"></div>' +
          '<span class="badge' + (enLigne ? " en-ligne" : "") + '">' +
            (enLigne ? "En ligne" : "Téléchargement") +
          "</span>" +
          '<span class="cover-emoji">' + p.emoji + "</span>" +
        "</div>" +
        '<div class="tuile-corps">' +
          "<h3>" + p.titre + "</h3>" +
          '<div class="tags">' + tagsHTML(p.tags) + "</div>" +
          "<p>" + p.resume + "</p>" +
          '<div class="actions">' +
            lienHTML(p, "btn btn-primaire large") +
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
      return tuileHTML(p, PROJETS.indexOf(p));
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
      tagsHTML((p.tags || []).concat(p.annee ? [p.annee] : []));

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
      action.setAttribute("download", nomFichier(p.lien));
      action.removeAttribute("target");
    } else {
      action.removeAttribute("download");
      action.target = "_blank";
      action.rel = "noopener";
    }

    // 2e bouton optionnel (ex : la version application d'un jeu jouable en ligne)
    var action2 = document.getElementById("modale-action2");
    if (p.secondaire) {
      action2.textContent = p.secondaire.libelle;
      action2.href = p.secondaire.lien;
      action2.target = "_blank";
      action2.rel = "noopener";
      action2.hidden = false;
    } else {
      action2.hidden = true;
    }

    modale.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function fermerModale() {
    modale.hidden = true;
    document.body.style.overflow = "";
  }

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

  // les boutons "Détails" existent dans la grille ET dans la vitrine
  document.addEventListener("click", function (e) {
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
  afficherVitrine();
  afficher();
})();
