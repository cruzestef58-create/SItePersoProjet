/* =========================================================
   QUEL AGENT VALORANT ES-TU ?
   Données : 25 agents / 24 questions

   Les illustrations viennent du CDN d'assets publics de Riot
   (media.valorant-api.com). Elles nécessitent une connexion
   internet ; si une image ne charge pas, le site retombe
   automatiquement sur le badge coloré avec l'initiale.
   ========================================================= */

const CDN = "https://media.valorant-api.com/agents/";
const portraitUrl = id => CDN + AGENTS[id].u + "/fullportrait.png";
const iconUrl     = id => CDN + AGENTS[id].u + "/displayicon.png";
const bgUrl       = id => CDN + AGENTS[id].u + "/background.png";

const ROLE_ICONS = {
  "DUELLISTE" : CDN + "roles/dbe8757e-9e92-4ed4-b39f-9dfc589691d4/displayicon.png",
  "INITIATEUR": CDN + "roles/1b47567f-8f7b-444b-aae3-b0c634622d10/displayicon.png",
  "CONTRÔLEUR": CDN + "roles/4ee40330-ecdd-4f2f-98a8-eb1243428373/displayicon.png",
  "SENTINELLE": CDN + "roles/5fc02f99-4091-4486-a531-98459a3e95e9/displayicon.png"
};

const AGENTS = {
  /* ---------- DUELLISTES ---------- */
  jett:{u:"add6443a-41bd-e414-f6ad-e58d267f4e95",n:"JETT",r:"DUELLISTE",c:["#b8e6f0","#6fb9d4"],
    q:"« Fais-moi confiance, je te dépose une bombe. »",
    d:"Tu es rapide, insaisissable et tu ne demandes la permission à personne. Tu entres en premier, tu prends les duels que personne n'ose prendre, et si ça tourne mal… tu es déjà repartie. Ton jeu repose sur ton instinct et ta confiance en toi — quand tu es chaud, personne ne te suit.",
    t:["Agressif","Mobile","Confiant","Solo carry","Instinctif"]},
  phoenix:{u:"eb93336a-449b-9c1b-0a54-a891f7921d69",n:"PHOENIX",r:"DUELLISTE",c:["#ff9b42","#ff5a2e"],
    q:"« Vous voulez du spectacle ? Regardez ça. »",
    d:"Chaleureux, extraverti, un peu m'as-tu-vu — mais tu assumes complètement. Tu es le genre de personne qui met l'ambiance partout où elle passe, et qui se relève toujours après une chute. Littéralement. Tu n'as besoin de personne pour t'ouvrir la voie, tu le fais toi-même avec le sourire.",
    t:["Charismatique","Autonome","Optimiste","Flamboyant","Résilient"]},
  raze:{u:"f94c3b30-42be-e959-889c-5aa313dba261",n:"RAZE",r:"DUELLISTE",c:["#f7c948","#e8703a"],
    q:"« BOOM ! Vous avez vu ça ?! »",
    d:"Explosive, bruyante, incontrôlable — et adorée pour ça. Tu ne connais pas la subtilité : quand il y a un problème, tu mets assez d'explosifs pour qu'il disparaisse. Tu es le moteur d'énergie de ton groupe, celle qui fait rire tout le monde même après une défaite.",
    t:["Explosif","Chaotique","Joyeux","Sans filtre","Imprévisible"]},
  reyna:{u:"a3bfb853-43b2-7238-a4f1-ad90e9e46bcc",n:"REYNA",r:"DUELLISTE",c:["#a56ff0","#5f2ea8"],
    q:"« Vous n'êtes que du carburant. »",
    d:"Tu joues pour toi. Chaque victoire te rend plus fort, chaque élimination te nourrit. Tu es intense, sûr de ta valeur, et tu détestes dépendre des autres. Certains disent égoïste, toi tu dis efficace — et honnêtement, quand tu es en forme, la partie t'appartient.",
    t:["Égocentrique","Impitoyable","Ambitieux","Auto-suffisant","Intense"]},
  yoru:{u:"7f94d92c-4234-0a36-9646-3a87eb8b5c89",n:"YORU",r:"DUELLISTE",c:["#4a6ef5","#1d2f8f"],
    q:"« Je suis déjà passé derrière toi. »",
    d:"Tu ne joues pas franc-jeu, tu joues malin. Faux pas, leurres, apparitions dans le dos : tu adores manipuler ce que les autres croient savoir. Solitaire, sarcastique, un peu rancunier — tu préfères travailler seul et laisser tout le monde deviner où tu es.",
    t:["Sournois","Solitaire","Manipulateur","Sarcastique","Infiltré"]},
  neon:{u:"bb2a4828-46eb-8cd1-e765-15848195d751",n:"NEON",r:"DUELLISTE",c:["#5ee7ff","#2b6ef5"],
    q:"« Trop lents. Beaucoup trop lents. »",
    d:"Tu carbures à l'énergie pure. Tu parles vite, tu bouges vite, tu décides vite — attendre te rend physiquement malade. Compétitive et fière, tu veux prouver ce que tu vaux à chaque round, quitte à foncer dans le mur de temps en temps.",
    t:["Hyperactif","Rapide","Compétitif","Impatient","Électrique"]},
  iso:{u:"0e38b510-41a8-5780-5e8f-568b2a4f2d6c",n:"ISO",r:"DUELLISTE",c:["#c47bff","#4a2b8c"],
    q:"« Un contre un. Rien d'autre n'existe. »",
    d:"Calme à l'extérieur, en guerre à l'intérieur. Tu ne cherches pas l'attention : tu cherches le duel, la preuve que tu es meilleur. Tu bloques le bruit du monde, tu te concentres sur une cible, et tu ne lâches pas. Discipline froide et détermination absolue.",
    t:["Concentré","Solitaire","Déterminé","Méthodique","Silencieux"]},

  /* ---------- INITIATEURS ---------- */
  sova:{u:"320b2a48-4d9b-a075-30f1-1f93a9b638fa",n:"SOVA",r:"INITIATEUR",c:["#7fd8f7","#2a6fa8"],
    q:"« Aucun secret ne m'échappe. »",
    d:"Patient, précis, observateur. Tu ne bouges jamais sans information, et tu vois souvent les choses avant les autres. Chasseur dans l'âme, tu traques ta cible sans t'énerver, et tu partages tout ce que tu trouves avec ton équipe. Ton calme est ta plus grande arme.",
    t:["Observateur","Patient","Précis","Traqueur","Fiable"]},
  breach:{u:"5f8d3a7f-467b-97f3-062c-13acf203c006",n:"BREACH",r:"INITIATEUR",c:["#f0a04b","#a34d1f"],
    q:"« Si ça bloque, on casse le mur. »",
    d:"Subtil ? Jamais. Tu résous les problèmes en fonçant dedans jusqu'à ce qu'ils cèdent. Bourru, direct, un peu tête brûlée — mais toujours pour ouvrir la voie aux autres. Tu es celui qui secoue tout le monde et qui crée le chaos dont ton équipe a besoin.",
    t:["Brutal","Direct","Franc","Perturbateur","Loyal"]},
  skye:{u:"6f2a04ca-43e0-be17-7f36-b3908627744d",n:"SKYE",r:"INITIATEUR",c:["#7ede9b","#2f8f5b"],
    q:"« Je m'occupe de vous, tenez bon. »",
    d:"Protecteur, généreux, connecté aux autres. Tu ouvres le chemin *et* tu soignes les blessures — tu ne supportes pas de voir quelqu'un se débrouiller seul. Naturel, chaleureux, tu es la personne vers qui tout le monde se tourne quand ça va mal.",
    t:["Protecteur","Altruiste","Guide","Naturel","Empathique"]},
  kayo:{u:"601dbbe7-43ce-be57-2a40-4abd24953621",n:"KAY/O",r:"INITIATEUR",c:["#c9d4dd","#5b6f80"],
    q:"« Objectif identifié. Exécution. »",
    d:"Froid, logique, imperturbable. Tu ne te laisses pas emporter par l'émotion : tu analyses, tu exécutes, tu passes à la suite. Les insultes glissent sur toi. Ton équipe compte sur toi parce que tu es le seul à ne jamais paniquer, même en 1v4.",
    t:["Rationnel","Imperturbable","Tactique","Discipliné","Efficace"]},
  fade:{u:"dade69b4-4f5a-8528-247b-219e5a1facd6",n:"FADE",r:"INITIATEUR",c:["#9d7fd6","#2b1f4a"],
    q:"« Je connais déjà ta peur. »",
    d:"Sombre, silencieuse, terriblement perspicace. Tu lis les gens mieux qu'ils ne se lisent eux-mêmes, et tu n'oublies rien. Tu ne parles pas beaucoup, mais quand tu parles, ça pèse. Tu chasses tes cibles avec une patience qui met tout le monde mal à l'aise.",
    t:["Mystérieux","Perspicace","Rancunier","Nocturne","Traqueur"]},
  gekko:{u:"e370fa57-4757-3604-3648-499e1f642d3f",n:"GEKKO",r:"INITIATEUR",c:["#a8e05f","#48a03a"],
    q:"« Allez les gars, on y va ensemble ! »",
    d:"Fun, généreux, jamais méchant. Tu es le pote qui rassemble tout le monde, celui qui dédramatise et qui repart au combat en rigolant. Tu joues en équipe par instinct — pour toi, gagner seul n'a aucun intérêt.",
    t:["Sociable","Bienveillant","Drôle","Team player","Détendu"]},

  /* ---------- CONTRÔLEURS ---------- */
  brimstone:{u:"9f0d8ba9-4140-b941-57d3-a7ad57c6b417",n:"BRIMSTONE",r:"CONTRÔLEUR",c:["#e0873c","#8a4520"],
    q:"« Tenez-vous prêts, j'ai un plan. »",
    d:"Le vétéran. Tu es le pilier calme sur lequel tout le monde s'appuie : tu donnes les consignes, tu couvres les erreurs, tu gardes la tête froide quand ça part en vrille. Tu n'as pas besoin de briller, tu as besoin que l'équipe gagne.",
    t:["Leader","Fiable","Stratège","Protecteur","Posé"]},
  omen:{u:"8e253930-4c05-31dd-1b6c-968525494517",n:"OMEN",r:"CONTRÔLEUR",c:["#8d8dff","#20204d"],
    q:"« Tu ne sauras jamais d'où je viens. »",
    d:"Une ombre. Personne ne sait vraiment qui tu es, et ça te convient parfaitement. Tu apparais, tu frappes, tu disparais. Introverti et énigmatique, tu observes beaucoup plus que tu ne parles — et tu es toujours là où on ne t'attend pas.",
    t:["Mystérieux","Introverti","Insaisissable","Stratège","Nocturne"]},
  viper:{u:"707eab51-4836-f488-046a-cda6bf494859",n:"VIPER",r:"CONTRÔLEUR",c:["#4ecf7d","#1a5c33"],
    q:"« La pitié, c'est pour les faibles. »",
    d:"Calculatrice, exigeante, impitoyable. Tu contrôles ton environnement jusqu'au moindre détail et tu ne laisses rien au hasard. Tu n'as pas besoin d'être aimée, tu as besoin d'avoir raison. Ceux qui te sous-estiment le regrettent systématiquement.",
    t:["Contrôlant","Rancunier","Méthodique","Intransigeant","Redoutable"]},
  astra:{u:"41fb69c1-4189-7b37-f117-bcaf1e96f1bf",n:"ASTRA",r:"CONTRÔLEUR",c:["#c07ce8","#4a2172"],
    q:"« Je vois le terrain avant qu'il n'existe. »",
    d:"Tu penses trois coups à l'avance. Là où les autres réagissent, toi tu as déjà placé tes pièces. Élégante, cérébrale, un peu au-dessus de la mêlée : tu orchestres la partie depuis les étoiles pendant que tout le monde court dans tous les sens.",
    t:["Visionnaire","Cérébral","Organisateur","Élégant","Anticipation"]},
  harbor:{u:"95b78ed7-4637-86d9-7e41-71ba8c293152",n:"HARBOR",r:"CONTRÔLEUR",c:["#4fc9c9","#186b7a"],
    q:"« Reste derrière moi, je te couvre. »",
    d:"Solide, généreux, protecteur. Tu prends naturellement le rôle du bouclier : tant que tu es là, personne ne tombe. Tu es fiable, un peu grand frère sur les bords, et tu préfères encaisser toi-même plutôt que voir un coéquipier souffrir.",
    t:["Protecteur","Solide","Généreux","Rassurant","Endurant"]},
  clove:{u:"1dbf2edd-4729-0984-3115-daa5eed44993",n:"CLOVE",r:"CONTRÔLEUR",c:["#e87fd6","#7a2b8c"],
    q:"« Ce n'est pas fini tant que je le dis. »",
    d:"Espiègle, imprévisible, complètement increvable. Tu prends la vie (et la mort) avec humour et tu refuses catégoriquement d'abandonner. Tu adores taquiner tout le monde, mais derrière les blagues il y a quelqu'un de très attaché aux siens.",
    t:["Espiègle","Increvable","Taquin","Optimiste","Imprévisible"]},

  /* ---------- SENTINELLES ---------- */
  sage:{u:"569fdd95-4d10-43ab-ca70-79becc718b46",n:"SAGE",r:"SENTINELLE",c:["#7fe3d9","#2a8a86"],
    q:"« Je vous ramène. Tenez bon. »",
    d:"Calme, morale, indispensable. Tu es le point d'équilibre de ton groupe : tu répares, tu apaises, tu recadres. Tu ne cherches ni les compliments ni la gloire — mais sans toi, tout s'effondre. Ton sang-froid impressionne tout le monde.",
    t:["Bienveillant","Calme","Altruiste","Intègre","Rassurant"]},
  cypher:{u:"117ed9e3-49f3-6512-3ccf-0cada7e3823b",n:"CYPHER",r:"SENTINELLE",c:["#d6d2c4","#7a746a"],
    q:"« Je sais déjà tout de toi. »",
    d:"L'homme qui sait. Tu observes, tu notes, tu retiens. Tu adores avoir un coup d'avance et tu détestes les surprises, alors tu prépares tout. Un peu paranoïaque ? Peut-être. Mais tu n'es jamais pris au dépourvu, et c'est ça qui compte.",
    t:["Espion","Curieux","Prévoyant","Paranoïaque","Informé"]},
  killjoy:{u:"1e58de9c-4950-5125-93e9-a0aee9f98746",n:"KILLJOY",r:"SENTINELLE",c:["#f5e04a","#b09018"],
    q:"« J'avais déjà tout installé, évidemment. »",
    d:"Brillante, geek, hyper organisée. Tu n'improvises pas : tu construis, tu testes, tu optimises. Ton setup est prêt avant que le problème existe. Confiante dans ton intelligence, tu as un petit côté « je vous l'avais dit » totalement mérité.",
    t:["Ingénieux","Organisé","Intelligent","Préparé","Technique"]},
  chamber:{u:"22697a3d-45bf-8dd7-4fec-84a9e28c69d7",n:"CHAMBER",r:"SENTINELLE",c:["#e8c98a","#8a6a2a"],
    q:"« Le style, ça ne s'achète pas. Enfin… si. »",
    d:"Élégant, précis, un brin arrogant. Tu aimes les belles choses, le travail bien fait et les solutions propres. Tu gardes tes distances — au sens propre — et tu frappes une seule fois, mais parfaitement. La classe est ton arme secondaire.",
    t:["Élégant","Précis","Arrogant","Raffiné","Distant"]},
  deadlock:{u:"cc8b64c8-4b25-4ff9-6e7f-37b4da43d235",n:"DEADLOCK",r:"SENTINELLE",c:["#c9cfd6","#4a5560"],
    q:"« Personne ne passe. Point. »",
    d:"Discipline militaire, zéro fantaisie. Tu tiens ta position, tu respectes tes engagements et tu attends la même chose des autres. Tu ne parles pas pour ne rien dire et tu détestes le désordre. Quand tu verrouilles quelque chose, ça reste verrouillé.",
    t:["Discipliné","Rigoureux","Tenace","Sérieux","Inflexible"]},
  vyse:{u:"efba5359-4016-a1e5-7626-b1ae76895940",n:"VYSE",r:"SENTINELLE",c:["#b0b8c4","#3d2b5c"],
    q:"« Tu es déjà dans mon piège. »",
    d:"Silencieuse, patiente, machiavélique. Tu ne poursuis pas tes proies : tu les laisses venir. Tu construis tes pièges dans l'ombre et tu attends, sans jamais t'impatienter. Personne ne sait vraiment ce que tu prépares, et c'est exactement le but.",
    t:["Patient","Calculateur","Mystérieux","Piégeur","Impassible"]}
};

const ROLE_LIST = ["DUELLISTE","INITIATEUR","CONTRÔLEUR","SENTINELLE"];

/* =========================================================
   DONNÉES GAMEPLAY (test 2)
   d = difficulté /5 · w = pourquoi il te va · t = 3 conseils
   ========================================================= */
const PLAY = {
  jett:{d:4,w:"Tu as les réflexes et la visée pour prendre les duels que les autres refusent. Jett te donne la mobilité pour entrer, tuer, et ressortir avant que la riposte arrive — mais elle ne pardonne aucune erreur de timing : ratée, tu meurs seul et sans utilitaire pour l'équipe.",
    t:["Garde ton dash pour SORTIR d'un duel, pas pour y entrer : c'est ce qui sépare une Jett Fer d'une Jett Immortel.","L'updraft sert à prendre des angles que personne ne surveille (au-dessus des caisses, sur les toits), pas juste à sauter en l'air.","Elle rend l'Operator rentable : même un tir raté ne coûte rien si tu peux dash pour te dégager."]},
  phoenix:{d:2,w:"Tu veux entrer en premier sans dépendre de personne : Phoenix se flashe lui-même, se soigne lui-même et revient à la vie avec son ultime. C'est l'entry le plus indulgent du jeu — parfait pour apprendre l'agression sans être puni à chaque erreur.",
    t:["Sa flash se courbe : lance-la en clic droit derrière un mur pour aveugler sans t'exposer.","Reste dans ton propre mur de feu quand tu prends un duel : tu te soignes pendant qu'il brûle.","Son ultime est un ticket gratuit : utilise-le pour prendre l'info sur un site, mourir n'a aucune conséquence."]},
  raze:{d:3,w:"Tu joues à l'instinct et tu adores forcer le passage. Raze déloge n'importe quel joueur retranché sans avoir besoin de gagner un duel de visée — et ses satchels offrent l'un des mouvements les plus rapides du jeu une fois maîtrisés.",
    t:["Le double satchel (les deux d'un coup, en sautant) te propulse sur tout un site : c'est la compétence à travailler en premier.","Le Boombot n'est pas qu'un dégât : c'est de l'info gratuite sur un angle avant d'y entrer.","Sa grenade tue rarement seule — sers-t'en pour déloger, puis tire sur celui qui bouge."]},
  reyna:{d:1,w:"Ton aim est ta vraie compétence, et tu veux jouer sans dépendre de ton équipe. Reyna transforme chaque élimination en soin ou en invulnérabilité : si tu gagnes tes duels, tu peux gagner un round seul. Si tu les perds, tu n'apportes rien — c'est le pari.",
    t:["Devour (soin) quand tu comptes rester, Dismiss (fuite) quand tu es exposé : décide AVANT le duel.","Elle n'a aucun utilitaire pour l'équipe : préviens en début de partie, quelqu'un doit prendre un initiateur.","Son ultime rend le rechargement instantané — enchaîne les duels au lieu de te cacher pour recharger."]},
  yoru:{d:5,w:"Tu joues seul, dans le dos des gens, et tu adores manipuler ce que l'ennemi croit savoir. Yoru récompense la connaissance du jeu plus que la visée — mais un Yoru qui n'a pas de plan est un joueur en moins pour son équipe.",
    t:["Le faux pas ne marche que si tu le rends crédible : lance-le pendant que l'équipe fait du bruit ailleurs.","Ne te téléporte pas au hasard : place ton TP en début de round là où tu voudras être 30 secondes plus tard.","Son ultime sert surtout à récupérer de l'info et à repositionner, pas à foncer sur cinq joueurs."]},
  neon:{d:4,w:"Tu es impatient et tu veux la vitesse pure. Neon arrive sur un site avant que la défense soit en place et coupe les rotations avec ses murs. La difficulté : tirer correctement en glissant, ce qui demande de vraies heures d'entraînement.",
    t:["Arrête ton sprint AVANT le duel : on ne tire pas correctement en courant.","La glissade sert à passer un angle ouvert, pas à engager — glisse, puis stoppe, puis tire.","Ses murs bloquent les rotations : place-les pour isoler un site, pas juste devant toi."]},
  iso:{d:2,w:"Tu veux du duel pur, un contre un, sans dépendre de l'équipe. Iso se donne un bouclier qui absorbe une balle : ça transforme chaque duel gagnable en duel gagné. Simple à prendre en main, redoutable si ta visée suit.",
    t:["Active ton bouclier AVANT de prendre l'angle, jamais pendant : l'animation te ralentit.","Chaque élimination recharge ton bouclier — enchaîne les duels au lieu de temporiser.","Son ultime isole un ennemi dans une arène : prends-le sur leur meilleur joueur, pas sur le premier venu."]},
  sova:{d:4,w:"Tu es patient et tu acceptes de passer du temps en practice. Sova transforme le travail hors partie (les lineups de flèches) en information qui gagne des rounds. C'est l'agent qui récompense le plus la préparation.",
    t:["Apprends 2 lineups de flèche recon par carte, pas 15 : deux bien maîtrisés valent mieux que dix approximatifs.","Le drone sert à faire réagir l'ennemi autant qu'à le voir : il révèle des positions rien qu'en le forçant à tirer.","Sa flèche à choc tue les Cypher/Killjoy retranchés et casse leur utilitaire à distance."]},
  breach:{d:2,w:"Tu veux ouvrir les sites sans avoir besoin d'une visée exceptionnelle. Breach aveugle et étourdit à travers les murs, donc sans jamais s'exposer. Condition : ton équipe doit suivre derrière, sinon ton utilitaire part dans le vide.",
    t:["Compte à voix haute avant de lancer ta flash pour que l'équipe entre au bon moment : sans ça, tu ne sers à rien.","Tes compétences traversent les murs — tu n'as JAMAIS besoin de te montrer pour les utiliser.","Son ultime sert à ouvrir un site, pas à finir un round : garde-le pour l'entrée."]},
  skye:{d:3,w:"Tu joues pour l'équipe et tu aimes tenir plusieurs rôles à la fois. Skye donne de l'info, aveugle pour l'entrée et soigne ses coéquipiers — un couteau suisse qui rend n'importe quelle équipe plus solide.",
    t:["Ton oiseau (flash) se pilote : courbe-le derrière l'angle plutôt que de le lancer tout droit.","Le loup révèle ET fait fuir : envoie-le en premier sur un site pour savoir s'il est tenu.","Tes soins ne se rechargent pas sur toi — soigne les coéquipiers avant de reprendre un duel."]},
  kayo:{d:3,w:"Tu as une bonne visée mais tu veux quand même apporter à l'équipe. KAY/O combine des flashs très fortes avec une capacité qui empêche les ennemis d'utiliser leur utilitaire — l'agent parfait entre le frag et le soutien.",
    t:["Le couteau de suppression avant une prise de site : sans utilitaire, les défenseurs ne peuvent plus rien bloquer.","Sa flash peut être relâchée plus tôt (clic droit) pour surprendre un ennemi qui l'attend.","Son ultime te relève si un coéquipier vient te réanimer : joue-le agressivement, c'est fait pour."]},
  fade:{d:3,w:"Tu aimes traquer et prendre l'info de façon agressive. Fade révèle les positions et marque ses cibles avec un utilitaire facile à lancer, sans lineups compliqués — de l'information immédiate pour un investissement réduit.",
    t:["Le Prowler se dirige : lâche le clic droit et il se verrouille sur le premier ennemi vu.","Haunt révèle la zone : lance-le AVANT d'entrer, pas quand tu es déjà en train de te faire tirer dessus.","Les ennemis marqués laissent des traces au sol — apprends à lire ces traces plutôt que de les ignorer."]},
  gekko:{d:2,w:"Tu veux du fun et un agent qui pardonne. Gekko est le seul dont l'utilitaire se récupère après usage : tu peux te tromper, ramasser ta créature et recommencer. Idéal si tu progresses en jouant plutôt qu'en t'entraînant.",
    t:["Ramasse toujours tes créatures après usage : deux flashs par round au lieu d'une, c'est énorme.","Le Wingman peut planter ET désamorcer la Spike tout seul : garde-le pour les fins de round.","Son ultime attrape plusieurs ennemis à la fois et se récupère : n'aie pas peur de le lancer tôt."]},
  brimstone:{d:1,w:"Tu veux jouer tout de suite sans passer par le practice. Brimstone pose ses fumigènes sur une carte, en un clic, depuis n'importe où — c'est le contrôleur le plus simple du jeu, et il reste efficace à tous les niveaux.",
    t:["Pose tes 3 fumigènes d'un coup au début de la prise de site : ne les garde pas « au cas où ».","Le Stim Beacon augmente la cadence de tir de toute l'équipe : lance-le avant chaque entrée.","Son ultime déloge n'importe qui d'un angle : utilise-le sur un joueur planté, pas au hasard."]},
  omen:{d:4,w:"Tu es à l'aise partout et tu aimes surprendre. Omen fume, se téléporte et réapparaît là où personne ne l'attend. Il demande une bonne lecture du jeu, mais c'est le contrôleur le plus flexible : il peut jouer devant comme derrière.",
    t:["Tes fumigènes se replacent à la volée : rappelle-les et repose-les au lieu de subir un mauvais placement.","Le TP court est une arme : téléporte-toi DERRIÈRE l'ennemi pendant qu'il regarde ta fumée.","Ton ultime fait du bruit à l'arrivée — sers-t'en surtout pour l'info ou pour désamorcer, pas pour fragger."]},
  viper:{d:4,w:"Tu es discipliné, tu acceptes de bosser tes placements et tu aimes contrôler le terrain. Viper coupe littéralement les sites en deux et rend des rounds injouables pour l'adversaire — mais elle exige de gérer son carburant et d'apprendre ses murs.",
    t:["Surveille ta jauge de carburant : un mur qui tombe au mauvais moment perd le round.","Apprends 1 mur par carte et par côté, c'est déjà suffisant pour être fort.","Ses one-way (fumée placée pour que tu voies sans être vu) gagnent des duels sans viser."]},
  astra:{d:5,w:"Tu réfléchis avant d'agir et tu veux l'agent le plus cérébral du jeu. Astra place ses étoiles à l'avance partout sur la carte et contrôle des zones où elle n'est même pas. C'est le plafond de maîtrise le plus haut de Valorant.",
    t:["Place tes étoiles PENDANT la phase d'achat : en pleine action tu n'auras pas le temps.","En forme astrale tu es aveugle et vulnérable — préviens l'équipe avant d'y passer.","Garde toujours une étoile pour la retenue (le pull) : c'est ce qui casse une prise de site ennemie."]},
  harbor:{d:3,w:"Tu joues avec ton équipe et tu aimes avancer en bloc. Harbor crée des murs d'eau traversables qui protègent la progression du groupe — un contrôleur agressif qui prend le terrain au lieu de juste le cacher.",
    t:["Ton mur se pilote en le maintenant : courbe-le pour couvrir deux angles au lieu d'un.","Avance DANS ton propre mur avec l'équipe : l'ennemi ne peut pas viser à travers, vous si (de près).","Sa bulle bloque une balle : pose-la sur la Spike pendant le désamorçage."]},
  clove:{d:2,w:"Tu joues solo et tu veux un contrôleur qui ne dépend de personne. Clove peut poser ses fumigènes même après sa mort et se relever seul — c'est le seul contrôleur qui peut jouer agressivement sans pénaliser l'équipe quand il meurt.",
    t:["Tu peux fumer APRÈS ta mort : ne lâche pas ton clavier quand tu tombes, continue de couvrir l'équipe.","Ton ultime te relève, mais il faut une élimination ou une assistance rapide : reviens dans le combat, pas à l'abri.","Tu es un contrôleur qui peut entrer en premier : profites-en, peu d'agents le peuvent."]},
  sage:{d:2,w:"Tu veux être utile même quand ta visée n'est pas au rendez-vous. Le vrai talent de Sage, c'est le placement de son mur : bien posé, il gagne un round à lui seul, sans tirer une balle. Simple à jouer, difficile à jouer parfaitement.",
    t:["Ton mur sert à COUPER une entrée, pas à te cacher derrière : apprends 2 placements par carte.","L'orbe ralentissante sur la Spike pendant un désamorçage force l'ennemi à se montrer.","Garde ta résurrection pour ton meilleur joueur en fin de round, pas pour le premier mort."]},
  cypher:{d:3,w:"Tu veux savoir avant d'agir et tu aimes préparer le terrain. Cypher verrouille un flanc entier tout seul avec ses caméras et ses fils, ce qui libère le reste de l'équipe. Peu de visée demandée, beaucoup de lecture du jeu.",
    t:["Place tes fils là où l'ennemi ne regarde pas (au sol, dans les coins), pas en travers du couloir à hauteur d'yeux.","La caméra sert à surveiller pendant que tu joues ailleurs — regarde-la entre deux duels, pas en permanence.","Son ultime révèle TOUTE l'équipe ennemie : utilise-le en fin de round, quand l'info compte le plus."]},
  killjoy:{d:2,w:"Tu es organisé et tu aimes tout préparer à l'avance. Killjoy pose son matériel et laisse la machine travailler : son setup fait le boulot pendant que tu tiens ton angle. Très efficace pour tenir un site, très simple à comprendre.",
    t:["Ton alarmbot doit être caché HORS de la ligne de vue, sinon il se fait détruire gratuitement.","La tourelle ralentit ET donne l'info : place-la pour couvrir le côté que tu ne regardes pas.","Son ultime force le retrait : utilise-le pour reprendre un site après la pose de la Spike."]},
  chamber:{d:3,w:"Tu as une bonne visée et tu aimes tenir des angles avec une porte de sortie. Chamber donne un sniper gratuit et une téléportation qui te sort de tout mauvais duel. Le style « je tire et je disparais » à l'état pur.",
    t:["Pose ton ancre de téléportation AVANT de prendre l'angle : c'est ta porte de sortie, pas un gadget.","Son pistolet est un one-shot à la tête même en pistol round : tu peux gagner de l'économie très tôt.","Tu es une sentinelle : tu dois quand même tenir ton flanc, pas juste chercher des kills."]},
  deadlock:{d:2,w:"Tu es rigoureux et tu veux tenir une position sans te compliquer la vie. Deadlock bloque les entrées avec un filet et détecte les déplacements bruyants — un ancrage de site direct et lisible, sans lineups à apprendre.",
    t:["Le capteur sonore couvre un couloir entier : place-le sur la rotation, pas sur le site lui-même.","Le filet ralentit l'entrée — pose-le au sol devant l'entrée, l'ennemi devra le détruire et faire du bruit.","Son ultime traverse les murs et capture un ennemi : utilise-le pour isoler le dernier survivant."]},
  vyse:{d:3,w:"Tu es patient et tu aimes que l'ennemi tombe dans un piège que tu as posé cinq minutes plus tôt. Vyse contrôle les entrées avec un métal liquide qui bloque et aveugle — une sentinelle moderne qui punit les entrées trop rapides.",
    t:["Ses pièges sont invisibles jusqu'à l'activation : pose-les sur les chemins d'entrée classiques, l'ennemi ne les verra pas venir.","Le mur de ronces bloque une entrée entière : garde-le pour le moment où ils s'engagent, pas en début de round.","Son ultime enraye les armes ennemies : déclenche-le juste avant que ton équipe reprenne le site."]}
};

/* =========================================================
   LES 24 QUESTIONS
   ========================================================= */
const QUESTIONS = [
{q:"Comment tu entres sur un site ?",a:[
 {t:"Je fonce en premier, on verra bien ce qui se passe",s:{jett:3,raze:3,neon:3,breach:3,reyna:2,phoenix:2}},
 {t:"J'attends que quelqu'un ouvre, et je suis juste derrière",s:{brimstone:2,harbor:2,sage:2,skye:2,gekko:2,kayo:1}},
 {t:"Je passe par un flanc que personne ne surveille",s:{yoru:3,omen:3,fade:2,cypher:2,chamber:2,iso:1}},
 {t:"Je ne rentre pas : je tiens le site et j'attends",s:{cypher:3,killjoy:3,deadlock:3,vyse:3,sage:2,viper:1}}]},

{q:"Ton arme de prédilection ?",a:[
 {t:"Vandal — un tap propre, une élimination",s:{sova:2,chamber:2,viper:2,kayo:2,deadlock:2,iso:1}},
 {t:"Operator — je tiens l'angle et je ne bouge pas",s:{chamber:3,killjoy:2,deadlock:2,vyse:2,cypher:1}},
 {t:"Judge — le chaos rapproché, c'est ma spécialité",s:{raze:3,breach:3,reyna:2,neon:2,phoenix:2,clove:2}},
 {t:"Classic. Un ace au pistolet, pourquoi pas ?",s:{gekko:2,clove:3,yoru:2,raze:2,jett:2}}]},

{q:"Un pouvoir surnaturel, tu prends lequel ?",a:[
 {t:"La téléportation",s:{omen:3,yoru:3,jett:2,clove:2}},
 {t:"Contrôler la matière autour de moi",s:{astra:3,viper:2,vyse:2,harbor:3,killjoy:1}},
 {t:"Voir à travers les murs",s:{sova:4,cypher:3,fade:2,killjoy:2}},
 {t:"Revenir à la vie après la mort",s:{clove:3,reyna:3,sage:2,phoenix:3}}]},

{q:"Ton plus gros défaut, en toute honnêteté ?",a:[
 {t:"Je suis trop égoïste, je joue pour moi",s:{reyna:3,jett:2,yoru:2,chamber:2,iso:2}},
 {t:"Je veux tout contrôler, je ne lâche jamais rien",s:{viper:3,deadlock:3,killjoy:2,astra:2,cypher:2}},
 {t:"Je suis beaucoup trop impulsif",s:{breach:4,raze:3,neon:3,phoenix:2}},
 {t:"Je garde tout pour moi, je parle très peu",s:{omen:3,fade:3,iso:2,vyse:2,cypher:2}}]},

{q:"Ton équipe est menée 0-8. Ta réaction ?",a:[
 {t:"Je garde mon calme et je recadre le plan",s:{brimstone:3,astra:2,sage:2,harbor:2,kayo:2}},
 {t:"Je décide de tout carry moi-même",s:{reyna:3,jett:3,chamber:2,iso:2,neon:1}},
 {t:"Je tente un truc complètement absurde pour relancer",s:{raze:3,gekko:3,clove:2,yoru:2,neon:2}},
 {t:"Je mute tout le monde et je joue mon jeu",s:{viper:3,iso:3,yoru:2,omen:2,fade:2}}]},

{q:"Ton élément, ce serait…",a:[
 {t:"Le feu",s:{phoenix:4,brimstone:2,raze:2,breach:2}},
 {t:"L'eau et la brume",s:{harbor:3,viper:2,omen:2,astra:2}},
 {t:"La foudre et l'électricité",s:{neon:3,breach:3,kayo:2,gekko:2}},
 {t:"L'ombre et le néant",s:{omen:3,fade:3,yoru:2,iso:2,clove:2}}]},

{q:"Comment tu prépares quelque chose d'important ?",a:[
 {t:"Plan détaillé, timings, tout est écrit à l'avance",s:{killjoy:3,astra:3,brimstone:2,viper:2,deadlock:2}},
 {t:"Je récolte un maximum d'informations avant de bouger",s:{sova:4,cypher:3,fade:2,vyse:2,astra:1}},
 {t:"J'improvise, ça passe toujours",s:{raze:3,phoenix:3,jett:2,gekko:2,clove:2}},
 {t:"Je m'entraîne seul jusqu'à être irréprochable",s:{iso:3,chamber:2,deadlock:2,sage:2,kayo:2}}]},

{q:"Ta soirée idéale ?",a:[
 {t:"Une grosse fête avec tous mes potes",s:{phoenix:3,raze:3,gekko:3,neon:2,clove:2}},
 {t:"Un bon restaurant, tenue impeccable",s:{chamber:3,astra:2,reyna:2,vyse:2}},
 {t:"Chez moi, seul, au calme",s:{omen:3,iso:3,cypher:2,fade:2,viper:2}},
 {t:"Sur un projet perso jusqu'à 4h du matin",s:{killjoy:3,sova:2,deadlock:2,vyse:2,kayo:2}}]},

{q:"Quelqu'un t'insulte en vocal. Tu fais quoi ?",a:[
 {t:"Je réponds encore plus fort",s:{breach:4,reyna:2,neon:2,phoenix:2}},
 {t:"J'ignore complètement, ça ne m'atteint pas",s:{kayo:3,sage:3,iso:2,omen:2,deadlock:2}},
 {t:"Je réponds avec une punchline bien placée",s:{jett:3,clove:3,chamber:2,gekko:2}},
 {t:"Je note son pseudo. Je n'oublie jamais.",s:{cypher:3,viper:3,fade:3,vyse:2}}]},

{q:"Ton rôle dans ton groupe d'amis ?",a:[
 {t:"Le leader, celui qui organise tout",s:{brimstone:3,astra:2,killjoy:2,deadlock:2}},
 {t:"Le clown qui met l'ambiance",s:{raze:3,gekko:3,clove:3,phoenix:2,neon:2}},
 {t:"Celui qui écoute et qui rassure",s:{skye:4,sage:3,harbor:3,gekko:2}},
 {t:"Le mystérieux dont personne ne sait grand-chose",s:{omen:3,fade:3,cypher:3,vyse:2,yoru:2,iso:2}}]},

{q:"Choisis un animal.",a:[
 {t:"Le loup",s:{skye:3,breach:3,fade:2,deadlock:2,sova:2}},
 {t:"Le chat",s:{jett:2,yoru:2,clove:2,reyna:2,cypher:1}},
 {t:"Le serpent",s:{viper:3,vyse:2,omen:2,iso:2}},
 {t:"Le rapace",s:{sova:4,jett:2,skye:2,astra:2,chamber:1}}]},

{q:"Qu'est-ce qui te motive vraiment ?",a:[
 {t:"Gagner. Être le meilleur, tout simplement.",s:{reyna:3,iso:3,jett:2,chamber:2,neon:2}},
 {t:"Protéger les gens auxquels je tiens",s:{skye:4,sage:3,harbor:3,brimstone:2,gekko:2}},
 {t:"Comprendre, savoir, tout maîtriser",s:{cypher:3,killjoy:3,astra:2,sova:2,vyse:2}},
 {t:"Prouver quelque chose. Ou me venger.",s:{viper:3,fade:3,yoru:3,breach:2,deadlock:2}}]},

{q:"Une couleur ?",a:[
 {t:"Rouge sang",s:{reyna:2,breach:3,phoenix:2,raze:2}},
 {t:"Vert toxique",s:{viper:3,skye:2,gekko:2,killjoy:2}},
 {t:"Violet nuit",s:{omen:3,astra:3,fade:2,clove:2,vyse:2}},
 {t:"Blanc argenté",s:{jett:3,chamber:3,sage:2,kayo:2,iso:2}}]},

{q:"Dans un film d'horreur, tu serais…",a:[
 {t:"Celui qui meurt en premier en courant partout",s:{neon:3,raze:2,phoenix:2}},
 {t:"Le survivant qui garde son sang-froid",s:{kayo:3,deadlock:3,sage:2,brimstone:2,harbor:2}},
 {t:"Le monstre",s:{fade:3,viper:3,omen:2,vyse:2,iso:2}},
 {t:"Celui qui a préparé des pièges partout",s:{killjoy:3,cypher:3,vyse:3,deadlock:2}}]},

{q:"Ta façon de te déplacer ?",a:[
 {t:"Je cours. Tout le temps.",s:{neon:3,jett:3,raze:2,phoenix:2}},
 {t:"En silence, dans le dos des gens",s:{yoru:3,omen:2,fade:2,cypher:1,iso:1}},
 {t:"Posé, je prends mon temps",s:{brimstone:3,harbor:2,sage:2,deadlock:2,viper:1}},
 {t:"J'observe longuement avant de bouger",s:{sova:4,vyse:2,astra:2,killjoy:2,cypher:1}}]},

{q:"Un coéquipier fait une erreur énorme.",a:[
 {t:"« C'est rien, on repart, focus »",s:{sage:3,gekko:3,harbor:3,skye:2}},
 {t:"Je lui explique calmement quoi faire la prochaine fois",s:{brimstone:3,astra:2,kayo:2,deadlock:2,sova:2}},
 {t:"Je le charrie gentiment pour dédramatiser",s:{clove:3,gekko:2,phoenix:2,raze:2,jett:2}},
 {t:"Je soupire et je joue solo à partir de maintenant",s:{reyna:2,viper:2,iso:2,yoru:2,chamber:2}}]},

{q:"Ce qui te fait le plus peur ?",a:[
 {t:"Perdre le contrôle de la situation",s:{viper:3,deadlock:3,killjoy:2,astra:2,vyse:2}},
 {t:"Être ignoré, oublié",s:{reyna:3,yoru:3,phoenix:3,clove:2,neon:2}},
 {t:"Perdre quelqu'un à qui je tiens",s:{sage:3,brimstone:3,clove:3,skye:2,harbor:2}},
 {t:"Rien. Sincèrement.",s:{kayo:3,iso:3,fade:2,chamber:2}}]},

{q:"Ton style vestimentaire ?",a:[
 {t:"Streetwear, couleurs vives",s:{neon:3,raze:3,gekko:3,clove:2}},
 {t:"Costume, classe, sur mesure",s:{chamber:3,astra:2,vyse:2,reyna:2}},
 {t:"Tenue tactique / militaire",s:{brimstone:3,deadlock:3,kayo:3,breach:3,sova:2}},
 {t:"Sombre, capuche, discret",s:{omen:3,yoru:3,fade:3,iso:2,cypher:2}}]},

{q:"Ta punchline avant un round décisif ?",a:[
 {t:"« Regardez-moi bien. »",s:{reyna:3,phoenix:3,jett:2,chamber:2,iso:2}},
 {t:"« Je suis déjà derrière vous. »",s:{yoru:3,omen:3,fade:2,vyse:2}},
 {t:"« Tenez-vous prêts, j'ai un plan. »",s:{brimstone:3,astra:2,killjoy:2,sova:2,kayo:2}},
 {t:"« T'inquiète, je te couvre. »",s:{harbor:4,sage:3,skye:3,gekko:2,brimstone:2}}]},

{q:"Vous gagnez le round. Ta réaction ?",a:[
 {t:"Je danse, j'emote, je célèbre",s:{raze:3,gekko:3,clove:3,neon:2,phoenix:2}},
 {t:"« gg » et je passe au round suivant",s:{kayo:3,deadlock:2,sova:2,vyse:2,cypher:1}},
 {t:"Je rappelle à tout le monde que c'était grâce à moi",s:{reyna:3,chamber:2,jett:2,phoenix:2}},
 {t:"J'analyse déjà comment ils vont réagir après",s:{astra:3,killjoy:2,brimstone:2,viper:1,cypher:1}}]},

{q:"On te propose de tricher pour gagner.",a:[
 {t:"Jamais. L'honneur avant tout.",s:{sage:3,deadlock:3,kayo:2,brimstone:2,harbor:2}},
 {t:"Si personne ne le sait… pourquoi pas",s:{chamber:3,yoru:3,cypher:2,clove:2}},
 {t:"Évidemment. Tous les moyens sont bons.",s:{viper:3,reyna:2,iso:2,vyse:2}},
 {t:"Non, je préfère gagner en étant plus malin qu'eux",s:{cypher:3,killjoy:2,astra:2,fade:2,sova:2}}]},

{q:"Comment tu résous un problème ?",a:[
 {t:"Je fonce dedans jusqu'à ce que ça cède",s:{breach:4,raze:3,neon:2,reyna:2}},
 {t:"Je le contourne intelligemment",s:{yoru:2,astra:2,clove:2,gekko:2,omen:2,cypher:1}},
 {t:"Je demande de l'aide, on est plus forts à plusieurs",s:{skye:4,gekko:2,sage:2,harbor:2,brimstone:2}},
 {t:"Je démonte tout pour comprendre comment ça marche",s:{killjoy:3,vyse:3,sova:2,kayo:2}}]},

{q:"Où est-ce que tu te sens le mieux ?",a:[
 {t:"En pleine nature, dans une forêt",s:{skye:4,sova:3,fade:2,breach:2}},
 {t:"Devant un écran ou dans un atelier",s:{killjoy:3,kayo:2,vyse:2,cypher:1}},
 {t:"Au bord de l'eau, sous la pluie",s:{harbor:4,astra:2,clove:2,viper:1}},
 {t:"Dans une grande ville, la nuit",s:{neon:3,chamber:2,omen:2,yoru:2,reyna:1}}]},

{q:"Le meilleur moment d'une partie, pour toi ?",a:[
 {t:"Le clutch 1v3 que je gagne seul",s:{jett:3,reyna:3,iso:3,chamber:2}},
 {t:"La combo parfaite exécutée avec l'équipe",s:{breach:4,skye:4,brimstone:2,astra:2,kayo:2,harbor:2}},
 {t:"Le moment où l'ennemi ne comprend absolument rien",s:{yoru:3,fade:3,omen:2,gekko:2,cypher:2}},
 {t:"Le setup qui bloque tout et les frustre à mort",s:{viper:3,sage:3,harbor:3,vyse:3,deadlock:2,killjoy:2}}]}
];

/* =========================================================
   LES 20 QUESTIONS DU TEST GAMEPLAY
   ========================================================= */
const QUESTIONS_JEU = [
{q:"Ta visée, honnêtement ?",a:[
 {t:"C'est ma force, je gagne mes duels",s:{reyna:4,jett:3,chamber:3,iso:3,kayo:3,neon:2,phoenix:2}},
 {t:"Correcte, sans plus",s:{phoenix:3,skye:2,fade:2,breach:2,gekko:2,clove:2,omen:2,kayo:2}},
 {t:"C'est ma faiblesse, je compense autrement",s:{brimstone:4,killjoy:3,cypher:3,viper:3,astra:3,deadlock:3,vyse:3,sage:2,harbor:2}},
 {t:"Très inconstante, ça dépend des jours",s:{gekko:3,skye:3,brimstone:2,sage:2,breach:2,harbor:2,clove:2}}]},

{q:"Sur une prise de site, ta place c'est où ?",a:[
 {t:"Premier dedans, j'ouvre le duel",s:{raze:4,phoenix:4,reyna:4,neon:4,jett:3,iso:2}},
 {t:"Juste derrière, je nettoie avec l'utilitaire",s:{breach:4,kayo:3,skye:3,fade:3,sova:3,gekko:3}},
 {t:"Au milieu, je fume et je gère l'espace",s:{brimstone:4,harbor:4,omen:3,astra:3,viper:3,clove:3}},
 {t:"Derrière, je couvre le flanc et la sortie",s:{deadlock:4,cypher:3,killjoy:3,sage:3,vyse:3,chamber:3}}]},

{q:"En défense, tu fais quoi ?",a:[
 {t:"J'agresse dès le début du round",s:{jett:3,reyna:3,neon:3,iso:3,raze:2,phoenix:2,chamber:2}},
 {t:"Je pose mon setup et j'attends sur le site",s:{vyse:5,killjoy:4,cypher:4,deadlock:4,sage:3,viper:2}},
 {t:"Je prends l'info puis je tourne",s:{fade:4,sova:3,skye:3,kayo:3,gekko:3,breach:2}},
 {t:"Je bloque les angles et je ralentis leur push",s:{viper:4,harbor:3,astra:3,brimstone:3,sage:3,omen:2}}]},

{q:"Apprendre des lineups par cœur (les positions exactes pour lancer ton utilitaire) ?",a:[
 {t:"J'adore, je passe des heures en practice",s:{sova:5,viper:4,brimstone:3,killjoy:3,harbor:3,astra:3,fade:2}},
 {t:"Quelques-uns, les plus utiles",s:{raze:3,killjoy:2,sova:2,breach:2,skye:2,omen:2,gekko:2}},
 {t:"Non, je joue à l'instinct",s:{reyna:4,jett:3,phoenix:3,neon:3,iso:3,clove:2,yoru:2}},
 {t:"Je préfère les compétences qui marchent sans préparation",s:{phoenix:3,gekko:3,sage:3,deadlock:3,breach:3,clove:3,chamber:2}}]},

{q:"Ton déplacement en jeu ?",a:[
 {t:"Je bouge sans arrêt, vite et agressif",s:{neon:5,jett:3,raze:3,phoenix:2,yoru:2}},
 {t:"Lentement, je joue au son",s:{cypher:3,viper:3,deadlock:3,vyse:3,killjoy:2,sage:2,omen:2}},
 {t:"Je me téléporte, je prends des chemins bizarres",s:{omen:4,yoru:4,raze:3,chamber:3,jett:2}},
 {t:"Groupé avec l'équipe, on avance ensemble",s:{harbor:4,sage:3,brimstone:3,skye:3,gekko:3,breach:3,kayo:2}}]},

{q:"Tu joues surtout…",a:[
 {t:"En solo queue, sans compter sur personne",s:{reyna:4,iso:4,jett:3,phoenix:3,yoru:3,clove:2,neon:2}},
 {t:"En équipe, tout le monde en vocal",s:{breach:4,astra:4,sova:3,skye:3,harbor:3,brimstone:3,kayo:3}},
 {t:"Les deux, ça dépend des soirs",s:{gekko:3,omen:2,killjoy:2,viper:2,fade:2,sage:2,chamber:2}},
 {t:"En duo avec un pote qui joue avec moi",s:{skye:3,breach:3,sage:3,kayo:3,brimstone:2,gekko:2}}]},

{q:"Tu veux un agent…",a:[
 {t:"Facile, jouable tout de suite",s:{brimstone:4,phoenix:4,reyna:4,sage:3,gekko:3,deadlock:3,breach:3}},
 {t:"Avec un énorme plafond de progression",s:{astra:4,viper:4,yoru:4,neon:4,jett:3,chamber:3,raze:3,omen:3,sova:3}},
 {t:"Équilibré, ni trop simple ni trop dur",s:{skye:3,killjoy:3,fade:3,kayo:3,harbor:3,clove:3,iso:3,cypher:3}},
 {t:"Que peu de gens maîtrisent, pour sortir du lot",s:{vyse:5,astra:4,yoru:3,harbor:3,iso:3,deadlock:3,clove:2}}]},

{q:"Ce qui te fait le plus plaisir en jeu ?",a:[
 {t:"Un ace ou un gros clutch",s:{reyna:4,jett:4,iso:4,chamber:3,neon:3,phoenix:3}},
 {t:"Une flash parfaite qui donne 3 kills à l'équipe",s:{kayo:5,breach:4,skye:3,sova:3,fade:3,gekko:3}},
 {t:"Un mur ou une fumée qui bloque tout un round",s:{viper:4,harbor:4,sage:3,astra:3,brimstone:3,omen:3}},
 {t:"Un piège qui attrape l'ennemi et sauve le round",s:{vyse:5,cypher:4,killjoy:4,deadlock:4}}]},

{q:"Tu communiques beaucoup en vocal ?",a:[
 {t:"Non, je joue quasiment muet",s:{reyna:3,iso:3,yoru:3,jett:2,clove:2,neon:2,phoenix:2}},
 {t:"Oui, je call tout ce que je vois",s:{sova:5,cypher:4,skye:3,fade:3,kayo:3,gekko:2}},
 {t:"Je donne les consignes, j'organise l'équipe",s:{brimstone:4,astra:4,viper:3,harbor:3,omen:2}},
 {t:"Le strict minimum utile",s:{deadlock:4,vyse:3,chamber:3,killjoy:2,sage:2,raze:2}}]},

{q:"Ton achat préféré ?",a:[
 {t:"Vandal ou Phantom, je suis là pour fragger",s:{kayo:4,reyna:3,jett:3,iso:3,neon:2,phoenix:2,yoru:2}},
 {t:"Operator",s:{chamber:4,jett:4}},
 {t:"Peu importe, j'achète mon utilitaire complet d'abord",s:{brimstone:4,astra:4,viper:3,killjoy:3,harbor:3,sova:3,skye:3,sage:3}},
 {t:"Shorty ou Judge, je joue les angles serrés",s:{raze:3,killjoy:2,sage:2,deadlock:2,cypher:2,vyse:2,gekko:2}}]},

{q:"Mourir en premier presque chaque round, tu le vis comment ?",a:[
 {t:"C'est mon rôle, j'ouvre le round",s:{raze:4,phoenix:4,neon:4,jett:3,reyna:3,breach:2}},
 {t:"Mal, je veux rester en vie le plus longtemps possible",s:{cypher:4,chamber:4,killjoy:3,sage:3,deadlock:3,vyse:3,viper:2}},
 {t:"Ça m'est égal si ça sert à l'équipe",s:{kayo:4,skye:3,breach:3,brimstone:3,harbor:3,gekko:3,sova:2}},
 {t:"Je préfère mourir en dernier, en lurk",s:{yoru:4,omen:3,cypher:2,fade:2,iso:2,chamber:2}}]},

{q:"Tu veux passer combien de temps à t'entraîner hors partie ?",a:[
 {t:"Beaucoup, je veux maîtriser à fond",s:{viper:4,astra:4,sova:4,jett:3,chamber:3,yoru:3,raze:3}},
 {t:"Un peu, juste les bases",s:{skye:2,fade:2,killjoy:2,kayo:2,omen:2,clove:2,harbor:2,iso:2,cypher:2}},
 {t:"Zéro, je veux jouer directement",s:{reyna:4,phoenix:4,brimstone:4,sage:3,gekko:3,deadlock:3,breach:3}},
 {t:"Je progresse en jouant, pas en practice",s:{fade:4,gekko:3,clove:3,neon:3,breach:3,phoenix:2}}]},

{q:"En clutch 1v1, sous pression, tu…",a:[
 {t:"Tu adores ça, tu es meilleur sous pression",s:{reyna:4,iso:4,jett:3,chamber:3,clove:2,neon:2}},
 {t:"Tu stresses, tu préfères éviter",s:{sage:3,brimstone:3,harbor:3,gekko:3,skye:3,deadlock:2}},
 {t:"Tu réfléchis et tu joues le temps",s:{viper:3,cypher:3,killjoy:3,vyse:3,astra:3,omen:3,chamber:2}},
 {t:"Tu tentes un truc que personne n'attend",s:{yoru:3,raze:3,clove:3,fade:3,gekko:2,neon:2}}]},

{q:"Ce que tu veux apporter à l'équipe ?",a:[
 {t:"Des kills, beaucoup de kills",s:{reyna:4,jett:3,iso:3,neon:3,chamber:3,phoenix:3}},
 {t:"De l'information sur les positions ennemies",s:{fade:5,sova:4,cypher:4,skye:3,gekko:3,kayo:2}},
 {t:"De l'espace : je bloque la vision et j'ouvre le terrain",s:{brimstone:4,omen:4,astra:4,harbor:4,viper:3,clove:3}},
 {t:"De la sécurité : je tiens le flanc et je soigne",s:{sage:4,vyse:4,killjoy:3,deadlock:3,cypher:2,skye:2}}]},

{q:"Tu préfères jouer…",a:[
 {t:"En attaque",s:{raze:3,breach:3,jett:2,phoenix:2,skye:2,sova:2,neon:2,brimstone:2}},
 {t:"En défense",s:{deadlock:4,cypher:3,killjoy:3,vyse:3,chamber:3,viper:3,sage:2}},
 {t:"Les deux pareil",s:{omen:2,astra:2,gekko:2,fade:2,kayo:2,harbor:2,clove:2,iso:2,yoru:2}},
 {t:"J'aime les agents forts des deux côtés",s:{omen:3,gekko:3,clove:3,viper:2,killjoy:2,skye:2,fade:2}}]},

{q:"Ton utilitaire idéal, c'est…",a:[
 {t:"Simple : j'appuie, ça marche",s:{brimstone:4,reyna:4,phoenix:3,sage:3,breach:3,deadlock:3}},
 {t:"Complexe mais dévastateur si bien utilisé",s:{astra:4,viper:4,yoru:3,sova:3,harbor:3,cypher:3,killjoy:2}},
 {t:"Récupérable, je peux le réutiliser si je le rate",s:{gekko:4,killjoy:3,cypher:3,vyse:2,sage:2}},
 {t:"Du mouvement, je veux me déplacer avec",s:{jett:4,raze:4,neon:3,omen:3,yoru:3,chamber:3}}]},

{q:"Ta plus grosse faiblesse en jeu ?",a:[
 {t:"Je meurs trop vite en fonçant bêtement",s:{sage:3,killjoy:3,cypher:3,deadlock:3,vyse:3,brimstone:3}},
 {t:"Je suis trop passif, je n'ose pas prendre les duels",s:{neon:4,jett:3,reyna:3,phoenix:3,raze:3,iso:3}},
 {t:"Je ne sais jamais quoi faire de mon utilitaire",s:{reyna:4,phoenix:3,iso:3,jett:2,chamber:2}},
 {t:"Je perds mes duels de visée",s:{brimstone:3,sage:3,astra:3,viper:3,killjoy:3,harbor:3,gekko:2,sova:2}}]},

{q:"Pour toi, un agent doit surtout être…",a:[
 {t:"Fun à jouer, même quand je perds",s:{raze:4,gekko:3,phoenix:3,neon:3,yoru:3,clove:2}},
 {t:"Efficace pour monter en rang",s:{reyna:4,jett:3,viper:3,killjoy:3,cypher:3,chamber:3,omen:3,brimstone:3}},
 {t:"Utile à l'équipe avant tout",s:{skye:4,sage:3,brimstone:3,harbor:3,astra:3,kayo:3,breach:3}},
 {t:"Différent de ce que tout le monde joue",s:{vyse:5,deadlock:4,yoru:3,astra:3,harbor:3,iso:3,clove:2}}]},

{q:"Ton équipe ne suit pas ton plan. Tu fais quoi ?",a:[
 {t:"Je m'adapte et je joue autour d'eux",s:{omen:3,gekko:3,clove:3,fade:3,skye:3,harbor:2}},
 {t:"Je joue mon propre truc dans mon coin",s:{reyna:4,yoru:3,iso:3,chamber:3,cypher:2}},
 {t:"Je continue de call jusqu'à ce que ça rentre",s:{brimstone:4,astra:4,sova:3,viper:3,kayo:2}},
 {t:"Je passe en mode solo-carry",s:{jett:3,reyna:3,neon:3,phoenix:3,raze:2,iso:2}}]},

{q:"Ton objectif principal sur Valorant ?",a:[
 {t:"Monter le plus haut possible en compétitif",s:{reyna:3,jett:3,viper:3,cypher:3,killjoy:3,omen:3,chamber:2}},
 {t:"M'amuser avec mes potes",s:{gekko:3,raze:3,phoenix:3,clove:3,skye:3,breach:2}},
 {t:"Devenir vraiment bon mécaniquement",s:{jett:4,chamber:4,iso:4,neon:4,reyna:3,raze:3}},
 {t:"Comprendre le jeu en profondeur, être le cerveau",s:{sova:5,astra:4,viper:3,cypher:3,omen:3,brimstone:3,fade:3}}]}
];

/* =========================================================
   LES DEUX TESTS
   ========================================================= */
const TESTS = {
  perso: {
    questions: QUESTIONS,
    label:  "TEST DE PERSONNALITÉ",
    titre:  "L'AGENT QUI TE RESSEMBLE",
    kicker: "PROFIL PSYCHOLOGIQUE // CORRESPONDANCE ÉTABLIE",
    matches:"TES AUTRES COMPATIBILITÉS",
    roles:  "TON PROFIL PAR RÔLE",
    msgs:   ["ANALYSE DU PROFIL…","CROISEMENT DES DONNÉES…","COMPARAISON AVEC 25 AGENTS…","CORRESPONDANCE TROUVÉE"]
  },
  jeu: {
    questions: QUESTIONS_JEU,
    label:  "TEST DE GAMEPLAY",
    titre:  "L'AGENT QUE TU DEVRAIS JOUER",
    kicker: "ANALYSE DE JEU // AGENT RECOMMANDÉ",
    matches:"LES AUTRES AGENTS QUI T'IRAIENT",
    roles:  "LE RÔLE FAIT POUR TOI",
    msgs:   ["ANALYSE DU STYLE DE JEU…","ÉVALUATION MÉCANIQUE…","CROISEMENT AVEC 25 AGENTS…","AGENT RECOMMANDÉ"]
  }
};

const DIFF_MOTS = ["","TRÈS FACILE","FACILE","MOYENNE","DIFFICILE","TRÈS DIFFICILE"];

/* =========================================================
   LES DEUX TESTS — VERSION LEAGUE OF LEGENDS
   ========================================================= */
const TESTS_LOL = {
  perso: {
    questions: Q_LOL_PERSO,
    label:  "TEST DE PERSONNALITÉ",
    titre:  "LE CHAMPION QUI TE RESSEMBLE",
    kicker: "PROFIL ÉTABLI // CHAMPION IDENTIFIÉ",
    matches:"TES AUTRES AFFINITÉS",
    roles:  "TON PROFIL PAR VOIE",
    msgs:   ["LECTURE DU PROFIL…","CONSULTATION DES ARCHIVES…","COMPARAISON AVEC LA FAILLE…","CHAMPION IDENTIFIÉ"]
  },
  jeu: {
    questions: Q_LOL_JEU,
    label:  "TEST DE GAMEPLAY",
    titre:  "LE CHAMPION QUE TU DEVRAIS JOUER",
    kicker: "ANALYSE DE JEU // CHAMPION RECOMMANDÉ",
    matches:"LES AUTRES CHAMPIONS QUI T'IRAIENT",
    roles:  "LA VOIE FAITE POUR TOI",
    msgs:   ["ANALYSE DU STYLE DE JEU…","ÉVALUATION MÉCANIQUE…","CROISEMENT AVEC TOUS LES CHAMPIONS…","CHAMPION RECOMMANDÉ"]
  }
};

/* Traduction des mots-clés de gameplay en français lisible,
   pour expliquer le résultat du test 2 côté LoL. */
const EXPLI = {
  HAUT:"la voie du haut", JUNGLE:"la jungle", MILIEU:"le milieu",
  TIREUR:"le rôle de tireur", SUPPORT:"le rôle de support",
  Fighter:"le combat rapproché", Tank:"encaisser pour ton équipe",
  Mage:"les dégâts à distance", Assassin:"supprimer une cible d'un coup",
  Marksman:"les dégâts continus à distance", Support:"aider tes alliés",
  facile:"un champion simple à prendre en main",
  moyen:"un champion équilibré",
  difficile:"un champion technique à fort plafond"
};

/* =========================================================
   LES DEUX JEUX
   Chaque jeu fournit ses personnages, ses images et sa
   façon de compter les points. Le reste du site est commun.
   ========================================================= */
const JEUX = {
  valorant: {
    nom:"VALORANT", theme:"valorant", motPerso:"AGENTS",
    tests: TESTS,
    persos: () => AGENTS,
    roles:  () => ROLE_LIST,
    roleIcon: r => ROLE_ICONS[r] || null,
    portrait: id => portraitUrl(id),
    fond:     id => bgUrl(id),
    // points directs : chaque réponse cite les agents un par un
    pts: (rep, id) => rep.s[id] || 0,
    pret: () => true,
    charger: async () => {}
  },
  lol: {
    nom:"LEAGUE OF LEGENDS", theme:"lol", motPerso:"CHAMPIONS",
    tests: TESTS_LOL,
    persos: () => CHAMPIONS,
    roles:  () => ROLES_LOL,
    roleIcon: () => null,
    portrait: id => lolPortrait(id),
    fond:     id => lolSplash(id),
    // points par mots-clés : trop de champions pour les citer un par un
    pts: (rep, id) => {
      const mots = motsClesChampion(id, mode);
      let total = 0;
      for (const k in rep.s) if (mots.indexOf(k) !== -1) total += rep.s[k];
      return total;
    },
    pret: () => Object.keys(CHAMPIONS).length > 0,
    charger: chargerChampions
  }
};

let jeuActif = "valorant";
const J = () => JEUX[jeuActif];

/* =========================================================
   ETAT
   ========================================================= */
let idx = 0;
let picks = [];       // index de réponse par question
let pseudo = "";
let locked = false;   // évite qu'un double-clic rapide fasse sauter une question
let mode = "perso";   // "perso" ou "jeu"

// dernier agent obtenu à chaque test, pour la comparaison finale
const resultats = { perso:null, jeu:null };

const test = () => J().tests[mode];
const autreMode = () => mode === "perso" ? "jeu" : "perso";

const $ = id => document.getElementById(id);
const screens = {
  jeux:   $("screen-jeu"),
  intro:  $("screen-intro"),
  quiz:   $("screen-quiz"),
  loading:$("screen-loading"),
  result: $("screen-result")
};

function show(name){
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
  window.scrollTo({top:0,behavior:"smooth"});
}

/* =========================================================
   QUIZ
   ========================================================= */
function renderQuestion(){
  const qs = test().questions;
  const q = qs[idx];
  $("q-num").textContent = idx + 1;
  $("q-total").textContent = qs.length;
  $("quiz-mode").textContent = test().label;
  $("progress-fill").style.width = (idx / qs.length * 100) + "%";
  $("question-text").textContent = q.q;

  const box = $("answers");
  box.innerHTML = "";
  const letters = ["A","B","C","D"];

  q.a.forEach((ans, i) => {
    const b = document.createElement("button");
    b.className = "answer" + (picks[idx] === i ? " picked" : "");
    b.dataset.letter = letters[i];
    b.textContent = ans.t;
    b.style.animation = `fadeUp .35s ease ${i * 0.06}s both`;
    b.addEventListener("click", () => choose(i));
    box.appendChild(b);
  });

  $("btn-back").disabled = idx === 0;
}

function choose(i){
  if (locked) return;
  locked = true;
  picks[idx] = i;
  document.querySelectorAll(".answer").forEach((el,k)=>el.classList.toggle("picked",k===i));

  setTimeout(() => {
    locked = false;
    if (idx < test().questions.length - 1){
      idx++;
      renderQuestion();
    } else {
      $("progress-fill").style.width = "100%";
      runAnalysis();
    }
  }, 220);
}

/* =========================================================
   CALCUL DU RESULTAT
   ========================================================= */
/* Maximum de points qu'un agent peut atteindre sur un test donné
   (en supposant qu'on choisisse à chaque question la réponse qui l'avantage le plus).

   Sert à corriger un biais : sans ça, un agent présent dans beaucoup de réponses
   sortirait presque à tous les coups et d'autres jamais. On divise le score brut
   par ce maximum élevé à la puissance ALPHA. À 0 on ne corrige rien (les agents
   "larges" écrasent tout), à 1 on sur-corrige (les agents au profil étroit
   deviennent trop fréquents). 0,65 a été retenu après simulation. */
const ALPHA_PAR_TEST = {
  "valorant-perso": 0.65,
  "valorant-jeu":   0.65,
  "lol-perso":      0.65,
  "lol-jeu":        1.0    // beaucoup plus de champions : correction plus forte
};
const alpha = () => ALPHA_PAR_TEST[jeuActif + "-" + mode] ?? 0.65;
const MAX_CACHE = {};
function maxParAgent(){
  const cle = jeuActif + "-" + mode;
  if (MAX_CACHE[cle]) return MAX_CACHE[cle];
  const qs = test().questions;
  const pts = J().pts;
  const m = {};
  Object.keys(J().persos()).forEach(k => {
    m[k] = qs.reduce((tot, q) => tot + Math.max(...q.a.map(a => pts(a, k))), 0);
  });
  return (MAX_CACHE[cle] = m);
}

function computeScores(){
  const persos = J().persos();
  const pts = J().pts;
  const qs = test().questions;

  const brut = {};
  Object.keys(persos).forEach(k => brut[k] = 0);

  picks.forEach((choice, qi) => {
    const rep = qs[qi].a[choice];
    Object.keys(brut).forEach(k => { brut[k] += pts(rep, k); });
  });

  // Affinité de difficulté (LoL, test gameplay uniquement).
  // La difficulté officielle va de 1 à 10 et varie finement d'un champion
  // à l'autre : c'est ce qui départage ceux qui ont la même voie,
  // la même classe et le même style.
  let diffVoulue = null;
  if (jeuActif === "lol" && mode === "jeu"){
    let somme = 0, nb = 0;
    qs.forEach((q, qi) => {
      const rep = q.a[picks[qi]];
      if (rep && rep.v != null){ somme += rep.v; nb++; }
    });
    if (nb) diffVoulue = somme / nb;
  }

  const max = maxParAgent();
  const scores = {};
  const graine = picks.join("");
  Object.keys(brut).forEach(k => {
    let base = max[k] ? brut[k] / Math.pow(max[k], alpha()) * 100 : 0;
    if (diffVoulue !== null){
      const ecart = Math.abs(diffVoulue - persos[k].diff10) / 9;   // 0 = pile poil
      base += (1 - ecart) * 14;
    }
    // Départage des ex æquo. Sans ça, les égalités seraient toujours tranchées
    // dans l'ordre de la liste et une partie des personnages ne sortirait jamais.
    // Le décalage est minuscule et dépend des réponses : mêmes réponses,
    // même résultat, mais chaque personnage a sa chance.
    scores[k] = base + petitHash(k + "|" + graine) * 1e-6;
  });
  return scores;
}

/* Renvoie un nombre stable entre 0 et 1 à partir d'une chaîne */
function petitHash(str){
  let h = 2166136261;
  for (let i = 0; i < str.length; i++){
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

function runAnalysis(){
  show("loading");

  // on précharge les illustrations pendant l'écran d'analyse
  const scores = computeScores();
  Object.entries(scores).sort((a,b) => b[1] - a[1]).slice(0, 5)
    .forEach(([id]) => { const i = new Image(); i.src = J().portrait(id); });

  const msgs = test().msgs;
  let m = 0;
  const timer = setInterval(() => {
    m++;
    if (m < msgs.length) $("loading-text").textContent = msgs[m];
    else { clearInterval(timer); showResult(); }
  }, 620);
  $("loading-text").textContent = msgs[0];
}

function showResult(){
  const PERSOS = J().persos();
  const scores = computeScores();
  const ranked = Object.entries(scores).sort((a,b) => b[1] - a[1]);
  const [topId, topScore] = ranked[0];
  const top = PERSOS[topId];
  const T = test();

  resultats[mode] = topId;

  /* --- en-têtes propres au test --- */
  $("result-kicker").textContent = pseudo
    ? `AGENT ${pseudo.toUpperCase()} // ${T.kicker.split("// ")[1]}`
    : T.kicker;
  $("result-title").textContent = T.titre;
  $("matches-title").textContent = T.matches;
  $("roles-title").textContent = T.roles;

  const port = $("agent-portrait");
  port.style.background = `linear-gradient(150deg, ${top.c[0]}, ${top.c[1]})`;
  $("agent-initial").textContent = top.n.charAt(0);

  // illustration officielle de l'agent (repli sur l'initiale si elle ne charge pas)
  const img = $("agent-img");
  const initial = $("agent-initial");
  img.hidden = true;
  initial.hidden = false;
  img.onload  = () => { img.hidden = false; initial.hidden = true;  };
  img.onerror = () => { img.hidden = true;  initial.hidden = false; };
  img.src = J().portrait(topId);
  img.alt = top.n;
  $("agent-bg").style.backgroundImage = `url("${J().fond(topId)}")`;

  // icône du rôle (Valorant uniquement)
  const rIcon = $("role-icon");
  const urlIcone = J().roleIcon(top.r);
  rIcon.hidden = true;
  if (urlIcone){
    rIcon.onload  = () => { rIcon.hidden = false; };
    rIcon.onerror = () => { rIcon.hidden = true; };
    rIcon.src = urlIcone;
  }

  $("role-label").textContent = top.r;
  $("agent-role").style.color = top.c[0];
  $("agent-role").style.borderColor = top.c[0];
  $("agent-name").textContent = top.n;
  $("agent-quote").textContent = top.q;
  $("agent-quote").style.color = top.c[0];
  $("agent-card").style.borderLeftColor = top.c[0];

  const estLol = jeuActif === "lol";
  const play = estLol ? null : PLAY[topId];
  const difficulte = estLol ? diff5(top.diff10) : play.d;

  // le texte change selon le test — et selon le jeu
  $("agent-desc").textContent = mode === "jeu"
    ? (estLol ? expliquerChampion(topId) : play.w)
    : top.d;

  // fiche technique : seulement pour le test gameplay de LoL
  $("fiche").hidden = !(estLol && mode === "jeu");
  if (estLol && mode === "jeu"){
    const st = top.stats;
    setTimeout(() => {
      $("stat-attaque").style.width = (st.attack  * 10) + "%";
      $("stat-defense").style.width = (st.defense * 10) + "%";
      $("stat-magie").style.width   = (st.magic   * 10) + "%";
    }, 60);
  }

  // traits de caractère : uniquement pour le test de personnalité
  const traits = $("agent-traits");
  traits.innerHTML = "";
  if (mode === "perso"){
    top.t.forEach(t => {
      const s = document.createElement("span");
      s.className = "trait";
      s.textContent = t;
      traits.appendChild(s);
    });
  }

  // difficulté + conseils : uniquement pour le test de gameplay
  $("difficulty").hidden = mode !== "jeu";
  // les conseils détaillés n'existent que côté Valorant
  $("tips-block").hidden = mode !== "jeu" || estLol;

  if (mode === "jeu"){
    const bars = $("diff-bars");
    bars.innerHTML = "";
    for (let n = 1; n <= 5; n++){
      const b = document.createElement("i");
      if (n <= difficulte) b.className = "on";
      bars.appendChild(b);
    }
    $("diff-word").textContent = DIFF_MOTS[difficulte] +
      (estLol ? ` (${top.diff10}/10 selon Riot)` : "");

    if (!estLol){
      const tips = $("tips");
      tips.innerHTML = "";
      play.t.forEach(txt => {
        const li = document.createElement("li");
        li.textContent = txt;
        tips.appendChild(li);
      });
    }
  }

  /* --- top 2 à 5 --- */
  const list = $("matches");
  list.innerHTML = "";
  ranked.slice(1, 5).forEach(([id, sc]) => {
    const a = PERSOS[id];
    const pct = Math.max(20, Math.round(sc / topScore * 94));
    const row = document.createElement("div");
    row.className = "match";
    row.innerHTML = `
      <div class="match-badge" style="background:linear-gradient(140deg,${a.c[0]},${a.c[1]})"><span>${a.n.charAt(0)}</span></div>
      <div class="match-body">
        <div class="match-top">
          <span><span class="match-name">${a.n}</span> <span class="match-role">${a.r}</span></span>
          <span class="match-pct">${pct}%</span>
        </div>
        <div class="match-bar"><i style="background:${a.c[0]}"></i></div>
      </div>`;

    // portrait de l'agent dans le badge ; s'il ne charge pas, l'initiale reste visible
    const badge = row.querySelector(".match-badge");
    const mini = new Image();
    mini.alt = a.n;
    mini.onload = () => badge.appendChild(mini);
    mini.src = J().portrait(id);

    list.appendChild(row);
    setTimeout(() => { row.querySelector(".match-bar i").style.width = pct + "%"; }, 60);
  });

  /* --- profil par rôle --- */
  const LISTE_ROLES = J().roles();
  const roleTotals = {};
  LISTE_ROLES.forEach(r => roleTotals[r] = 0);
  ranked.forEach(([id, sc]) => { roleTotals[PERSOS[id].r] += sc; });
  const roleMax = Math.max(...Object.values(roleTotals)) || 1;

  const rbox = $("roles");
  rbox.innerHTML = "";
  LISTE_ROLES.forEach(r => {
    const pct = Math.round(roleTotals[r] / roleMax * 100);
    const ic = J().roleIcon(r);
    const c = document.createElement("div");
    c.className = "role-card";
    c.innerHTML = `
      <div class="rc-top">
        <span class="rc-name">${ic ? `<img class="rc-icon" src="${ic}" alt="" onerror="this.remove()">` : ""}${r}</span>
        <span class="rc-pct">${pct}%</span>
      </div>
      <div class="rc-bar"><i></i></div>`;
    rbox.appendChild(c);
    setTimeout(() => { c.querySelector(".rc-bar i").style.width = pct + "%"; }, 60);
  });

  /* --- comparaison des deux tests --- */
  renderCross();

  /* --- bouton vers l'autre test --- */
  $("btn-other").querySelector("span").textContent =
    autreMode() === "jeu" ? "QUEL AGENT DEVRAIS-TU JOUER ?" : "QUEL AGENT TE RESSEMBLE ?";

  /* --- texte à partager --- */
  const motPerso = jeuActif === "lol" ? "champion" : "agent";
  const lignes = [
    `${pseudo ? pseudo + " a" : "J'ai"} fait le test "Quel personnage ${J().nom} es-tu ?"`,
    mode === "jeu"
      ? `➜ ${motPerso.charAt(0).toUpperCase()+motPerso.slice(1)} que je devrais jouer : ${top.n} (${top.r}) — difficulté ${difficulte}/5`
      : `➜ ${motPerso.charAt(0).toUpperCase()+motPerso.slice(1)} qui me ressemble : ${top.n}${top.titre ? ", " + top.titre : ""}`,
    `Ensuite : ${ranked.slice(1,4).map(([id]) => PERSOS[id].n).join(", ")}`
  ];
  if (resultats.perso && resultats.jeu){
    lignes.push(resultats.perso === resultats.jeu
      ? `Je ressemble à ${PERSOS[resultats.perso].n} ET je devrais le jouer. Rare !`
      : `Je ressemble à ${PERSOS[resultats.perso].n} mais je devrais jouer ${PERSOS[resultats.jeu].n}.`);
  }
  window._shareText = lignes.filter(Boolean).join("\n");

  show("result");
}

/* Explique le résultat du test gameplay LoL à partir des réponses données :
   on ne garde que ce que le joueur a demandé ET que le champion possède. */
function expliquerChampion(id){
  const c = CHAMPIONS[id];
  const mots = motsClesChampion(id, "jeu");
  const poids = {};

  test().questions.forEach((q, qi) => {
    const rep = q.a[picks[qi]];
    if (!rep) return;
    for (const k in rep.s){
      if (mots.indexOf(k) !== -1 && EXPLI[k]) poids[k] = (poids[k] || 0) + rep.s[k];
    }
  });

  const demandes = Object.entries(poids).sort((a,b) => b[1] - a[1]).slice(0,3).map(([k]) => EXPLI[k]);
  const classe = (NOM_CLASSE[c.classe] || c.classe).toLowerCase();
  const voie = c.voies.length > 1 ? c.voies.join(" ou ").toLowerCase() : c.voies[0].toLowerCase();

  const base = `${c.n} est un ${classe} qui se joue sur ${voie}, noté ${c.diff10}/10 en difficulté par Riot.`;
  if (!demandes.length) return base;
  return base + ` D'après tes réponses tu cherches ${demandes.join(", ")} — c'est exactement ce qu'il propose.`;
}

/* Affiche la bande de comparaison quand les deux tests ont été faits */
function renderCross(){
  const box = $("cross");
  if (!resultats.perso || !resultats.jeu){ box.hidden = true; return; }

  const PERSOS = J().persos();
  const p = PERSOS[resultats.perso];
  const j = PERSOS[resultats.jeu];
  box.hidden = false;
  $("cross-perso").textContent = p.n;
  $("cross-perso").style.color = p.c[0];
  $("cross-jeu").textContent = j.n;
  $("cross-jeu").style.color = j.c[0];

  if (resultats.perso === resultats.jeu){
    $("cross-note").textContent =
      `Cas rare : les deux tests tombent sur ${p.n}. Ton caractère et ta façon de jouer demandent ` +
      `exactement la même chose — tu peux le jouer les yeux fermés, c'est vraiment ton agent.`;
  } else {
    $("cross-note").textContent =
      `C'est normal que ce ne soit pas le même : ${p.n} correspond à ta personnalité, ` +
      `${j.n} correspond à ta manière de jouer. Le premier, c'est qui tu serais dans le jeu — ` +
      `le second, c'est celui sur lequel tu vas réellement gagner des parties.`;
  }
}

/* =========================================================
   EVENEMENTS
   ========================================================= */
function startTest(m){
  mode = m;
  pseudo = $("pseudo").value.trim();
  $("q-player").textContent = pseudo ? "AGENT " + pseudo : "";
  idx = 0;
  picks = [];
  locked = false;
  show("quiz");
  renderQuestion();
}

/* ---------- choix du jeu ---------- */
async function choisirJeu(nom){
  const btn = $("jeu-" + nom);
  const G = JEUX[nom];
  $("jeu-erreur").hidden = true;

  if (!G.pret()){
    btn.disabled = true;
    const go = btn.querySelector(".game-go");
    const texteOrigine = go.textContent;
    go.textContent = "CHARGEMENT…";
    try {
      await G.charger();
    } catch (e){
      btn.disabled = false;
      go.textContent = texteOrigine;
      $("jeu-erreur").hidden = false;
      $("jeu-erreur").textContent =
        "Impossible de charger la liste des champions depuis les serveurs de Riot. " +
        "Vérifie ta connexion internet et réessaie.";
      return;
    }
    btn.disabled = false;
    go.textContent = texteOrigine;
  }

  jeuActif = nom;
  document.documentElement.dataset.theme = G.theme;

  // on repart de zéro : les résultats d'un jeu n'ont pas de sens dans l'autre
  resultats.perso = null;
  resultats.jeu = null;
  $("done-perso").hidden = true;
  $("done-jeu").hidden = true;
  $("cross").hidden = true;

  const nbPersos = Object.keys(G.persos()).length;
  $("count-persos").textContent = nbPersos;
  $("label-persos").textContent = G.motPerso;
  $("count-roles").textContent = G.roles().length;
  $("count-perso").textContent = G.tests.perso.questions.length;
  $("count-jeu").textContent   = G.tests.jeu.questions.length;
  $("count-total").textContent = G.tests.perso.questions.length + G.tests.jeu.questions.length;

  document.querySelector("#screen-intro .title").innerHTML = nom === "lol"
    ? 'QUEL<br><span class="title-accent">CHAMPION</span><br>ES-TU&nbsp;?'
    : 'QUEL AGENT<br><span class="title-accent">VALORANT</span><br>ES-TU&nbsp;?';
  document.querySelector("#screen-intro .kicker").textContent = nom === "lol"
    ? "ARCHIVES DE LA FAILLE // IDENTIFICATION"
    : "PROTOCOLE D'IDENTIFICATION // AGENT";
  document.title = nom === "lol" ? "QUEL CHAMPION LOL ES-TU ?" : "QUEL AGENT VALORANT ES-TU ?";

  show("intro");
}

$("jeu-valorant").addEventListener("click", () => choisirJeu("valorant"));
$("jeu-lol").addEventListener("click", () => choisirJeu("lol"));
$("btn-jeux").addEventListener("click", () => show("jeux"));

$("mode-perso").addEventListener("click", () => startTest("perso"));
$("mode-jeu").addEventListener("click", () => startTest("jeu"));

$("btn-other").addEventListener("click", () => startTest(autreMode()));

$("pseudo").addEventListener("keydown", e => {
  if (e.key === "Enter") $("mode-perso").click();
});

$("btn-back").addEventListener("click", () => {
  if (!locked && idx > 0){ idx--; renderQuestion(); }
});

$("btn-retry").addEventListener("click", () => {
  idx = 0; picks = []; locked = false;
  $("progress-fill").style.width = "0%";
  // marque les tests déjà faits sur l'accueil
  $("done-perso").hidden = !resultats.perso;
  $("done-jeu").hidden   = !resultats.jeu;
  show("intro");
});

$("btn-copy").addEventListener("click", () => {
  const t = window._shareText || "";
  const done = () => {
    $("copied").classList.add("show");
    setTimeout(() => $("copied").classList.remove("show"), 2200);
  };
  if (navigator.clipboard && window.isSecureContext){
    navigator.clipboard.writeText(t).then(done).catch(fallback);
  } else fallback();

  function fallback(){
    const ta = document.createElement("textarea");
    ta.value = t;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch(e){}
    document.body.removeChild(ta);
    done();
  }
});

/* raccourcis clavier 1-4 pendant le quiz */
document.addEventListener("keydown", e => {
  if (!screens.quiz.classList.contains("active")) return;
  const n = parseInt(e.key, 10);
  if (n >= 1 && n <= 4) choose(n - 1);
  if (e.key === "Backspace" && !locked && idx > 0){ idx--; renderQuestion(); }
});

/* =========================================================
   INITIALISATION
   ========================================================= */
document.documentElement.dataset.theme = "valorant";
$("count-perso").textContent = QUESTIONS.length;
$("count-jeu").textContent   = QUESTIONS_JEU.length;
$("count-total").textContent = QUESTIONS.length + QUESTIONS_JEU.length;
