/* ==========================================================================
   Plantillas de contenido. Todas las páginas se construyen con estas
   funciones para que cada tema respete SIEMPRE la misma estructura:
   ¿Qué es? → ¿Por qué? → ¿Cómo funciona? → ¿Cómo lo reconozco? → Ejemplo →
   Representación gráfica → ¿Cuándo usarlo? → Error común → Ejercicio →
   Respuesta oculta → Explicación.
   ========================================================================== */
(function () {
  'use strict';

  let seq = 0;          // ids de elementos generados al cargar contenido
  let pageKey = 'p';    // prefijo de ids generados al renderizar una página
  let pageSeq = 0;
  const gid = () => 'g' + (++seq);
  const uid = () => `${pageKey}-${++pageSeq}`;

  /* ---------- Piezas pequeñas ---------- */
  const list = (items, cls) => `<ul class="lst ${cls || ''}">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
  const olist = (items, cls) => `<ol class="olst ${cls || ''}">${items.map((i) => `<li>${i}</li>`).join('')}</ol>`;
  const table = (head, rows, cls) =>
    `<div class="tbl-wrap"><table class="tbl ${cls || ''}"><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead>` +
    `<tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const box = (kind, title, html) =>
    `<div class="callout callout-${kind}">${title ? `<div class="callout-t">${title}</div>` : ''}<div class="callout-b">${html}</div></div>`;
  const fig = (svg, cap) =>
    `<figure class="fig"><div class="fig-scroll">${svg}</div>${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`;
  const cols = (...parts) => `<div class="cols cols-${parts.length}">${parts.map((p) => `<div class="col">${p}</div>`).join('')}</div>`;
  const kbd = (s) => `<span class="tag">${s}</span>`;
  const ent = (s) => `<span class="tk tk-e">${s}</span>`;
  const rel = (s) => `<span class="tk tk-r">${s}</span>`;
  const att = (s) => `<span class="tk tk-a">${s}</span>`;
  const card = (s) => `<span class="tk tk-c">${s}</span>`;

  /* Comparación incorrecto / correcto */
  const cmp = (mal, bien, malT, bienT) =>
    `<div class="cmp"><div class="cmp-bad"><div class="cmp-h">✗ ${malT || 'Incorrecto'}</div>${mal}</div>` +
    `<div class="cmp-good"><div class="cmp-h">✓ ${bienT || 'Correcto'}</div>${bien}</div></div>`;

  /* Bloque desplegable (respuesta oculta) generado al cargar */
  const reveal = (html, label) => {
    const id = gid();
    return `<div class="reveal"><button class="btn btn-reveal" data-toggle="${id}" aria-expanded="false" aria-controls="${id}">` +
      `<span class="lbl-show">${label || 'Mostrar respuesta'}</span><span class="lbl-hide">Ocultar</span></button>` +
      `<div class="reveal-body" id="${id}" hidden>${html}</div></div>`;
  };

  /* Pasos que se descubren uno a uno */
  const steps = (items, opts) => {
    const id = gid();
    const o = opts || {};
    return `<div class="stepper" id="${id}" data-hide-first="${o.hideFirst ? 1 : 0}">` +
      items.map((s, i) => `<div class="step" data-i="${i}" ${i === 0 && !o.hideFirst ? '' : 'hidden'}>` +
        `<div class="step-n">${o.prefix || 'Paso'} ${i + 1}</div><div class="step-body"><div class="step-t">${s.t}</div>${s.html}</div></div>`).join('') +
      `<div class="stepper-ctl"><button class="btn btn-primary" data-step-next="${id}">${o.next || 'Siguiente paso →'}</button>` +
      `<button class="btn btn-ghost" data-step-all="${id}">Ver todos</button>` +
      `<button class="btn btn-ghost" data-step-reset="${id}">Reiniciar</button>` +
      `<span class="stepper-count" data-count="${id}">${o.hideFirst ? 0 : 1} / ${items.length}</span></div></div>`;
  };

  /* Área de trabajo del estudiante (se guarda en el navegador) */
  const work = (ph) => {
    const id = uid();
    return `<label class="work"><span class="work-l">✎ Tu respuesta (se guarda automáticamente en este navegador)</span>` +
      `<textarea data-save="${id}" rows="4" placeholder="${ph || 'Escribe aquí tu análisis antes de ver la solución...'}"></textarea></label>`;
  };

  /* Botón de respuesta generado en tiempo de render */
  const answer = (html, label) => {
    const id = uid();
    return `<div class="reveal reveal-answer"><div class="reveal-hint">🔒 La respuesta está oculta. Inténtalo primero.</div>` +
      `<button class="btn btn-reveal" data-toggle="${id}" aria-expanded="false" aria-controls="${id}">` +
      `<span class="lbl-show">${label || 'Mostrar respuesta'}</span><span class="lbl-hide">Ocultar respuesta</span></button>` +
      `<div class="reveal-body" id="${id}" hidden>${html}</div></div>`;
  };

  /* ---------- Bloques estándar de un tema ---------- */
  const BLOCKS = [
    ['que', '¿Qué es?', 'q', '?'],
    ['porque', '¿Por qué se utiliza?', 'why', '★'],
    ['como', '¿Cómo funciona?', 'how', '⚙'],
    ['identificar', '¿Cómo lo reconozco en un ejercicio?', 'find', '⌕'],
    ['ejemplo', 'Ejemplo', 'ex', '◆'],
    ['grafico', 'Representación gráfica', 'draw', '◇'],
    ['cuando', '¿Cuándo debo utilizarlo?', 'when', '✓'],
    ['error', 'Error común', 'err', '!'],
  ];

  const block = (key, title, icon, body) =>
    `<section class="blk blk-${key}"><h3 class="blk-h"><span class="blk-i">${icon}</span>${title}</h3><div class="blk-b">${body}</div></section>`;

  function renderEjemplo(e) {
    if (typeof e === 'string') return e;
    let s = '<div class="ex-grid">';
    if (e.cotidiano) s += `<div class="ex-card ex-life"><div class="ex-h">🏠 Ejemplo cotidiano</div>${e.cotidiano}</div>`;
    if (e.bd) s += `<div class="ex-card ex-db"><div class="ex-h">🗄 Ejemplo en una base de datos</div>${e.bd}</div>`;
    return s + '</div>' + (e.extra || '');
  }

  function renderCuando(c) {
    if (typeof c === 'string') return c;
    return cols(
      `<div class="use use-yes"><div class="use-h">Úsalo cuando…</div>${Array.isArray(c.si) ? list(c.si) : c.si}</div>`,
      `<div class="use use-no"><div class="use-h">NO lo uses cuando…</div>${Array.isArray(c.no) ? list(c.no) : c.no}</div>`
    );
  }

  function renderError(e) {
    if (typeof e === 'string') return e;
    let s = '';
    if (e.mal || e.bien) s += cmp(e.mal || '', e.bien || '', e.malT, e.bienT);
    if (e.porque) s += box('tip', 'Cómo evitarlo', e.porque);
    return s;
  }

  function renderEjercicio(ej, n) {
    const arr = Array.isArray(ej) ? ej : [ej];
    return arr.map((x, i) =>
      `<section class="blk blk-exr"><h3 class="blk-h"><span class="blk-i">✎</span>Ejercicio${arr.length > 1 ? ' ' + (i + 1) : ''}</h3>` +
      `<div class="blk-b"><div class="exr-q">${x.enunciado}</div>${x.noWork ? '' : work(x.ph)}` +
      answer(`<div class="ans"><h4 class="ans-h">✔ Respuesta</h4>${x.respuesta}` +
        (x.explicacion ? `<h4 class="ans-h ans-h2">💡 Explicación de la respuesta</h4>${x.explicacion}` : '') + '</div>') +
      '</div></section>').join('');
  }

  function topic(t) {
    let s = t.intro ? `<p class="lead">${t.intro}</p>` : '';
    BLOCKS.forEach(([k, title, cls, icon]) => {
      if (!t[k]) return;
      let body = t[k];
      if (k === 'ejemplo') body = renderEjemplo(body);
      if (k === 'cuando') body = renderCuando(body);
      if (k === 'error') body = renderError(body);
      s += block(cls, title, icon, body);
    });
    if (t.extra) s += t.extra;
    if (t.resumen) s += box('sum', '📌 Para recordar', Array.isArray(t.resumen) ? list(t.resumen) : t.resumen);
    if (t.ejercicio) s += renderEjercicio(t.ejercicio);
    return s;
  }

  /* ---------- Ficha de símbolo (7 puntos) ---------- */
  function symbol(t) {
    const pts = [
      ['Nombre', t.nombre],
      ['¿Qué significa?', t.significa],
      ['¿Para qué sirve?', t.sirve],
      ['¿Cómo reconocerlo?', t.reconocer],
      ['Ejemplo', t.ejemplo],
      ['¿Cuándo utilizarlo?', t.usar],
      ['¿Cuándo NO utilizarlo?', t.noUsar],
    ];
    let s = `<div class="sym-hero"><div class="sym-fig">${t.figura}</div><div class="sym-name"><div class="sym-kicker">Símbolo</div><div class="sym-title">${t.nombre}</div><div class="sym-short">${t.desc || ''}</div></div></div>`;
    s += '<ol class="sym-pts">' + pts.map(([h, b], i) =>
      `<li class="sym-pt sym-pt-${i + 1}"><div class="sym-pt-h"><span class="sym-pt-n">${i + 1}</span>${h}</div><div class="sym-pt-b">${b}</div></li>`).join('') + '</ol>';
    if (t.error) s += block('err', 'Error común', '!', renderError(t.error));
    if (t.ejercicio) s += renderEjercicio(t.ejercicio);
    return s;
  }

  /* ---------- Ejercicio completo (secciones de práctica) ---------- */
  function exercise(e) {
    let s = `<div class="exc">`;
    s += `<div class="exc-meta">${e.nivel ? `<span class="lvl lvl-${e.nivel}">Nivel ${e.nivel}</span>` : ''}${(e.temas || []).map((x) => `<span class="chip">${x}</span>`).join('')}</div>`;
    s += block('q', 'Enunciado', '📄', `<div class="stmt">${e.enunciado}</div>`);
    if (e.pide) s += box('info', 'Se pide', Array.isArray(e.pide) ? olist(e.pide) : e.pide);
    if (e.pista) s += `<div class="hint-wrap">${answer(e.pista, '💡 Ver una pista')}</div>`;
    s += block('exr', 'Espacio para analizar y responder', '✎', work('Lista aquí: entidades, atributos (con clave), relaciones, cardinalidad y participación...'));
    let sol = '<div class="ans">';
    if (e.diagrama) sol += `<h4 class="ans-h">✔ Solución (diagrama)</h4>${fig(e.diagrama, e.leyenda)}`;
    if (e.solucionTexto) sol += e.solucionTexto;
    if (e.pasos) sol += `<h4 class="ans-h ans-h2">🧭 Explicación paso a paso</h4>${olist(e.pasos)}`;
    if (e.entidades) sol += `<h4 class="ans-h ans-h2">▭ Justificación de cada entidad</h4>${table(['Entidad', '¿Por qué es entidad?'], e.entidades)}`;
    if (e.atributos) sol += `<h4 class="ans-h ans-h2">⬭ Justificación de cada atributo</h4>${table(['Pertenece a', 'Atributos', 'Justificación'], e.atributos)}`;
    if (e.relaciones) sol += `<h4 class="ans-h ans-h2">◇ Justificación de cada relación</h4>${table(['Relación', 'Entre', 'Justificación'], e.relaciones)}`;
    if (e.cardinalidades) sol += `<h4 class="ans-h ans-h2">1:N Justificación de la cardinalidad y participación</h4>${table(['Relación', 'Cardinalidad', 'Razonamiento'], e.cardinalidades)}`;
    if (e.notas) sol += box('tip', 'Observaciones', e.notas);
    sol += '</div>';
    s += answer(sol, 'Mostrar respuesta');
    return s + '</div>';
  }

  /* ---------- Caso práctico por etapas ---------- */
  function caso(c) {
    let s = `<div class="caso">`;
    if (c.contexto) s += `<p class="lead">${c.contexto}</p>`;
    s += block('q', 'Enunciado del problema', '📄', `<div class="stmt">${c.enunciado}</div>`);
    s += box('info', 'Cómo trabajar este caso', 'Resuelve cada etapa en orden. Escribe tu propuesta y solo después abre la solución de esa etapa. Compara, corrige y pasa a la siguiente.');
    c.etapas.forEach((et, i) => {
      s += `<section class="blk blk-stage"><h3 class="blk-h"><span class="blk-i">${i + 1}</span>${et.t}</h3><div class="blk-b">` +
        `<div class="exr-q">${et.pregunta}</div>${work()}${answer(`<div class="ans">${et.resp}</div>`, 'Mostrar solución de esta etapa')}</div></section>`;
    });
    s += `<section class="blk blk-final"><h3 class="blk-h"><span class="blk-i">★</span>Diagrama final</h3><div class="blk-b">` +
      `<p>Dibuja tu diagrama completo en papel antes de abrir la solución.</p>` +
      answer(`<div class="ans">${fig(c.diagrama, c.leyenda)}${c.validacion ? box('sum', 'Validación del modelo', list(c.validacion)) : ''}</div>`, 'Mostrar diagrama final') +
      '</div></section>';
    return s + '</div>';
  }

  /* ---------- Cuestionario ---------- */
  function quiz(q) {
    const id = uid();
    let s = `<div class="quiz" id="${id}">`;
    q.preguntas.forEach((p, i) => {
      const qid = `${id}-q${i}`;
      s += `<div class="qz" data-correct="${p.ok}" id="${qid}"><div class="qz-h"><span class="qz-n">${i + 1}</span><div>${p.q}</div></div>` +
        (p.fig ? fig(p.fig) : '') +
        `<div class="qz-opts">${p.op.map((o, j) => `<label class="qz-op"><input type="radio" name="${qid}" value="${j}"><span>${o}</span></label>`).join('')}</div>` +
        `<button class="btn btn-small" data-quiz-check="${qid}">Comprobar</button>` +
        `<div class="qz-fb" hidden><div class="qz-res"></div><div class="qz-exp">${p.exp}</div></div></div>`;
    });
    s += `<div class="quiz-sum"><button class="btn btn-primary" data-quiz-score="${id}">Calcular mi puntuación</button><div class="quiz-score" hidden></div></div>`;
    return s + '</div>';
  }

  function renderItem(item, key) {
    pageKey = key;
    pageSeq = 0;
    return render(item);
  }

  function render(item) {
    switch (item.tipo) {
      case 'simbolo': return symbol(item);
      case 'ejercicio': return exercise(item);
      case 'caso': return caso(item);
      case 'quiz': return (item.intro ? `<p class="lead">${item.intro}</p>` : '') + quiz(item);
      case 'html': return typeof item.html === 'function' ? item.html() : item.html;
      case 'multi': return (item.intro ? `<p class="lead">${item.intro}</p>` : '') +
        item.partes.map((p) => (p.h ? `<h2 class="part-h">${p.h}</h2>` : '') + render(p)).join('<hr class="sep">');
      default: return topic(item);
    }
  }

  /* Registro de módulos: cada archivo de /js/contenido llama a MER.add({...}) */
  window.MER = { sections: [], add(s) { this.sections.push(s); } };

  window.R = { list, olist, table, box, fig, cols, cmp, reveal, steps, kbd, ent, rel, att, card, renderItem, work, answer, topic, exercise };
})();
