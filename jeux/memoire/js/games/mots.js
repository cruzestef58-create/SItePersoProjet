/* ============================================================
   Liste de mots — mémoire verbale (encodage)
   La liste est sauvegardée : elle sera re-testée un autre jour
   par l'exercice « Rappel différé ».
   ============================================================ */

const NB_MOTS = 15;

Games.register({
  id: 'mots',
  nom: 'Liste de mots',
  emoji: '📝',
  skill: 'Mémoire verbale',
  unite: `mots / ${NB_MOTS}`,
  duree: '~3 min',
  desc: `Mémorise ${NB_MOTS} mots en une minute, puis retrouve-en le maximum. La liste te sera redemandée un autre jour.`,

  play(root, done) {
    const jeu = this;
    const mots = pickMany(DATA.mots, NB_MOTS);

    G.intro(root, jeu, [
      `<b>${NB_MOTS} mots</b> s'affichent pendant <b>60 secondes</b>.`,
      'Ensuite tu les réécris, <b>dans n\'importe quel ordre</b>.',
      'Astuce qui change tout : relie-les par une petite histoire absurde (« le <i>tigre</i> joue de la <i>guitare</i> sur un <i>bateau</i>… »).',
      'Cette liste te sera redemandée dans quelques jours : c\'est là que la mémoire longue se travaille.'
    ], () => memorisation());

    function memorisation() {
      clear(root);
      const grille = el('div', { class: 'word-grid' },
        mots.map(m => el('div', { class: 'word-chip', text: m })));
      root.append(el('h3', { text: 'Mémorise ces mots' }), grille);
      const barre = G.timerBar(root, 60000, rappel);
      root.append(el('button', { class: 'btn btn-ghost btn-sm', onclick: () => { Timers.clearAll(); rappel(); } }, 'J\'ai fini →'));
    }

    function rappel() {
      clear(root);
      const zone = el('textarea', {
        class: 'recall',
        placeholder: 'Un mot par ligne…\n\nbateau\nguitare\n…'
      });
      const compteur = el('p', { class: 'small muted', text: '0 mot écrit' });
      zone.addEventListener('input', () => {
        const n = zone.value.split('\n').filter(l => normalize(l)).length;
        compteur.textContent = n + (n > 1 ? ' mots écrits' : ' mot écrit');
      });
      root.append(
        el('h3', { text: 'Écris tous les mots dont tu te souviens' }),
        el('p', { text: 'Un par ligne, l\'ordre n\'a aucune importance. Prends ton temps.' }),
        zone, compteur,
        el('button', { class: 'btn btn-primary', onclick: corriger }, 'Corriger')
      );
      zone.focus();

      function corriger() {
        const saisis = zone.value.split('\n').map(normalize).filter(Boolean);
        const uniques = Array.from(new Set(saisis));
        const trouves = mots.filter(m => uniques.includes(normalize(m)));
        const intrus = uniques.filter(u => !mots.some(m => normalize(m) === u));

        Store.saveWordSet(mots);

        const extra = el('div', { style: 'width:100%' },
          el('p', { class: 'small muted', text: intrus.length ? `${intrus.length} mot(s) inventé(s) — ça arrive quand on force le rappel.` : 'Aucun mot inventé, ta récupération est propre.' }),
          el('div', { class: 'word-grid' },
            mots.map(m => el('div', {
              class: 'word-chip ' + (trouves.includes(m) ? 'hit' : 'miss'),
              text: (trouves.includes(m) ? '✓ ' : '· ') + m
            })))
        );

        done({
          score: trouves.length,
          score100: Math.round(trouves.length / NB_MOTS * 100),
          detail: `${trouves.length}/${NB_MOTS} mots`,
          label: `${trouves.length} / ${NB_MOTS}`,
          extra
        });
      }
    }
  }
});
