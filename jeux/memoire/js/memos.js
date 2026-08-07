/* ============================================================
   memos.js — répétition espacée pour les choses de la vraie vie
   ============================================================ */

const Memos = (() => {
  let file = [];        // mémos à réviser dans cette session
  let courant = null;

  function init() {
    // modèles rapides
    const zone = $('#memoTemplates');
    clear(zone);
    DATA.modelesMemo.forEach(m => {
      zone.append(el('button', {
        class: 'chip', text: m.l,
        onclick: () => { $('#memoQ').value = m.q; $('#memoQ').focus(); }
      }));
    });

    $('#memoAddBtn').onclick = ajouter;
    $('#memoA').addEventListener('keydown', e => { if (e.key === 'Enter') ajouter(); });
  }

  function ajouter() {
    const q = $('#memoQ').value.trim();
    const a = $('#memoA').value.trim();
    if (!q || !a) { toast('Il faut une question ET une réponse.'); return; }
    Store.addMemo(q, a);
    $('#memoQ').value = ''; $('#memoA').value = '';
    toast('Mémo ajouté — il te sera redemandé aujourd\'hui, puis demain, puis dans 3 jours…');
    render();
    App.refreshBadges();
  }

  function render() {
    renderRevision();
    renderListe();
  }

  /* ---------- zone de révision ---------- */
  function renderRevision() {
    const zone = $('#memoReviewArea');
    clear(zone);
    const dus = Store.dueMemos();
    $('#memoDueCount').textContent = dus.length ? `${dus.length} à réviser` : 'rien à réviser';
    $('#memoDueCount').className = 'pill' + (dus.length ? ' hot' : '');

    if (!dus.length) {
      zone.append(el('div', { class: 'empty' },
        Store.data.memos.length
          ? '✅ Tout est révisé pour aujourd\'hui. Reviens demain.'
          : 'Ajoute ton premier mémo ci-dessus. Commence par les trois choses que tu oublies le plus souvent.'));
      return;
    }

    // constitue la file si besoin
    if (!file.length || !courant) { file = shuffle(dus); courant = file.shift(); }
    if (!courant) { renderRevision(); return; }

    afficherQuestion(zone);
  }

  function afficherQuestion(zone) {
    clear(zone);
    const m = courant;
    zone.append(
      el('p', { class: 'small muted', text: `Reste ${file.length + 1} mémo(s) — essaie de retrouver la réponse avant de la voir.` }),
      el('div', { class: 'memo-q', text: m.q }),
      el('button', { class: 'btn btn-primary', onclick: () => afficherReponse(zone) }, 'Afficher la réponse')
    );
  }

  function afficherReponse(zone) {
    clear(zone);
    const m = courant;
    zone.append(
      el('div', { class: 'memo-q', text: m.q }),
      el('div', { class: 'memo-a', text: m.a }),
      el('p', { class: 'small muted', text: 'Sois honnête : « oublié » n\'est pas un échec, c\'est ce qui règle le bon rythme.' }),
      el('div', { class: 'memo-actions' },
        el('button', { class: 'btn btn-danger', onclick: () => noter('oubli') }, '😵 Oublié'),
        el('button', { class: 'btn btn-warn', onclick: () => noter('dur') }, '😐 Difficile'),
        el('button', { class: 'btn btn-ok', onclick: () => noter('facile') }, '😄 Facile')
      )
    );
  }

  function noter(grade) {
    const m = Store.reviewMemo(courant.id, grade);
    if (grade === 'oubli') file.push(m);   // il repassera dans la même session
    courant = file.shift() || null;
    if (!courant) {
      const dus = Store.dueMemos();
      if (dus.length) { file = shuffle(dus); courant = file.shift(); }
    }
    render();
    App.refreshBadges();
    if (!courant) toast('Révision terminée 👏');
  }

  /* ---------- liste complète ---------- */
  function renderListe() {
    const zone = $('#memoList');
    clear(zone);
    const memos = Store.data.memos;
    $('#memoTotal').textContent = memos.length ? `(${memos.length})` : '';

    if (!memos.length) {
      zone.append(el('div', { class: 'empty', text: 'Aucun mémo pour l\'instant.' }));
      return;
    }

    memos.forEach(m => {
      const niveaux = el('span', { class: 'lvl' },
        Store.INTERVALS.map((_, i) => el('i', { class: i <= m.box ? 'on' : '' })));
      const jours = daysBetween(new Date(), keyToDate(m.due));
      const quand = jours <= 0 ? 'à réviser maintenant'
        : jours === 1 ? 'demain'
        : `dans ${jours} jours`;

      zone.append(el('div', { class: 'memo-item' },
        el('div', { class: 'mi-body' },
          el('div', { class: 'mi-q', text: m.q }),
          el('div', { class: 'mi-a', text: m.a }),
          el('div', { class: 'mi-meta' },
            niveaux,
            el('span', { text: quand }),
            el('span', { text: `· ${m.reviews} révision(s)` }),
            m.lapses ? el('span', { text: `· ${m.lapses} oubli(s)` }) : null
          )
        ),
        el('button', {
          class: 'del-btn', title: 'Supprimer',
          onclick: () => {
            if (!confirm('Supprimer ce mémo ?')) return;
            Store.deleteMemo(m.id);
            if (courant && courant.id === m.id) { courant = null; file = []; }
            file = file.filter(x => x.id !== m.id);
            render(); App.refreshBadges();
          }
        }, '🗑')
      ));
    });
  }

  return { init, render };
})();
