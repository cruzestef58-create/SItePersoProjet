/* =========================================================================
   Tap Empire — logique du jeu
   Dépend de js/data.js (chargé avant celui-ci).
   ========================================================================= */
'use strict';

const SAVE_KEY = 'tap-empire-save';
const SAVE_EVERY = 10e3;     // sauvegarde auto toutes les 10 s
const UI_EVERY = 100;        // rafraîchissement de l'interface : 10 fois par seconde

/* =========================================================================
   1. FORMATAGE DES NOMBRES
   ========================================================================= */
const SUFFIXES = [
  [1e33, ' Qid'], [1e30, ' Qin'], [1e27, ' Qd'], [1e24, ' Qn'],
  [1e21, ' Td'],  [1e18, ' Tn'],  [1e15, ' Bd'], [1e12, ' Bn'],
  [1e9,  ' Md'],  [1e6,  ' M']
];

/** Formate un nombre pour l'affichage (1 234 · 12,5 M · 3,40 Bn…). */
function fmt(n) {
  if (!Number.isFinite(n)) return '0';
  const abs = Math.abs(n);
  if (abs >= 1e36) return n.toExponential(2).replace('.', ',');
  for (const [exp, suf] of SUFFIXES) {
    if (abs >= exp) return (n / exp).toFixed(2).replace('.', ',') + suf;
  }
  if (abs < 100 && !Number.isInteger(n)) return n.toFixed(1).replace('.', ',');
  return Math.floor(n).toLocaleString('fr-FR');
}

/** Formate une durée en ms → « 2 h 14 min ». */
function fmtDuration(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  if (h > 0) return h + ' h ' + String(m).padStart(2, '0') + ' min';
  if (m > 0) return m + ' min ' + String(s % 60).padStart(2, '0') + ' s';
  return s + ' s';
}

/* =========================================================================
   2. ÉTAT DE LA PARTIE
   ========================================================================= */
function defaultState() {
  return {
    version: 2,
    score: 0,
    era: 0,
    buildings: Object.fromEntries(BUILDINGS.map(b => [b.id, 0])),
    heroes: {},
    toolLevel: 0,
    gauntletLevel: 0,
    townHall: 1,
    crystalHP: 0,
    crystalsBroken: 0,
    // pillage
    raid: null,
    nextRaidTime: 0,
    raidWins: 0,
    raidLosses: 0,
    raidMsg: '',
    raidMsgWin: false,
    nextDefenseTime: 0,
    // héritage
    relics: 0,
    prestiges: 0,
    achievements: {},
    // divers
    stats: { clicks: 0, earnedEver: 0, earnedRun: 0, playTime: 0 },
    sound: true,
    qty: 1,
    lastSeen: Date.now()
  };
}

let state = defaultState();

/* --- Sauvegarde / chargement ------------------------------------------- */
function save() {
  state.lastSeen = Date.now();
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) { /* quota / mode privé */ }
}

/** Recharge la sauvegarde en réparant tout champ manquant ou corrompu. */
function load() {
  let raw;
  try { raw = localStorage.getItem(SAVE_KEY); } catch (e) { return null; }
  if (!raw) return null;

  let s;
  try { s = JSON.parse(raw); } catch (e) { return null; }
  if (!s || typeof s !== 'object') return null;

  const st = defaultState();

  const num = (v, def, min) => (Number.isFinite(v) && v >= (min ?? 0)) ? v : def;
  const int = (v, def, min, max) => {
    if (!Number.isFinite(v)) return def;
    return Math.min(Math.max(Math.floor(v), min), max);
  };

  st.score          = num(s.score, 0);
  st.era            = int(s.era, 0, 0, ERAS.length - 1);
  st.toolLevel      = int(s.toolLevel, 0, 0, 1e6);
  st.gauntletLevel  = int(s.gauntletLevel, 0, 0, GAUNTLET.max);
  st.townHall       = int(s.townHall, 1, 1, TH_MAX);
  st.crystalHP      = num(s.crystalHP, 0);
  st.crystalsBroken = int(s.crystalsBroken, 0, 0, 1e12);
  st.raidWins       = int(s.raidWins, 0, 0, 1e12);
  st.raidLosses     = int(s.raidLosses, 0, 0, 1e12);
  st.nextRaidTime   = num(s.nextRaidTime, 0);
  st.nextDefenseTime= num(s.nextDefenseTime, 0);
  st.relics         = int(s.relics, 0, 0, 1e9);
  st.prestiges      = int(s.prestiges, 0, 0, 1e9);
  st.raidMsg        = typeof s.raidMsg === 'string' ? s.raidMsg : '';
  st.raidMsgWin     = !!s.raidMsgWin;
  st.sound          = s.sound !== false;
  st.qty            = (s.qty === 10 || s.qty === 100 || s.qty === 'max') ? s.qty : 1;
  st.lastSeen       = num(s.lastSeen, Date.now(), 1);

  // Bâtiments : on ne garde que les identifiants encore connus.
  BUILDINGS.forEach(b => { st.buildings[b.id] = int(s.buildings && s.buildings[b.id], 0, 0, 1e6); });
  // Héros / succès : idem.
  if (s.heroes && typeof s.heroes === 'object') HEROES.forEach(h => { if (s.heroes[h.id]) st.heroes[h.id] = true; });
  if (s.achievements && typeof s.achievements === 'object')
    ACHIEVEMENTS.forEach(a => { if (s.achievements[a.id]) st.achievements[a.id] = true; });

  // Cible de pillage : rejetée si elle est incohérente.
  st.raid = (s.raid && Number.isFinite(s.raid.defense) && Number.isFinite(s.raid.loot) && typeof s.raid.name === 'string')
    ? { name: s.raid.name, defense: s.raid.defense, loot: s.raid.loot }
    : null;

  if (s.stats && typeof s.stats === 'object') {
    st.stats.clicks     = num(s.stats.clicks, 0);
    st.stats.earnedEver = num(s.stats.earnedEver, 0);
    st.stats.earnedRun  = num(s.stats.earnedRun, 0);
    st.stats.playTime   = num(s.stats.playTime, 0);
  }
  return st;
}

/* =========================================================================
   3. VALEURS DÉRIVÉES
   Toute la production passe par globalMult() : une seule source de vérité.
   ========================================================================= */
function eraMult()      { return ERAS[state.era].mult; }
function unlocked(x)    { return x.era <= state.era; }
function ownedTotal()   { return totalBuildings(state); }
function heroCount()    { return recruitedCount(state); }
function heroMult()     { return 1 + heroCount() * HERO_PROD_BONUS; }
function villageMult()  { return 1 + (state.townHall - 1) * TH_PROD_BONUS; }
function achCount()     { return ACHIEVEMENTS.reduce((n, a) => n + (state.achievements[a.id] ? 1 : 0), 0); }
function achMult()      { return 1 + achCount() * ACHIEVEMENT_BONUS; }
function relicMult()    { return 1 + state.relics * RELIC_BONUS; }
function globalMult()   { return eraMult() * heroMult() * villageMult() * achMult() * relicMult(); }

function basePPS()      { return BUILDINGS.reduce((s, b) => unlocked(b) ? s + b.pps * state.buildings[b.id] : s, 0); }
function effPPS()       { return basePPS() * globalMult(); }

function clickBase()    { return 1 + state.toolLevel * TOOL.power; }
function gauntletShare(){ return state.gauntletLevel * GAUNTLET.share; }
function effClick()     { return clickBase() * globalMult() + effPPS() * gauntletShare(); }
function critChance()   { return 0.05 + heroCount() * 0.01; }

function toolCost()     { return Math.ceil(TOOL.base * Math.pow(TOOL.growth, state.toolLevel)); }
function gauntletCost() { return Math.ceil(GAUNTLET.base * Math.pow(GAUNTLET.growth, state.gauntletLevel)); }
function townHallCost() { return Math.ceil(TH_BASE_COST * Math.pow(TH_COST_GROWTH, state.townHall - 1)); }

/* Militaire — la Force ne sert QU'aux combats, pas à la production. */
function forceTotal()     { return HEROES.reduce((s, h) => state.heroes[h.id] ? s + h.force : s, 0); }
function villageDefense() { return Math.round(state.townHall * 40 + ownedTotal() * 3 + forceTotal() * 0.5); }
function villageHuts()    { return Math.min(6, Math.floor(state.era / 2) + Math.floor(ownedTotal() / 6)); }

/* Coût groupé : somme géométrique des `count` prochains exemplaires. */
function bulkCost(b, count) {
  const start = b.base * Math.pow(BUY_GROWTH, state.buildings[b.id]);
  return Math.ceil(start * (Math.pow(BUY_GROWTH, count) - 1) / (BUY_GROWTH - 1));
}
/** Combien d'exemplaires de `b` le score actuel permet-il d'acheter ? */
function maxAffordable(b) {
  const start = b.base * Math.pow(BUY_GROWTH, state.buildings[b.id]);
  if (state.score < start) return 0;
  const n = Math.floor(Math.log(state.score * (BUY_GROWTH - 1) / start + 1) / Math.log(BUY_GROWTH));
  return Math.max(0, Math.min(n, 5000));
}
/** Quantité effective visée par le sélecteur ×1 / ×10 / ×100 / Max. */
function wantedQty(b) {
  return state.qty === 'max' ? Math.max(1, maxAffordable(b)) : state.qty;
}

/* Héritage */
function relicsEarnable() {
  const p = Math.floor(Math.pow(state.stats.earnedEver / RELIC_DIVISOR, RELIC_EXPONENT));
  return Math.max(0, (Number.isFinite(p) ? p : 0) - state.relics);
}
function canPrestige() { return state.era >= 5 && relicsEarnable() >= 1; }

/* Ajoute des points en tenant les compteurs de statistiques à jour. */
function earn(amount) {
  if (!Number.isFinite(amount) || amount <= 0) return;
  state.score += amount;
  state.stats.earnedEver += amount;
  state.stats.earnedRun += amount;
}

/* =========================================================================
   4. RÉFÉRENCES DOM & CONSTRUCTION DES LISTES
   ========================================================================= */
const $ = id => document.getElementById(id);
const el = {
  score: $('score'), pps: $('pps'), topScore: $('top-score'), topPps: $('top-pps'),
  eraName: $('era-name'), eraIcon: $('era-icon'), eraMult: $('era-mult'), forceLine: $('force-line'),
  clicker: $('clicker'), cracks: $('cracks'), clickTag: $('click-power-tag'),
  crystalFill: $('crystal-fill'), crystalInfo: $('crystal-info'),
  clickUpgrades: $('click-upgrades'), buildings: $('buildings'), qty: $('qty'),
  evolveDesc: $('evolve-desc'), evolveProg: $('evolve-progress'), evolveProgTx: $('evolve-progress-text'),
  evolveBtn: $('evolve-btn'), evolveNote: $('evolve-note'),
  villageScene: $('village-scene'), garrison: $('garrison'),
  vhLevel: $('vh-level'), vhDef: $('vh-def'), vhTroops: $('vh-troops'), vhForce: $('vh-force'),
  vhNext: $('vh-next'), vhCost: $('vh-cost'), vhUpgrade: $('vh-upgrade'),
  heroes: $('heroes'), raidCard: $('raid-card'),
  stats: $('stats'), achievements: $('achievements'), achCount: $('ach-count'),
  relicCount: $('relic-count'), relicDesc: $('relic-desc'), relicGain: $('relic-gain'), prestigeBtn: $('prestige-btn'),
  toast: $('toast'), soundToggle: $('sound-toggle'), resetBtn: $('reset-btn')
};

/* Écritures DOM filtrées : on ne touche au noeud que si la valeur a changé.
   C'est ce qui permet de rafraîchir 10×/s sans faire ramer la page. */
const lastText = new WeakMap();
function txt(node, value) {
  if (!node) return;
  if (lastText.get(node) !== value) { lastText.set(node, value); node.textContent = value; }
}
function dis(node, value) { if (node && node.disabled !== value) node.disabled = value; }
function cls(node, name, on) { if (node) node.classList.toggle(name, on); }

/* --- Améliorations de clic (2 lignes fixes) ----------------------------- */
el.clickUpgrades.innerHTML = `
  <div class="building" id="up-tool">
    <div class="b-icon">⛏️</div>
    <div class="b-info">
      <h3>Outil de taille</h3>
      <p>+1 point de base par clic &middot; Niveau : <span class="owned" id="tool-level">0</span></p>
    </div>
    <button class="buy-btn" id="buy-tool">Améliorer<small id="tool-cost">—</small></button>
  </div>
  <div class="building" id="up-gauntlet">
    <div class="b-icon">🧤</div>
    <div class="b-info">
      <h3>Gantelet du contremaître</h3>
      <p id="gauntlet-desc">Chaque clic rapporte en plus un % du PPS</p>
    </div>
    <button class="buy-btn" id="buy-gauntlet">Améliorer<small id="gauntlet-cost">—</small></button>
  </div>`;

/* --- Bâtiments ---------------------------------------------------------- */
BUILDINGS.forEach(b => {
  const row = document.createElement('div');
  row.className = 'building';
  row.id = 'b-' + b.id;
  row.innerHTML = `
    <div class="b-icon">${b.icon}</div>
    <div class="b-info">
      <h3>${b.name}</h3>
      <p><span id="${b.id}-pps">+${fmt(b.pps)} PPS</span> &middot; Possédés : <span class="owned" id="${b.id}-count">0</span></p>
    </div>
    <button class="buy-btn" id="buy-${b.id}">Acheter<small id="${b.id}-cost">—</small></button>`;
  el.buildings.appendChild(row);
  $('buy-' + b.id).addEventListener('click', () => buyBuilding(b));
});

/* --- Héros -------------------------------------------------------------- */
HEROES.forEach(h => {
  const row = document.createElement('div');
  row.className = 'building';
  row.id = 'h-' + h.id;
  row.innerHTML = `
    <div class="b-icon">${h.svg}</div>
    <div class="b-info">
      <h3>${h.name}</h3>
      <p>${h.role} &middot; <span class="hero-force">${fmt(h.force)} Force</span> &middot; +5 % prod.</p>
    </div>
    <button class="buy-btn" id="recruit-${h.id}">Recruter<small>${fmt(h.cost)} pts</small></button>`;
  el.heroes.appendChild(row);
  $('recruit-' + h.id).addEventListener('click', () => recruit(h));
});

/* --- Succès (grille statique, seule la classe « got » bouge) ------------ */
ACHIEVEMENTS.forEach(a => {
  const d = document.createElement('div');
  d.className = 'ach';
  d.id = 'ach-' + a.id;
  d.innerHTML = `
    <div class="ach-head"><span>${a.icon}</span><div class="ach-name">${a.name}</div></div>
    <div class="ach-desc">${a.desc}</div>`;
  el.achievements.appendChild(d);
});

/* =========================================================================
   5. RENDU
   ========================================================================= */
let currentView = 'prod';

function render() {
  const pps = effPPS();
  const click = effClick();

  txt(el.score, fmt(state.score));
  txt(el.topScore, fmt(state.score));
  txt(el.topPps, fmt(pps));

  if (currentView === 'prod')   renderProd(pps, click);
  if (currentView === 'village') renderVillage();
  if (currentView === 'empire')  renderEmpire();

  txt(el.soundToggle, state.sound ? '🔊 Son' : '🔇 Muet');
}

function renderProd(pps, click) {
  txt(el.pps, fmt(pps) + ' point' + (pps >= 2 ? 's' : '') + ' par seconde');
  txt(el.clickTag, '+' + fmt(click) + ' par clic');
  const m = globalMult();
  txt(el.eraMult, m > 1 ? 'Multiplicateur global : ×' + fmt(m) : '');
  const f = forceTotal();
  txt(el.forceLine, f > 0 ? '💪 Force militaire : ' + fmt(f) : '');

  // Améliorations de clic
  txt($('tool-level'), String(state.toolLevel));
  txt($('tool-cost'), fmt(toolCost()) + ' pts');
  const canTool = state.score >= toolCost();
  dis($('buy-tool'), !canTool);
  cls($('up-tool'), 'affordable', canTool);

  const gMax = state.gauntletLevel >= GAUNTLET.max;
  txt($('gauntlet-desc'), gMax
    ? 'Niveau maximum · +' + Math.round(gauntletShare() * 100) + ' % du PPS ajouté à chaque clic'
    : '+' + Math.round(GAUNTLET.share * 100) + ' % du PPS par niveau · actuel : +'
      + Math.round(gauntletShare() * 100) + ' % (niv. ' + state.gauntletLevel + ')');
  txt($('gauntlet-cost'), gMax ? 'Max' : fmt(gauntletCost()) + ' pts');
  const canG = !gMax && state.score >= gauntletCost();
  dis($('buy-gauntlet'), !canG);
  cls($('up-gauntlet'), 'affordable', canG);

  // Bâtiments
  BUILDINGS.forEach(b => {
    const row = $('b-' + b.id);
    if (!unlocked(b)) { if (row.style.display !== 'none') row.style.display = 'none'; return; }
    if (row.style.display === 'none') row.style.display = '';

    const owned = state.buildings[b.id];
    const n = wantedQty(b);
    const cost = bulkCost(b, n);
    const can = state.score >= cost && (state.qty !== 'max' || maxAffordable(b) >= 1);

    txt($(b.id + '-count'), String(owned));
    txt($(b.id + '-pps'), '+' + fmt(b.pps * globalMult()) + ' PPS');
    txt($(b.id + '-cost'), fmt(cost) + ' pts');
    const btn = $('buy-' + b.id);
    txt(btn.firstChild, n > 1 ? 'Acheter ×' + n : 'Acheter');
    dis(btn, !can);
    cls(row, 'affordable', can);
  });

  // Prochaine ère
  if (state.era >= ERAS.length - 1) {
    txt(el.evolveDesc, '🏆 Ton empire a atteint la dernière ère connue. Fonde une nouvelle dynastie dans l’onglet Empire pour repartir plus fort.');
    el.evolveProg.style.width = '100%';
    txt(el.evolveProgTx, '');
    dis(el.evolveBtn, true);
    txt(el.evolveBtn, 'Apogée atteinte');
    txt(el.evolveNote, '');
  } else {
    const cost = EVOLVE_COSTS[state.era];
    const next = ERAS[state.era + 1];
    txt(el.evolveDesc, 'Accumule ' + fmt(cost) + ' points pour accéder à l’ère « ' + next.name + ' ».');
    const pct = Math.min(100, state.score / cost * 100);
    el.evolveProg.style.width = pct.toFixed(1) + '%';
    txt(el.evolveProgTx, fmt(Math.min(state.score, cost)) + ' / ' + fmt(cost));
    dis(el.evolveBtn, state.score < cost);
    txt(el.evolveBtn, 'Évoluer vers ' + next.name);
    txt(el.evolveNote, 'Production ×' + next.mult + ' + 3 nouveaux bâtiments + 1 héros');
  }
}

/* --- Village ------------------------------------------------------------ */
let lastVillageSig = '';
function renderVillage() {
  const sig = state.era + '|' + state.townHall + '|' + villageHuts() + '|' + heroCount();
  if (sig !== lastVillageSig) { rebuildVillageVisual(); lastVillageSig = sig; }

  txt(el.vhLevel, String(state.townHall));
  txt(el.vhDef, fmt(villageDefense()));
  txt(el.vhTroops, String(heroCount()));
  txt(el.vhForce, fmt(forceTotal()));
  txt(el.vhNext, fmtDuration(state.nextDefenseTime - Date.now()));

  if (state.townHall >= TH_MAX) {
    txt(el.vhCost, 'Niveau max');
    dis(el.vhUpgrade, true);
  } else {
    txt(el.vhCost, fmt(townHallCost()) + ' pts');
    dis(el.vhUpgrade, state.score < townHallCost());
  }

  // Héros
  HEROES.forEach(h => {
    const row = $('h-' + h.id);
    if (!unlocked(h)) { if (row.style.display !== 'none') row.style.display = 'none'; return; }
    if (row.style.display === 'none') row.style.display = '';
    const btn = $('recruit-' + h.id);
    const got = !!state.heroes[h.id];
    // NB : les deux branches remettent l'état complet — c'est ce qui manquait
    // dans la version précédente, où les boutons restaient « ✓ Recruté »
    // après une réinitialisation.
    if (got) {
      if (!btn.classList.contains('done')) {
        btn.classList.add('done');
        btn.innerHTML = '✓ Recruté';
      }
      dis(btn, true);
      cls(row, 'recruited', true);
      cls(row, 'affordable', false);
    } else {
      if (btn.classList.contains('done')) {
        btn.classList.remove('done');
        btn.innerHTML = 'Recruter<small>' + fmt(h.cost) + ' pts</small>';
      }
      const can = state.score >= h.cost;
      dis(btn, !can);
      cls(row, 'recruited', false);
      cls(row, 'affordable', can);
    }
  });

  // Compte à rebours du bouton d'attaque, sans reconstruire toute la carte
  const ab = $('raid-attack');
  if (ab) {
    const cd = state.nextRaidTime - Date.now();
    if (cd > 0) { dis(ab, true); txt(ab, '⏳ ' + Math.ceil(cd / 1000) + ' s'); }
    else if (ab.disabled) { dis(ab, false); txt(ab, '⚔️ Attaquer'); }
  }
}

/* --- Empire (stats, succès, héritage) ----------------------------------- */
let lastStatsHTML = '';
function renderEmpire() {
  const statsHTML = [
    ['💰 Points gagnés (dynastie)', fmt(state.stats.earnedRun)],
    ['🏛️ Points gagnés (total)',   fmt(state.stats.earnedEver)],
    ['👆 Clics effectués',          fmt(state.stats.clicks)],
    ['🏠 Bâtiments possédés',       fmt(ownedTotal())],
    ['💎 Minerais brisés',          fmt(state.crystalsBroken)],
    ['⚔️ Pillages',                 state.raidWins + ' gagnés / ' + state.raidLosses + ' perdus'],
    ['🏺 Héritages',                String(state.prestiges)],
    ['⏱️ Temps de jeu',             fmtDuration(state.stats.playTime)],
    ['✨ Multiplicateur global',    '×' + fmt(globalMult())]
  ].map(([k, v]) => `<div class="stat-row"><span>${k}</span><b>${v}</b></div>`).join('');
  if (statsHTML !== lastStatsHTML) { lastStatsHTML = statsHTML; el.stats.innerHTML = statsHTML; }

  ACHIEVEMENTS.forEach(a => cls($('ach-' + a.id), 'got', !!state.achievements[a.id]));
  txt(el.achCount, achCount() + ' / ' + ACHIEVEMENTS.length + ' · +' + Math.round((achMult() - 1) * 100) + ' %');

  const gain = relicsEarnable();
  txt(el.relicCount, fmt(state.relics) + (state.relics > 1 ? ' reliques' : ' relique'));
  txt(el.relicDesc, 'Chaque relique donne +' + Math.round(RELIC_BONUS * 100)
    + ' % de production, pour toujours. Bonus actuel : +' + Math.round((relicMult() - 1) * 100) + ' %.');
  if (state.era < 5) {
    txt(el.relicGain, 'Disponible à partir de la Renaissance.');
    txt(el.prestigeBtn, 'Verrouillé');
  } else {
    txt(el.relicGain, gain >= 1 ? '+' + fmt(gain) + ' relique(s) à la prochaine dynastie' : 'Continue à produire pour gagner des reliques…');
    txt(el.prestigeBtn, gain >= 1 ? 'Fonder une dynastie (+' + fmt(gain) + ')' : 'Pas assez de reliques');
  }
  dis(el.prestigeBtn, !canPrestige());
}

/* =========================================================================
   6. ACHATS & PROGRESSION
   ========================================================================= */
function buyBuilding(b) {
  if (!unlocked(b)) return;
  const n = wantedQty(b);
  const cost = bulkCost(b, n);
  if (n < 1 || state.score < cost) return;
  state.score -= cost;
  state.buildings[b.id] += n;
  blip(420);
  render(); save();
}

function buyTool() {
  const c = toolCost();
  if (state.score < c) return;
  state.score -= c;
  state.toolLevel++;
  blip(520);
  render(); save();
}

function buyGauntlet() {
  if (state.gauntletLevel >= GAUNTLET.max) return;
  const c = gauntletCost();
  if (state.score < c) return;
  state.score -= c;
  state.gauntletLevel++;
  blip(600);
  showToast('🧤 Gantelet niveau ' + state.gauntletLevel + ' : +'
    + Math.round(gauntletShare() * 100) + ' % du PPS à chaque clic.');
  render(); save();
}

function recruit(h) {
  if (!unlocked(h) || state.heroes[h.id] || state.score < h.cost) return;
  state.score -= h.cost;
  state.heroes[h.id] = true;
  blip(660);
  showToast('🦸 ' + h.name + ' rejoint ton empire ! +' + fmt(h.force) + ' Force, +5 % de production.');
  renderRaid(); render(); save();
}

function evolve() {
  if (state.era >= ERAS.length - 1) return;
  const cost = EVOLVE_COSTS[state.era];
  if (state.score < cost) return;

  state.score -= cost;
  state.era++;
  state.crystalHP = crystalMax();   // nouveau minerai, tout neuf

  applyEra();
  flashEra();
  renderCrystal();
  showToast('🎉 Nouvelle ère : ' + ERAS[state.era].name + ' ! Production globale ×' + ERAS[state.era].mult);
  blip(720);
  render();

  BUILDINGS.filter(b => b.era === state.era).forEach(b => {
    const row = $('b-' + b.id);
    row.classList.remove('just-unlocked');
    void row.offsetWidth;
    row.classList.add('just-unlocked');
  });
  renderRaid(); save();
}

function upgradeVillage() {
  if (state.townHall >= TH_MAX) return;
  const c = townHallCost();
  if (state.score < c) return;
  state.score -= c;
  state.townHall++;
  blip(560);
  showToast('🏡 Village niveau ' + state.townHall + ' ! +5 % de production et défense renforcée.');
  render(); save();
}

function doPrestige() {
  if (!canPrestige()) return;
  const gain = relicsEarnable();
  if (!confirm('Fonder une nouvelle dynastie ?\n\nTu repars à l’Âge de Pierre : points, bâtiments, héros, '
    + 'village et améliorations sont remis à zéro.\n\nTu conserves définitivement : '
    + (state.relics + gain) + ' reliques (+' + Math.round((state.relics + gain) * RELIC_BONUS * 100)
    + ' % de production), tes succès et tes statistiques.')) return;

  const keep = {
    relics: state.relics + gain,
    prestiges: state.prestiges + 1,
    achievements: state.achievements,
    stats: state.stats,
    sound: state.sound,
    qty: state.qty
  };
  state = Object.assign(defaultState(), keep);
  state.stats.earnedRun = 0;
  state.nextDefenseTime = Date.now() + DEFENSE_MIN;
  state.crystalHP = crystalMax();

  applyEra(); flashEra(); renderCrystal(); buildRaidScene(); renderRaid();
  lastVillageSig = '';
  showToast('🏺 Nouvelle dynastie ! Tu possèdes ' + state.relics + ' reliques (+'
    + Math.round((relicMult() - 1) * 100) + ' % de production).');
  render(); save();
}

/* --- Succès : vérifiés en continu, coût négligeable --------------------- */
function checkAchievements() {
  for (const a of ACHIEVEMENTS) {
    if (state.achievements[a.id]) continue;
    let ok = false;
    try { ok = a.test(state); } catch (e) { ok = false; }
    if (ok) {
      state.achievements[a.id] = true;
      showToast('🏆 Succès débloqué : ' + a.name + ' (+' + Math.round(ACHIEVEMENT_BONUS * 100) + ' % de production)');
      blip(880);
    }
  }
}

/* =========================================================================
   7. LE MINERAI CLIQUABLE
   ========================================================================= */
function crystalMax() { return 10 + state.era * 5 + Math.floor(state.toolLevel / 3); }

function renderCrystal() {
  const max = crystalMax();
  if (!Number.isFinite(state.crystalHP) || state.crystalHP <= 0 || state.crystalHP > max) state.crystalHP = max;
  const frac = state.crystalHP / max;
  el.crystalFill.style.width = (frac * 100).toFixed(1) + '%';
  let step = 0;
  if (frac <= 0.66) step = 1;
  if (frac <= 0.40) step = 2;
  if (frac <= 0.18) step = 3;
  el.cracks.setAttribute('class', 'cracks' + (step ? ' s' + step : ''));
  txt(el.crystalInfo, 'Minerais brisés : ' + fmt(state.crystalsBroken));
}

function doClick(x, y) {
  let gain = effClick();
  const crit = Math.random() < critChance();
  if (crit) gain *= 7;

  earn(gain);
  state.stats.clicks++;

  el.clicker.classList.remove('clicked');
  void el.clicker.offsetWidth;
  el.clicker.classList.add('clicked');
  bumpScore();
  spawnFloat(x, y, (crit ? '💥 ×7  +' : '+') + fmt(gain), crit);
  spawnParticles(x, y, crit ? 14 : 8);
  clickSound(crit);

  // Dégâts au minerai → fissures puis éclatement
  state.crystalHP--;
  if (state.crystalHP <= 0) {
    const bonus = Math.max(10, effClick() * crystalMax() * 1.5 + effPPS() * 5);
    earn(bonus);
    state.crystalsBroken++;
    state.crystalHP = crystalMax();
    el.clicker.classList.remove('shatter');
    void el.clicker.offsetWidth;
    el.clicker.classList.add('shatter');
    spawnFloat(x, y - 40, '💎 +' + fmt(bonus));
    spawnParticles(x, y, 22, true);
    breakSound();
  }
  renderCrystal();
  render();
}

el.clicker.addEventListener('pointerdown', e => {
  if (e.button !== 0) return;                     // ignore clic droit / molette
  doClick(e.clientX, e.clientY);
});
el.clicker.addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  e.preventDefault();
  const r = el.clicker.getBoundingClientRect();
  doClick(r.left + r.width / 2, r.top + r.height / 2);
});

function bumpScore() {
  el.score.classList.add('bump');
  clearTimeout(bumpScore._t);
  bumpScore._t = setTimeout(() => el.score.classList.remove('bump'), 90);
}

/* =========================================================================
   8. EFFETS VISUELS
   Les éléments éphémères sont plafonnés : sur un clic très rapide, la page
   ne se remplit pas de milliers de noeuds (ce qui faisait ramer l'ancienne version).
   ========================================================================= */
let liveFx = 0;
const FX_MAX = 160;

function spawnFloat(x, y, text, crit) {
  if (liveFx > FX_MAX) return;
  liveFx++;
  const f = document.createElement('div');
  f.className = 'float' + (crit ? ' crit' : '');
  f.textContent = text;
  f.style.left = x + 'px';
  f.style.top = y + 'px';
  document.body.appendChild(f);
  setTimeout(() => { f.remove(); liveFx--; }, 850);
}

function spawnParticles(x, y, n, big) {
  if (liveFx > FX_MAX) return;
  for (let i = 0; i < n; i++) {
    liveFx++;
    const p = document.createElement('div');
    p.className = 'particle';
    const angle = (Math.PI * 2 * i) / n + Math.random() * .5;
    const dist = (big ? 60 : 40) + Math.random() * (big ? 70 : 40);
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    if (big) p.style.width = p.style.height = (8 + Math.random() * 8) + 'px';
    p.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    p.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    p.style.background = ['var(--accent)', 'var(--beige)', '#ffffff'][i % 3];
    document.body.appendChild(p);
    setTimeout(() => { p.remove(); liveFx--; }, 600);
  }
}

function flashEra() {
  const f = document.createElement('div');
  f.className = 'era-flash';
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 1100);
  el.clicker.classList.remove('evolving');
  void el.clicker.offsetWidth;
  el.clicker.classList.add('evolving');
}

function showToast(msg, bad) {
  txt(el.toast, msg);
  el.toast.classList.toggle('bad', !!bad);
  el.toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.toast.classList.remove('show'), 4200);
}

/** Applique la palette et l'icône de l'ère courante. */
function applyEra() {
  const e = ERAS[state.era];
  const r = document.documentElement.style;
  r.setProperty('--accent', e.accent);
  r.setProperty('--accent-hover', e.accentHover);
  r.setProperty('--accent-glow', e.glow);
  r.setProperty('--beige', e.beige);
  r.setProperty('--beige-dark', e.beigeDark);
  r.setProperty('--bg', e.bg);
  r.setProperty('--bg2', e.bg2);
  txt(el.eraName, e.name);
  el.eraIcon.innerHTML = e.icon;
}

/* =========================================================================
   9. SON (Web Audio, aucun fichier externe)
   ========================================================================= */
let audioCtx = null;
function ensureAudio() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return true;
}
function tone(freq, dur, type, vol) {
  if (!state.sound || !ensureAudio()) return;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type || 'triangle';
  o.frequency.value = freq;
  g.gain.setValueAtTime(vol || .14, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
  o.connect(g).connect(audioCtx.destination);
  o.start();
  o.stop(audioCtx.currentTime + dur);
}
function clickSound(crit) {
  if (crit) { tone(880, .1, 'square', .16); setTimeout(() => tone(1320, .12, 'triangle', .13), 55); return; }
  tone(300 + Math.random() * 120, .08, 'square', .11);
}
function blip(freq) { tone(freq, .15, 'triangle', .15); }
function breakSound() {
  tone(180, .14, 'square', .17);
  setTimeout(() => tone(520, .12, 'triangle', .15), 60);
  setTimeout(() => tone(770, .18, 'triangle', .13), 130);
}

/* =========================================================================
   10. PILLAGE
   ========================================================================= */
const VILLAGE_ART = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 110"><path d="M0 88 Q100 74 200 88 L200 110 L0 110 Z" fill="#8a9a52" stroke="#5f6d38" stroke-width="2"/><g stroke="#3a2f25" stroke-width="2" stroke-linejoin="round"><rect x="26" y="64" width="34" height="26" rx="3" fill="#c9a877"/><polygon points="22,64 64,64 43,44" fill="#8a5a30"/><rect x="38" y="74" width="10" height="16" fill="#5f4326"/></g><g stroke="#3a2f25" stroke-width="2" stroke-linejoin="round"><rect x="80" y="54" width="44" height="36" rx="3" fill="#d8b78f"/><polygon points="74,54 130,54 102,30" fill="#a4642f"/><rect x="96" y="70" width="12" height="20" fill="#5f4326"/><rect x="84" y="60" width="9" height="9" fill="#7aa0b5"/></g><g stroke="#3a2f25" stroke-width="2" stroke-linejoin="round"><rect x="140" y="66" width="32" height="24" rx="3" fill="#c9a877"/><polygon points="136,66 176,66 156,48" fill="#8a5a30"/></g><line x1="102" y1="30" x2="102" y2="16" stroke="#3a2f25" stroke-width="2"/><polygon points="102,16 116,20 102,24" fill="#cf4a3f" stroke="#3a2f25" stroke-width="1.5"/></svg>`;

let isScanning = false;

function randomVillageName() {
  return V_PREFIX[Math.floor(Math.random() * V_PREFIX.length)] + ' '
       + V_SUFFIX[Math.floor(Math.random() * V_SUFFIX.length)];
}

/* La scène (nuages + village) est construite une seule fois ; renderRaid ne
   remplace que #raid-info, sinon les animations CSS repartiraient de zéro. */
function buildRaidScene() {
  el.raidCard.innerHTML = `
    <div class="raid-scene" id="raid-scene">
      <div class="village-art">${VILLAGE_ART}</div>
      <div class="puff p1"></div><div class="puff p2"></div><div class="puff p3"></div>
      <div class="puff p4"></div><div class="puff p5"></div>
      <div class="scene-label" id="scene-label"></div>
    </div>
    <div id="raid-info"></div>`;
}

function winChance(defense) {
  const f = forceTotal();
  return (f + defense) > 0 ? f / (f + defense) : 0;
}

function searchVillage() {
  if (isScanning) return;
  isScanning = true;
  state.raid = null;
  state.raidMsg = '';
  const scene = $('raid-scene'), label = $('scene-label');
  if (scene) { scene.classList.remove('revealed'); scene.classList.add('scanning'); }
  if (label) label.textContent = '🌥️ Survol des terres…';
  renderRaid();

  setTimeout(() => {
    const f = forceTotal();
    const defense = Math.round(Math.max(10, f) * (0.5 + Math.random() * 1.3));
    const loot = Math.round(effPPS() * (30 + Math.random() * 60) + 100 + defense * 4);
    state.raid = { name: randomVillageName(), defense, loot };
    isScanning = false;
    if (scene) { scene.classList.remove('scanning'); scene.classList.add('revealed'); }
    if (label) label.textContent = '';
    renderRaid(); save();
  }, 1300);
}

function attackVillage() {
  if (!state.raid || Date.now() < state.nextRaidTime) return;
  const t = state.raid;
  if (Math.random() < winChance(t.defense)) {
    earn(t.loot);
    state.raidWins++;
    state.raidMsg = '🏆 Victoire ! Tu as pillé ' + fmt(t.loot) + ' points à ' + t.name + '.';
    state.raidMsgWin = true;
    blip(820);
    showToast(state.raidMsg);
  } else {
    state.raidLosses++;
    state.raidMsg = '💥 Défaite… ' + t.name + ' a repoussé ton attaque. Recrute des héros pour gagner en Force.';
    state.raidMsgWin = false;
    blip(170);
    showToast(state.raidMsg, true);
    el.raidCard.classList.remove('shake');
    void el.raidCard.offsetWidth;
    el.raidCard.classList.add('shake');
  }
  state.raid = null;
  state.nextRaidTime = Date.now() + RAID_COOLDOWN;
  renderRaid(); render(); save();
}

function renderRaid() {
  const scene = $('raid-scene'), info = $('raid-info'), label = $('scene-label');
  if (!info) return;

  if (!isScanning && scene) {
    if (state.raid) {
      scene.classList.add('revealed'); scene.classList.remove('scanning');
      if (label) label.textContent = '';
    } else {
      scene.classList.remove('revealed', 'scanning');
      if (label) label.textContent = '☁️ Terres inexplorées';
    }
  }

  const f = forceTotal();
  let html = `<div class="raid-force">💪 Force d'attaque : <b>${fmt(f)}</b></div>`;
  if (f <= 0) html += `<div class="raid-hint">Recrute un héros pour gagner de la Force et pouvoir piller.</div>`;

  if (isScanning) {
    html += `<div class="raid-chance">🔭 Exploration en cours…</div>`;
  } else if (!state.raid) {
    html += `<button class="raid-btn search" id="raid-search">🔍 Chercher un village à piller</button>`;
  } else {
    const t = state.raid;
    const pct = Math.round(winChance(t.defense) * 100);
    const cd = state.nextRaidTime - Date.now();
    html += `
      <div class="raid-name">🏰 ${t.name}</div>
      <div class="raid-stats">
        <span>🛡️ Défense : <b>${fmt(t.defense)}</b></span>
        <span>💰 Butin : <b>${fmt(t.loot)}</b></span>
      </div>
      <div class="raid-chance">Chances de victoire : <b>${pct} %</b></div>
      <div class="raid-bar"><div style="width:${pct}%"></div></div>
      <div class="raid-actions">
        <button class="raid-btn attack" id="raid-attack"${cd > 0 ? ' disabled' : ''}>${cd > 0 ? '⏳ ' + Math.ceil(cd / 1000) + ' s' : '⚔️ Attaquer'}</button>
        <button class="raid-btn skip" id="raid-skip">↻ Autre cible</button>
      </div>`;
  }
  if (state.raidMsg) html += `<div class="raid-result ${state.raidMsgWin ? 'win' : 'lose'}">${state.raidMsg}</div>`;
  html += `<div class="raid-tally">Victoires : ${state.raidWins} &middot; Défaites : ${state.raidLosses}</div>`;
  info.innerHTML = html;
}

/* Un seul écouteur sur le conteneur : il survit aux remplacements innerHTML. */
el.raidCard.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.id === 'raid-search' || b.id === 'raid-skip') searchVillage();
  else if (b.id === 'raid-attack') attackVillage();
});

/* Attaque ennemie périodique sur TON village. */
function defenseEvent() {
  const def = villageDefense();
  const threat = Math.round(
    (forceTotal() * 0.45 + state.townHall * 35 + (state.era + 1) * 80 + ownedTotal() * 2)
    * (0.6 + Math.random() * 0.9)
  );
  if (def >= threat) {
    const bonus = Math.round(effPPS() * 20 + 50);
    earn(bonus);
    showToast('🛡️ Ton village a repoussé une attaque (' + fmt(def) + ' contre ' + fmt(threat) + ') ! +' + fmt(bonus) + ' de butin.');
    blip(720);
  } else {
    const loss = Math.min(state.score * 0.03, effPPS() * 30);
    state.score = Math.max(0, state.score - loss);
    showToast('💥 Un clan ennemi a pillé ton village (' + fmt(def) + ' contre ' + fmt(threat) + ') : -' + fmt(loss) + '. Améliore ta défense !', true);
    blip(180);
  }
  state.nextDefenseTime = Date.now() + DEFENSE_MIN + Math.random() * DEFENSE_RANGE;
}

/* =========================================================================
   11. MON VILLAGE (rendu isométrique)
   ========================================================================= */
const ISO_W = 46, ISO_H = 23;

function darken(hex) {
  const m = hex.replace('#', '');
  if (m.length !== 6) return hex;
  const f = i => Math.max(0, Math.round(parseInt(m.substr(i, 2), 16) * 0.78)).toString(16).padStart(2, '0');
  return '#' + f(0) + f(2) + f(4);
}

function isoBuilding(P, ptsStr, it, wallL, wallR) {
  const { c, r, w, d, wallH, roofH, roof, th } = it;
  const A = P(c, r), B = P(c + w, r), C = P(c + w, r + d), D = P(c, r + d);
  const up = p => [p[0], p[1] - wallH];
  const At = up(A), Bt = up(B), Ct = up(C), Dt = up(D);
  const E = [(At[0] + Ct[0]) / 2, (At[1] + Ct[1]) / 2 - roofH];
  const poly = (pts, fill) => `<polygon points="${ptsStr(pts)}" fill="${fill}" stroke="#3a2f25" stroke-width="1.4" stroke-linejoin="round"/>`;

  let s = '';
  s += poly([D, C, Ct, Dt], wallL);
  s += poly([B, C, Ct, Bt], wallR);
  s += poly([At, Dt, E], darken(roof));
  s += poly([At, Bt, E], darken(roof));
  s += poly([Dt, Ct, E], roof);
  s += poly([Bt, Ct, E], roof);
  if (th) {
    const fy = E[1] - 14;
    s += `<line x1="${E[0].toFixed(1)}" y1="${E[1].toFixed(1)}" x2="${E[0].toFixed(1)}" y2="${fy.toFixed(1)}" stroke="#3a2f25" stroke-width="2"/>`;
    s += `<polygon points="${E[0].toFixed(1)},${fy.toFixed(1)} ${(E[0] + 12).toFixed(1)},${(fy + 3).toFixed(1)} ${E[0].toFixed(1)},${(fy + 6).toFixed(1)}" fill="#cf4a3f" stroke="#3a2f25" stroke-width="1"/>`;
    for (let k = 0; k < 3; k++)
      s += `<circle class="v-smoke" cx="${(E[0] - 10).toFixed(1)}" cy="${(E[1] - 2).toFixed(1)}" r="${(2.6 + k * 0.7).toFixed(1)}" fill="#e6e6ea" style="animation-delay:${(k * 0.85).toFixed(2)}s"/>`;
  }
  return `<g class="v-build${th ? ' v-th' : ''}" data-b="${th ? 'th' : 'hut'}">${s}</g>`;
}

function villageSceneSVG() {
  const e = ERAS[state.era];
  const ground = '#7faa4e', grassEdge = '#5f7d34', wallL = '#b39b73', wallR = '#cbb68f';
  const cx = 140, cy = 46, N = 5, gH = 16;
  const P = (c, r) => [cx + (c - r) * ISO_W / 2, cy + (c + r) * ISO_H / 2];
  const ptsStr = pts => pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');

  const T = P(0, 0), R = P(N, 0), Bo = P(N, N), Lf = P(0, N);
  const dn = p => [p[0], p[1] + gH];

  const cloud = (x, y, sc, dur, delay) =>
    `<g class="v-cloud" style="animation-duration:${dur}s;animation-delay:${delay}s">`
    + `<ellipse cx="${x}" cy="${y}" rx="${(14 * sc).toFixed(1)}" ry="${(8 * sc).toFixed(1)}" fill="#fff" opacity=".9"/>`
    + `<ellipse cx="${(x + 10 * sc).toFixed(1)}" cy="${y + 2}" rx="${(10 * sc).toFixed(1)}" ry="${(6 * sc).toFixed(1)}" fill="#fff" opacity=".9"/>`
    + `<ellipse cx="${(x - 9 * sc).toFixed(1)}" cy="${y + 3}" rx="${(8 * sc).toFixed(1)}" ry="${(5 * sc).toFixed(1)}" fill="#fff" opacity=".85"/></g>`;

  let inner = cloud(15, 24, 1, 26, 0) + cloud(115, 14, .8, 34, -12) + cloud(205, 30, 1.1, 30, -20);
  inner += `<polygon points="${ptsStr([R, Bo, dn(Bo), dn(R)])}" fill="#6f4a2a"/>`;
  inner += `<polygon points="${ptsStr([Lf, Bo, dn(Bo), dn(Lf)])}" fill="#5a3c22"/>`;
  inner += `<polygon points="${ptsStr([T, R, Bo, Lf])}" fill="${ground}" stroke="${grassEdge}" stroke-width="2" stroke-linejoin="round"/>`;

  let grid = '';
  for (let i = 1; i < N; i++) {
    grid += `<line x1="${P(i, 0)[0].toFixed(1)}" y1="${P(i, 0)[1].toFixed(1)}" x2="${P(i, N)[0].toFixed(1)}" y2="${P(i, N)[1].toFixed(1)}"/>`;
    grid += `<line x1="${P(0, i)[0].toFixed(1)}" y1="${P(0, i)[1].toFixed(1)}" x2="${P(N, i)[0].toFixed(1)}" y2="${P(N, i)[1].toFixed(1)}"/>`;
  }
  inner += `<g stroke="${grassEdge}" stroke-width="1" opacity=".3">${grid}</g>`;

  const slots = [{ c: 0, r: 0 }, { c: 4, r: 0 }, { c: 0, r: 4 }, { c: 4, r: 4 }, { c: 0, r: 2 }, { c: 4, r: 2 }];
  const items = [{ c: 1.5, r: 1.5, w: 2, d: 2, wallH: 36, roofH: 24, roof: e.accent, th: true }];
  for (let i = 0; i < villageHuts(); i++)
    items.push({ c: slots[i].c, r: slots[i].r, w: 1, d: 1, wallH: 18, roofH: 14, roof: e.beigeDark, th: false });
  items.sort((a, b) => ((a.c + a.w / 2) + (a.r + a.d / 2)) - ((b.c + b.w / 2) + (b.r + b.d / 2)));
  for (const it of items) inner += isoBuilding(P, ptsStr, it, wallL, wallR);

  const vil = (cc, rr, col, dur, delay) => {
    const p = P(cc, rr);
    return `<g class="v-villager" style="animation-duration:${dur}s;animation-delay:${delay}s">`
      + `<ellipse cx="${p[0].toFixed(1)}" cy="${(p[1] - 1).toFixed(1)}" rx="3" ry="1.5" fill="#00000033"/>`
      + `<rect x="${(p[0] - 2).toFixed(1)}" y="${(p[1] - 9).toFixed(1)}" width="4" height="7" rx="2" fill="${col}"/>`
      + `<circle cx="${p[0].toFixed(1)}" cy="${(p[1] - 10).toFixed(1)}" r="2.3" fill="#e9c6a0"/></g>`;
  };
  inner += vil(2.5, 3.7, '#7a8a52', 5, 0) + vil(1.5, 2.7, '#9a5a3a', 6.5, -2) + vil(3.5, 2.3, '#5a6f8a', 5.8, -3.5);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 195">${inner}</svg>`;
}

function rebuildVillageVisual() {
  el.villageScene.innerHTML = villageSceneSVG();
  const g = HEROES
    .filter(h => state.heroes[h.id])
    .map(h => `<span class="troop" title="${h.name}">${h.svg}</span>`)
    .join('');
  el.garrison.innerHTML = g || '<span class="garrison-empty">Aucune troupe — recrute des héros !</span>';
}

/* Taper l'hôtel de ville l'améliore ; taper une hutte récolte un petit bonus. */
el.villageScene.addEventListener('click', ev => {
  const g = ev.target.closest && ev.target.closest('[data-b]');
  if (!g) return;
  g.classList.remove('tapped');
  requestAnimationFrame(() => g.classList.add('tapped'));
  setTimeout(() => g.classList.remove('tapped'), 360);

  if (g.dataset.b === 'th' && state.townHall < TH_MAX && state.score >= townHallCost()) {
    upgradeVillage();
    return;
  }
  const gain = effClick() * 0.25;
  earn(gain);
  spawnFloat(ev.clientX, ev.clientY, '+' + fmt(gain));
  spawnParticles(ev.clientX, ev.clientY, 6);
  clickSound(false);
  render();
});

/* =========================================================================
   12. BRANCHEMENT DES CONTRÔLES
   ========================================================================= */
$('buy-tool').addEventListener('click', buyTool);
$('buy-gauntlet').addEventListener('click', buyGauntlet);
el.evolveBtn.addEventListener('click', evolve);
el.vhUpgrade.addEventListener('click', upgradeVillage);
el.prestigeBtn.addEventListener('click', doPrestige);

el.qty.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  const v = b.dataset.qty;
  state.qty = v === 'max' ? 'max' : Number(v);
  el.qty.querySelectorAll('button').forEach(x => x.classList.toggle('active', x.dataset.qty === v));
  render(); save();
});

el.soundToggle.addEventListener('click', () => {
  state.sound = !state.sound;
  if (state.sound) { ensureAudio(); blip(600); }
  render(); save();
});

el.resetBtn.addEventListener('click', () => {
  if (!confirm('Effacer TOUTE la progression, y compris les reliques et les succès ?')) return;
  state = defaultState();
  state.nextDefenseTime = Date.now() + DEFENSE_MIN;
  lastVillageSig = '';
  applyEra(); renderCrystal(); buildRaidScene(); renderRaid();
  el.qty.querySelectorAll('button').forEach(x => x.classList.toggle('active', x.dataset.qty === '1'));
  render(); save();
  showToast('Progression réinitialisée.');
});

/* Onglets */
function showView(v) {
  currentView = v;
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.view === v));
  ['prod', 'village', 'empire'].forEach(n => $('view-' + n).classList.toggle('active', n === v));
  if (v === 'village') lastVillageSig = '';   // force un redessin propre de la scène
  render();
  try { localStorage.setItem('tap-empire-tab', v); } catch (e) {}
}
document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => showView(t.dataset.view)));

/* =========================================================================
   13. BOUCLE DE JEU
   Le temps de référence est l'horloge réelle (Date.now), jamais le nombre
   d'itérations : si le navigateur ralentit l'onglet en arrière-plan, ou si
   l'ordinateur se met en veille, la production reste exacte au lieu de
   « sauter ». Un trou de plus d'une minute est traité au tarif hors-ligne.
   ========================================================================= */
const TICK_MS = 200;
let lastTick = Date.now();
let lastUI = 0;
let lastSave = Date.now();

function tick() {
  const now = Date.now();
  const real = (now - lastTick) / 1000;
  lastTick = now;
  if (real <= 0) return;

  // Onglet gelé / veille : on crédite au rendement hors-ligne et sous plafond.
  const dt = real <= 60
    ? real
    : Math.min(real, OFFLINE_CAP / 1000) * OFFLINE_RATE;

  earn(effPPS() * dt);
  state.stats.playTime += Math.min(real, 60) * 1000;
  if (!Number.isFinite(state.score)) state.score = 0;

  if (now > state.nextDefenseTime) defenseEvent();
  checkAchievements();

  // L'interface ne se redessine que si l'onglet est visible : inutile de
  // peindre des pixels que personne ne regarde.
  if (!document.hidden && now - lastUI >= UI_EVERY) { lastUI = now; render(); }
  if (now - lastSave >= SAVE_EVERY) { lastSave = now; save(); }
}

/* =========================================================================
   14. DÉMARRAGE
   ========================================================================= */
function applyOfflineProgress() {
  const away = Date.now() - state.lastSeen;
  if (!(away > 60e3)) return;                       // moins d'une minute : rien
  const capped = Math.min(away, OFFLINE_CAP);
  const gain = effPPS() * (capped / 1000) * OFFLINE_RATE;
  if (gain <= 0) return;
  earn(gain);
  setTimeout(() => showToast('🌙 Absent ' + fmtDuration(away) + ' : tes bâtiments ont produit '
    + fmt(gain) + ' points (' + Math.round(OFFLINE_RATE * 100) + ' % du rendement, '
    + fmtDuration(OFFLINE_CAP) + ' maximum).'), 700);
}

function boot() {
  const loaded = load();
  if (loaded) {
    state = loaded;
    applyOfflineProgress();
  }
  // L'échéance d'attaque ennemie est conservée si elle est encore dans le futur :
  // recharger la page ne permet plus d'esquiver les attaques.
  if (!(state.nextDefenseTime > Date.now())) state.nextDefenseTime = Date.now() + 15e3;

  el.qty.querySelectorAll('button').forEach(x =>
    x.classList.toggle('active', x.dataset.qty === String(state.qty)));

  applyEra();
  renderCrystal();
  buildRaidScene();
  renderRaid();

  let tab = 'prod';
  try { tab = localStorage.getItem('tap-empire-tab') || 'prod'; } catch (e) {}
  showView(['prod', 'village', 'empire'].includes(tab) ? tab : 'prod');

  // Poussières décoratives
  const host = $('dust');
  for (let i = 0; i < 30; i++) {
    const s = document.createElement('span');
    s.style.left = Math.random() * 100 + 'vw';
    s.style.animationDuration = (14 + Math.random() * 16) + 's';
    s.style.animationDelay = (-Math.random() * 20) + 's';
    const sz = 2 + Math.random() * 4;
    s.style.width = s.style.height = sz + 'px';
    host.appendChild(s);
  }

  window.addEventListener('beforeunload', save);
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });

  lastTick = Date.now();
  lastSave = Date.now();
  setInterval(tick, TICK_MS);
}

boot();
