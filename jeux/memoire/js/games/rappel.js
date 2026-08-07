/* ============================================================
   Rappel différé — la vraie mémoire à long terme
   Re-teste la liste de mots apprise lors d'une séance précédente.
   ============================================================ */

Games.register({
  id: 'rappel',
  nom: 'Rappel différé',
  emoji: '⏳',
  skill: 'Mémoire à long terme',
  unite: '% de la liste',
  duree: '~2 min',
  desc: 'Retrouve la liste de mots d\'une séance précédente. C\'est l\'exercice qui mesure ce que tu retiens vraiment.',

  /** l'exercice n'a de sens que s'il existe une ancienne liste */
  disponible() { return !!Store.previousWordSet(); },

  play(root, done) {
    const jeu = this;
    const set = Store.previousWordSet();

    if (!set) {
      G.msg(root, 'Rien à rappeler pour l\'instant',
        'Fais d\'abord l\'exercice « Liste de mots ». Il te sera redemandé lors d\'une prochaine séance.');
      root.append(el('button', { class: 'btn', onclick: () => done({ score: 0, score100: 0, detail: 'aucune liste', label: '—', skip: true }) }, 'Continuer'));
      return;
    }

    const d = keyToDate(set.date);
    const jours = daysBetween(d, new Date());
    const quand = jours <= 1 ? 'hier' : `il y a ${jours} jours`;

    G.intro(root, jeu, [
      `Tu as appris une liste de <b>${set.words.length} mots</b> ${quand} (${frDate(d)}).`,
      'Écris tous ceux dont tu te souviens, <b>sans aide</b>.',
      'Ne t\'inquiète pas si le score est bas : c\'est <b>normal</b>, et c\'est justement ce chiffre qui va monter avec les semaines.',
      'Si tu bloques, passe en revue les catégories : animaux, objets de la maison, nourriture…'
    ], rappel);

    function rappel() {
      clear(root);
      const zone = el('textarea', { class: 'recall', placeholder: 'Un mot par ligne…' });
      const compteur = el('p', { class: 'small muted', text: '0 mot écrit' });
      zone.addEventListener('input', () => {
        const n = zone.value.split('\n').filter(l => normalize(l)).length;
        compteur.textContent = n + (n > 1 ? ' mots écrits' : ' mot écrit');
      });
      root.append(
        el('h3', { text: `La liste ${quand}` }),
        el('p', { text: `${set.words.length} mots. Écris tout ce qui remonte, même si tu n'es pas sûr.` }),
        zone, compteur,
        el('button', { class: 'btn btn-primary', onclick: corriger }, 'Corriger')
      );
      zone.focus();

      function corriger() {
        const saisis = Array.from(new Set(zone.value.split('\n').map(normalize).filter(Boolean)));
        const trouves = set.words.filter(m => saisis.includes(normalize(m)));
        const pct = Math.round(trouves.length / set.words.length * 100);

        const extra = el('div', { style: 'width:100%' },
          el('div', { class: 'word-grid' },
            set.words.map(m => el('div', {
              class: 'word-chip ' + (trouves.includes(m) ? 'hit' : 'miss'),
              text: (trouves.includes(m) ? '✓ ' : '· ') + m
            })))
        );

        done({
          score: pct,
          score100: pct,
          detail: `${trouves.length}/${set.words.length} après ${jours} jour(s)`,
          label: `${trouves.length} / ${set.words.length}`,
          extra
        });
      }
    }
  }
});
