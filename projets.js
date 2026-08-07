/* =========================================================================
   LA LISTE DE TES PROJETS
   -------------------------------------------------------------------------
   C'est LE SEUL fichier que tu as besoin de modifier pour ajouter,
   enlever ou changer un projet. Le site se met à jour tout seul.

   Pour ajouter un projet : copie un bloc { ... } entier, colle-le,
   et change les valeurs. N'oublie pas la virgule entre chaque bloc.

   Les champs :
     titre       : le nom affiché
     resume      : une phrase courte (sur la carte)
     details     : le texte long (dans la fenêtre "Détails")
     emoji       : l'icône affichée sur la carte
     couleurs    : les 2 couleurs du dégradé de la carte
     categorie   : "jeu" ou "outil"
     action      : "jouer"      -> bouton "Jouer / Ouvrir"
                   "telecharger"-> bouton "Télécharger"
     lien        : le chemin vers le projet (ou le fichier à télécharger)
     tags        : les petits libellés sous le titre
     vedette     : true = grande carte mise en avant (1 seul conseillé)
     annee       : affichée dans les détails
   ========================================================================= */

const PROJETS = [

  {
    titre: "Abysse",
    resume: "Un vrai jeu vidéo roguelite 2D : descends dans les abysses, améliore ton perso, survis le plus longtemps possible.",
    details:
      "Roguelite d'action en 2D fait entièrement à la main en Python. " +
      "Chaque partie est différente : tu descends d'étage en étage, tu nettoies des salles remplies d'ennemis, " +
      "et entre deux étages tu choisis des améliorations qui changent complètement ta façon de jouer. " +
      "Tous les graphismes sont générés par le code, il n'y a aucune image dans le jeu.",
    emoji: "🌑",
    couleurs: ["#7B1FA2", "#E01A76"],
    categorie: "jeu",
    action: "telecharger",
    lien: "telechargements/Abysse.exe",
    tags: ["Windows", "Roguelite", "Solo", "14 Mo"],
    vedette: true,
    annee: "2026",
    install:
      "Windows va afficher un avertissement bleu « Windows a protégé votre ordinateur » : " +
      "c'est normal pour un jeu qui n'est pas signé. Clique sur « Informations complémentaires » " +
      "puis « Exécuter quand même ». Aucune installation, le jeu se lance directement."
  },

  {
    titre: "QuizzlyUnivers",
    resume: "L'univers du quizz : animaux, sciences, géo, histoire, films… Mode aléatoire ou contre-la-montre.",
    details:
      "Une vraie plateforme de quiz avec plusieurs univers : félins, oiseaux, canidés, reptiles, " +
      "mammifères marins, mais aussi sciences, géographie, histoire et films & séries. " +
      "Tu peux lancer un mode aléatoire de 10 questions tous thèmes confondus, ou te tester " +
      "en QuizzlySpeed, le mode contre-la-montre. Les questions sont vérifiées et sourcées.",
    emoji: "🦉",
    couleurs: ["#0891B2", "#7C3AED"],
    categorie: "jeu",
    action: "jouer",
    lien: "https://cruzestef58-create.github.io/QuizzlyUnivers/",
    tags: ["Navigateur", "Quiz", "Culture G"],
    annee: "2026"
  },

  {
    titre: "Arcane Summoner",
    resume: "Jeu gacha : invoque des personnages arcaniques, complète ta collection, monte ta meilleure équipe.",
    details:
      "Un gacha jouable dans le navigateur. Tu fais des invocations pour tirer des personnages " +
      "arcaniques plus ou moins rares, tu gères ta collection, tu montes leurs stats et tu " +
      "composes l'équipe la plus solide possible. Le plaisir du tirage, sans dépenser un centime.",
    emoji: "🔮",
    couleurs: ["#5E35B1", "#E01A76"],
    categorie: "jeu",
    action: "jouer",
    lien: "https://cruzestef58-create.github.io/Arcane-Sommuner/",
    tags: ["Navigateur", "Gacha", "Collection"],
    annee: "2026"
  },

  {
    titre: "Tap Empire",
    resume: "Clicker de civilisation : tu commences avec une pierre et tu finis avec un empire.",
    details:
      "Un jeu de clic addictif où tu fais évoluer une civilisation à travers les âges. " +
      "Améliorations, production automatique, prestige... le combo classique du genre, " +
      "jouable directement dans le navigateur, sur PC comme sur téléphone.",
    emoji: "👑",
    couleurs: ["#F0334A", "#F79D2E"],
    categorie: "jeu",
    action: "jouer",
    lien: "jeux/tap-empire/",
    tags: ["Navigateur", "Clicker", "Mobile OK"],
    annee: "2026"
  },

  {
    titre: "Quel agent Valorant es-tu ?",
    resume: "24 questions, 25 agents possibles. Fais-le, envoie ton résultat aux potes, comparez.",
    details:
      "Un vrai test de personnalité, pas un quiz au hasard : chaque réponse ajoute des points " +
      "à plusieurs agents à la fois, avec un système de pondération. Les 25 agents du jeu sont " +
      "atteignables. À la fin tu as ton agent principal et ton top 3.",
    emoji: "🎯",
    couleurs: ["#E01A76", "#B4237A"],
    categorie: "jeu",
    action: "jouer",
    lien: "jeux/test-valorant/",
    tags: ["Navigateur", "Quiz", "Mobile OK"],
    annee: "2026"
  },

  {
    titre: "Hero Arena 3D",
    resume: "Arène de combat en 3D dans le navigateur. Tape, esquive, survis aux vagues.",
    details:
      "Un jeu d'action en 3D qui tourne directement dans le navigateur, sans rien installer. " +
      "Tu contrôles un héros dans une arène et tu affrontes des vagues d'ennemis de plus en plus costauds.",
    emoji: "⚔️",
    couleurs: ["#C2185B", "#5E35B1"],
    categorie: "jeu",
    action: "jouer",
    lien: "jeux/hero-arena-3d/",
    tags: ["Navigateur", "3D", "Action"],
    annee: "2026"
  },

  {
    titre: "Clash de Village 3D",
    resume: "Construis ton village, gère tes ressources, monte en puissance.",
    details:
      "Jeu de gestion et de construction en 3D vu du dessus. Tu poses tes bâtiments, " +
      "tu produis des ressources, tu améliores ton village petit à petit. Inspiré des grands " +
      "jeux de village sur mobile, mais jouable directement dans le navigateur.",
    emoji: "🏰",
    couleurs: ["#E85D2A", "#F0334A"],
    categorie: "jeu",
    action: "jouer",
    lien: "jeux/clash-village/",
    tags: ["Navigateur", "3D", "Gestion"],
    annee: "2026"
  },

  {
    titre: "Régate",
    resume: "Course de bateaux à voile. Gère le vent, prends la bonne trajectoire, passe devant.",
    details:
      "Une course de voiliers où le vent compte vraiment : mal orienté, tu n'avances plus. " +
      "Le but est de boucler le parcours en passant toutes les bouées le plus vite possible.",
    emoji: "⛵",
    couleurs: ["#0E7490", "#22B8CF"],
    categorie: "jeu",
    action: "jouer",
    lien: "jeux/regate/",
    tags: ["Navigateur", "Course", "Arcade"],
    annee: "2026"
  },

  {
    titre: "SkyLeap",
    resume: "Parkour dans les nuages. Un saut raté et tu recommences.",
    details:
      "Jeu de plateforme et de parkour où il faut enchaîner les sauts de plus en plus précis " +
      "sur des plateformes flottantes. Simple à comprendre, énervant à finir.",
    emoji: "☁️",
    couleurs: ["#3B82F6", "#A855F7"],
    categorie: "jeu",
    action: "jouer",
    lien: "jeux/skyleap/",
    tags: ["Navigateur", "Plateforme", "Skill"],
    annee: "2026"
  },

  {
    titre: "LoL Coach Board",
    resume: "Tableau tactique de la Faille de l'Invocateur pour préparer vos coups en équipe.",
    details:
      "Un tableau blanc tactique sur la carte de League of Legends : tu poses les champions, " +
      "tu traces les déplacements, tu marques les wards et les objectifs. Pratique pour expliquer " +
      "un plan à ton équipe avant une game ou pour débriefer après.",
    emoji: "🗺️",
    couleurs: ["#0F766E", "#0EA5A5"],
    categorie: "outil",
    action: "jouer",
    lien: "jeux/lol-coach-board/",
    tags: ["Navigateur", "League of Legends", "Outil"],
    annee: "2026"
  },

  {
    titre: "LoL Random Picker",
    resume: "Plus d'excuses pour hésiter 5 minutes en champ select.",
    details:
      "Tu appuies, il te sort un champion au hasard. Idéal pour les soirées où personne " +
      "n'arrive à se décider, ou pour se forcer à sortir de son pool habituel.",
    emoji: "🎲",
    couleurs: ["#B4237A", "#E01A76"],
    categorie: "outil",
    action: "jouer",
    lien: "jeux/lol-random-picker/",
    tags: ["Navigateur", "League of Legends", "Fun"],
    annee: "2026"
  },

  {
    titre: "Entraînement Mémoire",
    resume: "8 exercices quotidiens pour muscler sa mémoire, avec suivi de progression.",
    details:
      "Une petite salle de sport pour le cerveau : 8 exercices différents (chiffres, mots, " +
      "images, associations...) à faire chaque jour, plus un système de mémos à répétition " +
      "espacée pour retenir des choses sur le long terme. Tes données restent dans ton " +
      "navigateur, rien n'est envoyé nulle part.",
    emoji: "🧠",
    couleurs: ["#7C3AED", "#E01A76"],
    categorie: "outil",
    action: "jouer",
    lien: "jeux/memoire/",
    tags: ["Navigateur", "Quotidien", "Mobile OK"],
    annee: "2026"
  }

  /* ------------------------------------------------------------------
     EXEMPLE pour ajouter un mod Minecraft plus tard :
     (enlève les /* et */ /* autour, et mets une virgule après le } du
     projet juste au-dessus)

  ,{
    titre: "NeoVision",
    resume: "Des lunettes futuristes pour Minecraft : vision des minerais, ESP des mobs, vision nocturne.",
    details: "Mod Fabric pour Minecraft 1.20.1. Installe Fabric, puis mets le .jar dans ton dossier mods.",
    emoji: "🕶️",
    couleurs: ["#22B8CF", "#3B82F6"],
    categorie: "outil",
    action: "telecharger",
    lien: "telechargements/neovision-1.0.jar",
    tags: ["Minecraft 1.20.1", "Fabric", "Mod"],
    annee: "2026",
    install: "Il te faut Minecraft 1.20.1 avec Fabric Loader + Fabric API. Mets le .jar dans le dossier .minecraft/mods."
  }
     ------------------------------------------------------------------ */

];
