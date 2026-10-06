/* ==========================================================================
   Motor de diagramas MER (notación de Chen) — genera SVG como texto.
   Uso:  D.diagram({ w, h, nodes: [...], edges: [...] })

   Nodos (t = tipo):
     E   entidad           { id, t:'E', l, x, y, weak, attrs, side }
     R   relación          { id, t:'R', l, x, y, ident, attrs, side }
     A   atributo          { id, t:'A', l, x, y }   prefijos en l:
            *id      clave primaria (subrayado)
            ~num     clave parcial (subrayado punteado)
            /edad    derivado (óvalo punteado)
            {tel}    multivaluado (óvalo doble)
     ISA círculo de especialización { id, t:'ISA', l:'d'|'o', x, y }
     T   texto libre       { id, t:'T', l, x, y, cls }
   Aristas:
     { a, b, ca, cb, m, total, dash, curve, subset, side, cls }
       ca/cb = etiqueta junto al extremo a/b, m = etiqueta en el centro
       total = línea doble (participación total)
       subset = símbolo ⊂ (subclase) en el centro
   ========================================================================== */
(function () {
  'use strict';

  const esc = (s) => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  /* Ancho aproximado de un texto a 13px */
  function tw(s) {
    let w = 0;
    for (const ch of String(s)) {
      if (/[A-ZÁÉÍÓÚÑ_]/.test(ch)) w += 8.6;
      else if (/[il.,:;'|!()1]/.test(ch)) w += 3.8;
      else if (ch === ' ') w += 3.6;
      else w += 7.1;
    }
    return w;
  }

  function parseAttr(raw) {
    const o = { t: 'A' };
    let l = String(raw);
    if (l[0] === '*') { o.key = true; l = l.slice(1); }
    else if (l[0] === '~') { o.partial = true; l = l.slice(1); }
    else if (l[0] === '/') { o.derived = true; l = l.slice(1); }
    if (l[0] === '{' && l[l.length - 1] === '}') { o.multi = true; l = l.slice(1, -1); }
    o.l = l;
    return o;
  }

  function size(n) {
    const w = tw(n.l || '');
    switch (n.t) {
      case 'E': return { w: Math.max(96, w + 32), h: 42 };
      case 'R': return { w: Math.max(104, w * 1.45 + 26), h: 56 };
      case 'A': return { w: Math.max(58, w + 28), h: 30 };
      case 'ISA': return { w: 34, h: 34 };
      default: return { w: w, h: 16 };
    }
  }

  /* Distancia del centro al borde de la figura en la dirección (ux, uy) */
  function bdist(n, ux, uy) {
    const hw = n.w / 2, hh = n.h / 2, ax = Math.abs(ux), ay = Math.abs(uy);
    if (n.t === 'E' || n.t === 'T') return Math.min(ax ? hw / ax : 1e9, ay ? hh / ay : 1e9);
    if (n.t === 'R') return 1 / (ax / hw + ay / hh);
    if (n.t === 'ISA') return hw;
    return 1 / Math.sqrt((ux * ux) / (hw * hw) + (uy * uy) / (hh * hh));
  }

  const SIDE_ANGLE = { right: 0, bottom: 90, left: 180, top: 270 };

  /* Coloca atributos en abanico alrededor de su dueño, sin solaparse */
  function placeAttrs(owner, list, side, out, depth) {
    const items = list.map((raw) => {
      const a = typeof raw === 'object' ? Object.assign(parseAttr(raw.l), { sub: raw.sub, hl: raw.hl }) : parseAttr(raw);
      const s = size(a); a.w = s.w; a.h = s.h;
      /* ancho efectivo: un compuesto reserva espacio para sus componentes */
      a.cw = a.sub ? Math.max(a.w, a.sub.reduce((t, x) => t + size({ t: 'A', l: String(x) }).w + 8, 0) * 0.8) : a.w;
      return a;
    });
    const n = items.length;
    if (!n) return;
    const center = typeof side === 'number' ? side : SIDE_ANGLE[side || 'top'];
    const range = Math.min(depth ? 90 : 150, (depth ? 42 : 34) * (n - 1));
    let angles = items.map((_, i) => (n === 1 ? center : center - range / 2 + (range * i) / (n - 1)));
    /* orden de lectura natural: de izquierda a derecha y de arriba abajo */
    const norm = ((center % 360) + 360) % 360;
    if (norm > 45 && norm <= 225) angles = angles.reverse();
    let rx = owner.w / 2 + (depth ? 45 : 58), ry = owner.h / 2 + (depth ? 28 : 36);
    for (let iter = 0; iter < 40; iter++) {
      items.forEach((a, i) => {
        const r = (angles[i] * Math.PI) / 180;
        a.x = owner.x + Math.cos(r) * rx;
        a.y = owner.y + Math.sin(r) * ry;
      });
      let ok = true;
      for (let i = 0; i < n - 1 && ok; i++) {
        const p = items[i], q = items[i + 1];
        const hasSub = p.sub || q.sub;
        if (Math.abs(p.x - q.x) < (p.cw + q.cw) / 2 + 6 && Math.abs(p.y - q.y) < (p.h + q.h) / 2 + (hasSub ? 14 : 4)) ok = false;
      }
      if (ok) break;
      rx += 12; ry += 9;
    }
    items.forEach((a, i) => {
      out.nodes.push(a);
      out.edges.push({ A: owner, B: a });
      if (a.sub) placeAttrs(a, a.sub, angles[i], out, (depth || 0) + 1);
    });
  }

  function quad(A, C, B, t) {
    const k = 1 - t;
    return { x: k * k * A.x + 2 * k * t * C.x + t * t * B.x, y: k * k * A.y + 2 * k * t * C.y + t * t * B.y };
  }

  function label(x, y, txt, cls, anchor) {
    return `<text class="dg-lbl ${cls || ''}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" dy=".35em" text-anchor="${anchor || 'middle'}">${esc(txt)}</text>`;
  }

  /* Arista con ruta ortogonal: e.via = [[x,y], ...] */
  function polyEdgeSVG(e) {
    const ao = e.ao || [0, 0], bo = e.bo || [0, 0];
    const pts = [{ x: e.A.x + ao[0], y: e.A.y + ao[1] }].concat(e.via.map(([x, y]) => ({ x, y })), [{ x: e.B.x + bo[0], y: e.B.y + bo[1] }]);
    const d = 'M' + pts.map((p) => `${p.x},${p.y}`).join(' L');
    const extra = e.cls ? ' ' + e.cls : '';
    let s = e.total
      ? `<path class="dg-line dg-total-o${extra}" d="${d}"/><path class="dg-total-i" d="${d}"/>`
      : `<path class="dg-line${e.dash ? ' dg-dash' : ''}${extra}" d="${d}"/>`;
    const sd = e.side || 1;
    const seg = (P, Q) => { const l = Math.hypot(Q.x - P.x, Q.y - P.y) || 1; return { ux: (Q.x - P.x) / l, uy: (Q.y - P.y) / l, l }; };
    const near = (N, P, Q, txt) => {
      const g = seg(P, Q);
      const off = N === e.A ? ao : bo;
      const inside = Math.max(0, bdist(N, g.ux, g.uy) - Math.abs(off[0] * g.ux + off[1] * g.uy));
      const t = Math.min(g.l * 0.6, (e.via.length && (off[0] || off[1]) ? 0 : inside) + 15);
      s += label(P.x + g.ux * t - g.uy * 12 * sd, P.y + g.uy * t + g.ux * 12 * sd, txt, 'dg-card');
    };
    if (e.ca) near(e.A, pts[0], pts[1], e.ca);
    if (e.cb) near(e.B, pts[pts.length - 1], pts[pts.length - 2], e.cb);
    if (e.m) {
      let i = 0;
      for (let j = 1; j < pts.length - 1; j++) if (seg(pts[j], pts[j + 1]).l > seg(pts[i], pts[i + 1]).l) i = j;
      const P = pts[i], Q = pts[i + 1], g = seg(P, Q);
      const lx = (P.x + Q.x) / 2 - g.uy * 12 * sd, ly = (P.y + Q.y) / 2 + g.ux * 12 * sd;
      const anchor = Math.abs(g.ux) < 0.3 ? (lx > (P.x + Q.x) / 2 ? 'start' : 'end') : 'middle';
      s += label(lx, ly, e.m, 'dg-role', anchor);
    }
    return s;
  }

  function edgeSVG(e) {
    if (e.via) return polyEdgeSVG(e);
    const A = e.A, B = e.B;
    const dx = B.x - A.x, dy = B.y - A.y;
    const len = Math.hypot(dx, dy) || 1;
    const px = -dy / len, py = dx / len;
    const c = e.curve || 0;
    const C = { x: (A.x + B.x) / 2 + px * c, y: (A.y + B.y) / 2 + py * c };
    const d = c
      ? `M${A.x},${A.y} Q${C.x.toFixed(1)},${C.y.toFixed(1)} ${B.x},${B.y}`
      : `M${A.x},${A.y} L${B.x},${B.y}`;
    const extra = e.cls ? ' ' + e.cls : '';
    let s = '';
    if (e.total) {
      s += `<path class="dg-line dg-total-o${extra}" d="${d}"/><path class="dg-total-i" d="${d}"/>`;
    } else {
      s += `<path class="dg-line${e.dash ? ' dg-dash' : ''}${extra}" d="${d}"/>`;
    }
    const sd = e.side || 1;
    const near = (N, from, to, txt) => {
      const vx = to.x - from.x, vy = to.y - from.y, vl = Math.hypot(vx, vy) || 1;
      const t = Math.min(0.45, (bdist(N, vx / vl, vy / vl) + 17) / len);
      const P = N === A ? quad(A, C, B, t) : quad(A, C, B, 1 - t);
      s += label(P.x + px * 13 * sd, P.y + py * 13 * sd, txt, 'dg-card');
    };
    if (e.ca) near(A, A, C, e.ca);
    if (e.cb) near(B, B, C, e.cb);
    if (e.m) {
      const P = quad(A, C, B, 0.5);
      s += label(P.x + px * 13 * sd, P.y + py * 13 * sd, e.m, 'dg-role');
    }
    if (e.subset) {
      const P = quad(A, C, B, 0.55);
      const ux = dx / len, uy = dy / len, qx = -uy, qy = ux;
      const p1 = { x: P.x - ux * 5 + qx * 8, y: P.y - uy * 5 + qy * 8 };
      const p2 = { x: P.x - ux * 5 - qx * 8, y: P.y - uy * 5 - qy * 8 };
      const cc = { x: P.x + ux * 11, y: P.y + uy * 11 };
      s += `<path class="dg-subset" d="M${p1.x.toFixed(1)},${p1.y.toFixed(1)} Q${cc.x.toFixed(1)},${cc.y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}"/>`;
    }
    return s;
  }

  function nodeSVG(n) {
    const { x, y, w, h } = n;
    const hw = w / 2, hh = h / 2;
    let s = '';
    const cls = ['dg-node', 'dg-' + n.t];
    if (n.hl) cls.push('dg-hl');
    if (n.bad) cls.push('dg-bad');
    if (n.good) cls.push('dg-good');
    if (n.t === 'E') {
      s += `<rect class="dg-shape" x="${x - hw}" y="${y - hh}" width="${w}" height="${h}" rx="2"/>`;
      if (n.weak) s += `<rect class="dg-shape dg-inner" x="${x - hw + 5}" y="${y - hh + 5}" width="${w - 10}" height="${h - 10}" rx="1"/>`;
    } else if (n.t === 'R') {
      s += `<polygon class="dg-shape" points="${x},${y - hh} ${x + hw},${y} ${x},${y + hh} ${x - hw},${y}"/>`;
      if (n.ident) {
        const iw = hw - 11, ih = hh - 6;
        s += `<polygon class="dg-shape dg-inner" points="${x},${y - ih} ${x + iw},${y} ${x},${y + ih} ${x - iw},${y}"/>`;
      }
    } else if (n.t === 'A') {
      s += `<ellipse class="dg-shape${n.derived ? ' dg-dash' : ''}" cx="${x}" cy="${y}" rx="${hw}" ry="${hh}"/>`;
      if (n.multi) s += `<ellipse class="dg-shape dg-inner" cx="${x}" cy="${y}" rx="${hw - 4}" ry="${hh - 4}"/>`;
    } else if (n.t === 'ISA') {
      s += `<circle class="dg-shape" cx="${x}" cy="${y}" r="${hw}"/>`;
    }
    if (n.t === 'T') {
      s += `<text class="dg-note ${n.cls || ''}" x="${x}" y="${y}" dy=".35em" text-anchor="middle">${esc(n.l)}</text>`;
    } else {
      s += `<text class="dg-txt" x="${x}" y="${y}" dy=".35em" text-anchor="middle">${esc(n.l)}</text>`;
    }
    if (n.key || n.partial) {
      const u = tw(n.l) / 2;
      s += `<line class="dg-ul${n.partial ? ' dg-ul-p' : ''}" x1="${(x - u).toFixed(1)}" y1="${y + 9}" x2="${(x + u).toFixed(1)}" y2="${y + 9}"/>`;
    }
    return `<g class="${cls.join(' ')}">${s}</g>`;
  }

  function diagram(spec) {
    const byId = {};
    const out = { nodes: [], edges: [] };
    (spec.nodes || []).forEach((n0) => {
      const n = Object.assign({}, n0);
      if (n.t === 'A') Object.assign(n, parseAttr(n0.l));
      const s = size(n);
      n.w = n0.w || s.w; n.h = n0.h || s.h;
      byId[n.id] = n;
      out.nodes.push(n);
    });
    out.nodes.slice().forEach((n) => { if (n.attrs) placeAttrs(n, n.attrs, n.side, out, 0); });
    (spec.edges || []).forEach((e) => {
      const A = byId[e.a], B = byId[e.b];
      if (!A || !B) { console.warn('Arista inválida', e); return; }
      out.edges.push(Object.assign({}, e, { A, B }));
    });
    /* El lienzo se amplía si algún elemento queda fuera del tamaño indicado */
    let x0 = 0, y0 = 0, x1 = spec.w || 600, y1 = spec.h || 300;
    out.nodes.forEach((n) => {
      if (n.t === 'T' && !n.l) return;
      x0 = Math.min(x0, n.x - n.w / 2 - 8); x1 = Math.max(x1, n.x + n.w / 2 + 8);
      y0 = Math.min(y0, n.y - n.h / 2 - 8); y1 = Math.max(y1, n.y + n.h / 2 + 8);
    });
    const W = Math.round(x1 - x0), H = Math.round(y1 - y0);
    const title = spec.title ? `<title>${esc(spec.title)}</title>` : '';
    return `<svg class="dg" viewBox="${Math.round(x0)} ${Math.round(y0)} ${W} ${H}" style="max-width:${W}px" role="img" xmlns="http://www.w3.org/2000/svg">${title}` +
      `<g>${out.edges.map(edgeSVG).join('')}</g><g>${out.nodes.map(nodeSVG).join('')}</g></svg>`;
  }

  /* Símbolo aislado para tablas y tarjetas */
  function sym(kind, l) {
    const W = 170, H = 70, c = { x: 85, y: 35 };
    const map = {
      entity: { t: 'E', l: l || 'ENTIDAD' },
      weak: { t: 'E', l: l || 'DÉBIL', weak: true },
      rel: { t: 'R', l: l || 'relación' },
      ident: { t: 'R', l: l || 'identifica', ident: true },
      attr: { t: 'A', l: l || 'atributo' },
      key: { t: 'A', l: '*' + (l || 'id') },
      partial: { t: 'A', l: '~' + (l || 'número') },
      multi: { t: 'A', l: '{' + (l || 'teléfono') + '}' },
      derived: { t: 'A', l: '/' + (l || 'edad') },
      isa: { t: 'ISA', l: l || 'd' },
    };
    if (map[kind]) return diagram({ w: W, h: H, nodes: [Object.assign({ id: 'n' }, c, map[kind])] });
    if (kind === 'line') return diagram({ w: W, h: H, nodes: [{ id: 'p', t: 'T', l: '', x: 20, y: 35 }, { id: 'q', t: 'T', l: '', x: 150, y: 35 }], edges: [{ a: 'p', b: 'q' }] });
    if (kind === 'total') return diagram({ w: W, h: H, nodes: [{ id: 'p', t: 'T', l: '', x: 20, y: 35 }, { id: 'q', t: 'T', l: '', x: 150, y: 35 }], edges: [{ a: 'p', b: 'q', total: true }] });
    if (kind === 'card') return diagram({ w: W, h: H, nodes: [{ id: 'p', t: 'T', l: '', x: 15, y: 42 }, { id: 'q', t: 'T', l: '', x: 155, y: 42 }], edges: [{ a: 'p', b: 'q', m: l || '1        N' }] });
    if (kind === 'minmax') return diagram({ w: W, h: H, nodes: [{ id: 'p', t: 'T', l: '', x: 15, y: 42 }, { id: 'q', t: 'T', l: '', x: 155, y: 42 }], edges: [{ a: 'p', b: 'q', m: l || '(0,N)' }] });
    if (kind === 'subset') return diagram({ w: W, h: H, nodes: [{ id: 'p', t: 'T', l: '', x: 20, y: 35 }, { id: 'q', t: 'T', l: '', x: 150, y: 35 }], edges: [{ a: 'p', b: 'q', subset: true }] });
    if (kind === 'composite') {
      return diagram({ w: 230, h: 110, nodes: [
        { id: 'a', t: 'A', l: 'nombre', x: 115, y: 30 },
        { id: 'b', t: 'A', l: 'nombres', x: 55, y: 85 },
        { id: 'c', t: 'A', l: 'apellidos', x: 175, y: 85 },
      ], edges: [{ a: 'a', b: 'b' }, { a: 'a', b: 'c' }] });
    }
    return '';
  }

  /* ---------- Notación pata de gallo (Crow's Foot / Martin) ---------- */
  function crowEnd(xb, y, dir, kind) {
    // xb = borde de la entidad, dir = +1 si la línea sale hacia la derecha
    const X = (d) => xb + dir * d;
    let s = '';
    const bar = (d) => { s += `<line class="dg-cf" x1="${X(d)}" y1="${y - 9}" x2="${X(d)}" y2="${y + 9}"/>`; };
    const circ = (d) => { s += `<circle class="dg-cf dg-cf-o" cx="${X(d)}" cy="${y}" r="6"/>`; };
    const foot = () => {
      s += `<line class="dg-cf" x1="${X(14)}" y1="${y}" x2="${X(0)}" y2="${y - 10}"/>`;
      s += `<line class="dg-cf" x1="${X(14)}" y1="${y}" x2="${X(0)}" y2="${y + 10}"/>`;
    };
    if (kind === '11') { bar(8); bar(14); }
    if (kind === '01') { bar(8); circ(22); }
    if (kind === '1N') { foot(); bar(20); }
    if (kind === '0N') { foot(); circ(26); }
    return s;
  }

  function crow(left, right, lk, rk, verb) {
    const W = 460, H = 76, y = 38;
    const lw = Math.max(90, tw(left) + 30), rw = Math.max(90, tw(right) + 30);
    const lx2 = 10 + lw, rx1 = W - 10 - rw;
    let s = `<svg class="dg" viewBox="0 0 ${W} ${H}" style="max-width:${W}px" role="img" xmlns="http://www.w3.org/2000/svg">`;
    s += `<line class="dg-line" x1="${lx2}" y1="${y}" x2="${rx1}" y2="${y}"/>`;
    s += crowEnd(lx2, y, 1, lk) + crowEnd(rx1, y, -1, rk);
    s += `<g class="dg-node dg-E"><rect class="dg-shape" x="10" y="${y - 21}" width="${lw}" height="42"/><text class="dg-txt" x="${10 + lw / 2}" y="${y}" dy=".35em" text-anchor="middle">${esc(left)}</text></g>`;
    s += `<g class="dg-node dg-E"><rect class="dg-shape" x="${rx1}" y="${y - 21}" width="${rw}" height="42"/><text class="dg-txt" x="${rx1 + rw / 2}" y="${y}" dy=".35em" text-anchor="middle">${esc(right)}</text></g>`;
    if (verb) s += `<text class="dg-lbl dg-role" x="${(lx2 + rx1) / 2}" y="${y - 16}" text-anchor="middle">${esc(verb)}</text>`;
    return s + '</svg>';
  }

  function crowSym(kind) {
    const W = 170, H = 50, y = 25;
    let s = `<svg class="dg" viewBox="0 0 ${W} ${H}" style="max-width:${W}px" xmlns="http://www.w3.org/2000/svg">`;
    s += `<line class="dg-line" x1="10" y1="${y}" x2="120" y2="${y}"/>` + crowEnd(120, y, -1, kind);
    s += `<rect class="dg-shape dg-cf-box" x="120" y="${y - 16}" width="44" height="32"/>`;
    return s + '</svg>';
  }

  window.D = { diagram, sym, crow, crowSym, tw };
})();
