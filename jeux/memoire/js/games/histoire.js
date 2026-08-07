/* ============================================================
   Mémoire logique — retenir les détails d'une situation
   (le plus proche de la vie quotidienne)
   ============================================================ */

Games.register({
  id: 'histoire',
  nom: 'Les détails',
  emoji: '📖',
  skill: 'Mémoire des situations',
  unite: '% de détails',
  duree: '~3 min',
  desc: 'Lis une courte scène, puis réponds aux questions sur ses détails : dates, prénoms, chiffres, lieux.',

  play(root, done) {
    const jeu = this;
    const h = DATA.histoires[dayIndex() % DATA.histoires.length];
    const questions = shuffle(h.questions);

    G.intro(root, jeu, [
      'Une courte scène s\'affiche pendant <b>50 secondes</b>.',
      'Puis on te pose des questions précises : prénoms, heures, montants, couleurs…',
      'Astuce : <b>visualise la scène comme un film</b> au lieu de relire les mots. Les détails s\'accrochent aux images.',
      'C\'est l\'exercice le plus proche de ce que la vie te demande vraiment.'
    ], lecture);

    function lecture() {
      clear(root);
      root.append(
        el('h3', { text: 'Lis attentivement' }),
        el('div', { class: 'story', html: h.texte })
      );
      G.timerBar(root, 50000, quiz);
      root.append(el('button', { class: 'btn btn-ghost btn-sm', onclick: () => { Timers.clearAll(); quiz(); } }, 'J\'ai retenu →'));
    }

    function juste(saisi, q) {
      const n = normalize(saisi);
      if (!n) return false;
      const attendus = [q.r].concat(q.alt || []).map(normalize).filter(Boolean);
      return attendus.some(a => n === a || (a.length >= 3 && n.includes(a)));
    }

    function quiz() {
      let i = 0, bons = 0;
      const rates = [];

      function poser() {
        if (i >= questions.length) return fin();
        clear(root);
        const q = questions[i];
        const input = el('input', { type: 'text', autocomplete: 'off', placeholder: 'Ta réponse…', style: 'max-width:320px' });
        const btn = el('button', { class: 'btn btn-primary', onclick: valider }, 'Valider');
        root.append(
          el('p', { text: `Question ${i + 1} / ${questions.length}` }),
          el('h3', { text: q.q }),
          input, btn
        );
        input.focus();
        input.addEventListener('keydown', e => { if (e.key === 'Enter') valider(); });

        function valider() {
          btn.disabled = true;
          const ok = juste(input.value, q);
          if (ok) bons++; else rates.push(`${q.q} → ${q.r}`);
          clear(root);
          root.append(
            el('div', { style: 'font-size:40px' }, ok ? '✅' : '❌'),
            el('h3', { text: ok ? 'Exact' : 'La réponse était : ' + q.r })
          );
          i++;
          Timers.after(poser, ok ? 700 : 1500);
        }
      }

      function fin() {
        const pct = Math.round(bons / questions.length * 100);
        const extra = rates.length
          ? el('div', { class: 'small muted', style: 'text-align:left;max-width:60ch' },
              el('b', { text: 'À revoir :' }),
              el('ul', {}, rates.map(r => el('li', { text: r }))))
          : el('p', { class: 'small muted', text: 'Tous les détails retenus. Impressionnant.' });
        done({
          score: pct,
          score100: pct,
          detail: `${bons}/${questions.length} détails`,
          label: `${bons} / ${questions.length}`,
          extra
        });
      }

      poser();
    }
  }
});
