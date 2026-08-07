/* ============================================================
   Paires — mémoire visuelle de reconnaissance
   ============================================================ */

const NB_PAIRES = 10;

Games.register({
  id: 'paires',
  nom: 'Les paires',
  emoji: '🃏',
  skill: 'Mémoire visuelle',
  unite: 'points',
  duree: '~2 min',
  desc: 'Retrouve les 10 paires en un minimum de coups. Le classique qui entraîne à retenir « quoi » et « où » en même temps.',

  play(root, done) {
    const jeu = this;

    G.intro(root, jeu, [
      '20 cartes face cachée, <b>10 paires</b> à retrouver.',
      'Retourne deux cartes : si elles sont identiques, elles restent visibles.',
      'Ton score dépend du <b>nombre de coups</b> : 10 coups = sans faute.',
      'Astuce : nomme mentalement chaque carte découverte (« la clé en haut à droite »). Un mot retient mieux qu\'une image.'
    ], () => jouer());

    function jouer() {
      clear(root);
      const symboles = pickMany(DATA.paires, NB_PAIRES);
      const cartes = shuffle(symboles.concat(symboles));
      const compteurEl = el('p', { text: 'Coups : 0' });
      const grille = el('div', { class: 'pgrid' });

      let coups = 0, ouvertes = [], bloque = false, trouvees = 0;
      const debut = Date.now();

      cartes.forEach((sym, idx) => {
        const c = el('div', { class: 'pcard' }, el('span', { class: 'face', text: sym }));
        c.dataset.sym = sym; c.dataset.idx = idx;
        c.onclick = () => retourner(c);
        grille.append(c);
      });

      root.append(el('h3', { text: 'Retrouve les paires' }), compteurEl, grille);

      function retourner(c) {
        if (bloque || c.classList.contains('up') || c.classList.contains('matched')) return;
        c.classList.add('up');
        ouvertes.push(c);
        if (ouvertes.length < 2) return;

        coups++; compteurEl.textContent = 'Coups : ' + coups;
        const [a, b] = ouvertes;
        if (a.dataset.sym === b.dataset.sym) {
          a.classList.add('matched'); b.classList.add('matched');
          a.classList.remove('up'); b.classList.remove('up');
          ouvertes = []; trouvees++;
          if (trouvees === NB_PAIRES) Timers.after(fin, 550);
        } else {
          bloque = true;
          Timers.after(() => {
            a.classList.remove('up'); b.classList.remove('up');
            ouvertes = []; bloque = false;
          }, 750);
        }
      }

      function fin() {
        const secondes = Math.round((Date.now() - debut) / 1000);
        const points = Math.round(clamp(100 - (coups - NB_PAIRES) * 4.5, 5, 100));
        const extra = el('p', { class: 'small muted', text: `${coups} coups en ${secondes} s (minimum théorique : ${NB_PAIRES} coups)` });
        done({
          score: points,
          score100: points,
          detail: `${points} pts — ${coups} coups en ${secondes} s`,
          label: points + ' pts',
          extra
        });
      }
    }
  }
});
