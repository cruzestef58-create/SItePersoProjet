# ⛰️ Tap Empire

Un jeu de *clicker / idle* : tu fais traverser **9 ères** à ta civilisation,
de l'Âge de Pierre à l'Ère Spatiale, un clic à la fois.

## 🎮 Jouer

Double-clique sur **`index.html`**. C'est tout — pas d'installation, pas de serveur.

La partie se sauvegarde toute seule dans le navigateur (toutes les 10 secondes,
et à la fermeture de l'onglet).

## 🕹️ Comment on joue

| Onglet | Ce qu'on y fait |
|---|---|
| **⛏️ Production** | Frapper le minerai, acheter des bâtiments, changer d'ère |
| **🏡 Village** | Améliorer sa base, recruter des héros, piller les voisins |
| **🏆 Empire** | Statistiques, succès, et l'héritage (le « prestige ») |

### Les grandes mécaniques

- **Le minerai central** a des points de vie. Il se fissure à chaque coup et,
  quand il éclate, il lâche un gros butin. Chaque clic a aussi une chance de
  faire un **critique ×7**.
- **Les bâtiments** produisent tout seuls (PPS = points par seconde). Le
  sélecteur **×1 / ×10 / ×100 / Max** permet d'acheter en masse.
- **Les ères** : chaque passage multiplie toute la production ×5 et débloque
  3 bâtiments et 1 héros.
- **Les héros** donnent chacun +5 % de production, et de la **Force** qui sert
  uniquement aux combats.
- **Le village** donne +5 % de production par niveau et de la **Défense**. Des
  clans ennemis t'attaquent régulièrement : si ta défense tient, tu gagnes du
  butin, sinon tu perds des points.
- **Le pillage** : tu explores, tu trouves un village, tu attaques. Tes chances
  dépendent de ta Force contre sa Défense.
- **Les succès** (28) donnent chacun +2 % de production, définitivement.
- **L'héritage** (à partir de la Renaissance) : tu recommences à zéro mais tu
  gardes des **reliques** valant +2 % de production chacune, pour toujours.
- **Progression hors-ligne** : en revenant, tes bâtiments ont produit pendant
  ton absence (50 % du rendement, 8 heures maximum).

## 📁 Organisation des fichiers

```
Tap Empire/
├── index.html      la structure de la page (aucun code de jeu dedans)
├── css/style.css   toute la mise en forme et les animations
└── js/
    ├── data.js     LES RÉGLAGES : ères, bâtiments, héros, succès, coûts
    └── game.js     la logique : état, sauvegarde, rendu, boucle de jeu
```

**Pour équilibrer ou ajouter du contenu, tout se passe dans `js/data.js`.**
Ajouter un bâtiment = ajouter une ligne dans le tableau `BUILDINGS`, le reste
(affichage, achat, sauvegarde) suit tout seul.

Quelques constantes utiles, également dans `data.js` :

| Constante | Rôle |
|---|---|
| `EVOLVE_COSTS` | prix de chaque changement d'ère |
| `BUY_GROWTH` | inflation du prix d'un bâtiment à chaque achat (1.15) |
| `TOOL` / `GAUNTLET` | améliorations de la puissance de clic |
| `OFFLINE_CAP` / `OFFLINE_RATE` | plafond et rendement du gain hors-ligne |
| `RELIC_DIVISOR` / `RELIC_EXPONENT` | courbe de gain des reliques |

## 🛠️ Détails techniques

- 100 % HTML / CSS / JavaScript, aucune bibliothèque, aucun `npm install`.
- Toutes les illustrations (minerais, héros, village isométrique) sont des SVG
  écrits directement dans le code — aucun fichier image.
- Seule ressource externe : les polices Google Fonts. Sans connexion, le jeu
  fonctionne exactement pareil avec les polices du système.
- La boucle de jeu se base sur l'horloge réelle, donc la production reste juste
  même si l'onglet passe en arrière-plan ou si le PC se met en veille.
- Sauvegarde sous la clé `tap-empire-save` du `localStorage`. Une sauvegarde
  corrompue ou incomplète est réparée au chargement au lieu de casser le jeu.
