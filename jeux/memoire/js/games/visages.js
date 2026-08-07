/* ============================================================
   Noms & visages — l'oubli n°1 du quotidien
   ============================================================ */

const NB_PERSONNES = 6;

Games.register({
  id: 'visages',
  nom: 'Noms & visages',
  emoji: '🙂',
  skill: 'Mémoire associative',
  unite: `bonnes réponses / ${NB_PERSONNES}`,
  duree: '~2 min',
  desc: 'Associe des prénoms à des personnes. C\'est exactement ce qui lâche quand on recroise quelqu\'un dans la rue.',

  play(root, done) {
    const jeu = this;
    const gens = pickMany(DATA.personnes, NB_PERSONNES);

    G.intro(root, jeu, [
      `Tu vas rencontrer <b>${NB_PERSONNES} personnes</b> : un visage, un prénom, un détail.`,
      'Tu as <b>45 secondes</b> pour les mémoriser.',
      'Ensuite on te montre le visage seul : retrouve le prénom.',
      'Astuce qui marche vraiment : relie le prénom à une image (<i>Lucas</i> le boulanger → un <i>lasso</i> en pâte à pain).'
    ], etude);

    function carte(p, avecNom) {
      return el('div', { class: 'person' },
        el('div', { class: 'avatar', style: `background:${p.c}22;border:2px solid ${p.c}` }, p.e),
        avecNom ? el('div', { class: 'pname', text: p.p }) : null,
        el('div', { class: 'pinfo', text: p.i })
      );
    }

    function etude() {
      clear(root);
      root.append(
        el('h3', { text: 'Fais connaissance' }),
        el('div', { class: 'faces' }, gens.map(p => carte(p, true)))
      );
      G.timerBar(root, 45000, quiz);
      root.append(el('button', { class: 'btn btn-ghost btn-sm', onclick: () => { Timers.clearAll(); quiz(); } }, 'Je les connais →'));
    }

    function quiz() {
      const ordre = shuffle(gens);
      let i = 0, bons = 0;
      const rates = [];

      function question() {
        if (i >= ordre.length) return fin();
        clear(root);
        const p = ordre[i];
        const faux = shuffle(DATA.personnes.filter(x => x.p !== p.p)).slice(0, 3);
        const options = shuffle([p].concat(faux));

        const zone = el('div', { class: 'choices' });
        root.append(
          el('p', { text: `Personne ${i + 1} / ${ordre.length}` }),
          carte(p, false),
          el('h3', { text: 'Son prénom ?' }),
          zone
        );

        options.forEach(o => {
          const b = el('button', { class: 'choice', text: o.p });
          b.onclick = () => {
            $$('.choice', zone).forEach(x => x.disabled = true);
            if (o.p === p.p) { b.classList.add('good'); bons++; }
            else {
              b.classList.add('bad');
              rates.push(p.p);
              $$('.choice', zone).forEach(x => { if (x.textContent === p.p) x.classList.add('good'); });
            }
            i++;
            Timers.after(question, 900);
          };
          zone.append(b);
        });
      }

      function fin() {
        const extra = rates.length
          ? el('p', { class: 'small muted', text: 'Prénoms manqués : ' + rates.join(', ') })
          : el('p', { class: 'small muted', text: 'Sans faute — tu les as tous reconnus.' });
        done({
          score: bons,
          score100: Math.round(bons / NB_PERSONNES * 100),
          detail: `${bons}/${NB_PERSONNES} prénoms retrouvés`,
          label: `${bons} / ${NB_PERSONNES}`,
          extra
        });
      }

      question();
    }
  }
});
