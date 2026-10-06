/* Módulo 12 — Construcción de diagramas (un ejemplo que crece paso a paso) */
(function () {
  const { list, olist, table, box, fig, ent, rel, att } = R;

  const ENUN = `Una clínica veterinaria registra a sus <strong>clientes</strong> (cédula, nombre, dirección y uno o varios teléfonos).
    Cada cliente puede tener varias <strong>mascotas</strong>; cada mascota pertenece a un único cliente. De cada mascota se guarda un código, nombre, especie y fecha de nacimiento, y se desea conocer su edad.
    La clínica tiene <strong>empleados</strong> (código, nombre, salario). Todo empleado es <strong>veterinario</strong> (número de tarjeta profesional y especialidad) o <strong>recepcionista</strong> (turno), nunca ambas cosas.
    Las mascotas reciben <strong>consultas</strong>: cada consulta la realiza un veterinario, en una fecha y con un diagnóstico. Las consultas se numeran de forma consecutiva para cada mascota (consulta 1, 2, 3…).`;

  const CINE = `Un cine registra sus <strong>salas</strong> (número único y capacidad) y sus <strong>películas</strong> (código, título, duración y uno o varios géneros).
    Cada sala programa <strong>funciones</strong>, numeradas 1, 2, 3… dentro de cada sala, con fecha y hora. En cada función se proyecta una única película; una película puede proyectarse en muchas funciones o en ninguna.
    Los <strong>empleados</strong> (código, nombre) pueden ser taquilleros (número de caja) o proyeccionistas (certificación); hay empleados que no son ninguno de los dos.`;

  /* Construye el diagrama de la veterinaria hasta la etapa indicada
     1 entidades · 2 atributos · 3 claves · 4 relaciones · 5 cardinalidad · 6 participación · 7 generalización */
  function vet(st) {
    const A = (list) => (st >= 2 ? list : undefined);
    const k = (s) => (st >= 3 ? '*' + s : s);
    const hl = (n) => st === n;
    const nodes = [
      { id: 'cl', t: 'E', l: 'CLIENTE', x: 160, y: 150, attrs: A([k('cédula'), 'nombre', 'dirección', '{teléfono}']), side: 'top', hl: hl(1) },
      { id: 'ma', t: 'E', l: 'MASCOTA', x: 160, y: 450, attrs: A([k('código'), 'nombre', 'especie', 'fecha_nac', '/edad']), side: 'bottom', hl: hl(1) },
      { id: 'co', t: 'E', l: 'CONSULTA', x: 660, y: 450, weak: st >= 3, attrs: A([st >= 3 ? '~nro_consulta' : 'nro_consulta', 'fecha', 'diagnóstico']), side: 'bottom', hl: hl(1) || hl(3) },
      { id: 'em', t: 'E', l: 'EMPLEADO', x: 800, y: 70, attrs: A([k('código'), 'nombre', 'salario']), side: 'right', hl: hl(1) },
      { id: 've', t: 'E', l: 'VETERINARIO', x: 650, y: 225, attrs: A(['tarjeta_prof', 'especialidad']), side: 'left', hl: hl(1) },
      { id: 're', t: 'E', l: 'RECEPCIONISTA', x: 900, y: 225, attrs: A(['turno']), side: 'bottom', hl: hl(1) },
    ];
    const edges = [];
    if (st >= 4) {
      nodes.push({ id: 'r1', t: 'R', l: 'posee', x: 160, y: 300, hl: hl(4) });
      nodes.push({ id: 'r2', t: 'R', l: 'recibe', x: 410, y: 450, ident: st >= 4, hl: hl(4) });
      nodes.push({ id: 'r3', t: 'R', l: 'realiza', x: 650, y: 335, hl: hl(4) });
      const c = st >= 5, p = st >= 6;
      edges.push({ a: 'cl', b: 'r1', ca: c ? '1' : '' }, { a: 'ma', b: 'r1', ca: c ? 'N' : '', total: p });
      edges.push({ a: 'ma', b: 'r2', ca: c ? '1' : '' }, { a: 'co', b: 'r2', ca: c ? 'N' : '', total: p });
      edges.push({ a: 've', b: 'r3', ca: c ? '1' : '' }, { a: 'co', b: 'r3', ca: c ? 'N' : '', total: p });
    }
    if (st >= 7) {
      nodes.push({ id: 'is', t: 'ISA', l: 'd', x: 800, y: 150, hl: hl(7) });
      edges.push({ a: 'em', b: 'is', total: true }, { a: 'is', b: 've', subset: true }, { a: 'is', b: 're', subset: true });
    }
    return fig(D.diagram({ w: 1000, h: st >= 2 ? 590 : 520, nodes, edges }), st < 8 ? 'En naranja: lo que se agrega en este paso.' : 'Diagrama final completo.').replace('class="fig"', 'class="fig fig-lg"');
  }

  const enunBlock = `<div class="stmt">${ENUN}</div>`;
  const cineReveal = `<details class="mini-stmt"><summary>Ver enunciado del cine</summary><div class="stmt">${CINE}</div></details>`;

  MER.add({
    id: 'construccion', num: 12, orden: 12, grupo: 'Método de resolución',
    titulo: 'Construcción de diagramas', resumen: 'Construye un MER desde cero: del enunciado al diagrama final, paso a paso.',
    objetivo: 'Ver cómo un diagrama crece etapa por etapa y practicar cada etapa con otro enunciado.',
    requiere: ['leer'],
    items: [
      {
        titulo: 'El flujo de construcción', corto: 'Flujo', tipo: 'html',
        html: `<p class="lead">Construir un MER es un proceso en <strong>9 etapas</strong>. En cada una tomas <strong>un solo tipo de decisión</strong>. En este módulo verás el mismo ejemplo (una veterinaria) crecer etapa por etapa, y en cada página practicarás esa etapa con otro enunciado (un cine).</p>
          <div class="flow flow-v">${['Enunciado', 'Entidades', 'Atributos', 'Claves', 'Relaciones', 'Cardinalidades', 'Participación', 'Generalización / especialización', 'Diagrama final']
            .map((x, i) => `<a class="flow-i" href="#/construccion/${i + 1}"><b>${i + 1}</b>${x}</a>`).join('<span class="flow-a">↓</span>')}</div>
          ${box('info', 'Enunciado de ejemplo (veterinaria)', enunBlock)}
          ${box('warn', 'Enunciado de práctica (cine)', `<div class="stmt">${CINE}</div>`)}`,
      },
      {
        titulo: 'Paso 1 · Enunciado', corto: 'Enunciado',
        que: '<p>Leer el enunciado completo, <strong>dos veces</strong>, marcando sustantivos, datos, verbos y palabras de cantidad.</p>',
        como: enunBlock + olist(['Primera lectura: entender el negocio.', 'Segunda lectura: marcar con colores.', 'Anotar dudas y supuestos (“¿un cliente puede no tener mascotas? El texto dice ‘puede’: sí.”).']),
        error: { mal: '<p>Leer solo la primera frase y dibujar.</p>', bien: '<p>La regla de la consulta numerada “para cada mascota” aparece al final y cambia el diseño (entidad débil).</p>' },
        ejercicio: { enunciado: `Lee el enunciado del cine y marca: sustantivos, verbos y palabras de cantidad. ${cineReveal}`, respuesta: '<p><strong>Sustantivos:</strong> cine, sala, número, capacidad, película, código, título, duración, género, función, fecha, hora, empleado, nombre, taquillero, caja, proyeccionista, certificación. <strong>Verbos:</strong> programa, se proyecta. <strong>Cantidad:</strong> “numeradas… dentro de cada sala”, “una única película”, “muchas funciones o en ninguna”, “uno o varios géneros”, “hay empleados que no son ninguno”.</p>', explicacion: '<p>Las palabras de cantidad serán la base de la cardinalidad y la participación.</p>' },
      },
      {
        titulo: 'Paso 2 · Entidades', corto: 'Entidades',
        que: '<p>Decidir qué sustantivos son entidades con la prueba: ¿varios datos? ¿muchos ejemplares? ¿no es solo una característica?</p>',
        como: table(['Sustantivo', 'Decisión'], [['clínica', '✗ es el sistema'], ['cliente, mascota, empleado, consulta', '✓ entidades'], ['veterinario, recepcionista', '✓ entidades (tienen datos propios; se conectarán en el paso 8)'], ['nombre, especie, turno…', '✗ atributos']]),
        grafico: vet(1),
        error: { mal: '<p>Hacer de <em>especie</em> una entidad “porque hay muchas especies”.</p>', bien: '<p>No se pide ningún dato de la especie: es un atributo de MASCOTA.</p>' },
        ejercicio: { enunciado: `Identifica las entidades del cine. ${cineReveal}`, respuesta: `<p>${ent('SALA')} ${ent('PELÍCULA')} ${ent('FUNCIÓN')} ${ent('EMPLEADO')} ${ent('TAQUILLERO')} ${ent('PROYECCIONISTA')}</p>`, explicacion: '<p>Cine es el sistema. Género es atributo (multivaluado) porque no tiene datos propios.</p>' },
      },
      {
        titulo: 'Paso 3 · Atributos', corto: 'Atributos',
        que: '<p>Asignar cada dato del enunciado a su entidad (o relación) y marcar su tipo: simple, compuesto, multivaluado, derivado.</p>',
        como: table(['Dato', 'Va en', 'Tipo'], [['teléfonos', 'CLIENTE', 'multivaluado (“uno o varios”)'], ['edad', 'MASCOTA', 'derivado (“se desea conocer”, sale de fecha_nac)'], ['salario', 'EMPLEADO', 'simple (lo tienen todos)'], ['tarjeta_prof, especialidad', 'VETERINARIO', 'simples, solo de veterinarios'], ['turno', 'RECEPCIONISTA', 'simple'], ['fecha, diagnóstico, número', 'CONSULTA', 'simples']]),
        grafico: vet(2),
        error: { mal: '<p>Poner <em>cédula_cliente</em> como atributo de MASCOTA para “saber de quién es”.</p>', bien: '<p>Eso lo expresará la relación <em>posee</em> (paso 5). En el MER no hay claves foráneas.</p>' },
        ejercicio: { enunciado: `Asigna los atributos de las entidades del cine e indica su tipo. ${cineReveal}`, respuesta: table(['Entidad', 'Atributos'], [['SALA', 'número, capacidad'], ['PELÍCULA', 'código, título, duración, {género}'], ['FUNCIÓN', 'número, fecha, hora'], ['EMPLEADO', 'código, nombre'], ['TAQUILLERO', 'nro_caja'], ['PROYECCIONISTA', 'certificación']]), explicacion: '<p>Género es multivaluado (“uno o varios”).</p>' },
      },
      {
        titulo: 'Paso 4 · Claves', corto: 'Claves',
        que: '<p>Elegir la clave primaria de cada entidad. Si una entidad <strong>no tiene</strong> clave propia, revisar si es <strong>débil</strong>.</p>',
        como: table(['Entidad', 'Clave', 'Razonamiento'], [['CLIENTE', '<u>cédula</u>', 'única'], ['MASCOTA', '<u>código</u>', 'única'], ['EMPLEADO', '<u>código</u>', 'única; las subclases la heredan'], ['CONSULTA', 'nro_consulta (parcial)', '“se numeran para cada mascota”: la consulta 1 se repite → <strong>débil</strong>']]),
        grafico: vet(3),
        error: { mal: '<p>Subrayar <em>nro_consulta</em> como clave primaria.</p>', bien: '<p>Se repite entre mascotas → clave parcial (punteada) y CONSULTA pasa a rectángulo doble.</p>' },
        ejercicio: { enunciado: `Indica las claves del cine. ¿Hay alguna entidad débil? ${cineReveal}`, respuesta: '<p>SALA: <u>número</u> · PELÍCULA: <u>código</u> · EMPLEADO: <u>código</u> · FUNCIÓN: <strong>débil</strong> de SALA con clave parcial <em>número</em>.</p>', explicacion: '<p>“numeradas 1, 2, 3… dentro de cada sala” → la función 1 existe en todas las salas.</p>' },
      },
      {
        titulo: 'Paso 5 · Relaciones', corto: 'Relaciones',
        que: '<p>Convertir los verbos que unen entidades en rombos.</p>',
        como: table(['Frase', 'Relación'], [['“cada cliente puede tener varias mascotas”', 'CLIENTE — <em>posee</em> — MASCOTA'], ['“las mascotas reciben consultas”', 'MASCOTA — <em>recibe</em> — CONSULTA (identificadora, porque CONSULTA es débil)'], ['“cada consulta la realiza un veterinario”', 'VETERINARIO — <em>realiza</em> — CONSULTA']]),
        grafico: vet(4),
        error: { mal: '<p>Conectar <em>realiza</em> a EMPLEADO.</p>', bien: '<p>Solo los veterinarios hacen consultas; la relación va a la subclase VETERINARIO.</p>' },
        ejercicio: { enunciado: `Encuentra las relaciones del cine. ${cineReveal}`, respuesta: '<p>SALA — <em>programa</em> — FUNCIÓN (identificadora) · FUNCIÓN — <em>proyecta</em> — PELÍCULA.</p>', explicacion: '<p>“Cada sala programa funciones” y “en cada función se proyecta una película”.</p>' },
      },
      {
        titulo: 'Paso 6 · Cardinalidades', corto: 'Cardinalidades',
        que: '<p>Aplicar el método de las dos preguntas a cada relación.</p>',
        como: table(['Relación', 'Pregunta 1', 'Pregunta 2', 'Tipo'], [['posee', 'Un cliente → varias mascotas (N)', 'Una mascota → un único cliente (1)', '1:N'], ['recibe', 'Una mascota → varias consultas (N)', 'Una consulta → una mascota (1)', '1:N'], ['realiza', 'Un veterinario → varias consultas (N)', 'Una consulta → un veterinario (1)', '1:N']]),
        grafico: vet(5),
        error: { mal: '<p>Poner la N junto a CLIENTE porque “hay muchos clientes”.</p>', bien: '<p>La N va junto a la entidad que se cuenta: un cliente tiene N <strong>mascotas</strong>.</p>' },
        ejercicio: { enunciado: `Cardinalidades del cine. ${cineReveal}`, respuesta: '<p>programa: SALA 1 : N FUNCIÓN · proyecta: PELÍCULA 1 : N FUNCIÓN.</p>', explicacion: '<p>Una función tiene una única película; una película, muchas funciones.</p>' },
      },
      {
        titulo: 'Paso 7 · Participación', corto: 'Participación',
        que: '<p>Para cada entidad en cada relación: ¿puede existir sin participar?</p>',
        como: table(['Relación', 'Entidad', '¿Puede existir sin participar?', 'Participación'], [['posee', 'MASCOTA', 'No (“pertenece a un único cliente”)', 'Total'], ['posee', 'CLIENTE', 'Sí (“puede tener”)', 'Parcial'], ['recibe', 'CONSULTA', 'No (es débil)', 'Total'], ['realiza', 'CONSULTA', 'No (“cada consulta la realiza un veterinario”)', 'Total'], ['realiza', 'VETERINARIO', 'Sí (uno recién contratado)', 'Parcial']]),
        grafico: vet(6),
        error: { mal: '<p>Marcar total a CLIENTE en <em>posee</em>.</p>', bien: '<p>“puede tener” indica opcionalidad → parcial.</p>' },
        ejercicio: { enunciado: `Participación en el cine. ${cineReveal}`, respuesta: '<p>FUNCIÓN total en <em>programa</em> (débil) y total en <em>proyecta</em> (“se proyecta una única película”). PELÍCULA parcial (“o en ninguna”). SALA parcial (asumido: una sala nueva puede no tener funciones).</p>', explicacion: '<p>Cuando el texto no lo dice (SALA), anota el supuesto.</p>' },
      },
      {
        titulo: 'Paso 8 · Generalización / especialización', corto: 'Generalización',
        que: '<p>Conectar superclases y subclases y definir sus restricciones.</p>',
        como: list(['“Todo empleado es veterinario o recepcionista” → <strong>total</strong> (línea doble).', '“nunca ambas cosas” → <strong>disjunta</strong> (d).', 'Atributos comunes (código, nombre, salario) en EMPLEADO; específicos en cada subclase.']),
        grafico: vet(7),
        error: { mal: '<p>Repetir <em>código</em> y <em>nombre</em> en VETERINARIO y RECEPCIONISTA.</p>', bien: '<p>Se heredan de EMPLEADO.</p>' },
        ejercicio: { enunciado: `Define la especialización del cine. ${cineReveal}`, respuesta: '<p>EMPLEADO → TAQUILLERO (nro_caja), PROYECCIONISTA (certificación). <strong>Parcial</strong> (“hay empleados que no son ninguno”). Disyunción: el texto no lo dice; lo razonable es <strong>solapada (o)</strong> si nada lo impide, o disjunta si el negocio lo exige. Anota el supuesto.</p>', explicacion: '<p>Cuando el enunciado no especifica, cualquier decisión razonable es válida si la justificas.</p>' },
      },
      {
        titulo: 'Paso 9 · Diagrama final', corto: 'Diagrama final',
        que: '<p>Revisar el diagrama completo y validarlo contra el enunciado.</p>',
        grafico: vet(8),
        como: box('sum', 'Lista de validación', list([
          '¿Cada entidad tiene clave (o clave parcial si es débil)? ✓',
          '¿Cada relación tiene cardinalidad en ambos lados? ✓',
          '¿Cada frase del enunciado está representada? ✓',
          '¿Hay algún dato sin ubicar? No ✓',
          '¿Hay entidades aisladas sin relaciones? EMPLEADO se conecta por la jerarquía ✓',
          '¿Toda entidad débil tiene rombo doble, línea doble y clave parcial? ✓',
        ])),
        ejercicio: {
          enunciado: `Dibuja el diagrama final del cine. ${cineReveal}`,
          respuesta: fig(D.diagram({ w: 820, h: 470, nodes: [
            { id: 's', t: 'E', l: 'SALA', x: 110, y: 110, attrs: ['*número', 'capacidad'], side: 'top' },
            { id: 'r1', t: 'R', l: 'programa', x: 310, y: 110, ident: true },
            { id: 'f', t: 'E', l: 'FUNCIÓN', x: 510, y: 110, weak: true, attrs: ['~número', 'fecha', 'hora'], side: 'top' },
            { id: 'r2', t: 'R', l: 'proyecta', x: 700, y: 110 },
            { id: 'p', t: 'E', l: 'PELÍCULA', x: 700, y: 250, attrs: ['*código', 'título', 'duración', '{género}'], side: 'bottom' },
            { id: 'e', t: 'E', l: 'EMPLEADO', x: 220, y: 270, attrs: ['*código', 'nombre'], side: 'left' },
            { id: 'i', t: 'ISA', l: 'o', x: 220, y: 345 },
            { id: 't', t: 'E', l: 'TAQUILLERO', x: 110, y: 420, attrs: ['nro_caja'], side: 'right' },
            { id: 'q', t: 'E', l: 'PROYECCIONISTA', x: 400, y: 420, attrs: ['certificación'], side: 'right' }],
            edges: [{ a: 's', b: 'r1', ca: '1' }, { a: 'f', b: 'r1', ca: 'N', total: true }, { a: 'f', b: 'r2', ca: 'N', total: true }, { a: 'p', b: 'r2', ca: '1' },
              { a: 'e', b: 'i' }, { a: 'i', b: 't', subset: true }, { a: 'i', b: 'q', subset: true }] })).replace('class="fig"', 'class="fig fig-lg"'),
          explicacion: '<p>FUNCIÓN es débil de SALA; se relaciona con una película (N:1, total). La jerarquía de EMPLEADO es parcial y, con el supuesto elegido, solapada.</p>',
        },
      },
    ],
  });
})();
