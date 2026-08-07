/* ============================================================
   store.js — toutes les données, dans le localStorage du navigateur
   ============================================================ */

const Store = (() => {
  const KEY = 'memoire_app_v1';

  function blank() {
    return {
      version: 1,
      createdAt: dayKey(),
      settings: { theme: 'auto' },
      days: {},        // "2026-08-04": { done:[ids], scores:{id:score100}, complete:bool }
      history: [],     // {date, game, score, score100, detail}
      best: {},        // {game: score}
      memos: [],       // {id,q,a,box,due,created,reviews,lapses}
      wordSets: [],    // {date, words:[...]}  (pour le rappel différé)
      streak: { current: 0, best: 0, last: null }
    };
  }

  let data = blank();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        data = Object.assign(blank(), parsed);
        data.settings = Object.assign({ theme: 'auto' }, parsed.settings);
        data.streak = Object.assign({ current: 0, best: 0, last: null }, parsed.streak);
      }
    } catch (e) {
      console.warn('Sauvegarde illisible, on repart de zéro.', e);
      data = blank();
    }
    return data;
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); }
    catch (e) { toast('Impossible de sauvegarder (espace disque du navigateur plein ?)'); }
  }

  /* ---------- jours ---------- */
  function day(key) {
    const k = key || dayKey();
    if (!data.days[k]) data.days[k] = { done: [], scores: {}, complete: false };
    return data.days[k];
  }

  /* ---------- scores ---------- */
  function record(gameId, res, opts) {
    const k = dayKey();
    const d = day(k);
    const entry = {
      date: k, at: Date.now(), game: gameId,
      score: res.score, score100: Math.round(clamp(res.score100, 0, 100)),
      detail: res.detail || ''
    };
    data.history.push(entry);
    if (data.history.length > 4000) data.history = data.history.slice(-3000);

    const isBest = data.best[gameId] === undefined || res.score > data.best[gameId];
    if (isBest) data.best[gameId] = res.score;

    // meilleur score du jour pour cet exercice
    if (d.scores[gameId] === undefined || entry.score100 > d.scores[gameId]) {
      d.scores[gameId] = entry.score100;
    }
    if (opts && opts.session && !d.done.includes(gameId)) d.done.push(gameId);

    save();
    return { isBest, previousBest: isBest ? null : data.best[gameId] };
  }

  /* ---------- série (streak) ---------- */
  function completeDay() {
    const k = dayKey();
    const d = day(k);
    if (d.complete) return { already: true, streak: data.streak.current };
    d.complete = true;

    const last = data.streak.last;
    if (!last) data.streak.current = 1;
    else {
      const gap = daysBetween(keyToDate(last), keyToDate(k));
      if (gap === 1) data.streak.current += 1;
      else if (gap === 0) { /* même jour, rien */ }
      else data.streak.current = 1;
    }
    data.streak.last = k;
    data.streak.best = Math.max(data.streak.best, data.streak.current);
    save();
    return { already: false, streak: data.streak.current };
  }

  /** la série est-elle encore "vivante" aujourd'hui ? (sinon elle sera remise à 1) */
  function streakAlive() {
    if (!data.streak.last) return false;
    const gap = daysBetween(keyToDate(data.streak.last), keyToDate(dayKey()));
    return gap <= 1;
  }
  function displayStreak() { return streakAlive() ? data.streak.current : 0; }

  /* ---------- listes de mots pour le rappel différé ---------- */
  function saveWordSet(words) {
    data.wordSets = data.wordSets.filter(w => w.date !== dayKey());
    data.wordSets.push({ date: dayKey(), words });
    if (data.wordSets.length > 20) data.wordSets = data.wordSets.slice(-20);
    save();
  }
  /** dernière liste apprise un autre jour qu'aujourd'hui */
  function previousWordSet() {
    const today = dayKey();
    const older = data.wordSets.filter(w => w.date !== today);
    return older.length ? older[older.length - 1] : null;
  }

  /* ---------- mémos (répétition espacée) ---------- */
  const INTERVALS = [0, 1, 3, 7, 15, 30, 60]; // en jours, selon la "boîte"

  function addMemo(q, a) {
    const m = {
      id: 'm' + Date.now() + Math.floor(Math.random() * 1000),
      q: q.trim(), a: a.trim(),
      box: 0, due: dayKey(), created: dayKey(),
      reviews: 0, lapses: 0
    };
    data.memos.unshift(m);
    save();
    return m;
  }
  function deleteMemo(id) { data.memos = data.memos.filter(m => m.id !== id); save(); }

  function dueMemos() {
    const today = dayKey();
    return data.memos.filter(m => m.due <= today);
  }

  /** grade : 'oubli' | 'dur' | 'facile' */
  function reviewMemo(id, grade) {
    const m = data.memos.find(x => x.id === id);
    if (!m) return;
    m.reviews++;
    if (grade === 'oubli') { m.lapses++; m.box = 0; }
    else if (grade === 'dur') { m.box = Math.max(0, m.box); }
    else { m.box = Math.min(INTERVALS.length - 1, m.box + 1); }

    let days = INTERVALS[m.box];
    if (grade === 'oubli') days = 0;          // revient dans la même session
    if (grade === 'dur' && days > 1) days = Math.max(1, Math.round(days / 2));
    m.due = dayKey(addDays(new Date(), days === 0 ? 0 : days));
    m.lastReview = dayKey();
    save();
    return m;
  }

  /* ---------- export / import ---------- */
  function exportJSON() { return JSON.stringify(data, null, 2); }
  function importJSON(txt) {
    const parsed = JSON.parse(txt);
    if (!parsed || typeof parsed !== 'object' || !('days' in parsed)) throw new Error('format');
    data = Object.assign(blank(), parsed);
    save();
  }
  function reset() { data = blank(); save(); }

  load();

  return {
    get data() { return data; },
    save, day, record, completeDay, streakAlive, displayStreak,
    saveWordSet, previousWordSet,
    addMemo, deleteMemo, dueMemos, reviewMemo, INTERVALS,
    exportJSON, importJSON, reset
  };
})();
