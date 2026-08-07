/* ============================================================
   Grille spatiale — mémoire visuo-spatiale (type blocs de Corsi)
   ============================================================ */

const TAILLE_GRILLE = 5;

Games.register({
  id: 'grille',
  nom: 'Grille lumineuse',
  emoji: '🟪',
  skill: 'Mémoire spatiale',
  unite: 'cases',
  duree: '~2 min',
  desc: 'Des cases s\'allument une à une. Retrouve-les toutes. C\'est la mémoire des lieux et des positions.',

  play(root, done) {
    const jeu = this;
    let niveau = 3, erreurs = 0, record = 0, entete = null;

    G.intro(root, jeu, [
      'Des cases s\'allument les unes après les autres.',
      'Ensuite, clique sur <b>toutes celles qui se sont allumées</b> — l\'ordre ne compte pas.',
      'Une case en plus à chaque réussite. <b>Deux erreurs</b> au même niveau et c\'est fini.',
      'Astuce : vois la forme dessinée par les cases (un L, un triangle…) plutôt que des cases isolées.'
    ], () => G.countdown(root, tour));

    function construire() {
      const cases = [];
      const grille = el('div', {
        class: 'sgrid',
        style: `grid-template-columns:repeat(${TAILLE_GRILLE},auto)`
      });
      for (let i = 0; i < TAILLE_GRILLE * TAILLE_GRILLE; i++) {
        const c = el('div', { class: 'scell locked' });
        cases.push(c); grille.append(c);
      }
      return { grille, cases };
    }

    function tour() {
      clear(root);
      const { grille, cases } = construire();
      const cible = shuffle(cases.map((_, i) => i)).slice(0, niveau);
      root.append(el('p', { text: `Niveau ${niveau} cases — observe bien` }), grille);

      let k = 0;
      const iv = Timers.every(() => {
        if (k > 0) cases[cible[k - 1]].classList.remove('lit');
        if (k >= cible.length) {
          Timers.stop(iv);
          Timers.after(() => phaseClic(grille, cases, cible), 400);
          return;
        }
        cases[cible[k]].classList.add('lit');
        k++;
      }, 620);
    }

    function phaseClic(grille, cases, cible) {
      clear(root);
      const titre = el('h3', { text: 'À toi' });
      const consigne = el('p', { text: `Clique sur les ${cible.length} cases qui se sont allumées.` });
      entete = { titre, consigne };
      root.append(titre, consigne, grille);
      const choisies = [];
      cases.forEach((c, i) => {
        c.classList.remove('locked');
        c.onclick = () => {
          if (choisies.includes(i)) return;
          choisies.push(i);
          c.classList.add('picked');
          if (choisies.length === cible.length) evaluer(cases, cible, choisies);
        };
      });
    }

    function evaluer(cases, cible, choisies) {
      cases.forEach(c => { c.onclick = null; c.classList.add('locked'); });
      const juste = choisies.every(i => cible.includes(i));
      cible.forEach(i => { if (!choisies.includes(i)) cases[i].classList.add('lit'); });
      choisies.forEach(i => { if (!cible.includes(i)) cases[i].classList.add('wrong'); });

      if (juste) { record = Math.max(record, niveau); niveau++; erreurs = 0; }
      else erreurs++;

      if (entete) {
        entete.titre.textContent = juste ? '✅ Parfait !' : '❌ Pas tout à fait';
        entete.consigne.textContent = juste
          ? 'On monte d\'une case.'
          : 'En violet : les cases oubliées. En rouge : les erreurs.';
      }

      if (!juste && erreurs >= 2) Timers.after(fin, 1800);
      else Timers.after(tour, 1600);
    }

    function fin() {
      done({
        score: record,
        score100: clamp((record - 2) * 13, 0, 100),
        detail: `${record} cases retenues`,
        label: record ? `${record} cases` : 'aucune'
      });
    }
  }
});
