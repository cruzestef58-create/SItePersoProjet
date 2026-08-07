import * as THREE from 'three';

// ── DOM ──────────────────────────────────────────────────────────────────────
const canvas     = document.getElementById('scene');
const hud        = document.getElementById('hud');
const menu       = document.getElementById('menu');
const winScreen  = document.getElementById('win');
const loading    = document.getElementById('loading');
const playBtn    = document.getElementById('playBtn');
const replayBtn  = document.getElementById('replayBtn');
const muteBtn    = document.getElementById('muteBtn');
const banner     = document.getElementById('banner');
const elTimer    = document.getElementById('timer');
const elCoins    = document.getElementById('coins');
const elCoinsTot = document.getElementById('coinsTotal');
const elRings    = document.getElementById('rings');
const elRingsTot = document.getElementById('ringsTotal');
const elCp       = document.getElementById('checkpoint');
const elWinTime  = document.getElementById('winTime');
const elWinCoins = document.getElementById('winCoins');
const elWinRings = document.getElementById('winRings');
const elWinRank  = document.getElementById('winRank');

// ── Renderer & Scene ─────────────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0x87ceeb);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xb0d4f1, 80, 350);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(0, 8, 14);

// ── Lighting ─────────────────────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0x8899bb, 0.6));
const sun = new THREE.DirectionalLight(0xfff5e0, 1.2);
sun.position.set(40, 80, 30);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 200;
sun.shadow.camera.left = -80;
sun.shadow.camera.right = 80;
sun.shadow.camera.top = 80;
sun.shadow.camera.bottom = -80;
scene.add(sun);

// ── Sky dome ─────────────────────────────────────────────────────────────────
const skyGeo = new THREE.SphereGeometry(400, 32, 16);
const skyMat = new THREE.MeshBasicMaterial({
  color: 0x6eb5ff,
  side: THREE.BackSide,
});
scene.add(new THREE.Mesh(skyGeo, skyMat));

// Clouds
const cloudGroup = new THREE.Group();
for (let i = 0; i < 60; i++) {
  const g = new THREE.Group();
  const n = 3 + Math.floor(Math.random() * 4);
  for (let j = 0; j < n; j++) {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(2 + Math.random() * 3, 8, 6),
      new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 })
    );
    m.position.set((Math.random() - 0.5) * 8, Math.random() * 2, (Math.random() - 0.5) * 6);
    g.add(m);
  }
  g.position.set(
    (Math.random() - 0.5) * 300,
    -20 - Math.random() * 60,
    (Math.random() - 0.5) * 200
  );
  cloudGroup.add(g);
}
scene.add(cloudGroup);

// ── Materials ────────────────────────────────────────────────────────────────
const mats = {
  grass:  new THREE.MeshLambertMaterial({ color: 0x4caf50 }),
  stone:  new THREE.MeshLambertMaterial({ color: 0x78909c }),
  ice:    new THREE.MeshLambertMaterial({ color: 0xb3e5fc }),
  lava:   new THREE.MeshLambertMaterial({ color: 0xff5722 }),
  gold:   new THREE.MeshLambertMaterial({ color: 0xffd54f, emissive: 0xffa000, emissiveIntensity: 0.3 }),
  wood:   new THREE.MeshLambertMaterial({ color: 0x8d6e63 }),
  player: new THREE.MeshLambertMaterial({ color: 0x42a5f5 }),
  spike:  new THREE.MeshLambertMaterial({ color: 0xe53935 }),
  star:   new THREE.MeshStandardMaterial({ color: 0xffeb3b, emissive: 0xffc107, emissiveIntensity: 0.8, metalness: 0.4, roughness: 0.3 }),
  ring:   new THREE.MeshStandardMaterial({ color: 0xffd54f, emissive: 0xffa000, emissiveIntensity: 0.5, metalness: 0.6, roughness: 0.2, side: THREE.DoubleSide }),
};

// ── Level data ─────────────────────────────────────────────────────────────────
const platforms = [];
const stars = [];
const rings = [];
const hazards = [];
const checkpointData = [];

function addPlatform(x, y, z, w, h, d, mat, name) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.platform = true;
  scene.add(mesh);
  platforms.push({ mesh, hw: w / 2, hh: h / 2, hd: d / 2 });
  return mesh;
}

function addStar(x, y, z) {
  const geo = new THREE.OctahedronGeometry(0.5, 0);
  const mesh = new THREE.Mesh(geo, mats.star);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  scene.add(mesh);
  stars.push({ mesh, collected: false, baseY: y });
}

function addRing(x, y, z, passed = false) {
  const geo = new THREE.TorusGeometry(1.8, 0.15, 8, 24);
  const mesh = new THREE.Mesh(geo, mats.ring);
  mesh.position.set(x, y, z);
  mesh.rotation.x = Math.PI / 2;
  scene.add(mesh);
  rings.push({ mesh, passed, baseY: y });
}

function addHazard(x, y, z, radius = 0.7) {
  const geo = new THREE.IcosahedronGeometry(radius, 1);
  const mesh = new THREE.Mesh(geo, mats.spike);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  scene.add(mesh);
  hazards.push({ mesh, radius, baseY: y, angle: Math.random() * Math.PI * 2 });
}

function addCheckpoint(x, y, z, name) {
  checkpointData.push({ x, y: y + 2, z, name });
}

// ── Build 5 worlds ───────────────────────────────────────────────────────────
function buildLevel() {
  // World 1 — Départ (green)
  addPlatform(0, 0, 0, 12, 1, 12, mats.grass, 'Départ');
  addCheckpoint(0, 0, 0, 'Départ');
  addStar(-3, 2, -2); addStar(3, 2, 2); addStar(0, 2, -4);
  addRing(0, 3, 8);
  addPlatform(0, 0, 14, 8, 1, 8, mats.grass);
  addPlatform(0, 1, 24, 6, 1, 6, mats.grass);
  addStar(0, 3, 24);
  addHazard(3, 2, 20);

  // World 2 — Pierres
  addPlatform(0, 2, 34, 10, 1, 10, mats.stone);
  addCheckpoint(0, 2, 34, 'Roche');
  addStar(-2, 4, 32); addStar(2, 4, 36); addStar(0, 4, 38);
  addRing(0, 5, 42);
  addPlatform(-5, 3, 48, 5, 1, 5, mats.stone);
  addPlatform(5, 4, 52, 5, 1, 5, mats.stone);
  addPlatform(0, 5, 58, 8, 1, 8, mats.stone);
  addHazard(-5, 5, 48); addHazard(5, 6, 52);

  // World 3 — Glace
  addPlatform(0, 6, 68, 12, 1, 6, mats.ice);
  addCheckpoint(0, 6, 68, 'Glace');
  addStar(-4, 8, 66); addStar(4, 8, 70); addStar(0, 8, 72);
  addRing(0, 9, 76);
  addPlatform(-6, 7, 82, 4, 1, 4, mats.ice);
  addPlatform(0, 8, 88, 4, 1, 4, mats.ice);
  addPlatform(6, 9, 94, 4, 1, 4, mats.ice);
  addPlatform(0, 10, 100, 8, 1, 8, mats.ice);
  addHazard(0, 12, 88);

  // World 4 — Lave
  addPlatform(0, 11, 112, 10, 1, 10, mats.lava);
  addCheckpoint(0, 11, 112, 'Lave');
  addStar(-3, 13, 110); addStar(3, 13, 114); addStar(0, 13, 118);
  addRing(0, 14, 122);
  addPlatform(-8, 12, 128, 5, 1, 5, mats.wood);
  addPlatform(0, 13, 134, 5, 1, 5, mats.wood);
  addPlatform(8, 14, 140, 5, 1, 5, mats.wood);
  addPlatform(0, 15, 148, 10, 1, 10, mats.lava);
  addHazard(-8, 14, 128); addHazard(8, 16, 140); addHazard(0, 17, 144);

  // World 5 — Sommet doré
  addPlatform(0, 16, 160, 8, 1, 8, mats.gold);
  addCheckpoint(0, 16, 160, 'Nuages');
  addStar(-2, 18, 158); addStar(2, 18, 162);
  addRing(0, 19, 168);
  addPlatform(0, 17, 176, 6, 1, 6, mats.gold);
  addPlatform(0, 18, 184, 14, 2, 14, mats.gold);
  addCheckpoint(0, 18, 184, 'Sommet');
  addStar(-4, 21, 182); addStar(0, 22, 184); addStar(4, 21, 186);
  addRing(0, 21, 184, false);
}

buildLevel();

// Update totals in HUD
elCoinsTot.textContent = stars.length;
elRingsTot.textContent = rings.length;

// ── Player ───────────────────────────────────────────────────────────────────
const playerGroup = new THREE.Group();
const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.6), mats.player);
body.position.y = 0.6;
body.castShadow = true;
playerGroup.add(body);
const head = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), new THREE.MeshLambertMaterial({ color: 0xffcc80 }));
head.position.y = 1.5;
head.castShadow = true;
playerGroup.add(head);
scene.add(playerGroup);

const PLAYER = {
  pos: new THREE.Vector3(0, 3, 0),
  vel: new THREE.Vector3(),
  radius: 0.4,
  height: 1.8,
  onGround: false,
  jumpsLeft: 2,
  speed: 9,
  sprintMult: 1.65,
  jumpForce: 11,
  gravity: -28,
};

let spawnPoint = new THREE.Vector3(0, 3, 0);
let currentCpName = 'Départ';
let lastCpIndex = 0;

// ── Input ────────────────────────────────────────────────────────────────────
const keys = {};
let pointerLocked = false;
let camYaw = 0;
let camPitch = 0.3;
let muted = false;
let playing = false;
let won = false;

document.addEventListener('keydown', e => {
  keys[e.code] = true;
  if (e.code === 'KeyR' && playing) respawn();
  if (e.code === 'KeyM') toggleMute();
});
document.addEventListener('keyup', e => { keys[e.code] = false; });

canvas.addEventListener('click', () => {
  if (playing && !won) canvas.requestPointerLock();
});

document.addEventListener('pointerlockchange', () => {
  pointerLocked = document.pointerLockElement === canvas;
});

document.addEventListener('mousemove', e => {
  if (!pointerLocked) return;
  camYaw   -= e.movementX * 0.002;
  camPitch -= e.movementY * 0.002;
  camPitch = Math.max(-0.3, Math.min(1.2, camPitch));
});

// ── Audio (simple beeps) ─────────────────────────────────────────────────────
let audioCtx = null;
function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}
function beep(freq, dur, vol = 0.15) {
  if (muted || !audioCtx) return;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.connect(g); g.connect(audioCtx.destination);
  o.frequency.value = freq;
  g.gain.setValueAtTime(vol, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
  o.start(); o.stop(audioCtx.currentTime + dur);
}
function toggleMute() {
  muted = !muted;
  muteBtn.textContent = muted ? '🔇' : '🔊';
}

// ── Game state ───────────────────────────────────────────────────────────────
let coins = 0;
let ringsPassed = 0;
let startTime = 0;
let elapsed = 0;

function showBanner(text, dur = 2000) {
  banner.textContent = text;
  banner.classList.add('show');
  setTimeout(() => banner.classList.remove('show'), dur);
}

function respawn() {
  PLAYER.pos.copy(spawnPoint);
  PLAYER.vel.set(0, 0, 0);
  PLAYER.jumpsLeft = 2;
  showBanner('Respawn !');
  beep(200, 0.2);
}

function updateCheckpoint(idx) {
  if (idx <= lastCpIndex) return;
  lastCpIndex = idx;
  const cp = checkpointData[idx];
  spawnPoint.set(cp.x, cp.y, cp.z);
  currentCpName = cp.name;
  elCp.textContent = cp.name;
  showBanner(`Checkpoint : ${cp.name}`);
  beep(440, 0.15);
  beep(660, 0.15);
}

// ── Physics helpers ──────────────────────────────────────────────────────────
function getMoveInput() {
  let fx = 0, fz = 0;
  if (keys['KeyW'] || keys['KeyZ'] || keys['ArrowUp'])    fz -= 1;
  if (keys['KeyS'] || keys['ArrowDown'])                   fz += 1;
  if (keys['KeyA'] || keys['KeyQ'] || keys['ArrowLeft'])  fx -= 1;
  if (keys['KeyD'] || keys['ArrowRight'])                  fx += 1;
  if (fx === 0 && fz === 0) return new THREE.Vector3();
  const len = Math.hypot(fx, fz);
  fx /= len; fz /= len;
  const dir = new THREE.Vector3(fx, 0, fz);
  dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), camYaw);
  return dir;
}

function collidePlatforms() {
  PLAYER.onGround = false;
  const px = PLAYER.pos.x, py = PLAYER.pos.y, pz = PLAYER.pos.z;
  const r = PLAYER.radius, h = PLAYER.height;

  for (const p of platforms) {
    const m = p.mesh;
    const bx = m.position.x, by = m.position.y, bz = m.position.z;
    const hw = p.hw, hh = p.hh, hd = p.hd;

    const dx = px - bx, dz = pz - bz;
    if (Math.abs(dx) > hw + r || Math.abs(dz) > hd + r) continue;

    const top = by + hh;
    const bottom = by - hh;
    const feet = py;
    const headY = py + h;

    if (PLAYER.vel.y <= 0 && feet >= top - 0.3 && feet <= top + 0.5 && headY > top) {
      PLAYER.pos.y = top;
      PLAYER.vel.y = 0;
      PLAYER.onGround = true;
      PLAYER.jumpsLeft = 2;
    } else if (PLAYER.vel.y > 0 && headY >= bottom && headY <= bottom + 0.3) {
      PLAYER.pos.y = bottom - h;
      PLAYER.vel.y = 0;
    }
  }
}

function checkFall() {
  if (PLAYER.pos.y < -30) respawn();
}

function checkStars() {
  for (const s of stars) {
    if (s.collected) continue;
    const d = PLAYER.pos.distanceTo(s.mesh.position);
    if (d < 1.5) {
      s.collected = true;
      s.mesh.visible = false;
      coins++;
      elCoins.textContent = coins;
      beep(880, 0.1);
      beep(1100, 0.1);
    }
  }
}

function checkRings() {
  for (const r of rings) {
    if (r.passed) continue;
    const d = PLAYER.pos.distanceTo(r.mesh.position);
    if (d < 2.5) {
      r.passed = true;
      r.mesh.material = new THREE.MeshStandardMaterial({ color: 0x4caf50, emissive: 0x2e7d32, emissiveIntensity: 0.4, side: THREE.DoubleSide });
      ringsPassed++;
      elRings.textContent = ringsPassed;
      beep(523, 0.1);
      beep(784, 0.15);
    }
  }
}

function checkHazards() {
  for (const h of hazards) {
    const d = PLAYER.pos.distanceTo(h.mesh.position);
    if (d < h.radius + PLAYER.radius + 0.2) {
      respawn();
      return;
    }
  }
}

function checkCheckpoints() {
  for (let i = 0; i < checkpointData.length; i++) {
    const cp = checkpointData[i];
    const d = Math.hypot(PLAYER.pos.x - cp.x, PLAYER.pos.z - cp.z);
    if (d < 5 && Math.abs(PLAYER.pos.y - cp.y) < 5) {
      updateCheckpoint(i);
    }
  }
}

function checkWin() {
  const summit = checkpointData[checkpointData.length - 1];
  const d = Math.hypot(PLAYER.pos.x - summit.x, PLAYER.pos.z - summit.z);
  if (d < 6 && PLAYER.pos.y > summit.y - 2 && !won) {
    won = true;
    playing = false;
    document.exitPointerLock();
    elapsed = (performance.now() - startTime) / 1000;
    elWinTime.textContent = elapsed.toFixed(2);
    elWinCoins.textContent = coins;
    elWinRings.textContent = ringsPassed;
    const pct = (coins / stars.length) * 0.5 + (ringsPassed / rings.length) * 0.5;
    if (pct >= 1)       elWinRank.textContent = '🌟 LÉGENDE DU CIEL — Parfait !';
    else if (pct >= 0.75) elWinRank.textContent = '⭐ Maître du parkour';
    else if (pct >= 0.5)  elWinRank.textContent = '✨ Bon grimpeur';
    else                  elWinRank.textContent = '🏔 Sommet atteint !';
    hud.classList.add('hidden');
    winScreen.classList.remove('hidden');
    beep(523, 0.15); beep(659, 0.15); beep(784, 0.15); beep(1047, 0.3);
  }
}

// ── Update loop ──────────────────────────────────────────────────────────────
const clock = new THREE.Clock();

function update() {
  if (!playing || won) return;
  const dt = Math.min(clock.getDelta(), 0.05);

  // Timer
  elapsed = (performance.now() - startTime) / 1000;
  elTimer.textContent = elapsed.toFixed(2);

  // Movement
  const move = getMoveInput();
  const sprint = keys['ShiftLeft'] || keys['ShiftRight'];
  const spd = PLAYER.speed * (sprint ? PLAYER.sprintMult : 1);
  PLAYER.vel.x = move.x * spd;
  PLAYER.vel.z = move.z * spd;

  // Jump
  if (keys['Space']) {
    if (PLAYER.onGround) {
      PLAYER.vel.y = PLAYER.jumpForce;
      PLAYER.onGround = false;
      PLAYER.jumpsLeft = 1;
    } else if (PLAYER.jumpsLeft > 0 && !keys._jumpHeld) {
      PLAYER.vel.y = PLAYER.jumpForce * 0.85;
      PLAYER.jumpsLeft = 0;
      beep(350, 0.08);
    }
  }
  keys._jumpHeld = keys['Space'];

  // Gravity
  if (!PLAYER.onGround) PLAYER.vel.y += PLAYER.gravity * dt;

  PLAYER.pos.x += PLAYER.vel.x * dt;
  PLAYER.pos.y += PLAYER.vel.y * dt;
  PLAYER.pos.z += PLAYER.vel.z * dt;

  collidePlatforms();
  checkFall();
  checkStars();
  checkRings();
  checkHazards();
  checkCheckpoints();
  checkWin();

  // Player mesh
  playerGroup.position.copy(PLAYER.pos);
  if (move.lengthSq() > 0) {
    const angle = Math.atan2(move.x, move.z);
    playerGroup.rotation.y = angle;
  }

  // Animate collectibles
  const t = performance.now() * 0.001;
  for (const s of stars) {
    if (!s.collected) {
      s.mesh.rotation.y += dt * 2;
      s.mesh.position.y = s.baseY + Math.sin(t * 2 + s.baseY) * 0.3;
    }
  }
  for (const r of rings) {
    r.mesh.rotation.z += dt;
    r.mesh.position.y = r.baseY + Math.sin(t * 1.5 + r.baseY) * 0.2;
  }
  for (const h of hazards) {
    h.angle += dt * 2;
    h.mesh.rotation.set(h.angle, h.angle * 0.7, 0);
    h.mesh.position.y = h.baseY + Math.sin(t * 3 + h.baseY) * 0.4;
  }

  // Camera
  const camDist = 10;
  const cx = PLAYER.pos.x + Math.sin(camYaw) * Math.cos(camPitch) * camDist;
  const cy = PLAYER.pos.y + 1.5 + Math.sin(camPitch) * camDist;
  const cz = PLAYER.pos.z + Math.cos(camYaw) * Math.cos(camPitch) * camDist;
  camera.position.lerp(new THREE.Vector3(cx, cy, cz), 0.12);
  camera.lookAt(PLAYER.pos.x, PLAYER.pos.y + 1.2, PLAYER.pos.z);
}

function render() {
  update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

// ── Start / Restart ──────────────────────────────────────────────────────────
function startGame() {
  ensureAudio();
  if (audioCtx?.state === 'suspended') audioCtx.resume();

  coins = 0; ringsPassed = 0; won = false; lastCpIndex = 0;
  currentCpName = 'Départ';
  spawnPoint.set(0, 3, 0);
  PLAYER.pos.set(0, 3, 0);
  PLAYER.vel.set(0, 0, 0);
  PLAYER.jumpsLeft = 2;

  for (const s of stars) { s.collected = false; s.mesh.visible = true; }
  for (const r of rings) {
    r.passed = false;
    r.mesh.material = mats.ring;
  }

  elCoins.textContent = '0';
  elRings.textContent = '0';
  elCp.textContent = 'Départ';
  elTimer.textContent = '0.00';

  menu.classList.add('hidden');
  winScreen.classList.add('hidden');
  hud.classList.remove('hidden');
  loading.classList.add('hidden');
  playing = true;
  startTime = performance.now();
  clock.getDelta();
  canvas.requestPointerLock();
}

playBtn.addEventListener('click', startGame);
replayBtn.addEventListener('click', startGame);
muteBtn.addEventListener('click', toggleMute);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Hide loading after init
setTimeout(() => loading.classList.add('hidden'), 600);
render();
