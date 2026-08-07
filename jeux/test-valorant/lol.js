/* =========================================================
   DONNÉES LEAGUE OF LEGENDS — TOUS LES CHAMPIONS

   La liste des champions, leurs noms, titres, descriptions
   françaises, classes et difficulté officielle sont chargés
   en direct depuis Data Dragon (CDN de Riot). Le site est donc
   automatiquement à jour à chaque nouveau champion.

   Ce fichier contient la partie qu'on ne peut pas deviner :
   - la voie de chaque champion
   - ses mots-clés de personnalité (pour le test 1)
   Le reste (classe, difficulté, images) vient de Riot.
   ========================================================= */

const DDRAGON_IMG = "https://ddragon.leagueoflegends.com/cdn/img/champion/";
const lolPortrait = id => DDRAGON_IMG + "loading/" + id + "_0.jpg";
const lolSplash   = id => DDRAGON_IMG + "splash/"  + id + "_0.jpg";

const ROLES_LOL = ["HAUT","JUNGLE","MILIEU","TIREUR","SUPPORT"];

/* Rempli au chargement depuis Data Dragon */
const CHAMPIONS = {};

/* Affichage propre des mots-clés (les identifiants sont sans accent) */
const LIBELLE = {
  discipline:"Discipliné", methodique:"Méthodique", cerebral:"Cérébral",
  mysterieux:"Mystérieux", theatral:"Théâtral", elegant:"Élégant",
  agressif:"Agressif", obstine:"Obstiné", sournois:"Sournois",
  imperturbable:"Imperturbable", protecteur:"Protecteur", altruiste:"Altruiste",
  orgueilleux:"Orgueilleux", ambitieux:"Ambitieux", chaotique:"Chaotique",
  solitaire:"Solitaire", impulsif:"Impulsif", courageux:"Courageux",
  sensible:"Sensible", vengeur:"Vengeur", rebelle:"Rebelle",
  sociable:"Sociable", joyeux:"Joyeux", loyal:"Loyal", malin:"Malin",
  brutal:"Brutal", calme:"Calme", sombre:"Sombre", tourmente:"Tourmenté"
};
const libelle = m => LIBELLE[m] || (m.charAt(0).toUpperCase() + m.slice(1));

/* ---------------------------------------------------------
   PROFILS : "identifiant": "VOIE|mots-clés de personnalité"
   Plusieurs voies possibles, séparées par /
   Un champion absent de cette liste reste jouable : ses
   mots-clés sont alors déduits de sa classe officielle.
   --------------------------------------------------------- */
const PROFILS = {
Aatrox:"HAUT|sombre,solitaire,obstine,vengeur,brutal",
Ahri:"MILIEU|malin,sociable,joyeux,elegant,mysterieux",
Akali:"MILIEU|rebelle,solitaire,agressif,discipline,mysterieux",
Akshan:"MILIEU/TIREUR|malin,theatral,joyeux,rebelle,courageux",
Alistar:"SUPPORT|protecteur,brutal,loyal,courageux,obstine",
Ambessa:"HAUT/JUNGLE|ambitieux,brutal,discipline,orgueilleux,methodique",
Amumu:"JUNGLE/SUPPORT|sensible,solitaire,loyal,altruiste,protecteur",
Anivia:"MILIEU|calme,imperturbable,protecteur,cerebral,elegant",
Annie:"MILIEU|impulsif,joyeux,chaotique,sensible,theatral",
Aphelios:"TIREUR|solitaire,discipline,mysterieux,methodique,sombre",
Ashe:"TIREUR|calme,loyal,protecteur,cerebral,courageux",
AurelionSol:"MILIEU|orgueilleux,theatral,cerebral,rebelle,mysterieux",
Aurora:"MILIEU|malin,joyeux,rebelle,mysterieux,courageux",
Azir:"MILIEU|orgueilleux,ambitieux,theatral,discipline,methodique",
Bard:"SUPPORT|mysterieux,calme,altruiste,joyeux,cerebral",
Belveth:"JUNGLE|chaotique,ambitieux,sombre,agressif,mysterieux",
Blitzcrank:"SUPPORT|protecteur,loyal,altruiste,courageux,calme",
Brand:"SUPPORT/MILIEU|chaotique,vengeur,agressif,theatral,sombre",
Braum:"SUPPORT|protecteur,joyeux,loyal,courageux,sociable",
Briar:"JUNGLE|chaotique,impulsif,sensible,agressif,obstine",
Caitlyn:"TIREUR|methodique,cerebral,discipline,elegant,obstine",
Camille:"HAUT|elegant,methodique,discipline,orgueilleux,cerebral",
Cassiopeia:"MILIEU|orgueilleux,ambitieux,sournois,elegant,vengeur",
Chogath:"HAUT/JUNGLE|brutal,sombre,ambitieux,imperturbable,agressif",
Corki:"TIREUR/MILIEU|joyeux,theatral,sociable,malin,courageux",
Darius:"HAUT|brutal,agressif,obstine,orgueilleux,discipline",
Diana:"JUNGLE/MILIEU|solitaire,obstine,discipline,vengeur,mysterieux",
Draven:"TIREUR|theatral,orgueilleux,sociable,joyeux,agressif",
DrMundo:"HAUT|chaotique,imperturbable,joyeux,brutal,obstine",
Ekko:"MILIEU/JUNGLE|malin,joyeux,rebelle,cerebral,courageux",
Elise:"JUNGLE|sournois,elegant,mysterieux,malin,sombre",
Evelynn:"JUNGLE|sournois,mysterieux,elegant,sombre,malin",
Ezreal:"TIREUR|joyeux,orgueilleux,sociable,courageux,malin",
Fiddlesticks:"JUNGLE/SUPPORT|sombre,mysterieux,sournois,solitaire,imperturbable",
Fiora:"HAUT|elegant,orgueilleux,discipline,methodique,obstine",
Fizz:"MILIEU|malin,joyeux,sournois,chaotique,rebelle",
Galio:"MILIEU/SUPPORT|protecteur,loyal,calme,courageux,sensible",
Gangplank:"HAUT|brutal,malin,ambitieux,chaotique,orgueilleux",
Garen:"HAUT|loyal,courageux,protecteur,discipline,calme",
Gnar:"HAUT|joyeux,impulsif,chaotique,sensible,courageux",
Gragas:"JUNGLE/HAUT|joyeux,chaotique,sociable,impulsif,brutal",
Graves:"JUNGLE/TIREUR|brutal,loyal,agressif,obstine,rebelle",
Gwen:"HAUT|sensible,joyeux,courageux,protecteur,elegant",
Hecarim:"JUNGLE|brutal,agressif,sombre,orgueilleux,impulsif",
Heimerdinger:"MILIEU/SUPPORT|cerebral,methodique,joyeux,obstine,malin",
Hwei:"MILIEU/SUPPORT|cerebral,sensible,elegant,methodique,solitaire",
Illaoi:"HAUT|brutal,obstine,courageux,orgueilleux,protecteur",
Irelia:"HAUT/MILIEU|courageux,discipline,loyal,elegant,obstine",
Ivern:"JUNGLE|altruiste,joyeux,protecteur,calme,sensible",
Janna:"SUPPORT|protecteur,calme,altruiste,elegant,sensible",
JarvanIV:"JUNGLE/HAUT|courageux,loyal,discipline,protecteur,ambitieux",
Jax:"HAUT|orgueilleux,obstine,courageux,brutal,joyeux",
Jayce:"HAUT/MILIEU|orgueilleux,theatral,ambitieux,cerebral,courageux",
Jhin:"TIREUR|methodique,theatral,elegant,sombre,mysterieux",
Jinx:"TIREUR|chaotique,impulsif,joyeux,theatral,rebelle",
Kaisa:"TIREUR|solitaire,obstine,courageux,discipline,agressif",
Kalista:"TIREUR|vengeur,discipline,sombre,loyal,obstine",
Karma:"SUPPORT|calme,altruiste,cerebral,protecteur,elegant",
Karthus:"MILIEU/JUNGLE|sombre,imperturbable,mysterieux,solitaire,cerebral",
Kassadin:"MILIEU|protecteur,solitaire,obstine,discipline,vengeur",
Katarina:"MILIEU|impulsif,agressif,orgueilleux,solitaire,elegant",
Kayle:"HAUT|discipline,orgueilleux,loyal,courageux,imperturbable",
Kayn:"JUNGLE|ambitieux,orgueilleux,rebelle,impulsif,obstine",
Kennen:"HAUT/MILIEU|joyeux,discipline,malin,courageux,sociable",
Khazix:"JUNGLE|sournois,solitaire,malin,agressif,sombre",
Kindred:"JUNGLE|mysterieux,calme,solitaire,imperturbable,elegant",
Kled:"HAUT|chaotique,brutal,courageux,impulsif,obstine",
KogMaw:"TIREUR|chaotique,joyeux,sensible,loyal,impulsif",
KSante:"HAUT|protecteur,courageux,orgueilleux,discipline,loyal",
Leblanc:"MILIEU|sournois,mysterieux,malin,elegant,ambitieux",
LeeSin:"JUNGLE|discipline,altruiste,obstine,courageux,loyal",
Leona:"SUPPORT|protecteur,courageux,loyal,discipline,calme",
Lillia:"JUNGLE|sensible,solitaire,joyeux,calme,altruiste",
Lissandra:"MILIEU|ambitieux,sombre,methodique,imperturbable,sournois",
Locke:"MILIEU|mysterieux,malin,solitaire,cerebral,rebelle",
Lucian:"TIREUR|vengeur,obstine,loyal,courageux,discipline",
Lulu:"SUPPORT|joyeux,chaotique,protecteur,altruiste,sociable",
Lux:"MILIEU/SUPPORT|joyeux,sociable,protecteur,cerebral,elegant",
Malphite:"HAUT|imperturbable,calme,obstine,solitaire,protecteur",
Malzahar:"MILIEU|mysterieux,obstine,sombre,cerebral,solitaire",
Maokai:"SUPPORT/JUNGLE|vengeur,protecteur,obstine,calme,sombre",
MasterYi:"JUNGLE|discipline,solitaire,obstine,methodique,calme",
Mel:"MILIEU/SUPPORT|elegant,ambitieux,cerebral,methodique,sociable",
Milio:"SUPPORT|joyeux,altruiste,protecteur,sensible,sociable",
MissFortune:"TIREUR|orgueilleux,vengeur,sociable,ambitieux,malin",
MonkeyKing:"HAUT/JUNGLE|joyeux,malin,courageux,sociable,rebelle",
Mordekaiser:"HAUT|orgueilleux,theatral,brutal,ambitieux,imperturbable",
Morgana:"SUPPORT|vengeur,protecteur,sensible,sombre,loyal",
Naafiri:"MILIEU/JUNGLE|agressif,loyal,solitaire,obstine,sombre",
Nami:"SUPPORT|altruiste,courageux,protecteur,sensible,loyal",
Nasus:"HAUT|calme,discipline,cerebral,imperturbable,loyal",
Nautilus:"SUPPORT|solitaire,vengeur,obstine,protecteur,sombre",
Neeko:"SUPPORT/MILIEU|joyeux,malin,sociable,sournois,sensible",
Nidalee:"JUNGLE|solitaire,agressif,malin,rebelle,mysterieux",
Nilah:"TIREUR|joyeux,courageux,discipline,sociable,elegant",
Nocturne:"JUNGLE|sombre,sournois,mysterieux,agressif,solitaire",
Nunu:"JUNGLE|joyeux,loyal,chaotique,sensible,courageux",
Olaf:"HAUT/JUNGLE|brutal,courageux,obstine,impulsif,agressif",
Orianna:"MILIEU|methodique,cerebral,calme,elegant,sensible",
Ornn:"HAUT|solitaire,obstine,calme,methodique,imperturbable",
Pantheon:"HAUT/SUPPORT|courageux,obstine,discipline,brutal,loyal",
Poppy:"HAUT/SUPPORT|loyal,obstine,protecteur,courageux,discipline",
Pyke:"SUPPORT|vengeur,sombre,solitaire,sournois,obstine",
Qiyana:"MILIEU|orgueilleux,ambitieux,elegant,agressif,sournois",
Quinn:"TIREUR/HAUT|courageux,loyal,malin,solitaire,discipline",
Rakan:"SUPPORT|theatral,sociable,joyeux,protecteur,elegant",
Rammus:"JUNGLE|imperturbable,calme,mysterieux,obstine,protecteur",
RekSai:"JUNGLE|agressif,brutal,sournois,solitaire,obstine",
Rell:"SUPPORT|rebelle,courageux,protecteur,brutal,loyal",
Renata:"SUPPORT|ambitieux,cerebral,elegant,sournois,methodique",
Renekton:"HAUT|brutal,vengeur,agressif,impulsif,obstine",
Rengar:"JUNGLE|orgueilleux,agressif,solitaire,obstine,courageux",
Riven:"HAUT|obstine,discipline,sensible,courageux,solitaire",
Rumble:"HAUT|impulsif,chaotique,orgueilleux,cerebral,rebelle",
Ryze:"MILIEU|cerebral,solitaire,discipline,obstine,mysterieux",
Samira:"TIREUR|theatral,agressif,orgueilleux,courageux,rebelle",
Sejuani:"JUNGLE|brutal,loyal,discipline,protecteur,courageux",
Senna:"SUPPORT/TIREUR|loyal,courageux,protecteur,obstine,calme",
Seraphine:"SUPPORT|sociable,joyeux,altruiste,sensible,protecteur",
Sett:"HAUT|brutal,sociable,protecteur,orgueilleux,courageux",
Shaco:"JUNGLE|sournois,chaotique,malin,sombre,theatral",
Shen:"HAUT|calme,discipline,protecteur,imperturbable,loyal",
Shyvana:"JUNGLE|solitaire,loyal,obstine,courageux,imperturbable",
Singed:"HAUT|chaotique,cerebral,imperturbable,sournois,obstine",
Sion:"HAUT|brutal,obstine,imperturbable,theatral,agressif",
Sivir:"TIREUR|ambitieux,malin,orgueilleux,courageux,sociable",
Skarner:"JUNGLE|protecteur,obstine,calme,loyal,brutal",
Smolder:"TIREUR|joyeux,sensible,courageux,loyal,impulsif",
Sona:"SUPPORT|calme,altruiste,elegant,sensible,protecteur",
Soraka:"SUPPORT|altruiste,sensible,protecteur,calme,loyal",
Swain:"MILIEU/SUPPORT|cerebral,ambitieux,methodique,imperturbable,sombre",
Sylas:"MILIEU|rebelle,vengeur,malin,agressif,ambitieux",
Syndra:"MILIEU|orgueilleux,rebelle,ambitieux,obstine,solitaire",
TahmKench:"SUPPORT|sournois,malin,protecteur,calme,theatral",
Taliyah:"MILIEU|sensible,courageux,loyal,cerebral,obstine",
Talon:"MILIEU|solitaire,sournois,discipline,agressif,sombre",
Taric:"SUPPORT|protecteur,elegant,loyal,altruiste,courageux",
Teemo:"HAUT|malin,sournois,joyeux,methodique,discipline",
Thresh:"SUPPORT|methodique,sournois,cerebral,mysterieux,sombre",
Tristana:"TIREUR|joyeux,courageux,impulsif,sociable,agressif",
Trundle:"JUNGLE/HAUT|sournois,brutal,malin,orgueilleux,agressif",
Tryndamere:"HAUT|obstine,brutal,vengeur,impulsif,courageux",
TwistedFate:"MILIEU|malin,sociable,joyeux,elegant,rebelle",
Twitch:"TIREUR|sournois,chaotique,sombre,malin,solitaire",
Udyr:"JUNGLE|discipline,calme,obstine,solitaire,imperturbable",
Urgot:"HAUT|brutal,vengeur,obstine,sombre,imperturbable",
Varus:"TIREUR|vengeur,discipline,sombre,obstine,solitaire",
Vayne:"TIREUR|solitaire,vengeur,discipline,obstine,sombre",
Veigar:"MILIEU|ambitieux,theatral,vengeur,obstine,cerebral",
Velkoz:"MILIEU/SUPPORT|cerebral,methodique,imperturbable,mysterieux,solitaire",
Vex:"MILIEU|sensible,rebelle,solitaire,sombre,malin",
Vi:"JUNGLE|impulsif,brutal,loyal,courageux,sociable",
Viego:"JUNGLE|vengeur,obstine,sombre,sensible,orgueilleux",
Viktor:"MILIEU|cerebral,ambitieux,methodique,imperturbable,obstine",
Vladimir:"MILIEU|elegant,orgueilleux,sombre,mysterieux,ambitieux",
Volibear:"JUNGLE/HAUT|brutal,orgueilleux,obstine,courageux,agressif",
Warwick:"JUNGLE|agressif,loyal,obstine,impulsif,solitaire",
Xayah:"TIREUR|rebelle,orgueilleux,loyal,agressif,malin",
Xerath:"MILIEU/SUPPORT|ambitieux,orgueilleux,cerebral,vengeur,theatral",
XinZhao:"JUNGLE|loyal,courageux,discipline,obstine,protecteur",
Yasuo:"MILIEU|rebelle,obstine,solitaire,orgueilleux,discipline",
Yone:"MILIEU|calme,discipline,solitaire,obstine,mysterieux",
Yorick:"HAUT|solitaire,obstine,loyal,sombre,discipline",
Yunara:"TIREUR|discipline,courageux,calme,loyal,elegant",
Yuumi:"SUPPORT|joyeux,sociable,sensible,loyal,altruiste",
Zaahen:"MILIEU/JUNGLE|agressif,ambitieux,sombre,rebelle,obstine",
Zac:"JUNGLE|joyeux,altruiste,protecteur,sensible,courageux",
Zed:"MILIEU|sombre,ambitieux,discipline,solitaire,rebelle",
Zeri:"TIREUR|impulsif,joyeux,courageux,sociable,rebelle",
Ziggs:"MILIEU|chaotique,joyeux,impulsif,cerebral,theatral",
Zilean:"SUPPORT|calme,cerebral,mysterieux,altruiste,methodique",
Zoe:"MILIEU|joyeux,chaotique,malin,sournois,theatral",
Zyra:"SUPPORT/MILIEU|sombre,vengeur,orgueilleux,methodique,elegant"
};

/* Mots-clés de secours si un champion n'est pas dans PROFILS
   (nouveau champion sorti après l'écriture du site) */
const PROFIL_DEFAUT = {
  Fighter:  "HAUT|brutal,courageux,obstine,agressif,discipline",
  Tank:     "HAUT|protecteur,imperturbable,loyal,calme,courageux",
  Mage:     "MILIEU|cerebral,methodique,elegant,ambitieux,mysterieux",
  Assassin: "JUNGLE|sournois,solitaire,agressif,malin,sombre",
  Marksman: "TIREUR|discipline,orgueilleux,methodique,courageux,obstine",
  Support:  "SUPPORT|altruiste,protecteur,loyal,sensible,sociable"
};

/* =========================================================
   24 QUESTIONS — PERSONNALITÉ
   Chaque réponse donne des points à des mots-clés.
   ========================================================= */
const Q_LOL_PERSO = [
{q:"Comment tu abordes une partie ?",a:[
 {t:"Je cherche la bagarre dès la première minute",s:{agressif:4,impulsif:3,brutal:2,courageux:2}},
 {t:"Je farme tranquillement et je monte en puissance",s:{methodique:4,discipline:3,calme:2,ambitieux:2}},
 {t:"J'observe et je frappe quand ils font une erreur",s:{sournois:4,malin:3,cerebral:2,solitaire:2}},
 {t:"Je m'occupe des autres avant de penser à moi",s:{altruiste:4,protecteur:3,loyal:2,sensible:2}}]},

{q:"Tu perds ton duel. Ta réaction ?",a:[
 {t:"Je reste et je force, ça finira par passer",s:{obstine:4,brutal:3,courageux:2,impulsif:2}},
 {t:"Je recule, je farme et j'attends mon moment",s:{calme:3,methodique:3,discipline:3,cerebral:2}},
 {t:"Je vais chercher ailleurs sur la carte",s:{malin:3,rebelle:2,solitaire:2,ambitieux:2}},
 {t:"Je demande de l'aide à mon équipe",s:{sociable:3,sensible:3,loyal:2,altruiste:2}}]},

{q:"Un pouvoir surnaturel au choix ?",a:[
 {t:"Devenir invisible",s:{sournois:4,mysterieux:3,solitaire:2,malin:2}},
 {t:"Me téléporter n'importe où",s:{malin:3,rebelle:2,joyeux:2,mysterieux:2}},
 {t:"Soigner et ramener les gens",s:{altruiste:4,protecteur:3,sensible:3,loyal:2}},
 {t:"Une puissance brute sans limite",s:{ambitieux:4,orgueilleux:3,brutal:2,theatral:2}}]},

{q:"Ton pire défaut ?",a:[
 {t:"Je suis trop impulsif",s:{impulsif:4,chaotique:3,agressif:2,brutal:2}},
 {t:"Je suis arrogant",s:{orgueilleux:4,theatral:3,ambitieux:2,rebelle:2}},
 {t:"Je garde tout pour moi",s:{solitaire:4,mysterieux:3,sombre:2,discipline:2}},
 {t:"Je m'attache trop aux gens",s:{sensible:4,loyal:3,altruiste:2,protecteur:2}}]},

{q:"Ton équipe est complètement à la ramasse. Tu…",a:[
 {t:"Je porte la partie tout seul",s:{orgueilleux:3,solitaire:3,ambitieux:3,obstine:2}},
 {t:"Je garde mon calme et je réorganise",s:{calme:4,cerebral:3,protecteur:2,discipline:2}},
 {t:"Je tente un truc complètement absurde",s:{chaotique:4,joyeux:3,theatral:2,rebelle:2}},
 {t:"Je m'énerve et je joue dans mon coin",s:{rebelle:3,solitaire:3,sombre:2,orgueilleux:2}}]},

{q:"Ton élément ?",a:[
 {t:"Le feu",s:{impulsif:3,agressif:3,chaotique:2,theatral:2}},
 {t:"La glace et le vent",s:{calme:3,elegant:3,imperturbable:2,discipline:2}},
 {t:"L'ombre",s:{sombre:4,mysterieux:3,sournois:2,solitaire:2}},
 {t:"La pierre et le métal",s:{imperturbable:4,obstine:3,protecteur:2,brutal:2}}]},

{q:"Comment tu prépares quelque chose d'important ?",a:[
 {t:"Tout est planifié à l'avance, dans le détail",s:{methodique:4,cerebral:3,discipline:2,elegant:2}},
 {t:"Je répète le même geste jusqu'à la perfection",s:{discipline:4,obstine:3,solitaire:2,methodique:2}},
 {t:"J'improvise, ça passe toujours",s:{joyeux:3,chaotique:3,malin:2,courageux:2}},
 {t:"J'accumule patiemment jusqu'à être prêt",s:{ambitieux:3,methodique:3,obstine:3,cerebral:2}}]},

{q:"Ta soirée idéale ?",a:[
 {t:"Grosse soirée, tout le monde me regarde",s:{theatral:4,sociable:3,orgueilleux:2,joyeux:2}},
 {t:"Avec mes proches, tranquille",s:{loyal:3,sensible:3,protecteur:2,sociable:2}},
 {t:"Seul, au calme",s:{solitaire:4,mysterieux:2,calme:2,sombre:2}},
 {t:"À bosser sur un projet personnel",s:{cerebral:4,methodique:3,obstine:2,discipline:2}}]},

{q:"On t'insulte dans le chat. Tu fais quoi ?",a:[
 {t:"Je réponds encore plus fort",s:{agressif:4,impulsif:3,brutal:2,orgueilleux:2}},
 {t:"J'ignore complètement",s:{imperturbable:4,calme:3,discipline:2,solitaire:2}},
 {t:"Je réponds avec une punchline",s:{malin:3,joyeux:3,theatral:2,sociable:2}},
 {t:"Je note son pseudo, je n'oublie pas",s:{vengeur:4,sombre:3,obstine:2,sournois:2}}]},

{q:"Ton rôle dans ton groupe d'amis ?",a:[
 {t:"Le leader qui organise tout",s:{ambitieux:3,discipline:3,protecteur:2,cerebral:2}},
 {t:"Celui qui met l'ambiance",s:{joyeux:4,sociable:3,theatral:2,chaotique:2}},
 {t:"Celui sur qui on peut compter",s:{loyal:4,protecteur:3,courageux:2,calme:2}},
 {t:"Le discret dont on sait peu de choses",s:{mysterieux:4,solitaire:3,sombre:2,calme:2}}]},

{q:"Choisis un animal.",a:[
 {t:"Le loup",s:{solitaire:3,agressif:2,loyal:2,obstine:2}},
 {t:"Le renard ou le chat",s:{malin:4,joyeux:2,elegant:2,sournois:2}},
 {t:"Le prédateur discret, l'insecte",s:{sournois:4,sombre:2,mysterieux:2,agressif:2}},
 {t:"Le lion, quelque chose de solaire",s:{courageux:4,protecteur:3,orgueilleux:2,loyal:2}}]},

{q:"Qu'est-ce qui te motive vraiment ?",a:[
 {t:"Être le meilleur, sans discussion",s:{ambitieux:4,orgueilleux:3,discipline:2,obstine:2}},
 {t:"Protéger les gens auxquels je tiens",s:{protecteur:4,loyal:3,courageux:2,altruiste:2}},
 {t:"Comprendre et tout maîtriser",s:{cerebral:4,methodique:3,mysterieux:2,discipline:2}},
 {t:"Une revanche à prendre",s:{vengeur:4,obstine:3,sombre:2,solitaire:2}}]},

{q:"Une couleur ?",a:[
 {t:"Rouge",s:{agressif:3,impulsif:2,brutal:2,theatral:2}},
 {t:"Or et lumière",s:{courageux:3,elegant:3,protecteur:2,orgueilleux:2}},
 {t:"Violet nuit",s:{mysterieux:3,ambitieux:2,elegant:2,sombre:2}},
 {t:"Bleu glacé",s:{calme:3,cerebral:2,discipline:2,imperturbable:2}}]},

{q:"Dans un film d'horreur, tu serais…",a:[
 {t:"Celui qui meurt en fonçant tête baissée",s:{impulsif:4,courageux:2,brutal:2,chaotique:2}},
 {t:"Le survivant qui garde son calme",s:{calme:4,imperturbable:3,discipline:2,cerebral:2}},
 {t:"Le monstre",s:{sombre:4,brutal:3,mysterieux:2,vengeur:2}},
 {t:"Celui qui avait déjà tout piégé",s:{methodique:4,sournois:3,malin:3,cerebral:2}}]},

{q:"Ta façon de te déplacer ?",a:[
 {t:"Vite, tout le temps",s:{impulsif:3,agressif:2,joyeux:2,rebelle:2}},
 {t:"En silence, dans le dos des gens",s:{sournois:4,mysterieux:3,solitaire:2,sombre:2}},
 {t:"Lentement, personne ne me presse",s:{imperturbable:4,calme:3,obstine:2,theatral:2}},
 {t:"Avec le groupe, jamais seul",s:{sociable:4,loyal:3,protecteur:2,sensible:2}}]},

{q:"Un coéquipier fait une erreur énorme.",a:[
 {t:"« C'est rien, on continue »",s:{altruiste:4,calme:3,loyal:2,protecteur:2}},
 {t:"Je lui explique calmement quoi faire",s:{cerebral:3,calme:3,discipline:2,protecteur:2}},
 {t:"Je le charrie gentiment",s:{joyeux:4,sociable:3,malin:2,theatral:2}},
 {t:"Je soupire et je joue seul",s:{solitaire:4,orgueilleux:3,rebelle:2,obstine:2}}]},

{q:"Ce qui te fait le plus peur ?",a:[
 {t:"Perdre le contrôle",s:{methodique:4,discipline:3,cerebral:2,imperturbable:2}},
 {t:"Être ignoré ou oublié",s:{theatral:4,ambitieux:3,orgueilleux:3,vengeur:2}},
 {t:"Rester seul",s:{sensible:4,sociable:3,loyal:2,altruiste:2}},
 {t:"Rien du tout, sincèrement",s:{imperturbable:4,courageux:3,brutal:2,solitaire:2}}]},

{q:"Ton style vestimentaire ?",a:[
 {t:"Coloré, voyant, on me remarque",s:{theatral:4,joyeux:3,chaotique:2,sociable:2}},
 {t:"Chic et impeccable",s:{elegant:4,orgueilleux:2,methodique:2,ambitieux:2}},
 {t:"Sombre et discret",s:{sombre:4,mysterieux:3,solitaire:2,sournois:2}},
 {t:"Robuste, fonctionnel, une armure",s:{discipline:3,protecteur:3,brutal:2,courageux:2}}]},

{q:"Ta punchline avant un affrontement ?",a:[
 {t:"« Regardez-moi bien. »",s:{orgueilleux:4,theatral:3,ambitieux:2,rebelle:2}},
 {t:"« Tu ne m'as même pas vu venir. »",s:{sournois:4,mysterieux:3,malin:2,sombre:2}},
 {t:"« On y va ensemble, suivez-moi. »",s:{courageux:4,loyal:3,protecteur:3,sociable:2}},
 {t:"« T'inquiète, je te couvre. »",s:{protecteur:4,altruiste:3,loyal:2,sensible:2}}]},

{q:"Tu gagnes un combat. Ta réaction ?",a:[
 {t:"Je célèbre, j'en fais des tonnes",s:{theatral:4,joyeux:3,orgueilleux:2,sociable:2}},
 {t:"Rien, je passe à la suite",s:{imperturbable:4,calme:3,discipline:2,solitaire:2}},
 {t:"Je rappelle que c'était grâce à moi",s:{orgueilleux:4,ambitieux:3,theatral:2,rebelle:2}},
 {t:"Je vérifie que tout le monde va bien",s:{altruiste:4,protecteur:3,sensible:2,loyal:2}}]},

{q:"On te propose de tricher pour gagner.",a:[
 {t:"Jamais. L'honneur avant tout.",s:{loyal:4,discipline:3,courageux:2,protecteur:2}},
 {t:"Si personne ne le sait, pourquoi pas",s:{malin:4,sournois:3,rebelle:2,joyeux:2}},
 {t:"Évidemment, tous les moyens sont bons",s:{ambitieux:4,sombre:3,sournois:2,brutal:2}},
 {t:"Non, je préfère gagner en étant plus malin",s:{cerebral:4,methodique:3,malin:2,elegant:2}}]},

{q:"Le meilleur moment d'une partie ?",a:[
 {t:"Un duel gagné contre plus fort que moi",s:{obstine:4,courageux:3,orgueilleux:2,discipline:2}},
 {t:"Un combat d'équipe parfaitement exécuté",s:{discipline:3,cerebral:3,protecteur:2,loyal:2}},
 {t:"Le moment où l'ennemi ne comprend rien",s:{sournois:4,malin:3,mysterieux:2,chaotique:2}},
 {t:"Quand mon équipe survit grâce à moi",s:{altruiste:4,protecteur:4,sensible:2,loyal:2}}]},

{q:"Comment tu résous un problème ?",a:[
 {t:"Je fonce dedans jusqu'à ce que ça cède",s:{brutal:4,obstine:3,impulsif:2,courageux:2}},
 {t:"Je le contourne intelligemment",s:{malin:4,cerebral:2,sournois:2,elegant:2}},
 {t:"Je demande de l'aide",s:{sociable:4,sensible:3,loyal:2,altruiste:2}},
 {t:"Je l'analyse jusqu'à trouver la faille",s:{cerebral:4,methodique:3,discipline:2,elegant:2}}]},

{q:"Où est-ce que tu te sens le mieux ?",a:[
 {t:"En pleine nature",s:{calme:3,solitaire:2,altruiste:2,sensible:2}},
 {t:"Dans une grande ville animée",s:{sociable:4,joyeux:2,ambitieux:2,theatral:2}},
 {t:"Quelque part de sombre et calme",s:{sombre:4,mysterieux:3,solitaire:3,imperturbable:2}},
 {t:"Dans un endroit que je connais par cœur",s:{loyal:3,obstine:3,discipline:2,imperturbable:2}}]}
];

/* =========================================================
   20 QUESTIONS — GAMEPLAY
   Mots-clés : voies (HAUT/JUNGLE/MILIEU/TIREUR/SUPPORT),
   classes (Fighter/Tank/Mage/Assassin/Marksman/Support)
   et repères de difficulté (facile/moyen/difficile).
   ========================================================= */
const Q_LOL_JEU = [
{q:"Quelle voie te tente le plus ?",a:[
 {t:"La voie du haut : un contre un et split push",s:{HAUT:8,Fighter:2,Tank:1}},
 {t:"La jungle : je décide du rythme de la partie",s:{JUNGLE:8,Assassin:2,Fighter:1}},
 {t:"Le milieu : je suis au centre de tout",s:{MILIEU:8,Mage:2,Assassin:1}},
 {t:"La voie du bas : tireur ou support",s:{TIREUR:5,SUPPORT:5,Marksman:2,Support:2}}]},

{q:"Les combos techniques à exécuter vite ?",a:[
 {t:"J'adore, plus c'est dur mieux c'est",s:{difficile:6,Assassin:2,Fighter:1},v:9},
 {t:"Un combo simple mais bien placé me suffit",s:{moyen:5,Mage:1,Fighter:1},v:5},
 {t:"Le moins de touches possible",s:{facile:6,Tank:2,Support:1},v:2},
 {t:"Je préfère viser juste que cliquer vite",s:{moyen:3,Mage:3,Marksman:2},v:6}]},

{q:"Tu préfères être fort…",a:[
 {t:"Dès le début de la partie",s:{Fighter:3,Assassin:2,Tank:1,HAUT:1}},
 {t:"En fin de partie, avec tous mes objets",s:{Marksman:4,Mage:2,TIREUR:2}},
 {t:"Constant du début à la fin",s:{Mage:2,Fighter:2,Support:2,Tank:1}},
 {t:"Peu importe, tant que je suis utile",s:{Support:5,Tank:2,SUPPORT:2}}]},

{q:"Farmer les sbires ou chercher les éliminations ?",a:[
 {t:"Farmer, l'or régulier avant tout",s:{Marksman:3,Mage:3,TIREUR:2,facile:1}},
 {t:"Chercher les kills en permanence",s:{Assassin:5,JUNGLE:2,agressif:1}},
 {t:"Les deux, je m'adapte",s:{Fighter:3,Mage:1,moyen:2}},
 {t:"Ni l'un ni l'autre, je joue pour l'équipe",s:{Support:6,SUPPORT:3,Tank:2}}]},

{q:"Split push ou combat d'équipe ?",a:[
 {t:"Split push : seul dans une voie",s:{HAUT:4,Fighter:3,solitaire:2}},
 {t:"Combat d'équipe, tout le monde groupé",s:{Tank:4,Mage:3,Support:2}},
 {t:"J'embusque les isolés dans la jungle",s:{Assassin:5,JUNGLE:3}},
 {t:"Je suis mon porteur de dégâts partout",s:{Support:5,SUPPORT:3}}]},

{q:"En duel de voie, tu joues comment ?",a:[
 {t:"J'agresse dès le niveau 1",s:{Fighter:3,Assassin:2,agressif:2,HAUT:1}},
 {t:"Je joue en sécurité et je farme",s:{Marksman:3,Tank:2,Mage:2,facile:1}},
 {t:"Je harcèle à distance sans me montrer",s:{Mage:4,Marksman:2,MILIEU:1}},
 {t:"J'attends l'aide de mon jungler",s:{Tank:3,Support:3,SUPPORT:2}}]},

{q:"Tu veux un champion…",a:[
 {t:"Facile, jouable tout de suite",s:{facile:6,tresfacile:4},v:1},
 {t:"Avec un plafond de maîtrise énorme",s:{difficile:6,tresdifficile:4},v:9},
 {t:"Équilibré, ni trop simple ni trop dur",s:{moyen:8},v:5},
 {t:"Que peu de gens jouent bien",s:{tresdifficile:5,difficile:3,moyen:1},v:8}]},

{q:"Ce qui te fait le plus plaisir ?",a:[
 {t:"Un quadruple kill en plein combat",s:{Assassin:4,Marksman:3,agressif:1}},
 {t:"Un engagement parfait qui gagne le combat",s:{Tank:5,SUPPORT:2,Support:2}},
 {t:"Battre quelqu'un en un contre un",s:{Fighter:5,HAUT:2}},
 {t:"Sauver un allié à 2 % de vie",s:{Support:6,SUPPORT:3}}]},

{q:"Corps à corps ou à distance ?",a:[
 {t:"Corps à corps, dans la mêlée",s:{Fighter:4,Tank:3,HAUT:2,JUNGLE:1}},
 {t:"À distance, en sécurité",s:{Mage:4,Marksman:4,MILIEU:1,TIREUR:1}},
 {t:"Semi-distance, j'entre et je ressors",s:{Assassin:4,Fighter:1,MILIEU:1}},
 {t:"Peu importe, je m'adapte",s:{Support:3,moyen:2}}]},

{q:"Mourir en engageant les combats, ça te va ?",a:[
 {t:"Oui, c'est mon rôle d'ouvrir",s:{Tank:6,SUPPORT:2}},
 {t:"Non, je veux rester en vie",s:{Marksman:4,Mage:3,TIREUR:2}},
 {t:"Ça m'est égal si l'équipe en profite",s:{Support:5,Tank:2}},
 {t:"Je préfère entrer en dernier, sur les blessés",s:{Assassin:5,JUNGLE:2}}]},

{q:"Combien de champions tu veux maîtriser ?",a:[
 {t:"Un seul, mais à fond",s:{difficile:5,solitaire:1},v:8},
 {t:"Quelques-uns par rôle",s:{moyen:4},v:5},
 {t:"Le plus possible, j'aime varier",s:{moyen:3,facile:2},v:4},
 {t:"Un ou deux très simples, ça me suffit",s:{facile:6},v:2}]},

{q:"Ce que tu veux apporter à ton équipe ?",a:[
 {t:"Des dégâts physiques, du coup qui fait mal",s:{grosseattaque:5,Marksman:2,Assassin:2,Fighter:1}},
 {t:"Encaisser et engager pour les autres",s:{Tank:5,resistant:4}},
 {t:"De la magie et du contrôle à distance",s:{grossemagie:5,Mage:3,Support:1}},
 {t:"Des soins et de la protection",s:{Support:6,SUPPORT:2}}]},

{q:"Ta plus grosse faiblesse ?",a:[
 {t:"Je fonce et je meurs bêtement",s:{resistant:5,Tank:3,facile:1}},
 {t:"Je suis trop passif, je n'ose pas",s:{Assassin:3,Fighter:2,grosseattaque:2}},
 {t:"Je rate mes compétences à viser",s:{facile:4,tresfacile:3,Tank:1}},
 {t:"Je me place mal en combat d'équipe",s:{resistant:3,Support:3,facile:2}}]},

{q:"Tu préfères…",a:[
 {t:"Un pic de dégâts qui supprime d'un coup",s:{Assassin:5,Mage:3}},
 {t:"Des dégâts continus dans la durée",s:{Marksman:5,Fighter:3}},
 {t:"Des dégâts de zone sur tout le monde",s:{Mage:5,Tank:1}},
 {t:"Je ne fais pas de dégâts, j'aide",s:{Support:6,SUPPORT:2}}]},

{q:"Tu aimes les embuscades ?",a:[
 {t:"Oui, disparaître et frapper d'un coup",s:{Assassin:6,JUNGLE:2,sournois:1}},
 {t:"Oui, mais avec des pièges posés à l'avance",s:{Mage:3,methodique:2,HAUT:1}},
 {t:"Non, je préfère l'affrontement franc",s:{Fighter:4,Tank:3,brutal:1}},
 {t:"Non, je reste derrière et je soutiens",s:{Support:5,Mage:2}}]},

{q:"Ton positionnement en combat d'équipe ?",a:[
 {t:"Devant, j'encaisse tout",s:{Tank:6,Fighter:2}},
 {t:"Derrière, je tape en sécurité",s:{Marksman:5,Mage:3}},
 {t:"Sur les côtés, j'attends l'ouverture",s:{Assassin:6}},
 {t:"Collé à mon porteur de dégâts",s:{Support:6,SUPPORT:2}}]},

{q:"Tu veux un champion qui…",a:[
 {t:"Gagne les parties tout seul",s:{Assassin:3,Fighter:3,Marksman:2,solitaire:1}},
 {t:"Rend toute l'équipe meilleure",s:{Support:6,SUPPORT:2}},
 {t:"Fait peur rien qu'en apparaissant",s:{Fighter:3,Tank:2,brutal:2,sombre:1}},
 {t:"Est fun même quand je perds",s:{facile:3,joyeux:2,chaotique:2}}]},

{q:"Tu joues plutôt…",a:[
 {t:"En solo, je ne compte sur personne",s:{Assassin:3,Fighter:3,solitaire:2,HAUT:1}},
 {t:"En équipe, tout le monde coordonné",s:{Support:4,Tank:3,SUPPORT:1}},
 {t:"En duo avec un pote",s:{Support:4,SUPPORT:3,Marksman:1}},
 {t:"Un champion jouable à plusieurs postes, je m'adapte",s:{polyvalent:6,moyen:2}}]},

{q:"Tu supportes de rater une compétence importante ?",a:[
 {t:"Non, je veux du sûr qui touche toujours",s:{facile:5,Marksman:2,Tank:1},v:3},
 {t:"Oui, j'aime le risque d'un gros sort à viser",s:{difficile:4,Mage:3,SUPPORT:1},v:8},
 {t:"Ça ne me dérange pas, je réessaie",s:{moyen:4,Fighter:1},v:5},
 {t:"J'évite : je préfère les compétences de zone",s:{Mage:3,Tank:2,facile:2},v:4}]},

{q:"Ton objectif sur LoL ?",a:[
 {t:"Monter le plus haut possible en classé",s:{difficile:3,Assassin:2,ambitieux:2},v:7},
 {t:"M'amuser avec mes potes",s:{facile:3,joyeux:2,Support:2},v:3},
 {t:"Devenir vraiment bon mécaniquement",s:{difficile:6},v:10},
 {t:"Comprendre le jeu et bien décider",s:{Mage:2,Support:2,cerebral:2,moyen:2},v:6}]}
];

/* =========================================================
   CHARGEMENT DES CHAMPIONS DEPUIS DATA DRAGON
   ========================================================= */
const COULEURS_CLASSE = {
  Fighter:  ["#e08a4a","#8a4520"],
  Tank:     ["#7ea8c4","#2c4a63"],
  Mage:     ["#a97fd6","#4a2a75"],
  Assassin: ["#d9534f","#5c1f1d"],
  Marksman: ["#6fcf97","#1e6b45"],
  Support:  ["#f0c674","#8a6a2a"]
};
const NOM_CLASSE = {
  Fighter:"COMBATTANT", Tank:"TANK", Mage:"MAGE",
  Assassin:"ASSASSIN", Marksman:"TIREUR", Support:"SUPPORT"
};

/* Convertit la difficulté Data Dragon (1-10) en note sur 5 */
const diff5 = n => Math.max(1, Math.min(5, Math.round(n / 2)));

function motsClesDifficulte(d10){
  if (d10 <= 3) return "facile";
  if (d10 <= 6) return "moyen";
  return "difficile";
}

async function chargerChampions(){
  const version = await fetch("https://ddragon.leagueoflegends.com/api/versions.json")
    .then(r => r.json()).then(j => j[0]);
  const data = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/fr_FR/champion.json`)
    .then(r => r.json());

  Object.values(data.data).forEach(c => {
    // Data Dragon expose des entrées annexes (variantes) qu'on ignore
    if (c.id.indexOf("_") !== -1) return;

    const profil = PROFILS[c.id] || PROFIL_DEFAUT[c.tags[0]] || PROFIL_DEFAUT.Fighter;
    const [voies, motsPerso] = profil.split("|");
    const classe = c.tags[0] || "Fighter";
    const d10 = c.info.difficulty || 5;

    CHAMPIONS[c.id] = {
      u: c.id,
      n: c.name.toUpperCase(),
      titre: c.title,
      r: voies.split("/")[0],           // voie principale, pour le profil par rôle
      voies: voies.split("/"),
      c: COULEURS_CLASSE[classe] || COULEURS_CLASSE.Fighter,
      q: "« " + c.title.charAt(0).toUpperCase() + c.title.slice(1) + " »",
      d: c.blurb,                        // description officielle de Riot, en français
      t: motsPerso.split(",").map(libelle),   // traits affichés, joliment écrits
      mots: motsPerso.split(","),             // mots-clés bruts, pour le calcul
      classe: classe,
      classes: c.tags,
      diff10: d10,
      stats: c.info                      // attaque / défense / magie / difficulté
    };
  });

  return { version, nombre: Object.keys(CHAMPIONS).length };
}

/* =========================================================
   SCORING PAR MOTS-CLÉS
   Un champion marque des points quand une réponse cite
   un de ses mots-clés (personnalité) ou une de ses
   caractéristiques (voie, classe, difficulté).
   ========================================================= */
/* Mots-clés déduits des statistiques officielles du champion.
   Sans eux, deux champions de même voie / même classe / même difficulté
   seraient strictement identiques pour le test de gameplay. */
function motsClesStats(c){
  const s = c.stats, m = [];
  if (s.attack  >= 7) m.push("grosseattaque");
  if (s.magic   >= 7) m.push("grossemagie");
  if (s.defense >= 7) m.push("resistant");
  if (s.defense <= 3) m.push("fragile");
  if (s.attack  <= 3) m.push("peudattaque");
  if (c.diff10  >= 8) m.push("tresdifficile");
  if (c.diff10  <= 2) m.push("tresfacile");
  if (c.voies.length > 1) m.push("polyvalent");
  return m;
}

function motsClesChampion(id, testMode){
  const c = CHAMPIONS[id];
  if (testMode === "perso") return c.mots;
  return c.voies.concat(c.classes, [motsClesDifficulte(c.diff10)], motsClesStats(c), c.mots);
}
