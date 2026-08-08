/* =========================================================================
   Tap Empire — Données statiques du jeu
   Ce fichier ne contient QUE des tableaux de configuration : aucune logique.
   Pour équilibrer le jeu ou ajouter du contenu, c'est ici et nulle part ailleurs.
   ========================================================================= */

/* -------------------------------------------------------------------------
   LES ÈRES
   mult    : multiplicateur de production global appliqué dès qu'on atteint l'ère
   icon    : le gros minerai/objet cliquable au centre (SVG en clair, pas de data-URI)
   palette : ambiance de couleurs injectée dans les variables CSS
   ------------------------------------------------------------------------- */
const ERAS = [
  {
    name: 'Âge de Pierre', mult: 1,
    accent: '#b9a88c', accentHover: '#d3c3a6', glow: 'rgba(185,168,140,.45)',
    beige: '#cdbfa8', beigeDark: '#8d7d64', bg: '#211d19', bg2: '#2f2a23',
    icon: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="er0" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#cfc6b6"/><stop offset="1" stop-color="#6e675c"/></linearGradient></defs>
      <polygon points="60,10 96,40 88,92 42,108 20,66 30,28" fill="url(#er0)" stroke="#2e2a24" stroke-width="3" stroke-linejoin="round"/>
      <polygon points="60,10 30,28 52,52 78,40" fill="#e6dfd2" opacity=".55"/>
      <polygon points="52,52 20,66 42,108 62,86" fill="#000" opacity=".18"/>
      <path d="M78 40 L88 92" stroke="#2e2a24" stroke-width="2.2" fill="none" opacity=".45"/>
    </svg>`
  },
  {
    name: 'Âge de Bronze', mult: 5,
    accent: '#cd7f32', accentHover: '#e0974a', glow: 'rgba(205,127,50,.5)',
    beige: '#d8b78f', beigeDark: '#a87c4a', bg: '#241a12', bg2: '#34261a',
    icon: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="er1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f0c089"/><stop offset="1" stop-color="#8c5a28"/></linearGradient></defs>
      <polygon points="42,42 78,42 90,58 30,58" fill="#f2cd9c" stroke="#4a2f12" stroke-width="3" stroke-linejoin="round"/>
      <polygon points="30,58 90,58 98,96 22,96" fill="url(#er1)" stroke="#4a2f12" stroke-width="3" stroke-linejoin="round"/>
      <polygon points="38,62 50,62 42,92 30,92" fill="#ffffff" opacity=".22"/>
      <polygon points="52,45 70,45 76,55 58,55" fill="#ffffff" opacity=".25"/>
    </svg>`
  },
  {
    name: 'Âge de Fer', mult: 25,
    accent: '#8fa3b0', accentHover: '#aebfca', glow: 'rgba(143,163,176,.45)',
    beige: '#b9c4cc', beigeDark: '#6c7884', bg: '#181b1e', bg2: '#23282d',
    icon: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="er2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#c2ccd4"/><stop offset="1" stop-color="#5e6b75"/></linearGradient></defs>
      <g fill="url(#er2)" stroke="#2b3238" stroke-width="3" stroke-linejoin="round">
        <polygon points="94,42 116,50 94,58"/>
        <rect x="20" y="38" width="74" height="22" rx="6"/>
        <polygon points="48,60 76,60 68,78 88,78 88,98 36,98 36,78 56,78"/>
      </g>
      <rect x="26" y="43" width="44" height="6" rx="3" fill="#ffffff" opacity=".3"/>
    </svg>`
  },
  {
    name: 'Antiquité', mult: 125,
    accent: '#d9c074', accentHover: '#ecd488', glow: 'rgba(217,192,116,.45)',
    beige: '#e6dcb8', beigeDark: '#b0a05c', bg: '#1d1b12', bg2: '#2b281a',
    icon: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#4a3f2e" stroke-width="3" stroke-linejoin="round">
        <rect x="28" y="18" width="64" height="11" rx="2" fill="#ece4d3"/>
        <rect x="36" y="29" width="48" height="9"  fill="#ddd2bb"/>
        <rect x="42" y="38" width="36" height="62" fill="#ece4d3"/>
        <rect x="36" y="100" width="48" height="9" fill="#ddd2bb"/>
      </g>
      <g stroke="#c9bfa8" stroke-width="2.4" stroke-linecap="round" opacity=".85">
        <line x1="50" y1="43" x2="50" y2="95"/><line x1="60" y1="43" x2="60" y2="95"/><line x1="70" y1="43" x2="70" y2="95"/>
      </g>
      <rect x="72" y="38" width="6" height="62" fill="#000" opacity=".12"/>
    </svg>`
  },
  {
    name: 'Moyen Âge', mult: 625,
    accent: '#7f9ecf', accentHover: '#9bb6e0', glow: 'rgba(127,158,207,.45)',
    beige: '#c3d0e2', beigeDark: '#5a6f96', bg: '#14171f', bg2: '#1e2330',
    icon: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <path d="M60 12 L92 24 v34 c0 24-16 38-32 46 -16-8-32-22-32-46V24Z" fill="#7f9ecf" stroke="#26314a" stroke-width="3" stroke-linejoin="round"/>
      <path d="M60 12 L28 24 v34 c0 24 16 38 32 46Z" fill="#000" opacity=".16"/>
      <rect x="55" y="26" width="10" height="52" rx="4" fill="#e8eef7" stroke="#26314a" stroke-width="2.6"/>
      <rect x="42" y="50" width="36" height="8" rx="3" fill="#d9b25e" stroke="#26314a" stroke-width="2.6"/>
      <rect x="56" y="78" width="8" height="12" rx="3" fill="#8a5a30" stroke="#26314a" stroke-width="2.4"/>
    </svg>`
  },
  {
    name: 'Renaissance', mult: 3125,
    accent: '#c98bb8', accentHover: '#dda4cb', glow: 'rgba(201,139,184,.45)',
    beige: '#e3c9dc', beigeDark: '#96628a', bg: '#1c141c', bg2: '#2a1f2b',
    icon: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <path d="M60 38 C48 30 32 30 20 36 v50 c12-6 28-6 40 2Z" fill="#f0e6d6" stroke="#3a2f25" stroke-width="3" stroke-linejoin="round"/>
      <path d="M60 38 C72 30 88 30 100 36 v50 c-12-6-28-6-40 2Z" fill="#e2d5c0" stroke="#3a2f25" stroke-width="3" stroke-linejoin="round"/>
      <line x1="60" y1="38" x2="60" y2="88" stroke="#3a2f25" stroke-width="3"/>
      <g stroke="#b6a68c" stroke-width="2.4" stroke-linecap="round">
        <line x1="28" y1="48" x2="50" y2="50"/><line x1="28" y1="58" x2="50" y2="60"/>
        <line x1="70" y1="50" x2="92" y2="48"/><line x1="70" y1="60" x2="92" y2="58"/>
      </g>
      <path d="M86 16 c10 8 11 22 3 32 -6-11-13-15-21-17 6-8 11-12 18-15Z" fill="#c98bb8" stroke="#3a2f25" stroke-width="2.6" stroke-linejoin="round"/>
    </svg>`
  },
  {
    name: 'Ère Industrielle', mult: 15625,
    accent: '#c0712f', accentHover: '#d98c46', glow: 'rgba(192,113,47,.5)',
    beige: '#c9a98c', beigeDark: '#8a6038', bg: '#161310', bg2: '#221c16',
    icon: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="er6" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#c2ccd4"/><stop offset="1" stop-color="#6c7884"/></linearGradient></defs>
      <polygon points="106,60 94.2,74.2 92.5,92.5 74.2,94.2 60,106 45.8,94.2 27.5,92.5 25.8,74.2 14,60 25.8,45.8 27.5,27.5 45.8,25.8 60,14 74.2,25.8 92.5,27.5 94.2,45.8"
        fill="url(#er6)" stroke="#3a444c" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="60" cy="60" r="22" fill="#525e67" stroke="#3a444c" stroke-width="3"/>
      <circle cx="60" cy="60" r="12" fill="#2c3236" stroke="#3a444c" stroke-width="2.4"/>
      <path d="M42 46 A22 22 0 0 1 76 42" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity=".3"/>
    </svg>`
  },
  {
    name: 'Ère Électrique', mult: 78125,
    accent: '#f2c744', accentHover: '#ffdc6a', glow: 'rgba(242,199,68,.5)',
    beige: '#ecdca4', beigeDark: '#b08f2c', bg: '#14140e', bg2: '#1f1f14',
    icon: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs><radialGradient id="er7" cx=".45" cy=".38" r=".65">
        <stop offset="0" stop-color="#fff8d4"/><stop offset="1" stop-color="#f2c744"/></radialGradient></defs>
      <circle cx="60" cy="48" r="31" fill="url(#er7)" stroke="#5a4a12" stroke-width="3"/>
      <g fill="#9aa2a8" stroke="#3a3f44" stroke-width="2.6" stroke-linejoin="round">
        <rect x="45" y="76" width="30" height="8" rx="2"/>
        <rect x="47" y="87" width="26" height="7" rx="2"/>
        <path d="M51 97 h18 v6 a5 5 0 0 1 -5 5 h-8 a5 5 0 0 1 -5 -5Z"/>
      </g>
      <path d="M50 44 q10 16 20 0" fill="none" stroke="#c08a12" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M42 34 a22 22 0 0 1 20 -11" fill="none" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" opacity=".55"/>
    </svg>`
  },
  {
    name: 'Ère Spatiale', mult: 390625,
    accent: '#7fd6ff', accentHover: '#a5e4ff', glow: 'rgba(127,214,255,.5)',
    beige: '#bfe6f5', beigeDark: '#4a90ad', bg: '#0d1018', bg2: '#151b28',
    icon: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="er8" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#f2f9fd"/><stop offset="1" stop-color="#9fc3d4"/></linearGradient></defs>
      <path d="M60 8 c17 15 26 34 26 55 0 10-2 18-6 25H40c-4-7-6-15-6-25 0-21 9-40 26-55Z"
        fill="url(#er8)" stroke="#26404f" stroke-width="3" stroke-linejoin="round"/>
      <path d="M34 66 L16 90 l20-7Z" fill="#cf4a3f" stroke="#26404f" stroke-width="3" stroke-linejoin="round"/>
      <path d="M86 66 L104 90 l-20-7Z" fill="#cf4a3f" stroke="#26404f" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="60" cy="46" r="12" fill="#7fd6ff" stroke="#26404f" stroke-width="3"/>
      <circle cx="55" cy="42" r="4" fill="#ffffff" opacity=".7"/>
      <path d="M47 88 h26 l-7 24 -6-11 -6 11Z" fill="#f2a33c" stroke="#26404f" stroke-width="2.6" stroke-linejoin="round"/>
    </svg>`
  }
];

/* Coût pour passer de l'ère i à l'ère i+1 — longueur = ERAS.length - 1 */
const EVOLVE_COSTS = [
  6e3, 1.6e6, 4.5e8, 1.25e11, 3.5e13, 9.5e15, 2.5e18, 7e20
];

/* -------------------------------------------------------------------------
   LES BÂTIMENTS (production passive)
   era    : ère à partir de laquelle le bâtiment apparaît
   base   : coût du 1er exemplaire (le coût est ensuite ×1.15 à chaque achat)
   pps    : points par seconde apportés par exemplaire, AVANT multiplicateurs
   ------------------------------------------------------------------------- */
const BUY_GROWTH = 1.15;

const BUILDINGS = [
  // --- Âge de Pierre ---
  { id: 'cueilleurs', era: 0, icon: '🌿', name: 'Hutte de Cueilleurs',      base: 15,      pps: 0.2 },
  { id: 'champis',    era: 0, icon: '🍄', name: 'Ramasseurs de Champignons', base: 100,     pps: 1.2 },
  { id: 'feu',        era: 0, icon: '🔥', name: 'Feu de Camp',              base: 650,     pps: 7 },
  // --- Âge de Bronze ---
  { id: 'cuivre',     era: 1, icon: '⛏️', name: 'Mine de Cuivre',           base: 4.2e3,   pps: 43 },
  { id: 'fonderie',   era: 1, icon: '🏭', name: 'Fonderie de Bronze',       base: 2.7e4,   pps: 260 },
  { id: 'potier',     era: 1, icon: '🏺', name: 'Atelier de Potier',        base: 1.75e5,  pps: 1.55e3 },
  // --- Âge de Fer ---
  { id: 'forge',      era: 2, icon: '⚒️', name: 'Forge de Fer',             base: 1.1e6,   pps: 9.3e3 },
  { id: 'caserne',    era: 2, icon: '🛡️', name: 'Caserne',                  base: 7.4e6,   pps: 5.6e4 },
  { id: 'moulin',     era: 2, icon: '🌾', name: 'Moulin à Grain',           base: 4.8e7,   pps: 3.35e5 },
  // --- Antiquité ---
  { id: 'marche',     era: 3, icon: '🏪', name: 'Marché',                   base: 3.1e8,   pps: 2e6 },
  { id: 'temple',     era: 3, icon: '🏛️', name: 'Temple',                   base: 2e9,     pps: 1.2e7 },
  { id: 'biblio',     era: 3, icon: '📜', name: 'Grande Bibliothèque',      base: 1.3e10,  pps: 7.3e7 },
  // --- Moyen Âge ---
  { id: 'chateau',    era: 4, icon: '🏰', name: 'Château Fort',             base: 8.5e10,  pps: 4.37e8 },
  { id: 'cathedrale', era: 4, icon: '⛪', name: 'Cathédrale',               base: 5.5e11,  pps: 2.6e9 },
  { id: 'guilde',     era: 4, icon: '⚔️', name: 'Guilde de Mercenaires',    base: 3.6e12,  pps: 1.57e10 },
  // --- Renaissance ---
  { id: 'imprimerie', era: 5, icon: '🖨️', name: 'Imprimerie',               base: 2.3e13,  pps: 9.4e10 },
  { id: 'atelier',    era: 5, icon: '🎨', name: "Atelier d'Artiste",        base: 1.5e14,  pps: 5.7e11 },
  { id: 'galion',     era: 5, icon: '⛵', name: 'Galion Marchand',          base: 9.8e14,  pps: 3.4e12 },
  // --- Ère Industrielle ---
  { id: 'usine',      era: 6, icon: '🏗️', name: 'Usine à Vapeur',           base: 6.4e15,  pps: 2e13 },
  { id: 'rail',       era: 6, icon: '🚂', name: 'Chemin de Fer',            base: 4.1e16,  pps: 1.22e14 },
  { id: 'charbon',    era: 6, icon: '🪨', name: 'Mine de Charbon',          base: 2.7e17,  pps: 7.35e14 },
  // --- Ère Électrique ---
  { id: 'centrale',   era: 7, icon: '⚡', name: 'Centrale Électrique',      base: 1.7e18,  pps: 4.4e15 },
  { id: 'gratteciel', era: 7, icon: '🏙️', name: 'Gratte-ciel',              base: 1.1e19,  pps: 2.6e16 },
  { id: 'labo',       era: 7, icon: '🔬', name: 'Laboratoire',              base: 7.4e19,  pps: 1.59e17 },
  // --- Ère Spatiale ---
  { id: 'rampe',      era: 8, icon: '🚀', name: 'Rampe de Lancement',       base: 4.8e20,  pps: 9.5e17 },
  { id: 'station',    era: 8, icon: '🛰️', name: 'Station Orbitale',         base: 3.1e21,  pps: 5.7e18 },
  { id: 'colonie',    era: 8, icon: '🪐', name: 'Colonie Martienne',        base: 2e22,    pps: 3.4e19 }
];

/* -------------------------------------------------------------------------
   AMÉLIORATIONS DE CLIC
   outil    : +1 point de base par clic, coût ×1.35 par niveau
   gantelet : chaque niveau ajoute 2 % du PPS à chaque clic (plafonné)
   ------------------------------------------------------------------------- */
const TOOL     = { base: 25,   growth: 1.35, power: 1 };
const GAUNTLET = { base: 5e3,  growth: 6,    share: 0.02, max: 25 };

/* -------------------------------------------------------------------------
   LES HÉROS — un par ère, recrutables une seule fois.
   force : puissance militaire (sert UNIQUEMENT aux pillages et à la défense)
   Chaque héros recruté donne aussi +5 % de production globale.
   ------------------------------------------------------------------------- */
const HERO_PROD_BONUS = 0.05;

const HEROES = [
  { id: 'grok',   era: 0, force: 10,    cost: 3.5e3,  name: 'Grok le Chasseur',      role: 'Âge de Pierre',
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="28" fill="#8a6f4a" stroke="#2e2418" stroke-width="3"/><g transform="rotate(-30 32 32)" stroke="#2e2418" stroke-width="2"><rect x="22" y="29" width="20" height="6" rx="3" fill="#efe6d2"/><circle cx="22" cy="29" r="4" fill="#efe6d2"/><circle cx="22" cy="35" r="4" fill="#efe6d2"/><circle cx="42" cy="29" r="4" fill="#efe6d2"/><circle cx="42" cy="35" r="4" fill="#efe6d2"/></g></svg>` },
  { id: 'lua',    era: 1, force: 45,    cost: 9e5,    name: 'Lua la Guérisseuse',    role: 'Âge de Bronze',
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="28" fill="#4f8a46" stroke="#23401f" stroke-width="3"/><path d="M32 15 C19 22 19 41 32 50 C45 41 45 22 32 15 Z" fill="#bfe39a" stroke="#23401f" stroke-width="2.4"/><path d="M32 18 L32 48" stroke="#23401f" stroke-width="2"/></svg>` },
  { id: 'bronn',  era: 2, force: 200,   cost: 2.5e8,  name: 'Bronn le Forgeron',     role: 'Âge de Fer',
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="28" fill="#cd7f32" stroke="#5a3614" stroke-width="3"/><g stroke="#2e2418" stroke-width="2.4" stroke-linejoin="round"><rect x="29" y="24" width="6" height="24" rx="2" fill="#8a5a30" transform="rotate(35 32 36)"/><rect x="20" y="18" width="20" height="11" rx="2" fill="#cfd6da" transform="rotate(35 30 23)"/></g></svg>` },
  { id: 'sigrid', era: 3, force: 900,   cost: 7e10,   name: 'Sigrid la Guerrière',   role: 'Antiquité',
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="28" fill="#7e909c" stroke="#333b41" stroke-width="3"/><g stroke="#21272b" stroke-width="2.2" stroke-linejoin="round"><polygon points="32,11 36,40 28,40" fill="#e6edf1"/><rect x="22" y="40" width="20" height="5" rx="2" fill="#5a3a22"/><rect x="29" y="45" width="6" height="10" rx="2" fill="#7a4a2a"/></g></svg>` },
  { id: 'leon',   era: 4, force: 4e3,   cost: 2e13,   name: 'Léon le Stratège',      role: 'Moyen Âge',
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="28" fill="#7f9ecf" stroke="#26314a" stroke-width="3"/><rect x="19" y="19" width="26" height="26" rx="3" fill="#f3eccf" stroke="#26314a" stroke-width="2.2"/><g stroke="#7f8fa8" stroke-width="2" stroke-linecap="round"><line x1="24" y1="27" x2="40" y2="27"/><line x1="24" y1="32" x2="40" y2="32"/><line x1="24" y1="37" x2="35" y2="37"/></g></svg>` },
  { id: 'aria',   era: 5, force: 1.8e4, cost: 5.5e15, name: 'Aria la Savante',       role: 'Renaissance',
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="28" fill="#c98bb8" stroke="#5c3352" stroke-width="3"/><circle cx="32" cy="30" r="13" fill="#f4e3ef" stroke="#5c3352" stroke-width="2.4"/><path d="M32 17 v26 M19 30 h26" stroke="#a86b9a" stroke-width="2"/><path d="M23 44 q9 8 18 0" fill="none" stroke="#5c3352" stroke-width="2.6" stroke-linecap="round"/></svg>` },
  { id: 'edda',   era: 6, force: 8e4,   cost: 1.5e18, name: "Edda l'Inventrice",     role: 'Ère Industrielle',
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="28" fill="#c0712f" stroke="#5a3414" stroke-width="3"/><circle cx="32" cy="27" r="12" fill="#ffe9a8" stroke="#2e2418" stroke-width="2.4"/><rect x="27" y="40" width="10" height="8" rx="2" fill="#8a9298" stroke="#2e2418" stroke-width="2.2"/><path d="M28 25 L32 30 L36 25" fill="none" stroke="#c0712f" stroke-width="2"/></svg>` },
  { id: 'volt',   era: 7, force: 3.5e5, cost: 4e20,   name: 'Volt le Bâtisseur',     role: 'Ère Électrique',
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="28" fill="#f2c744" stroke="#7a610f" stroke-width="3"/><polygon points="36,12 20,35 30,35 26,52 44,28 33,28" fill="#fffbe6" stroke="#7a610f" stroke-width="2.4" stroke-linejoin="round"/></svg>` },
  { id: 'nova',   era: 8, force: 1.5e6, cost: 1.2e23, name: 'Nova la Pilote',        role: 'Ère Spatiale',
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="28" fill="#2b3d54" stroke="#16202e" stroke-width="3"/><circle cx="32" cy="30" r="14" fill="#7fd6ff" stroke="#16202e" stroke-width="2.6"/><path d="M22 26 a13 13 0 0 1 12 -8" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity=".8"/><rect x="25" y="45" width="14" height="7" rx="3" fill="#cfd8e2" stroke="#16202e" stroke-width="2.2"/></svg>` }
];

/* -------------------------------------------------------------------------
   LES SUCCÈS — chacun débloqué donne +2 % de production globale, pour toujours.
   test(s) reçoit l'état de jeu et renvoie true si le succès est acquis.
   ------------------------------------------------------------------------- */
const ACHIEVEMENT_BONUS = 0.02;

const ACHIEVEMENTS = [
  { id: 'clic1',    icon: '👆', name: 'Premier contact',   desc: 'Faire 1 clic',                 test: s => s.stats.clicks >= 1 },
  { id: 'clic100',  icon: '👆', name: 'Doigts agiles',     desc: 'Faire 100 clics',              test: s => s.stats.clicks >= 100 },
  { id: 'clic1k',   icon: '✋', name: 'Main de fer',       desc: 'Faire 1 000 clics',            test: s => s.stats.clicks >= 1e3 },
  { id: 'clic10k',  icon: '🖐️', name: 'Tendinite',         desc: 'Faire 10 000 clics',           test: s => s.stats.clicks >= 1e4 },
  { id: 'clic100k', icon: '🦾', name: 'Bras bionique',     desc: 'Faire 100 000 clics',          test: s => s.stats.clicks >= 1e5 },

  { id: 'bat10',    icon: '🏠', name: 'Petit hameau',      desc: 'Posséder 10 bâtiments',        test: s => totalBuildings(s) >= 10 },
  { id: 'bat50',    icon: '🏘️', name: 'Bourgade',          desc: 'Posséder 50 bâtiments',        test: s => totalBuildings(s) >= 50 },
  { id: 'bat150',   icon: '🌆', name: 'Grande cité',       desc: 'Posséder 150 bâtiments',       test: s => totalBuildings(s) >= 150 },
  { id: 'bat400',   icon: '🌐', name: 'Mégalopole',        desc: 'Posséder 400 bâtiments',       test: s => totalBuildings(s) >= 400 },

  { id: 'era1',     icon: '🟫', name: 'Bronze',            desc: "Atteindre l'Âge de Bronze",    test: s => s.era >= 1 },
  { id: 'era2',     icon: '⚒️', name: 'Fer',               desc: "Atteindre l'Âge de Fer",       test: s => s.era >= 2 },
  { id: 'era3',     icon: '🏛️', name: 'Antiquité',         desc: "Atteindre l'Antiquité",        test: s => s.era >= 3 },
  { id: 'era4',     icon: '🏰', name: 'Moyen Âge',         desc: 'Atteindre le Moyen Âge',       test: s => s.era >= 4 },
  { id: 'era5',     icon: '🎨', name: 'Renaissance',       desc: 'Atteindre la Renaissance',     test: s => s.era >= 5 },
  { id: 'era6',     icon: '⚙️', name: 'Industrie',         desc: "Atteindre l'Ère Industrielle", test: s => s.era >= 6 },
  { id: 'era7',     icon: '💡', name: 'Électricité',       desc: "Atteindre l'Ère Électrique",   test: s => s.era >= 7 },
  { id: 'era8',     icon: '🚀', name: 'Vers les étoiles',  desc: "Atteindre l'Ère Spatiale",     test: s => s.era >= 8 },

  { id: 'cris10',   icon: '💎', name: 'Casseur',           desc: 'Briser 10 cristaux',           test: s => s.crystalsBroken >= 10 },
  { id: 'cris100',  icon: '💠', name: 'Briseur de roche',  desc: 'Briser 100 cristaux',          test: s => s.crystalsBroken >= 100 },
  { id: 'cris1000', icon: '🔨', name: 'Pulvérisateur',     desc: 'Briser 1 000 cristaux',        test: s => s.crystalsBroken >= 1000 },

  { id: 'hero1',    icon: '🦸', name: 'Premier compagnon', desc: 'Recruter un héros',            test: s => recruitedCount(s) >= 1 },
  { id: 'heroAll',  icon: '🏅', name: 'Légendes réunies',  desc: 'Recruter les 9 héros',         test: s => recruitedCount(s) >= HEROES.length },

  { id: 'vil5',     icon: '🏡', name: 'Village prospère',  desc: 'Village niveau 5',             test: s => s.townHall >= 5 },
  { id: 'vil10',    icon: '👑', name: 'Capitale',          desc: 'Village niveau 10',            test: s => s.townHall >= 10 },

  { id: 'raid10',   icon: '⚔️', name: 'Pillard',           desc: 'Gagner 10 pillages',           test: s => s.raidWins >= 10 },
  { id: 'raid100',  icon: '🗡️', name: 'Seigneur de guerre', desc: 'Gagner 100 pillages',         test: s => s.raidWins >= 100 },

  { id: 'presti1',  icon: '🏺', name: 'Héritage',          desc: 'Faire un premier héritage',    test: s => s.prestiges >= 1 },
  { id: 'presti5',  icon: '📿', name: 'Cycle éternel',     desc: 'Faire 5 héritages',            test: s => s.prestiges >= 5 }
];

/* Petits utilitaires partagés par les conditions de succès */
function totalBuildings(s) {
  return BUILDINGS.reduce((n, b) => n + (s.buildings[b.id] || 0), 0);
}
function recruitedCount(s) {
  return HEROES.reduce((n, h) => n + (s.heroes[h.id] ? 1 : 0), 0);
}

/* -------------------------------------------------------------------------
   VILLAGE, PILLAGE, HÉRITAGE — constantes de réglage
   ------------------------------------------------------------------------- */
const TH_MAX          = 10;      // niveau maximum du village
const TH_BASE_COST    = 2e3;     // coût du passage au niveau 2
const TH_COST_GROWTH  = 6;       // ×6 par niveau
const TH_PROD_BONUS   = 0.05;    // +5 % de production par niveau au-dessus de 1

const RAID_COOLDOWN   = 8e3;     // ms entre deux attaques
const DEFENSE_MIN     = 120e3;   // délai mini avant une attaque ennemie
const DEFENSE_RANGE   = 120e3;   // + jusqu'à 2 min de plus, au hasard

const OFFLINE_CAP     = 8 * 3600e3;  // 8 h de production hors-ligne maximum
const OFFLINE_RATE    = 0.5;         // ... à 50 % du rendement

const RELIC_BONUS     = 0.02;    // +2 % de production par relique
const RELIC_DIVISOR   = 1e15;    // seuil de référence pour le calcul des reliques
const RELIC_EXPONENT  = 0.35;    // reliques = (total gagné / divisor) ^ exposant

/* Générateur de noms de villages ennemis */
const V_PREFIX = ['Village', 'Hameau', 'Bourg', 'Camp', 'Clan', 'Tribu', 'Fort', 'Cité', 'Enclave', 'Repaire'];
const V_SUFFIX = ['des Loups', 'de Pierre', 'du Nord', 'Sombre', "d'Argile", 'Rouge', 'des Brumes',
                  'du Vent', "de l'Aigle", 'des Cendres', 'du Roc', "d'Émeraude", 'du Lac',
                  'des Sangliers', 'Maudit', 'du Crépuscule', 'des Trois Rivières'];
