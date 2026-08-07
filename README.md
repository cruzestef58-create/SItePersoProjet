# Cruz — Mes projets

Le site vitrine qui regroupe tous mes projets pour que mes potes puissent y accéder
avec un seul lien.

---

## 1. Voir le site sur mon PC

Double-clique sur **`Ouvrir le site.bat`**.
Le site s'ouvre dans ton navigateur. C'est tout, il n'y a rien à installer.

---

## 2. Mettre le site en ligne (à faire UNE SEULE FOIS)

### Étape A — Créer le dépôt sur GitHub

1. Va sur https://github.com/new
2. Dans **Repository name**, écris exactement (attention à la casse) :
   ```
   SItePersoProjet
   ```
3. Coche **Public** (obligatoire, sinon le site gratuit ne marche pas).
4. **Ne coche RIEN d'autre** (pas de README, pas de .gitignore).
5. Clique sur **Create repository**.

### Étape B — Envoyer les fichiers

Double-clique sur **`Publier en ligne.bat`** et laisse-le faire.
La première fois, une fenêtre GitHub s'ouvrira pour te demander de te connecter : accepte.

### Étape C — Activer le site

1. Va sur https://github.com/cruzestef58-create/SItePersoProjet/settings/pages
2. Dans **Source**, choisis **Deploy from a branch**.
3. Branch : **main**, dossier : **/ (root)**. Clique sur **Save**.
4. Attends 1 à 2 minutes.

### Ton lien à envoyer aux potes

```
https://cruzestef58-create.github.io/SItePersoProjet/
```

---

## 3. Mettre le site à jour plus tard

Après n'importe quelle modification (nouveau projet, correction, nouveau jeu) :

> Double-clique sur **`Publier en ligne.bat`**

Les changements sont en ligne 30 secondes à 1 minute plus tard.

---

## 4. Ajouter un nouveau projet

### Si c'est un site / jeu qui marche dans le navigateur

1. Copie le dossier du projet dans `jeux/` (ex : `jeux/mon-nouveau-jeu/`).
   Il doit contenir un fichier `index.html`.
2. Ouvre `projets.js`, copie un bloc `{ ... }` existant, colle-le et change les valeurs.
   Mets `lien: "jeux/mon-nouveau-jeu/"`.
3. Double-clique sur `Publier en ligne.bat`.

### Si c'est un fichier à télécharger (.exe, .jar, .zip)

1. Mets le fichier dans le dossier `telechargements/`.
2. Ajoute un bloc dans `projets.js` avec `action: "telecharger"` et
   `lien: "telechargements/nom-du-fichier.exe"`.
3. Double-clique sur `Publier en ligne.bat`.

⚠️ GitHub refuse les fichiers de plus de **100 Mo**. Pour un gros fichier,
passe par l'onglet **Releases** de GitHub à la place.

---

## Ce qu'il y a dans le dossier

| Fichier / dossier      | À quoi ça sert                                        |
|------------------------|-------------------------------------------------------|
| `index.html`           | La page d'accueil du site                              |
| `projets.js`           | **La liste de tes projets** — le fichier à modifier    |
| `style.css`            | Le design (couleurs, mise en page)                     |
| `script.js`            | Le moteur (recherche, filtres, fenêtre détails)        |
| `jeux/`                | Les projets jouables directement en ligne              |
| `telechargements/`     | Les fichiers à télécharger (Abysse.exe, mods, etc.)    |
