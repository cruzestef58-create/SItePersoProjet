/* ============================================================
   util.js — petits outils partagés
   ============================================================ */

const $  = (sel, ctx) => (ctx || document).querySelector(sel);
const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

/** Crée un élément. el('div', {class:'x', text:'hi'}, enfant1, enfant2) */
function el(tag, props, ...children) {
  const node = document.createElement(tag);
  if (props) {
    for (const k in props) {
      const v = props[k];
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k === 'style') node.setAttribute('style', v);
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else if (v !== null && v !== undefined && v !== false) node.setAttribute(k, v);
    }
  }
  for (const c of children.flat()) {
    if (c === null || c === undefined || c === false) continue;
    node.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return node;
}

function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); return node; }

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const randInt = n => Math.floor(Math.random() * n);
const pick = arr => arr[randInt(arr.length)];
const pickMany = (arr, n) => shuffle(arr).slice(0, n);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/** enlève accents / casse / ponctuation → pour comparer des mots saisis */
const RE_ACCENTS = new RegExp('[\\u0300-\\u036f]', 'g');
function normalize(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD').replace(RE_ACCENTS, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/* ---- timers annulables : tout jeu doit passer par là ---- */
const Timers = {
  _t: [], _i: [],
  after(fn, ms) { const id = setTimeout(fn, ms); this._t.push(id); return id; },
  every(fn, ms) { const id = setInterval(fn, ms); this._i.push(id); return id; },
  stop(id) { clearTimeout(id); clearInterval(id); },
  clearAll() {
    this._t.forEach(clearTimeout); this._i.forEach(clearInterval);
    this._t = []; this._i = [];
  }
};

/* ---- dates ---- */
function dayKey(d) {
  const x = d || new Date();
  const m = String(x.getMonth() + 1).padStart(2, '0');
  const j = String(x.getDate()).padStart(2, '0');
  return `${x.getFullYear()}-${m}-${j}`;
}
function keyToDate(k) { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); }
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function daysBetween(a, b) {
  const A = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const B = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((B - A) / 86400000);
}
function frDate(d) {
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}
/** numéro de jour depuis l'époque — sert à faire tourner les exercices */
function dayIndex(d) { return Math.floor(keyToDate(dayKey(d || new Date())).getTime() / 86400000); }

/* ---- toast ---- */
let toastTimer = null;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ---- petit graphique en ligne sur canvas ---- */
function drawLineChart(canvas, values, opts) {
  opts = opts || {};
  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.clientWidth || 700;
  const cssH = opts.height || canvas.height || 220;
  canvas.width = cssW * dpr; canvas.height = cssH * dpr;
  canvas.style.height = cssH + 'px';
  const c = canvas.getContext('2d');
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.clearRect(0, 0, cssW, cssH);

  const css = getComputedStyle(document.documentElement);
  const accent = css.getPropertyValue('--accent').trim() || '#7c6cff';
  const muted = css.getPropertyValue('--muted').trim() || '#999';
  const border = css.getPropertyValue('--border').trim() || '#333';

  const mini = cssH < 90;                       // version « sparkline » : ni grille ni axes
  const padL = mini ? 4 : 34, padR = mini ? 4 : 10;
  const padT = mini ? 6 : 14, padB = mini ? 6 : 22;
  const W = cssW - padL - padR, H = cssH - padT - padB;

  if (!values.length) {
    c.fillStyle = muted; c.font = '13px Segoe UI, sans-serif'; c.textAlign = 'center';
    c.fillText('Pas encore assez de données — reviens demain.', cssW / 2, cssH / 2);
    return;
  }

  const max = opts.max !== undefined ? opts.max : Math.max(...values, 1) * 1.15;
  const min = opts.min !== undefined ? opts.min : 0;
  const x = i => padL + (values.length === 1 ? W / 2 : (i / (values.length - 1)) * W);
  const y = v => padT + H - ((v - min) / (max - min || 1)) * H;

  // grille
  if (!mini) {
    c.strokeStyle = border; c.lineWidth = 1; c.font = '11px Segoe UI, sans-serif';
    c.fillStyle = muted; c.textAlign = 'right'; c.textBaseline = 'middle';
    for (let k = 0; k <= 4; k++) {
      const v = min + (max - min) * k / 4, yy = Math.round(y(v)) + .5;
      c.beginPath(); c.moveTo(padL, yy); c.lineTo(cssW - padR, yy); c.stroke();
      c.fillText(Math.round(v), padL - 7, yy);
    }
  }

  // ligne de repère (moyenne de départ)
  if (opts.baseline !== undefined && opts.baseline !== null) {
    c.save(); c.setLineDash([5, 5]); c.strokeStyle = muted;
    const yy = Math.round(y(opts.baseline)) + .5;
    c.beginPath(); c.moveTo(padL, yy); c.lineTo(cssW - padR, yy); c.stroke(); c.restore();
  }

  // aire
  const grad = c.createLinearGradient(0, padT, 0, padT + H);
  grad.addColorStop(0, accent + '66'); grad.addColorStop(1, accent + '00');
  c.beginPath(); c.moveTo(x(0), y(values[0]));
  values.forEach((v, i) => c.lineTo(x(i), y(v)));
  c.lineTo(x(values.length - 1), padT + H); c.lineTo(x(0), padT + H); c.closePath();
  c.fillStyle = grad; c.fill();

  // courbe
  c.beginPath(); c.moveTo(x(0), y(values[0]));
  values.forEach((v, i) => c.lineTo(x(i), y(v)));
  c.strokeStyle = accent; c.lineWidth = 2.5; c.lineJoin = 'round'; c.stroke();

  // points
  values.forEach((v, i) => {
    c.beginPath(); c.arc(x(i), y(v), values.length > 40 ? 1.8 : 3.4, 0, Math.PI * 2);
    c.fillStyle = accent; c.fill();
  });
}
