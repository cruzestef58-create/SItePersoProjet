/* ============================================================
   app.js — navigation, séance du jour, résultats
   ============================================================ */

const App = (() => {

  const ROTATION = ['grille', 'nback', 'paires', 'visages', 'histoire'];
  let session = null;   // {steps:[ids], i:0}
  let ecranActuel = 'jour';

  /* ---------------- plan du jour ---------------- */
  function planDuJour() {
    const idx = dayIndex();
    const steps = [];
    const rappel = Games.get('rappel');
    if (rappel.disponible()) steps.push('rappel');
    steps.push('chiffres');
    steps.push(ROTATION[idx % ROTATION.length]);
    steps.push(ROTATION[(idx + 2) % ROTATION.length]);
    steps.push('mots');
    return steps;
  }

  /* ---------------- thème ---------------- */
  function appliquerTheme() {
    let t = Store.data.settings.theme;
    if (t === 'auto') {
      t = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-theme', t);
    $('#themeBtn').textContent = t === 'light' ? '🌙' : '☀️';
  }
  function basculerTheme() {
    const actuel = document.documentElement.getAttribute('data-theme');
    Store.data.settings.theme = actuel === 'light' ? 'dark' : 'light';
    Store.save();
    appliquerTheme();
    if (ecranActuel === 'progres') Progres.render();
  }

  /* ---------------- navigation ---------------- */
  function aller(nom) {
    Timers.clearAll();
    ecranActuel = nom;
    $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.screen === nom));
    $$('.screen').forEach(s => s.classList.toggle('active', s.id === 'screen-' + nom));
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (nom === 'jour') { quitterSession(); renderJour(); }
    if (nom === 'exercices') { $('#freePlay').classList.add('hidden'); $('#exerciceGrid').classList.remove('hidden'); }
    if (nom === 'memos') Memos.render();
    if (nom === 'progres') Progres.render();
  }

  /* ---------------- écran « séance du jour » ---------------- */
  function renderJour() {
    const steps = planDuJour();
    const jour = Store.day();
    const faits = steps.filter(s => jour.done.includes(s));

    $('#todayLabel').textContent = frDate(new Date());
    $('#ringTotal').textContent = steps.length;
    $('#ringDone').textContent = faits.length;
    $('#ringFg').style.strokeDashoffset = String(264 * (1 - faits.length / steps.length));

    const fini = faits.length >= steps.length;
    const btn = $('#startSessionBtn');
    if (fini) {
      $('#heroTitle').textContent = 'Séance terminée 👏';
      $('#heroSub').textContent = 'Tu es venu aujourd\'hui, c\'est le seul truc qui compte. Tu peux rejouer autant que tu veux dans l\'onglet Exercices.';
      btn.textContent = 'Refaire une séance';
    } else if (faits.length) {
      $('#heroTitle').textContent = 'Séance en cours';
      $('#heroSub').textContent = `Il te reste ${steps.length - faits.length} exercice(s). Environ ${(steps.length - faits.length) * 2} minutes.`;
      btn.textContent = 'Reprendre la séance';
    } else {
      $('#heroTitle').textContent = 'Ta séance du jour';
      $('#heroSub').textContent = `${steps.length} exercices, une dizaine de minutes. L'important, c'est de venir tous les jours.`;
      btn.textContent = 'Commencer la séance';
    }

    // programme
    const liste = $('#planList');
    clear(liste);
    steps.forEach(id => {
      const g = Games.get(id);
      const fait = jour.done.includes(id);
      liste.append(el('div', { class: 'item' + (fait ? ' done' : '') },
        el('div', { class: 'item-emoji', text: g.emoji }),
        el('div', { class: 'item-body' },
          el('div', { class: 'item-name', text: g.nom }),
          el('div', { class: 'item-desc', text: g.skill + ' · ' + g.duree })
        ),
        el('div', { class: 'item-right', text: fait ? (jour.scores[id] + ' /100') : '—' })
      ));
    });

    // astuce du jour
    const a = DATA.astuces[dayIndex() % DATA.astuces.length];
    clear($('#dailyTip'));
    $('#dailyTip').append(
      el('p', { class: 'eyebrow', text: 'Astuce du jour' }),
      el('h4', { text: a.t }),
      el('p', { text: a.p })
    );

    refreshBadges();
  }

  /* ---------------- déroulé de la séance ---------------- */
  function demarrerSession() {
    const steps = planDuJour();
    const jour = Store.day();
    const restants = steps.filter(s => !jour.done.includes(s));
    session = { steps, liste: restants.length ? restants : steps.slice(), i: 0, rejeu: !restants.length };
    $('#sessionHome').classList.add('hidden');
    $('#sessionPlay').classList.remove('hidden');
    etape();
  }

  function quitterSession() {
    Timers.clearAll();
    session = null;
    $('#sessionHome').classList.remove('hidden');
    $('#sessionPlay').classList.add('hidden');
  }

  function majPoints() {
    const zone = $('#stepDots');
    clear(zone);
    session.liste.forEach((_, k) => {
      zone.append(el('div', { class: 'dot ' + (k < session.i ? 'done' : k === session.i ? 'current' : '') }));
    });
  }

  function etape() {
    Timers.clearAll();
    if (session.i >= session.liste.length) return finSession();
    const g = Games.get(session.liste[session.i]);
    $('#playTitle').textContent = `${g.emoji} ${g.nom}`;
    majPoints();
    const stage = clear($('#stage'));
    g.play(stage, res => terminerExercice(g, res, stage));
  }

  function terminerExercice(g, res, stage) {
    Timers.clearAll();
    if (res.skip) { session.i++; return etape(); }
    const info = Store.record(g.id, res, { session: true });
    afficherResultat(stage, g, res, info, () => { session.i++; etape(); },
      session.i + 1 >= session.liste.length ? 'Terminer la séance' : 'Exercice suivant →');
    refreshBadges();
  }

  function finSession() {
    const r = Store.completeDay();
    const stage = clear($('#stage'));
    $('#playTitle').textContent = '';
    clear($('#stepDots'));

    const jour = Store.day();
    const vals = Object.values(jour.scores);
    const moy = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;

    stage.append(
      el('div', { style: 'font-size:60px' }, '🎉'),
      el('h3', { text: r.already ? 'Séance rejouée !' : 'Séance du jour terminée !' }),
      el('div', { class: 'result-score', text: moy + ' /100' }),
      el('p', { class: 'result-sub', text: 'moyenne de tes exercices d\'aujourd\'hui' }),
      el('p', { html: `Série en cours : <b>🔥 ${Store.displayStreak()} jour(s)</b><br>Reviens demain pour la faire grandir.` }),
      el('div', { class: 'hero-actions', style: 'justify-content:center' },
        el('button', { class: 'btn btn-primary', onclick: () => { aller('memos'); } }, 'Réviser mes mémos'),
        el('button', { class: 'btn', onclick: () => aller('progres') }, 'Voir mes progrès'),
        el('button', { class: 'btn btn-ghost', onclick: () => aller('jour') }, 'Retour')
      )
    );
    refreshBadges();
  }

  /* ---------------- écran de résultat ---------------- */
  function afficherResultat(stage, g, res, info, suite, labelBouton) {
    clear(stage);
    const best = Store.data.best[g.id];
    const parties = Store.data.history.filter(x => x.game === g.id).length;

    let badge;
    if (info.isBest && res.score > 0 && parties > 1) {
      badge = el('span', { class: 'result-badge rb-new', text: '🏆 Nouveau record !' });
    } else if (parties <= 1) {
      badge = el('span', { class: 'result-badge rb-ok', text: 'premier essai — c\'est ton point de départ' });
    } else {
      badge = el('span', { class: 'result-badge rb-ok', text: `ton record : ${best} ${g.unite}` });
    }

    const enfants = [
      el('div', { style: 'font-size:40px' }, g.emoji),
      el('h3', { text: g.nom }),
      el('div', { class: 'result-score', text: res.label || res.score }),
      el('p', { class: 'result-sub', text: res.detail }),
      badge
    ];
    if (res.extra) enfants.push(res.extra);
    enfants.push(el('button', { class: 'btn btn-primary btn-lg', onclick: suite }, labelBouton));
    stage.append(...enfants);
  }

  /* ---------------- exercices libres ---------------- */
  function renderGrilleExercices() {
    const zone = $('#exerciceGrid');
    clear(zone);
    Games.list.forEach(g => {
      const best = Store.data.best[g.id];
      zone.append(el('div', { class: 'gcard', onclick: () => jouerLibre(g.id) },
        el('div', { class: 'g-emoji', text: g.emoji }),
        el('h4', { text: g.nom }),
        el('p', { text: g.desc }),
        el('div', { class: 'g-meta', text: g.skill + ' · ' + g.duree + (best !== undefined ? ` · record ${best} ${g.unite}` : '') })
      ));
    });
  }

  function jouerLibre(id) {
    const g = Games.get(id);
    Timers.clearAll();
    $('#exerciceGrid').classList.add('hidden');
    $('#freePlay').classList.remove('hidden');
    $('#freeTitle').textContent = `${g.emoji} ${g.nom}`;
    const stage = clear($('#freeStage'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    g.play(stage, res => {
      Timers.clearAll();
      if (res.skip) return quitterLibre();
      const info = Store.record(g.id, res, { session: false });
      afficherResultat(stage, g, res, info, () => jouerLibre(id), 'Rejouer');
      stage.append(el('button', { class: 'btn btn-ghost', onclick: quitterLibre }, 'Retour à la liste'));
      refreshBadges();
    });
  }

  function quitterLibre() {
    Timers.clearAll();
    $('#freePlay').classList.add('hidden');
    $('#exerciceGrid').classList.remove('hidden');
    renderGrilleExercices();
  }

  /* ---------------- badges & série ---------------- */
  function refreshBadges() {
    const serie = Store.displayStreak();
    $('#streakNum').textContent = serie;
    $('#streakBox').classList.toggle('off', serie === 0);
    const dus = Store.dueMemos().length;
    const b = $('#memoBadge');
    b.textContent = dus;
    b.classList.toggle('hidden', dus === 0);
  }

  /* ---------------- sauvegarde ---------------- */
  function initSauvegarde() {
    $('#exportBtn').onclick = () => {
      const blob = new Blob([Store.exportJSON()], { type: 'application/json' });
      const a = el('a', { href: URL.createObjectURL(blob), download: `memoire-${dayKey()}.json` });
      document.body.append(a); a.click(); a.remove();
      toast('Sauvegarde exportée.');
    };
    $('#importBtn').onclick = () => $('#importFile').click();
    $('#importFile').onchange = e => {
      const f = e.target.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        try { Store.importJSON(r.result); toast('Sauvegarde importée.'); aller('progres'); refreshBadges(); }
        catch (err) { toast('Fichier illisible.'); }
      };
      r.readAsText(f);
      e.target.value = '';
    };
    $('#resetBtn').onclick = () => {
      if (!confirm('Effacer TOUTES tes données (scores, série, mémos) ? C\'est irréversible.')) return;
      if (!confirm('Vraiment sûr ? Pense à exporter avant.')) return;
      Store.reset(); toast('Tout a été effacé.'); aller('jour'); Memos.render(); refreshBadges();
    };
  }

  /* ---------------- démarrage ---------------- */
  function init() {
    appliquerTheme();
    $('#themeBtn').onclick = basculerTheme;
    $('#tabs').addEventListener('click', e => {
      const t = e.target.closest('.tab');
      if (t) aller(t.dataset.screen);
    });
    $('#startSessionBtn').onclick = demarrerSession;
    $('#quitSessionBtn').onclick = () => { quitterSession(); renderJour(); };
    $('#memoJumpBtn').onclick = () => aller('memos');
    $('#quitFreeBtn').onclick = quitterLibre;

    Memos.init();
    Memos.render();
    Conseils.render();
    renderGrilleExercices();
    initSauvegarde();
    renderJour();

    window.addEventListener('resize', () => { if (ecranActuel === 'progres') Progres.render(); });
  }

  return { init, refreshBadges, aller };
})();

document.addEventListener('DOMContentLoaded', App.init);
