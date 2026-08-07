const DDRAGON = "https://ddragon.leagueoflegends.com";
const CDRAGON_RUNES = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perks.json";

let state = {
  version: null,
  champions: [],
  items: {},
  spells: [],
  runeTrees: [],
};

const el = (id) => document.getElementById(id);

async function loadData() {
  el("loading").classList.remove("hidden");

  const versions = await fetch(`${DDRAGON}/api/versions.json`).then(r => r.json());
  const version = versions[0];
  state.version = version;

  const [champData, itemData, spellData, runeData] = await Promise.all([
    fetch(`${DDRAGON}/cdn/${version}/data/fr_FR/champion.json`).then(r => r.json()),
    fetch(`${DDRAGON}/cdn/${version}/data/fr_FR/item.json`).then(r => r.json()),
    fetch(`${DDRAGON}/cdn/${version}/data/fr_FR/summoner.json`).then(r => r.json()),
    fetch(`${DDRAGON}/cdn/${version}/data/fr_FR/runesReforged.json`).then(r => r.json()),
  ]);

  state.champions = Object.values(champData.data);
  state.items = itemData.data;
  state.spells = Object.values(spellData.data).filter(s =>
    s.modes && s.modes.includes("CLASSIC")
  );
  state.runeTrees = runeData;

  el("loading").classList.add("hidden");
  el("result").classList.remove("hidden");
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN(arr, n) {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

const ROLE_TAG_MAP = {
  Top: ["Fighter", "Tank"],
  Jungle: ["Fighter", "Assassin", "Tank"],
  Mid: ["Mage", "Assassin"],
  ADC: ["Marksman"],
  Support: ["Support", "Mage", "Tank"],
};

function pickChampion() {
  let pool = state.champions;
  if (el("lockRole").checked) {
    const role = el("roleSelect").value;
    const tags = ROLE_TAG_MAP[role] || [];
    const filtered = pool.filter(c => c.tags.some(t => tags.includes(t)));
    if (filtered.length > 0) pool = filtered;
  }
  return pickRandom(pool);
}

function isFinalItem(it) {
  // "into" lists the items this one builds into; a final item has none.
  return !it.into || it.into.length === 0;
}

function buildableItems() {
  return Object.entries(state.items)
    .filter(([id, it]) => {
      if (!it.gold || !it.gold.purchasable) return false;
      if (it.consumed) return false;
      if (it.requiredChampion) return false;
      if (!it.maps || !it.maps["11"]) return false;
      if (it.tags && it.tags.includes("Trinket")) return false;
      if (it.tags && it.tags.includes("Boots")) return false;
      if (!isFinalItem(it)) return false;
      return it.gold.total >= 1000;
    })
    .map(([id, it]) => ({ id, ...it }));
}

function bootsItems() {
  return Object.entries(state.items)
    .filter(([id, it]) =>
      it.tags && it.tags.includes("Boots") &&
      it.gold && it.gold.purchasable &&
      it.maps && it.maps["11"] &&
      isFinalItem(it)
    )
    .map(([id, it]) => ({ id, ...it }));
}

function pickBuild() {
  const boots = pickRandom(bootsItems());
  const others = pickN(buildableItems(), 5);
  return [boots, ...others];
}

function pickSpells() {
  return pickN(state.spells, 2);
}

function pickRunes() {
  const [primaryTree, secondaryTree] = pickN(state.runeTrees, 2);

  const keystone = pickRandom(primaryTree.slots[0].runes);
  const primaryPicks = [keystone];
  for (let i = 1; i < primaryTree.slots.length; i++) {
    primaryPicks.push(pickRandom(primaryTree.slots[i].runes));
  }

  const secondarySlotIndexes = pickN([1, 2, 3], 2);
  const secondaryPicks = secondarySlotIndexes.map(i =>
    pickRandom(secondaryTree.slots[i].runes)
  );

  return { primaryTree, secondaryTree, keystone, primaryPicks, secondaryPicks };
}

function iconUrl(iconPath) {
  return `${DDRAGON}/cdn/img/${iconPath}`;
}

function render(champion, spells, runes, build) {
  el("champSplash").src = `${DDRAGON}/cdn/img/champion/splash/${champion.id}_0.jpg`;
  el("champIcon").src = `${DDRAGON}/cdn/${state.version}/img/champion/${champion.image.full}`;
  el("champName").textContent = champion.name;
  el("champTitle").textContent = champion.title;

  el("spells").innerHTML = spells.map(s => `
    <img src="${DDRAGON}/cdn/${state.version}/img/spell/${s.image.full}" title="${s.name}" alt="${s.name}">
  `).join("");

  const runesHtml = `
    <div class="rune-line keystone">
      <img src="${iconUrl(runes.keystone.icon)}" alt="">
      <span><b>${runes.keystone.name}</b></span>
    </div>
    ${runes.primaryPicks.slice(1).map(r => `
      <div class="rune-line">
        <img src="${iconUrl(r.icon)}" alt="">
        <span>${r.name}</span>
      </div>
    `).join("")}
    <div class="rune-tree-label">Secondaire : ${runes.secondaryTree.name}</div>
    ${runes.secondaryPicks.map(r => `
      <div class="rune-line">
        <img src="${iconUrl(r.icon)}" alt="">
        <span>${r.name}</span>
      </div>
    `).join("")}
  `;
  el("runes").innerHTML = runesHtml;

  el("build").innerHTML = build.map(it => `
    <div class="item-slot" title="${it.name}">
      <img src="${DDRAGON}/cdn/${state.version}/img/item/${it.image.full}" alt="${it.name}">
    </div>
  `).join("");
}

async function roll() {
  if (!state.version) {
    await loadData();
  }
  const champion = pickChampion();
  const spells = pickSpells();
  const runes = pickRunes();
  const build = pickBuild();
  render(champion, spells, runes, build);
}

el("rollBtn").addEventListener("click", roll);
el("lockRole").addEventListener("change", () => {
  el("roleSelect").disabled = !el("lockRole").checked;
});

loadData().then(roll);
