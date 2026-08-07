/* ============================================================
   games.js — registre des exercices + briques d'interface communes
   ============================================================ */

const Games = {
  list: [],
  map: {},
  register(g) { this.list.push(g); this.map[g.id] = g; },
  get(id) { return this.map[id]; }
};

/* ------------------------------------------------------------
   Helpers réutilisés par tous les exercices.
   Chaque exercice expose : play(root, done)
     root : conteneur vidé d'avance
     done : callback({score, score100, detail, label})
   ------------------------------------------------------------ */
const G = {
  /** Écran d'intro avec règles + bouton démarrer */
  intro(root, game, rules, onStart) {
    clear(root);
    root.append(
      el('div', { style: 'font-size:44px' }, game.emoji),
      el('h3', { text: game.nom }),
      el('p', { text: game.desc }),
      el('ul', { class: 'rules' }, rules.map(r => el('li', { html: r }))),
      el('button', { class: 'btn btn-primary btn-lg', onclick: onStart }, 'Démarrer')
    );
  },

  /** Décompte 3‑2‑1 puis callback */
  countdown(root, cb, from) {
    clear(root);
    let n = from || 3;
    const box = el('div', { class: 'countdown', text: n });
    root.append(el('p', { text: 'Prépare-toi…' }), box);
    const iv = Timers.every(() => {
      n--;
      if (n <= 0) { Timers.stop(iv); cb(); }
      else box.textContent = n;
    }, 800);
  },

  /** Barre de temps qui se vide en ms, puis callback */
  timerBar(root, ms, cb) {
    const bar = el('i');
    const wrap = el('div', { class: 'timer-bar' }, bar);
    root.append(wrap);
    requestAnimationFrame(() => {
      bar.style.transition = `width ${ms}ms linear`;
      bar.style.width = '0%';
    });
    Timers.after(cb, ms);
    return wrap;
  },

  /** Message court centré */
  msg(root, txt, sub) {
    clear(root);
    root.append(el('h3', { text: txt }));
    if (sub) root.append(el('p', { text: sub }));
  }
};
