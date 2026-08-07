/* ===================== CONFIG DATA ===================== */

const DRAGONS = [
  { id: "infernal", label: "Dragon Infernal", emoji: "🔥", color: "#ff5a1f" },
  { id: "ocean", label: "Dragon Océanique", emoji: "🌊", color: "#2b8fd8" },
  { id: "mountain", label: "Dragon des Montagnes", emoji: "⛰️", color: "#8a5a2b" },
  { id: "cloud", label: "Dragon des Nuages", emoji: "☁️", color: "#cfd8e6" },
  { id: "hextech", label: "Dragon Hextech", emoji: "⚡", color: "#2be0d0" },
  { id: "chemtech", label: "Dragon Chimique", emoji: "☠️", color: "#7ad13a" },
  { id: "elder", label: "Dragon Ancestral", emoji: "💀", color: "#8a2be2" },
];

const OBJECTIVES_EXTRA = [
  { id: "baron", label: "Baron Nashor", emoji: "👑", color: "#7a2bd8" },
  { id: "herald", label: "Héraut de la Faille", emoji: "👁️", color: "#3fb5b0" },
  { id: "scuttle", label: "Crabe Éclaireur", emoji: "🦀", color: "#2b8fd8" },
];

const MINIONS = [
  { id: "melee-blue", label: "Sbire Corps-à-corps (Bleu)", emoji: "⚔️", color: "#3fa0ff", team: "blue" },
  { id: "caster-blue", label: "Sbire Lanceur (Bleu)", emoji: "🔮", color: "#3fa0ff", team: "blue" },
  { id: "siege-blue", label: "Sbire de Siège (Bleu)", emoji: "💣", color: "#3fa0ff", team: "blue" },
  { id: "melee-red", label: "Sbire Corps-à-corps (Rouge)", emoji: "⚔️", color: "#ff5555", team: "red" },
  { id: "caster-red", label: "Sbire Lanceur (Rouge)", emoji: "🔮", color: "#ff5555", team: "red" },
  { id: "siege-red", label: "Sbire de Siège (Rouge)", emoji: "💣", color: "#ff5555", team: "red" },
];

/* ===================== STATE ===================== */

const boardViewport = document.getElementById("boardViewport");
const board = document.getElementById("board");
const tokenLayer = document.getElementById("tokenLayer");
const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");

let currentTeam = "blue";
let armed = null; // {kind, id, label, img, emoji, color, team}
let tokens = [];
let tokenSeq = 1;
let undoStack = [];

function pushUndo(action) {
  undoStack.push(action);
  if (undoStack.length > 40) undoStack.shift();
}

function undo() {
  const action = undoStack.pop();
  if (!action) return;
  if (action.type === "draw") {
    ctx.putImageData(action.before, 0, 0);
  } else if (action.type === "place") {
    tokenLayer.querySelector(`[data-id="${action.id}"]`)?.remove();
    tokens = tokens.filter(t => t.id !== action.id);
  } else if (action.type === "remove") {
    restoreToken(action.tokenData);
  }
}

document.getElementById("undoBtn").addEventListener("click", undo);
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === "z") { e.preventDefault(); undo(); }
});

/* ===================== SIDEBAR: CHAMPIONS ===================== */

const champGrid = document.getElementById("champGrid");
let championData = [];

async function loadChampions() {
  try {
    const versions = await fetch("https://ddragon.leagueoflegends.com/api/versions.json").then(r => r.json());
    const version = versions[0];
    const data = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/fr_FR/champion.json`).then(r => r.json());
    championData = Object.values(data.data).map(c => ({
      id: c.id,
      label: c.name,
      img: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${c.image.full}`,
    })).sort((a, b) => a.label.localeCompare(b.label));
    renderChampions(championData);
  } catch (e) {
    champGrid.innerHTML = "Impossible de charger les champions (connexion internet requise).";
    console.error(e);
  }
}

function renderChampions(list) {
  champGrid.innerHTML = "";
  list.forEach(c => {
    const el = document.createElement("div");
    el.className = "item";
    el.innerHTML = `<img src="${c.img}" alt="${c.label}"><span class="label">${c.label}</span>`;
    el.addEventListener("click", () => armItem(el, { kind: "champion", id: c.id, label: c.label, img: c.img }));
    champGrid.appendChild(el);
  });
}

document.getElementById("champSearch").addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();
  renderChampions(championData.filter(c => c.label.toLowerCase().includes(q)));
});

loadChampions();

/* ===================== SIDEBAR: OBJECTIVES ===================== */

const objGrid = document.getElementById("objGrid");
[...DRAGONS, ...OBJECTIVES_EXTRA].forEach(o => {
  const el = document.createElement("div");
  el.className = "item";
  el.style.setProperty("--badge-color", o.color);
  el.innerHTML = `<div class="badge">${o.emoji}</div><span class="label">${o.label}</span>`;
  el.addEventListener("click", () => armItem(el, { kind: "objective", id: o.id, label: o.label, emoji: o.emoji, color: o.color }));
  objGrid.appendChild(el);
});

/* ===================== SIDEBAR: MINIONS ===================== */

const minionGrid = document.getElementById("minionGrid");
MINIONS.forEach(m => {
  const el = document.createElement("div");
  el.className = "item";
  el.style.setProperty("--badge-color", m.color);
  el.innerHTML = `<div class="badge">${m.emoji}</div><span class="label">${m.label}</span>`;
  el.addEventListener("click", () => armItem(el, { kind: "minion", id: m.id, label: m.label, emoji: m.emoji, color: m.color, team: m.team }));
  minionGrid.appendChild(el);
});

const waveBtn = document.createElement("button");
waveBtn.textContent = "🌊 Placer une vague complète";
waveBtn.style.gridColumn = "1 / -1";
waveBtn.style.padding = "8px";
waveBtn.style.marginTop = "6px";
waveBtn.addEventListener("click", () => armItem(waveBtn, { kind: "wave" }));
minionGrid.parentElement.appendChild(waveBtn);

/* ===================== ARM / SELECT ITEM ===================== */

function armItem(el, data) {
  const alreadySelected = el.classList.contains("selected") || (waveBtn === el && armed && armed.kind === "wave");
  document.querySelectorAll(".item.selected").forEach(i => i.classList.remove("selected"));
  waveBtn.classList.remove("selected");
  if (alreadySelected) {
    armed = null;
    return;
  }
  if (el.classList) el.classList.add("selected");
  armed = data;
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    armed = null;
    document.querySelectorAll(".item.selected").forEach(i => i.classList.remove("selected"));
  }
});

/* ===================== TABS ===================== */

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("panel-" + btn.dataset.tab).classList.add("active");
  });
});

/* ===================== TEAM SWITCH ===================== */

const teamBlueBtn = document.getElementById("teamBlue");
const teamRedBtn = document.getElementById("teamRed");
teamBlueBtn.addEventListener("click", () => { currentTeam = "blue"; teamBlueBtn.classList.add("active"); teamRedBtn.classList.remove("active"); });
teamRedBtn.addEventListener("click", () => { currentTeam = "red"; teamRedBtn.classList.add("active"); teamBlueBtn.classList.remove("active"); });

/* ===================== MODE SWITCH ===================== */

const modePlaceBtn = document.getElementById("modePlace");
const modeDrawBtn = document.getElementById("modeDraw");
const drawTools = document.getElementById("drawTools");
const hintText = document.getElementById("hintText");

modePlaceBtn.addEventListener("click", () => setMode("place"));
modeDrawBtn.addEventListener("click", () => setMode("draw"));

function setMode(mode) {
  board.classList.toggle("draw-mode", mode === "draw");
  modePlaceBtn.classList.toggle("active", mode === "place");
  modeDrawBtn.classList.toggle("active", mode === "draw");
  drawTools.hidden = mode !== "draw";
  hintText.textContent = mode === "draw"
    ? "Mode dessin : clique-glisse sur la carte pour dessiner (flèches, cercles, notes). Utilise la gomme ou 'Effacer le dessin' pour nettoyer."
    : "Clique un élément à gauche puis clique sur la carte pour le placer. Glisse un jeton posé pour le déplacer. Double-clic (ou clic-droit) sur un jeton pour le supprimer.";
}

/* ===================== TOKEN SIZE ===================== */

const tokenSizeInput = document.getElementById("tokenSize");
tokenSizeInput.addEventListener("input", () => {
  document.documentElement.style.setProperty("--token-size", tokenSizeInput.value + "px");
});

/* ===================== PLACE TOKENS ===================== */

let panMoved = false;

board.addEventListener("click", (e) => {
  if (board.classList.contains("draw-mode")) return;
  if (panMoved) { panMoved = false; return; }
  if (!armed) return;
  if (e.target.closest(".token")) return;

  const rect = board.getBoundingClientRect();
  const xPct = ((e.clientX - rect.left) / rect.width) * 100;
  const yPct = ((e.clientY - rect.top) / rect.height) * 100;

  if (armed.kind === "wave") {
    placeWave(xPct, yPct);
  } else {
    placeToken(armed, xPct, yPct);
  }
});

function createTokenElement(id, team, data) {
  const el = document.createElement("div");
  el.className = "token team-" + team + (data.kind === "minion" ? " minion" : "");
  el.dataset.id = id;
  if (data.img) {
    el.innerHTML = `<img src="${data.img}" alt="${data.label}" title="${data.label}" crossorigin="anonymous">`;
  } else {
    el.style.setProperty("--badge-color", data.color || "#444");
    el.innerHTML = `<div class="badge" title="${data.label || ""}">${data.emoji || "?"}</div>`;
  }
  attachTokenEvents(el, id);
  return el;
}

function placeToken(data, xPct, yPct) {
  const id = tokenSeq++;
  let team = "neutral";
  if (data.kind === "champion") team = currentTeam;
  if (data.kind === "minion") team = data.team;

  const el = createTokenElement(id, team, data);
  el.style.left = xPct + "%";
  el.style.top = yPct + "%";
  tokenLayer.appendChild(el);

  tokens.push({ id, xPct, yPct, team, data });
  pushUndo({ type: "place", id });
}

function restoreToken(t) {
  const el = createTokenElement(t.id, t.team, t.data);
  el.style.left = t.xPct + "%";
  el.style.top = t.yPct + "%";
  tokenLayer.appendChild(el);
  tokens.push(t);
}

function placeWave(xPct, yPct) {
  const team = currentTeam;
  const meleeIds = team === "blue" ? "melee-blue" : "melee-red";
  const caster = MINIONS.find(m => m.id === (team === "blue" ? "caster-blue" : "caster-red"));
  const melee = MINIONS.find(m => m.id === (team === "blue" ? "melee-blue" : "melee-red"));

  const offsets = [
    [-4, -2], [0, -3], [4, -2],
    [-3, 2], [3, 2],
    [0, 4],
  ];
  const kinds = [melee, melee, melee, caster, caster, caster];
  offsets.forEach(([dx, dy], i) => {
    const m = kinds[i];
    placeToken({ kind: "minion", id: m.id, label: m.label, emoji: m.emoji, color: m.color, team: m.team }, xPct + dx, yPct + dy);
  });
}

function attachTokenEvents(el, id) {
  el.addEventListener("dblclick", (e) => { e.stopPropagation(); removeToken(id, el); });
  el.addEventListener("contextmenu", (e) => { e.preventDefault(); e.stopPropagation(); removeToken(id, el); });

  el.addEventListener("pointerdown", (e) => {
    if (board.classList.contains("draw-mode")) return;
    e.stopPropagation();
    try { el.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    el.classList.add("dragging");

    function onMove(ev) {
      const rect = board.getBoundingClientRect();
      let xPct = ((ev.clientX - rect.left) / rect.width) * 100;
      let yPct = ((ev.clientY - rect.top) / rect.height) * 100;
      xPct = Math.max(0, Math.min(100, xPct));
      yPct = Math.max(0, Math.min(100, yPct));
      el.style.left = xPct + "%";
      el.style.top = yPct + "%";
      const t = tokens.find(t => t.id === id);
      if (t) { t.xPct = xPct; t.yPct = yPct; }
    }
    function onUp(ev) {
      el.classList.remove("dragging");
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
    }
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
  });
}

function removeToken(id, el) {
  const tokenData = tokens.find(t => t.id === id);
  el.remove();
  tokens = tokens.filter(t => t.id !== id);
  if (tokenData) pushUndo({ type: "remove", tokenData });
}

/* ===================== DRAWING ===================== */

const penColor = document.getElementById("penColor");
const penSize = document.getElementById("penSize");
let currentTool = "pen"; // pen | arrow | circle | text | eraser
let drawing = false;
let startPoint = null;
let strokeSnapshot = null;

document.querySelectorAll(".tool-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tool-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentTool = btn.dataset.tool;
  });
});

function canvasPos(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
}

function drawArrow(p0, p1) {
  const headLen = 12 + Number(penSize.value);
  const angle = Math.atan2(p1.y - p0.y, p1.x - p0.x);
  ctx.lineWidth = penSize.value;
  ctx.strokeStyle = penColor.value;
  ctx.fillStyle = penColor.value;
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.lineTo(p1.x, p1.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p1.x - headLen * Math.cos(angle - Math.PI / 6), p1.y - headLen * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(p1.x - headLen * Math.cos(angle + Math.PI / 6), p1.y - headLen * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
}

function drawZone(p0, p1) {
  const r = Math.hypot(p1.x - p0.x, p1.y - p0.y);
  ctx.fillStyle = penColor.value;
  ctx.strokeStyle = penColor.value;
  ctx.lineWidth = penSize.value;
  ctx.globalAlpha = 0.22;
  ctx.beginPath();
  ctx.arc(p0.x, p0.y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(p0.x, p0.y, r, 0, Math.PI * 2);
  ctx.stroke();
}

canvas.addEventListener("pointerdown", (e) => {
  const p = canvasPos(e);

  if (currentTool === "text") {
    const text = prompt("Texte à ajouter sur la carte :");
    if (text) {
      pushUndo({ type: "draw", before: ctx.getImageData(0, 0, canvas.width, canvas.height) });
      ctx.fillStyle = penColor.value;
      ctx.font = `bold ${16 + Number(penSize.value) * 3}px Segoe UI`;
      ctx.textBaseline = "top";
      ctx.fillText(text, p.x, p.y);
    }
    return;
  }

  drawing = true;
  startPoint = p;
  strokeSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
  pushUndo({ type: "draw", before: strokeSnapshot });
  try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* no active pointer session, safe to ignore */ }

  if (currentTool === "pen" || currentTool === "eraser") {
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  }
});

canvas.addEventListener("pointermove", (e) => {
  if (!drawing) return;
  const p = canvasPos(e);

  if (currentTool === "pen" || currentTool === "eraser") {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = currentTool === "eraser" ? penSize.value * 3 : penSize.value;
    ctx.globalCompositeOperation = currentTool === "eraser" ? "destination-out" : "source-over";
    ctx.strokeStyle = penColor.value;
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  } else if (currentTool === "arrow" || currentTool === "circle") {
    ctx.putImageData(strokeSnapshot, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    if (currentTool === "arrow") drawArrow(startPoint, p);
    else drawZone(startPoint, p);
  }
});

window.addEventListener("pointerup", () => { drawing = false; });

document.getElementById("clearDraw").addEventListener("click", () => {
  pushUndo({ type: "draw", before: ctx.getImageData(0, 0, canvas.width, canvas.height) });
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

/* ===================== ZOOM & PAN ===================== */

let zoom = 1, panX = 0, panY = 0;
const MIN_ZOOM = 0.5, MAX_ZOOM = 10;
const zoomLabel = document.getElementById("zoomLabel");

function applyTransform() {
  board.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
  zoomLabel.textContent = Math.round(zoom * 100) + "%";
}

function zoomAt(mx, my, factor) {
  const prevZoom = zoom;
  zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom * factor));
  panX = mx - (mx - panX) * (zoom / prevZoom);
  panY = my - (my - panY) * (zoom / prevZoom);
  applyTransform();
}

boardViewport.addEventListener("wheel", (e) => {
  e.preventDefault();
  const rect = boardViewport.getBoundingClientRect();
  zoomAt(e.clientX - rect.left, e.clientY - rect.top, e.deltaY < 0 ? 1.12 : 0.89);
}, { passive: false });

document.getElementById("zoomIn").addEventListener("click", () => {
  const rect = boardViewport.getBoundingClientRect();
  zoomAt(rect.width / 2, rect.height / 2, 1.2);
});
document.getElementById("zoomOut").addEventListener("click", () => {
  const rect = boardViewport.getBoundingClientRect();
  zoomAt(rect.width / 2, rect.height / 2, 0.8);
});
document.getElementById("zoomReset").addEventListener("click", () => {
  zoom = 1; panX = 0; panY = 0;
  applyTransform();
});

let panning = false;
let panStart = { x: 0, y: 0 };

boardViewport.addEventListener("pointerdown", (e) => {
  if (board.classList.contains("draw-mode")) return;
  if (armed) return;
  if (e.target.closest(".token")) return;
  panning = true;
  panMoved = false;
  panStart = { x: e.clientX, y: e.clientY };
  try { boardViewport.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
});

boardViewport.addEventListener("pointermove", (e) => {
  if (!panning) return;
  const dx = e.clientX - panStart.x;
  const dy = e.clientY - panStart.y;
  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
    panMoved = true;
    boardViewport.classList.add("panning");
    panX += dx;
    panY += dy;
    panStart = { x: e.clientX, y: e.clientY };
    applyTransform();
  }
});

boardViewport.addEventListener("pointerup", () => {
  panning = false;
  boardViewport.classList.remove("panning");
});

/* ===================== GAME CLOCK ===================== */

let clockSeconds = 0;
let clockInterval = null;
const clockLabel = document.getElementById("clockLabel");
const clockToggle = document.getElementById("clockToggle");

function renderClock() {
  const m = String(Math.floor(clockSeconds / 60)).padStart(2, "0");
  const s = String(clockSeconds % 60).padStart(2, "0");
  clockLabel.textContent = `${m}:${s}`;
}

clockToggle.addEventListener("click", () => {
  if (clockInterval) {
    clearInterval(clockInterval);
    clockInterval = null;
    clockToggle.textContent = "▶️";
  } else {
    clockInterval = setInterval(() => { clockSeconds++; renderClock(); }, 1000);
    clockToggle.textContent = "⏸️";
  }
});

document.getElementById("clockReset").addEventListener("click", () => {
  clockSeconds = 0;
  renderClock();
});

/* ===================== EXPORT PNG ===================== */

document.getElementById("exportBoard").addEventListener("click", () => {
  const out = document.createElement("canvas");
  out.width = 900;
  out.height = 900;
  const octx = out.getContext("2d");

  const finish = () => {
    try {
      const url = out.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "lol-coach-board.png";
      a.click();
    } catch (err) {
      console.error(err);
      alert("Export impossible (une image bloque l'export pour raison de sécurité navigateur). Utilise une capture d'écran à la place.");
    }
  };

  const mapImgEl = document.getElementById("mapImg");
  octx.drawImage(mapImgEl, 0, 0, 900, 900);

  const tokenImages = tokens.filter(t => t.data.img);
  let pending = tokenImages.length;

  function drawAllTokensAndFinish() {
    tokens.forEach(t => {
      const px = (t.xPct / 100) * 900;
      const py = (t.yPct / 100) * 900;
      const size = t.data.kind === "minion" ? 22 : 40;
      octx.save();
      octx.beginPath();
      octx.arc(px, py, size / 2, 0, Math.PI * 2);
      octx.closePath();
      octx.clip();
      if (t.data.img && t._loadedImg) {
        octx.drawImage(t._loadedImg, px - size / 2, py - size / 2, size, size);
      } else if (!t.data.img) {
        octx.fillStyle = t.data.color || "#444";
        octx.fillRect(px - size / 2, py - size / 2, size, size);
        octx.font = `${size * 0.6}px sans-serif`;
        octx.textAlign = "center";
        octx.textBaseline = "middle";
        octx.fillStyle = "#fff";
        octx.fillText(t.data.emoji || "", px, py);
      }
      octx.restore();
      octx.lineWidth = 3;
      octx.strokeStyle = t.team === "blue" ? "#3fa0ff" : t.team === "red" ? "#ff5555" : "#c8aa6e";
      octx.beginPath();
      octx.arc(px, py, size / 2, 0, Math.PI * 2);
      octx.stroke();
    });
    octx.drawImage(canvas, 0, 0);
    finish();
  }

  if (pending === 0) {
    drawAllTokensAndFinish();
  } else {
    tokenImages.forEach(t => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => { t._loadedImg = img; pending--; if (pending === 0) drawAllTokensAndFinish(); };
      img.onerror = () => { pending--; if (pending === 0) drawAllTokensAndFinish(); };
      img.src = t.data.img;
    });
  }
});

/* ===================== BOARD ACTIONS ===================== */

document.getElementById("clearAll").addEventListener("click", () => {
  if (!confirm("Tout effacer (jetons + dessin) ?")) return;
  tokens = [];
  tokenLayer.innerHTML = "";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  undoStack = [];
});

document.getElementById("saveBoard").addEventListener("click", () => {
  const payload = {
    tokens: tokens.map(t => ({ xPct: t.xPct, yPct: t.yPct, team: t.team, data: t.data })),
    drawing: canvas.toDataURL(),
  };
  localStorage.setItem("lolCoachBoard", JSON.stringify(payload));
  alert("Tableau sauvegardé !");
});

document.getElementById("loadBoard").addEventListener("click", () => {
  const raw = localStorage.getItem("lolCoachBoard");
  if (!raw) { alert("Aucune sauvegarde trouvée."); return; }
  const payload = JSON.parse(raw);

  tokens = [];
  tokenLayer.innerHTML = "";
  undoStack = [];
  payload.tokens.forEach(t => {
    const id = tokenSeq++;
    restoreToken({ id, xPct: t.xPct, yPct: t.yPct, team: t.team, data: t.data });
  });

  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
  img.src = payload.drawing;
});
