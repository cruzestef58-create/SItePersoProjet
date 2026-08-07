/* ============================================================
   2-back — attention soutenue + mise à jour de la mémoire de travail
   ============================================================ */

const NB_ESSAIS = 26;   // dont 2 d'amorce
const NB_DELAI = 2300;  // ms par lettre

Games.register({
  id: 'nback',
  nom: 'Le 2-back',
  emoji: '🔁',
  skill: 'Attention & mise à jour',
  unite: '% de justesse',
  duree: '~1 min 30',
  desc: 'Des lettres défilent. Signale quand une lettre est la même que celle d\'il y a 2 tours. Le plus exigeant des exercices.',

  play(root, done) {
    const jeu = this;

    G.intro(root, jeu, [
      'Une lettre s\'affiche toutes les 2 secondes.',
      'Clique sur <b>« Pareil ! »</b> (ou appuie sur <b>Espace</b>) quand la lettre est <b>identique à celle d\'il y a deux tours</b>.',
      'Exemple : <b>B</b> – F – <b>B</b> → au deuxième B, tu cliques.',
      'Ne clique pas si ce n\'est pas le cas : les fausses alertes comptent aussi.',
      'C\'est déroutant au début. C\'est normal, et c\'est exactement ce qui muscle l\'attention.'
    ], () => G.countdown(root, lancer));

    function lancer() {
      // suite avec ~30 % de correspondances
      const suite = [];
      for (let i = 0; i < NB_ESSAIS; i++) {
        if (i >= 2 && Math.random() < 0.3) suite.push(suite[i - 2]);
        else {
          let l;
          do { l = pick(DATA.lettres); } while (i >= 2 && l === suite[i - 2] && Math.random() < 0.7);
          suite.push(l);
        }
      }

      clear(root);
      const boite = el('div', { class: 'nb-letter', text: '—' });
      const info = el('p', { text: 'Tour 1' });
      const btn = el('button', { class: 'btn btn-primary btn-lg', onclick: repondre }, 'Pareil ! (Espace)');
      const retour = el('p', { class: 'small muted', text: ' ' });
      root.append(el('h3', { text: 'Repère les répétitions à 2 tours d\'écart' }), boite, info, btn, retour);

      let i = -1, repondu = false;
      let hits = 0, fausses = 0, manques = 0, rejets = 0, notes = 0;

      function repondre() {
        if (i < 0 || repondu) return;
        repondu = true;
        const cible = i >= 2 && suite[i] === suite[i - 2];
        if (cible) { hits++; retour.textContent = '✅ bien vu'; }
        else { fausses++; retour.textContent = '❌ fausse alerte'; }
        boite.classList.add('flash');
      }

      function clavier(e) {
        if (e.code === 'Space') { e.preventDefault(); repondre(); }
      }
      document.addEventListener('keydown', clavier);

      function suivant() {
        // bilan du tour précédent
        if (i >= 2 && !repondu) {
          const cible = suite[i] === suite[i - 2];
          if (cible) { manques++; retour.textContent = '⚠️ raté, c\'était pareil'; }
          else { rejets++; }
        }
        if (i >= 2) notes++;

        i++;
        if (i >= suite.length) { Timers.stop(iv); fin(); return; }
        repondu = false;
        boite.classList.remove('flash');
        boite.textContent = suite[i];
        info.textContent = `Tour ${i + 1} / ${suite.length}`;
        if (i < 2) retour.textContent = 'échauffement…';
      }

      const iv = Timers.every(suivant, NB_DELAI);
      suivant();

      function fin() {
        document.removeEventListener('keydown', clavier);
        // score de « sensibilité » : ne rien cliquer ou tout cliquer donne 0.
        const cibles = hits + manques;
        const nonCibles = Math.max(1, notes - cibles);
        const pct = clamp(Math.round(100 * (hits / Math.max(1, cibles)) - 100 * (fausses / nonCibles)), 0, 100);
        const extra = el('p', { class: 'small muted' },
          `${hits} répétitions sur ${cibles} repérées · ${manques} manquées · ${fausses} fausses alertes`);
        done({
          score: pct,
          score100: pct,
          detail: `${hits}/${cibles} répétitions repérées, ${fausses} fausse(s) alerte(s)`,
          label: pct + ' %',
          extra
        });
      }
    }
  }
});
