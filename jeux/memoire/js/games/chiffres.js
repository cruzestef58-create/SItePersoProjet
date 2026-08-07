/* ============================================================
   Empan de chiffres — mémoire de travail
   ============================================================ */

Games.register({
  id: 'chiffres',
  nom: 'Empan de chiffres',
  emoji: '🔢',
  skill: 'Mémoire de travail',
  unite: 'chiffres',
  duree: '~2 min',
  desc: "Retiens une suite de chiffres de plus en plus longue. C'est la mesure la plus classique de la mémoire immédiate.",

  play(root, done) {
    const jeu = this;
    let longueur = 3, erreurs = 0, record = 0, essais = 0;

    G.intro(root, jeu, [
      'Une suite de chiffres apparaît quelques secondes.',
      'Elle disparaît : retape-la <b>dans le même ordre</b>.',
      'Chaque réussite ajoute un chiffre. <b>Deux erreurs</b> à la même longueur et c\'est terminé.',
      'Astuce : découpe en paquets de 3 (« 4-8-2 / 9-1-7 ») et récite-les dans ta tête.'
    ], () => G.countdown(root, tour));

    function tour() {
      const suite = Array.from({ length: longueur }, () => randInt(10));
      clear(root);
      root.append(
        el('p', { text: `Niveau ${longueur} chiffres — mémorise !` }),
        el('div', { class: 'big-digits', text: suite.join('') })
      );
      const affichage = 800 + longueur * 550;
      G.timerBar(root, affichage, () => saisie(suite));
    }

    function saisie(suite) {
      clear(root);
      essais++;
      const input = el('input', {
        type: 'text', class: 'input-big', inputmode: 'numeric',
        autocomplete: 'off', maxlength: String(longueur + 4), placeholder: '…'
      });
      const btn = el('button', { class: 'btn btn-primary', onclick: valider }, 'Valider');
      root.append(
        el('h3', { text: 'Retape la suite' }),
        el('p', { text: `${longueur} chiffres, dans l'ordre.` }),
        input, btn
      );
      input.focus();
      input.addEventListener('keydown', e => { if (e.key === 'Enter') valider(); });

      function valider() {
        const rep = input.value.replace(/\D/g, '');
        btn.disabled = true;
        const juste = rep === suite.join('');
        if (juste) { record = Math.max(record, longueur); longueur++; erreurs = 0; }
        else erreurs++;

        clear(root);
        root.append(
          el('div', { style: 'font-size:46px' }, juste ? '✅' : '❌'),
          el('h3', { text: juste ? 'Exact !' : 'Raté' }),
          el('p', { html: `La suite était <b>${suite.join(' ')}</b>` + (juste ? '' : `<br>Tu as tapé : ${rep || '—'}`) })
        );

        if (!juste && erreurs >= 2) Timers.after(fin, 1500);
        else Timers.after(tour, 1400);
      }
    }

    function fin() {
      done({
        score: record,
        score100: clamp((record - 2) * 12, 0, 100),
        detail: `${record} chiffres retenus en ${essais} essais`,
        label: record ? `${record} chiffres` : 'aucun'
      });
    }
  }
});
