/* ============================================================
   conseils.js — les méthodes, en clair
   ============================================================ */

const Conseils = (() => {

  const blocs = [
    {
      t: '🎯 Le vrai coupable : l\'attention, pas la mémoire',
      p: 'Quand tu « oublies » où sont tes clés, la plupart du temps tu ne l\'as jamais enregistré : tu les as posées en pensant à autre chose. Une information non remarquée ne peut pas être retrouvée.',
      l: [
        'Au moment qui compte, marque <b>une seconde d\'arrêt</b> et regarde ce que tu fais.',
        'Dis-le à voix haute : « je pose mes clés sur le meuble de l\'entrée ».',
        'Une seule tâche à la fois quand tu veux retenir. Le téléphone à la main = zéro encodage.'
      ],
      ex: 'Teste ça une semaine sur un seul geste (fermer la porte, prendre ton badge). Tu verras le doute disparaître.'
    },
    {
      t: '🗓️ Externalise tout ce qui a une date',
      p: 'Une bonne mémoire ne consiste pas à tout stocker dans sa tête. Les gens qui n\'oublient rien ont surtout un <b>système</b>. Ta tête sert à réfléchir, pas à faire office de post-it.',
      l: [
        '<b>Une seule</b> boîte de réception pour les idées (une appli de notes, un carnet — mais un seul).',
        'Tout ce qui a une date part immédiatement dans l\'agenda, avec une alarme.',
        'Règle des 2 minutes : si ça prend moins de 2 minutes, fais-le tout de suite au lieu de le mémoriser.'
      ],
      ex: 'Les mémos de ce site servent à l\'autre catégorie : ce qui n\'a pas de date mais qu\'il faut avoir en tête (prénoms, codes, préférences des gens).'
    },
    {
      t: '🔁 Se tester bat relire, toujours',
      p: 'Relire donne une impression de maîtrise totalement trompeuse — c\'est exactement pour ça que tu ne te rends pas compte que tu oublies. Se forcer à retrouver l\'information, même en échouant, grave beaucoup plus profondément.',
      l: [
        'Après avoir lu ou entendu quelque chose, ferme les yeux et récite-le <b>de mémoire</b>.',
        'Espace les rappels : tout de suite, puis 10 minutes après, puis le lendemain.',
        'Un échec de rappel suivi de la réponse est <b>plus efficace</b> qu\'une relecture réussie.'
      ],
      ex: 'C\'est exactement le principe des « Mes mémos » : intervalles de 1, 3, 7, 15 puis 30 jours.'
    },
    {
      t: '🏠 Le palais de la mémoire',
      p: 'Ton cerveau retient les lieux beaucoup mieux que les listes. La technique des champions de mémoire : accrocher chaque élément à un endroit précis d\'un parcours que tu connais par cœur.',
      l: [
        'Choisis un trajet familier : entrée → couloir → salon → cuisine → chambre.',
        'Place chaque chose à retenir dans une pièce, avec une image <b>exagérée et absurde</b>.',
        'Pour te souvenir, refais le trajet mentalement dans le même ordre.'
      ],
      ex: 'Liste de courses (lait, piles, timbres) : une vache dans ton entrée, des piles qui grésillent dans le couloir, des timbres collés sur ton canapé.'
    },
    {
      t: '👤 Retenir les prénoms',
      p: 'C\'est l\'oubli le plus gênant socialement, et c\'est presque toujours un problème d\'encodage : tu n\'écoutais pas le prénom, tu préparais ta phrase suivante.',
      l: [
        '<b>Répète-le immédiatement</b> : « Enchanté, Julien. »',
        'Réutilise-le deux ou trois fois dans la conversation, puis en partant.',
        'Associe une image au prénom + un détail du visage (Julien / « joue lisse »).',
        'Le soir même, repasse mentalement les personnes rencontrées.'
      ],
      ex: 'L\'exercice « Noms & visages » entraîne précisément ce réflexe.'
    },
    {
      t: '📦 Le chunking (découpage)',
      p: 'La mémoire de travail tient environ 4 unités. Mais une « unité » peut être un gros paquet. C\'est pour ça qu\'on retient 06 12 34 56 78 mais pas 0612345678.',
      l: [
        'Découpe systématiquement en groupes de 3 ou 4.',
        'Cherche du sens dans les paquets (une année, un âge, une date).',
        'Pour une liste, regroupe par catégories plutôt que dans l\'ordre donné.'
      ],
      ex: 'Utilise-le dans l\'exercice « Empan de chiffres » : tu gagneras 2 ou 3 chiffres presque immédiatement.'
    },
    {
      t: '😴 Sommeil, sport, stress',
      p: 'La consolidation des souvenirs se fait pendant le sommeil profond. C\'est le levier le plus puissant, et le plus négligé.',
      l: [
        'Une nuit courte = une journée entière qui s\'imprime mal.',
        '30 minutes de marche rapide améliorent la mémoire dans les heures qui suivent.',
        'Le stress chronique et l\'anxiété abîment directement le rappel — souvent, « je perds la mémoire » veut dire « je suis épuisé ».',
        'L\'alcool bloque la consolidation nocturne.'
      ],
      ex: 'Si tes scores ici chutent plusieurs jours d\'affilée, regarde d\'abord ton sommeil avant de t\'inquiéter.'
    },
    {
      t: '🩺 Quand consulter',
      p: 'Ce site est un entraînement, pas un examen médical. Oublier des mots, des rendez-vous ou des prénoms est extrêmement courant, surtout en période de fatigue ou de stress.',
      l: [
        'Parles-en à un médecin si les oublis <b>s\'aggravent nettement</b> en quelques mois,',
        'si ton entourage le remarque plus que toi,',
        'ou si ça gêne des gestes du quotidien (se repérer, suivre une recette, gérer l\'argent).',
        'Un bilan simple existe et rassure la plupart du temps.'
      ],
      ex: 'Tes courbes de progrès peuvent d\'ailleurs servir de repère objectif à montrer en consultation.'
    }
  ];

  function render() {
    const zone = $('#conseilsBody');
    clear(zone);
    blocs.forEach(b => {
      zone.append(el('div', { class: 'method' },
        el('h3', { text: b.t }),
        el('p', { html: b.p }),
        el('ul', {}, b.l.map(x => el('li', { html: x }))),
        b.ex ? el('div', { class: 'ex', html: b.ex }) : null
      ));
    });
  }

  return { render };
})();
