/* ==========================================================================
   Aplicación: navegación por hash, menú, progreso y controles interactivos.
   Rutas:  #/            → inicio
           #/modulo      → primera página del módulo
           #/modulo/3    → página 3 del módulo
   ========================================================================== */
(function () {
  'use strict';

  const sections = MER.sections.slice().sort((a, b) => a.orden - b.orden);
  const byId = Object.fromEntries(sections.map((s) => [s.id, s]));
  const GROUPS = ['Conceptos', 'Método de resolución', 'Práctica'];

  const $ = (sel, el) => (el || document).querySelector(sel);
  const main = $('#content');
  const nav = $('#menu');

  /* ---------- Almacenamiento seguro ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } },
  };
  let visited = store.get('mer-visited', {});
  let notes = store.get('mer-notes', {});

  const totalPages = sections.reduce((n, s) => n + s.items.length, 0);
  const sectionDone = (s) => s.items.every((_, i) => visited[`${s.id}/${i}`]);
  const sectionCount = (s) => s.items.filter((_, i) => visited[`${s.id}/${i}`]).length;
  const globalPct = () => Math.round((Object.keys(visited).filter((k) => {
    const [sid, i] = k.split('/'); return byId[sid] && byId[sid].items[+i];
  }).length / totalPages) * 100);

  /* ---------- Menú lateral ---------- */
  function buildMenu(cur) {
    let h = `<a class="m-home ${!cur ? 'on' : ''}" href="#/"><span class="m-n">⌂</span>Inicio</a>`;
    GROUPS.forEach((g) => {
      const list = sections.filter((s) => s.grupo === g);
      if (!list.length) return;
      h += `<div class="m-group">${g}</div>`;
      list.forEach((s) => {
        const done = sectionDone(s), c = sectionCount(s);
        h += `<a class="m-item ${cur === s.id ? 'on' : ''} ${done ? 'done' : ''}" href="#/${s.id}">` +
          `<span class="m-n">${done ? '✓' : s.num}</span><span class="m-t">${s.titulo}</span>` +
          `<span class="m-c">${c}/${s.items.length}</span></a>`;
      });
    });
    nav.innerHTML = h;
    const pct = globalPct();
    $('#gprog-bar').style.width = pct + '%';
    $('#gprog-txt').textContent = pct + '% completado';
  }

  /* ---------- Inicio ---------- */
  function home() {
    document.title = 'Aprende el Modelo Entidad-Relación';
    let h = `<div class="home">
      <header class="hero">
        <div class="hero-k">Curso interactivo · de cero a avanzado</div>
        <h1>Modelo Entidad-Relación</h1>
        <p>Aprende a <strong>leer un enunciado</strong>, <strong>pensar</strong> como un diseñador de bases de datos y
        <strong>dibujar</strong> diagramas MER correctos. Cada tema avanza un paso: nunca verás un concepto sin haber visto antes lo que necesitas para entenderlo.</p>
        <div class="hero-cta"><a class="btn btn-primary" href="#/${sections[0].id}">Empezar por el módulo 1 →</a>
        <a class="btn btn-ghost" href="#/simbologia/${byId.simbologia ? byId.simbologia.items.length - 1 : 0}">Ver tabla de símbolos</a></div>
        <div class="hero-prog"><div class="bar"><div style="width:${globalPct()}%"></div></div><span>${globalPct()}% del curso visto</span></div>
      </header>
      <section class="howto">
        <h2>Así está organizado cada tema</h2>
        <div class="flow">${['¿Qué es?', '¿Por qué se usa?', '¿Cómo funciona?', '¿Cómo lo reconozco?', 'Ejemplo', 'Representación gráfica', '¿Cuándo usarlo?', 'Error común', 'Ejercicio', 'Respuesta oculta']
          .map((x, i) => `<span class="flow-i"><b>${i + 1}</b>${x}</span>`).join('<span class="flow-a">→</span>')}</div>
        <p class="muted">Las respuestas siempre están ocultas. Escribe tu intento en el cuadro de texto (se guarda en tu navegador) y después compáralo con la solución.</p>
      </section>`;
    GROUPS.forEach((g) => {
      const list = sections.filter((s) => s.grupo === g);
      h += `<section class="path"><h2>${g}</h2><div class="path-grid">`;
      list.forEach((s) => {
        const c = sectionCount(s), n = s.items.length;
        h += `<a class="pcard ${c === n ? 'done' : ''}" href="#/${s.id}"><div class="pcard-n">${s.num}</div>` +
          `<div class="pcard-b"><div class="pcard-t">${s.titulo}</div><div class="pcard-d">${s.resumen}</div>` +
          `<div class="pcard-p"><div class="bar"><div style="width:${Math.round((c / n) * 100)}%"></div></div><span>${c}/${n}</span></div></div></a>`;
      });
      h += '</div></section>';
    });
    h += `<section class="legend-home"><h2>Convenciones de este curso</h2>${R.box('info', 'Notación utilizada',
      'Usamos la <strong>notación de Chen</strong> (rectángulos, rombos y óvalos), que es la más utilizada para enseñar el MER. ' +
      'La cardinalidad se escribe como <strong>1 / N / M</strong> y, cuando hace falta precisión, como <strong>(mín, máx)</strong>. ' +
      'En el módulo de Simbología verás también la notación “pata de gallo” para que la reconozcas si aparece en otro libro.')}
      <button class="btn btn-ghost btn-small" id="reset-progress">Reiniciar mi progreso</button></section></div>`;
    main.innerHTML = h;
    buildMenu(null);
    $('#crumb').innerHTML = 'Inicio';
  }

  /* ---------- Página de un módulo ---------- */
  function page(sid, idx) {
    const s = byId[sid];
    if (!s) return home();
    idx = Math.max(0, Math.min(s.items.length - 1, idx || 0));
    const item = s.items[idx];
    visited[`${sid}/${idx}`] = 1;
    store.set('mer-visited', visited);

    const pos = sections.indexOf(s);
    const prev = idx > 0 ? `#/${sid}/${idx - 1}` : pos > 0 ? `#/${sections[pos - 1].id}/${sections[pos - 1].items.length - 1}` : '#/';
    const prevT = idx > 0 ? s.items[idx - 1].titulo : pos > 0 ? sections[pos - 1].titulo : 'Inicio';
    const next = idx < s.items.length - 1 ? `#/${sid}/${idx + 1}` : pos < sections.length - 1 ? `#/${sections[pos + 1].id}` : null;
    const nextT = idx < s.items.length - 1 ? s.items[idx + 1].titulo : pos < sections.length - 1 ? 'Módulo ' + sections[pos + 1].num + ': ' + sections[pos + 1].titulo : '';

    const req = (s.requiere || []).map((r) => byId[r] ? `<a class="chip chip-link" href="#/${r}">${byId[r].num}. ${byId[r].titulo}</a>` : '').join('');

    let h = `<header class="pg-head">
      <div class="pg-kicker">Módulo ${s.num} · ${s.grupo}</div>
      <h1 class="pg-title">${s.titulo}</h1>
      ${idx === 0 && s.objetivo ? `<p class="pg-obj"><strong>Objetivo:</strong> ${s.objetivo}</p>` : ''}
      ${idx === 0 && req ? `<div class="pg-req"><span>Antes de este módulo conviene dominar:</span>${req}</div>` : ''}
      <nav class="tabs" aria-label="Temas del módulo">${s.items.map((it, i) =>
        `<a class="tab ${i === idx ? 'on' : ''} ${visited[`${sid}/${i}`] ? 'seen' : ''}" href="#/${sid}/${i}"><b>${i + 1}</b>${it.corto || it.titulo}</a>`).join('')}</nav>
    </header>
    <article class="pg">
      <h2 class="pg-h"><span class="pg-h-n">${s.num}.${idx + 1}</span>${item.titulo}</h2>
      ${R.renderItem(item, `${sid}-${idx}`)}
    </article>
    <nav class="pager">
      <a class="pg-btn" href="${prev}"><small>← Anterior</small><span>${prevT}</span></a>
      ${next ? `<a class="pg-btn pg-next" href="${next}"><small>Siguiente →</small><span>${nextT}</span></a>` : '<span></span>'}
    </nav>`;
    main.innerHTML = h;
    document.title = `${item.titulo} · ${s.titulo} · MER`;
    $('#crumb').innerHTML = `<a href="#/${sid}">${s.num}. ${s.titulo}</a> <span>›</span> ${item.titulo}`;
    main.querySelectorAll('textarea[data-save]').forEach((t) => { t.value = notes[t.dataset.save] || ''; });
    buildMenu(sid);
    const tab = main.querySelector('.tab.on');
    if (tab && tab.scrollIntoView) tab.parentNode.scrollLeft = tab.offsetLeft - 40;
  }

  function route() {
    const parts = (location.hash || '#/').replace(/^#\/?/, '').split('/').filter(Boolean);
    closeMenu();
    if (!parts.length) home(); else page(parts[0], parseInt(parts[1], 10) || 0);
    window.scrollTo(0, 0);
  }

  /* ---------- Interacciones (delegación de eventos) ---------- */
  function toggle(btn) {
    const el = document.getElementById(btn.dataset.toggle);
    if (!el) return;
    const open = el.hidden;
    el.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    btn.classList.toggle('open', open);
  }

  function stepper(id, mode) {
    const box = document.getElementById(id);
    const all = [...box.querySelectorAll(':scope > .step')];
    if (mode === 'next') { const h = all.find((x) => x.hidden); if (h) { h.hidden = false; h.classList.add('fresh'); h.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } }
    if (mode === 'all') all.forEach((x) => { x.hidden = false; });
    if (mode === 'reset') all.forEach((x, i) => { x.hidden = i > 0 || box.dataset.hideFirst === '1'; });
    const shown = all.filter((x) => !x.hidden).length;
    box.querySelector('[data-count]').textContent = `${shown} / ${all.length}`;
    box.querySelector('[data-step-next]').disabled = shown === all.length;
  }

  function checkQuestion(qid) {
    const q = document.getElementById(qid);
    const sel = q.querySelector('input:checked');
    const fb = q.querySelector('.qz-fb');
    if (!sel) { fb.hidden = false; fb.querySelector('.qz-res').textContent = 'Selecciona una opción primero.'; fb.className = 'qz-fb'; fb.querySelector('.qz-exp').hidden = true; return; }
    const ok = +sel.value === +q.dataset.correct;
    q.dataset.answered = ok ? 'ok' : 'bad';
    fb.hidden = false;
    fb.className = 'qz-fb ' + (ok ? 'fb-ok' : 'fb-bad');
    fb.querySelector('.qz-res').textContent = ok ? '✓ ¡Correcto!' : '✗ No es correcto. Revisa la explicación:';
    fb.querySelector('.qz-exp').hidden = false;
    q.querySelectorAll('.qz-op').forEach((l, j) => {
      l.classList.toggle('is-correct', j === +q.dataset.correct);
      l.classList.toggle('is-wrong', !ok && j === +sel.value);
    });
  }

  function score(id) {
    const qs = [...document.getElementById(id).querySelectorAll('.qz')];
    qs.forEach((q) => { if (q.querySelector('input:checked')) checkQuestion(q.id); });
    const ok = qs.filter((q) => q.dataset.answered === 'ok').length;
    const pend = qs.filter((q) => !q.querySelector('input:checked')).length;
    const el = document.getElementById(id).querySelector('.quiz-score');
    const pct = Math.round((ok / qs.length) * 100);
    el.hidden = false;
    el.innerHTML = `<strong>${ok} de ${qs.length}</strong> correctas (${pct}%)` + (pend ? ` · ${pend} sin responder` : '') +
      `<div class="bar"><div style="width:${pct}%"></div></div>` +
      (pct >= 85 ? 'Excelente dominio. Pasa a los ejercicios abiertos.' : pct >= 60 ? 'Vas bien. Repasa los temas de las preguntas falladas.' : 'Repasa los módulos de Conceptos antes de continuar; lee las explicaciones de cada pregunta.');
  }

  document.addEventListener('click', (ev) => {
    const t = ev.target.closest('button, a');
    if (!t) return;
    if (t.dataset.toggle) return toggle(t);
    if (t.dataset.stepNext) return stepper(t.dataset.stepNext, 'next');
    if (t.dataset.stepAll) return stepper(t.dataset.stepAll, 'all');
    if (t.dataset.stepReset) return stepper(t.dataset.stepReset, 'reset');
    if (t.dataset.quizCheck) return checkQuestion(t.dataset.quizCheck);
    if (t.dataset.quizScore) return score(t.dataset.quizScore);
    if (t.id === 'reset-progress') {
      if (confirm('¿Borrar tu progreso y tus respuestas guardadas?')) { visited = {}; notes = {}; store.set('mer-visited', {}); store.set('mer-notes', {}); home(); }
    }
    if (t.id === 'menu-btn') { document.body.classList.toggle('menu-open'); }
    if (t.id === 'theme-btn') { setTheme(isDark() ? 'light' : 'dark'); }
  });
  $('#scrim').addEventListener('click', closeMenu);

  let saveTimer;
  document.addEventListener('input', (ev) => {
    const t = ev.target;
    if (!t.dataset || !t.dataset.save) return;
    notes[t.dataset.save] = t.value;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => store.set('mer-notes', notes), 300);
  });

  document.addEventListener('keydown', (ev) => {
    if (/INPUT|TEXTAREA/.test(document.activeElement.tagName) || ev.altKey || ev.ctrlKey || ev.metaKey) return;
    if (ev.key === 'ArrowRight') { const n = $('.pg-next'); if (n) location.hash = n.getAttribute('href'); }
    if (ev.key === 'ArrowLeft') { const p = $('.pager .pg-btn'); if (p) location.hash = p.getAttribute('href'); }
  });

  function closeMenu() { document.body.classList.remove('menu-open'); }

  function isDark() {
    const t = document.documentElement.dataset.theme;
    return t ? t === 'dark' : window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function setTheme(t) {
    document.documentElement.dataset.theme = t;
    store.set('mer-theme', t);
  }
  const saved = store.get('mer-theme', null);
  if (saved) document.documentElement.dataset.theme = saved;

  window.addEventListener('hashchange', route);
  route();
})();
