/* ============================================================
   progres.js — statistiques, assiduité, courbes
   ============================================================ */

const Progres = (() => {

  function moyenneJour(k) {
    const d = Store.data.days[k];
    if (!d) return null;
    const vals = Object.values(d.scores);
    if (!vals.length) return null;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }

  function joursActifs() {
    return Object.keys(Store.data.days)
      .filter(k => Object.keys(Store.data.days[k].scores).length)
      .sort();
  }

  function render() {
    renderStats();
    renderHeatmap();
    renderGlobal();
    renderParJeu();
  }

  /* ---------- bandeau de chiffres ---------- */
  function renderStats() {
    const d = Store.data;
    const actifs = joursActifs();
    const seances = Object.values(d.days).filter(x => x.complete).length;
    const exos = d.history.length;

    const serie = Store.displayStreak();
    const moyennes = actifs.map(moyenneJour).filter(v => v !== null);
    const debut = moyennes.slice(0, 5);
    const fin = moyennes.slice(-5);
    const avg = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
    const evol = (debut.length >= 3 && fin.length >= 3) ? Math.round(avg(fin) - avg(debut)) : null;

    const zone = $('#statRow');
    clear(zone);
    const stat = (v, l, cls) => el('div', { class: 'stat' },
      el('div', { class: 'sv ' + (cls || ''), html: v }), el('div', { class: 'sl', text: l }));

    zone.append(
      stat('🔥 ' + serie, 'série en cours'),
      stat(String(d.streak.best), 'meilleure série'),
      stat(String(seances), 'séances complètes'),
      stat(String(exos), 'exercices joués'),
      stat(moyennes.length ? Math.round(avg(fin)) : '—', 'niveau actuel /100'),
      stat(evol === null ? '—' : (evol >= 0 ? '+' + evol : String(evol)),
        'depuis tes débuts')
    );

    if (evol !== null) {
      const el2 = zone.lastChild.firstChild;
      el2.style.color = evol >= 0 ? 'var(--ok)' : 'var(--danger)';
    }
  }

  /* ---------- assiduité ---------- */
  function renderHeatmap() {
    const zone = $('#heatmap');
    clear(zone);
    const today = new Date();
    // on remonte 13 semaines, aligné sur le lundi
    const fin = new Date(today);
    const start = addDays(fin, -90);
    const decal = (start.getDay() + 6) % 7;      // 0 = lundi
    const debut = addDays(start, -decal);

    for (let i = 0; i < 91 + decal; i++) {
      const jour = addDays(debut, i);
      const k = dayKey(jour);
      const d = Store.data.days[k];
      const n = d ? Object.keys(d.scores).length : 0;
      let cls = 'h' + clamp(n, 0, 4);
      if (jour > today) cls += ' future';
      zone.append(el('i', { class: cls, title: `${frDate(jour)} — ${n} exercice(s)` }));
    }
  }

  /* ---------- courbe globale ---------- */
  function renderGlobal() {
    const actifs = joursActifs();
    const vals = actifs.map(moyenneJour).filter(v => v !== null);
    const base = vals.length >= 4 ? Math.round(vals.slice(0, Math.min(7, vals.length)).reduce((a, b) => a + b, 0) / Math.min(7, vals.length)) : null;
    drawLineChart($('#globalChart'), vals, { min: 0, max: 100, baseline: base, height: 220 });
  }

  /* ---------- détail par exercice ---------- */
  function renderParJeu() {
    const zone = $('#perGame');
    clear(zone);
    const h = Store.data.history;

    Games.list.forEach(g => {
      const scores = h.filter(x => x.game === g.id);
      const card = el('div', { class: 'gcard static' });
      card.append(el('div', { class: 'g-emoji', text: g.emoji }), el('h4', { text: g.nom }));

      if (!scores.length) {
        card.append(el('p', { text: 'Pas encore essayé.' }));
        zone.append(card);
        return;
      }

      const dernier = scores[scores.length - 1];
      const best = Store.data.best[g.id];
      const serie = scores.slice(-25).map(x => x.score);
      const debut = scores.slice(0, 3).map(x => x.score100);
      const recent = scores.slice(-3).map(x => x.score100);
      const avg = a => a.reduce((x, y) => x + y, 0) / a.length;
      const delta = (scores.length >= 6) ? Math.round(avg(recent) - avg(debut)) : null;

      card.append(
        el('p', { html: `Record : <b>${best} ${g.unite}</b><br>Dernier : ${dernier.score} · ${scores.length} partie(s)` })
      );
      if (delta !== null) {
        card.append(el('p', { class: 'trend ' + (delta >= 0 ? 'up' : 'down'), style: 'margin-top:8px',
          text: (delta >= 0 ? '▲ +' : '▼ ') + delta + ' pts depuis tes débuts' }));
      }
      const cv = el('canvas', { class: 'spark' });
      card.append(cv);
      zone.append(card);
      // le canvas doit être dans le DOM pour connaître sa largeur
      requestAnimationFrame(() => drawLineChart(cv, serie, { height: 60 }));
    });
  }

  return { render };
})();
