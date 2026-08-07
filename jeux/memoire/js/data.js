/* ============================================================
   data.js — banques de contenu (mots, personnes, histoires…)
   ============================================================ */

const DATA = {

  /* --- mots concrets et imageables : plus faciles à associer --- */
  mots: [
    'bateau','guitare','montagne','fromage','lampe','tigre','fenêtre','chocolat','violon','sable',
    'marteau','jardin','nuage','ceinture','écureuil','bureau','citron','tambour','épée','casquette',
    'brouette','cerise','dauphin','échelle','four','girafe','horloge','île','journal','kayak',
    'lanterne','miroir','navire','orage','pomme','quille','radis','savon','tortue','usine',
    'valise','wagon','yaourt','zèbre','ancre','balcon','cactus','dinde','étoile','flûte',
    'gant','hibou','igloo','jupe','koala','lion','moulin','neige','ombre','panier',
    'quai','ruche','sirop','trèfle','vague','yacht','abricot','bougie','canapé','drapeau',
    'écharpe','falaise','grenier','hameçon','incendie','jonquille','kiwi','loupe','manteau','nid',
    'oreiller','pinceau','quartier','râteau','seau','tabouret','uniforme','vélo','avion','banc',
    'chapeau','désert','épingle','forêt','gomme','harpe','clé','trompette','renard','château',
    'balai','crayon','fauteuil','glaçon','hôpital','jumelles','lunettes','micro','olive','parapluie'
  ],

  /* --- personnes pour l'exercice « noms & visages » --- */
  personnes: [
    { p: 'Camille', e: '👩‍🦰', c: '#ff8fa3', i: 'Vétérinaire à Nantes' },
    { p: 'Théo',    e: '🧑',    c: '#7c6cff', i: 'Prof de maths, joue au tennis' },
    { p: 'Inès',    e: '👩‍🦱', c: '#00d6a3', i: 'Architecte, vit à Lyon' },
    { p: 'Lucas',   e: '🧔',    c: '#ffb45c', i: 'Boulanger, deux chats' },
    { p: 'Sarah',   e: '👱‍♀️', c: '#5bc0ff', i: 'Infirmière de nuit' },
    { p: 'Malik',   e: '👨‍🦲', c: '#ff6b81', i: 'Développeur, fan de rando' },
    { p: 'Julie',   e: '👩',    c: '#c084fc', i: 'Libraire à Bordeaux' },
    { p: 'Nathan',  e: '🧑‍🦰', c: '#34d399', i: 'Pompier, joue de la basse' },
    { p: 'Léa',     e: '👩‍🦳', c: '#f472b6', i: 'Kiné, fait de l\'escalade' },
    { p: 'Karim',   e: '🧑‍🦱', c: '#facc15', i: 'Cuisinier, vient de Marseille' },
    { p: 'Emma',    e: '👧',    c: '#60a5fa', i: 'Étudiante en droit' },
    { p: 'Hugo',    e: '👨',    c: '#fb923c', i: 'Menuisier, un labrador' },
    { p: 'Chloé',   e: '👩‍🎤', c: '#a78bfa', i: 'Photographe indépendante' },
    { p: 'Yanis',   e: '🧑‍🎓', c: '#2dd4bf', i: 'Étudiant, joueur d\'échecs' },
    { p: 'Manon',   e: '👩‍⚕️', c: '#f87171', i: 'Pharmacienne à Rennes' },
    { p: 'Bastien', e: '🧑‍🌾', c: '#84cc16', i: 'Agriculteur, aime le jazz' }
  ],

  /* --- emojis pour le jeu de paires --- */
  paires: ['🍎','🚲','🎸','🐢','⚓','🌵','🎩','🔔','🍄','🧭','🪁','🦋','🧊','🕯️','🪴','🎲','🧩','🛎️','🪗','🦉'],

  /* --- lettres du n-back --- */
  lettres: ['A','B','C','D','E','F','G','H'],

  /* --- courtes histoires à détails, pour la mémoire logique --- */
  histoires: [
    {
      texte: "Mardi matin, <b>Sophie</b> a pris le train de <b>7 h 42</b> pour <b>Toulouse</b>. Dans son sac, elle avait <b>trois pommes</b>, un carnet <b>vert</b> et les clés de l'appartement de son frère <b>Damien</b>. Arrivée à la gare, elle a bu un café à <b>2,80 €</b> puis a appelé sa collègue <b>Nadia</b> pour décaler la réunion à <b>15 h</b>.",
      questions: [
        { q: 'Quel jour part-elle ?', r: 'mardi' },
        { q: 'À quelle heure part le train ?', r: '7h42', alt: ['742','7 h 42','7h42'] },
        { q: 'Vers quelle ville ?', r: 'Toulouse' },
        { q: 'Combien de pommes dans son sac ?', r: 'trois', alt: ['3'] },
        { q: 'De quelle couleur est le carnet ?', r: 'vert' },
        { q: 'Comment s\'appelle son frère ?', r: 'Damien' },
        { q: 'Combien coûte le café ?', r: '2,80', alt: ['280','2.80','2 80','280euros'] },
        { q: 'Qui appelle-t-elle ?', r: 'Nadia' },
        { q: 'À quelle heure est décalée la réunion ?', r: '15h', alt: ['15','15 h','15heures'] }
      ]
    },
    {
      texte: "Le <b>14 mars</b>, <b>Monsieur Renard</b> a garé sa voiture <b>bleue</b> au niveau <b>-2</b> du parking, place <b>117</b>. Il montait au <b>4<sup>e</sup> étage</b> voir le docteur <b>Bellini</b> pour une douleur au <b>genou droit</b>. En sortant, il a acheté <b>deux baguettes</b> et un journal à <b>1,50 €</b>.",
      questions: [
        { q: 'Quelle date ?', r: '14 mars', alt: ['14mars','14/03','14 03'] },
        { q: 'Couleur de la voiture ?', r: 'bleue', alt: ['bleu'] },
        { q: 'Quel niveau de parking ?', r: '-2', alt: ['2','moins2','niveau -2'] },
        { q: 'Numéro de place ?', r: '117' },
        { q: 'Quel étage ?', r: '4', alt: ['4e','quatre','quatrieme'] },
        { q: 'Nom du docteur ?', r: 'Bellini' },
        { q: 'Quel genou ?', r: 'droit' },
        { q: 'Combien de baguettes ?', r: 'deux', alt: ['2'] },
        { q: 'Prix du journal ?', r: '1,50', alt: ['150','1.50','1 50'] }
      ]
    },
    {
      texte: "<b>Yasmine</b> a emménagé au <b>28 rue des Lilas</b>, au <b>3<sup>e</sup> étage</b>, porte de <b>gauche</b>. Le code de l'immeuble est <b>4172</b>. Sa voisine <b>Madame Otto</b> garde un double des clés. Le container jaune sort le <b>jeudi soir</b>, et le chauffage est coupé après <b>22 h</b>.",
      questions: [
        { q: 'Quel numéro de rue ?', r: '28' },
        { q: 'Nom de la rue ?', r: 'lilas', alt: ['rue des lilas','des lilas'] },
        { q: 'Quel étage ?', r: '3', alt: ['3e','trois','troisieme'] },
        { q: 'Porte gauche ou droite ?', r: 'gauche' },
        { q: 'Code de l\'immeuble ?', r: '4172' },
        { q: 'Nom de la voisine ?', r: 'Otto', alt: ['madame otto','mme otto'] },
        { q: 'Quel jour sort le container jaune ?', r: 'jeudi' },
        { q: 'Le chauffage est coupé après quelle heure ?', r: '22h', alt: ['22','22 h','22heures'] }
      ]
    },
    {
      texte: "Au restaurant <b>Le Comptoir</b>, table <b>9</b>, <b>Paul</b> a commandé un <b>risotto</b> et <b>Alice</b> un <b>tartare</b>. Ils ont partagé une bouteille de <b>Chablis</b> à <b>32 €</b>. Le serveur, un grand roux prénommé <b>Victor</b>, leur a offert deux cafés. L'addition totale s'élevait à <b>78 €</b>, réglée en <b>espèces</b>.",
      questions: [
        { q: 'Nom du restaurant ?', r: 'comptoir', alt: ['le comptoir'] },
        { q: 'Numéro de table ?', r: '9', alt: ['neuf'] },
        { q: 'Qu\'a commandé Paul ?', r: 'risotto' },
        { q: 'Qu\'a commandé Alice ?', r: 'tartare' },
        { q: 'Quel vin ?', r: 'chablis' },
        { q: 'Prix de la bouteille ?', r: '32', alt: ['32euros'] },
        { q: 'Prénom du serveur ?', r: 'Victor' },
        { q: 'Montant total ?', r: '78', alt: ['78euros'] },
        { q: 'Moyen de paiement ?', r: 'espèces', alt: ['especes','cash','liquide'] }
      ]
    }
  ],

  /* --- modèles de mémos proposés dans l'onglet Mes mémos --- */
  modelesMemo: [
    { l: '👤 Un prénom', q: 'Comment s\'appelle … ?', a: '' },
    { l: '🔢 Un code / mot de passe', q: 'Code de … ?', a: '' },
    { l: '🎂 Une date', q: 'Anniversaire de … ?', a: '' },
    { l: '📦 Où j\'ai rangé un truc', q: 'Où j\'ai rangé … ?', a: '' },
    { l: '🤝 Un engagement pris', q: 'Qu\'est-ce que j\'ai promis à … ?', a: '' },
    { l: '💊 Une info santé', q: 'Quel dosage / quelle posologie pour … ?', a: '' },
    { l: '🚗 Un numéro', q: 'Plaque / numéro de … ?', a: '' }
  ],

  /* --- petits conseils affichés sur la page d'accueil --- */
  astuces: [
    { t: 'La règle des 3 rappels', p: 'Quand on te dit un prénom, répète-le tout de suite à voix haute, puis dans les 2 minutes, puis avant de partir. Trois rappels espacés valent dix répétitions d\'affilée.' },
    { t: 'Externalise sans culpabiliser', p: 'Une bonne mémoire, c\'est aussi un bon système. Tout ce qui a une date va dans un agenda, tout le reste va dans une seule liste. Ta tête n\'est pas faite pour stocker, elle est faite pour penser.' },
    { t: 'L\'attention avant la mémoire', p: 'On n\'oublie pas ce qu\'on n\'a jamais enregistré. 90 % des « oublis » sont des défauts d\'attention : tu pensais à autre chose. Marque un temps d\'arrêt d\'une seconde sur ce qui compte.' },
    { t: 'Associe une image absurde', p: 'Pour retenir « rendez-vous dentiste jeudi », imagine une dent géante assise dans ton salon le jeudi. Plus c\'est ridicule, mieux ça colle.' },
    { t: 'Le lieu-crochet', p: 'Pose mentalement les choses à retenir dans les pièces de ton logement. Pour les retrouver, tu refais la visite. C\'est le fameux « palais de la mémoire ».' },
    { t: 'Dis-le à voix haute', p: 'Prononcer « je ferme la porte à clé » au moment de le faire crée une trace beaucoup plus forte que le geste seul. Fini le doute dans l\'ascenseur.' },
    { t: 'Un seul endroit par objet', p: 'Clés, portefeuille, lunettes : une place unique, toujours la même. Tu ne mémorises plus rien, l\'espace le fait pour toi.' },
    { t: 'Dors', p: 'La consolidation de la mémoire se fait pendant le sommeil profond. Une nuit courte, c\'est une journée entière qui s\'imprime mal.' },
    { t: 'Teste-toi, ne relis pas', p: 'Relire donne l\'illusion de savoir. Se forcer à retrouver l\'information sans regarder, même en échouant, la grave bien plus profondément.' },
    { t: 'Le chunking', p: 'Un numéro à 10 chiffres est impossible ; trois groupes de 3-4 chiffres, c\'est simple. Découpe toujours ce que tu veux retenir en paquets de 3 ou 4.' }
  ]
};
