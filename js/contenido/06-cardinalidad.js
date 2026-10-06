/* Módulo 6 — Cardinalidad */
(function () {
  const { list, olist, table, box, fig, cmp, steps, ent, rel, att } = R;
  const bin = (a, r, b, ca, cb, o) => D.diagram(Object.assign({ w: 580, h: 110, nodes: [
    { id: 'a', t: 'E', l: a, x: 95, y: 55 }, { id: 'r', t: 'R', l: r, x: 290, y: 55 }, { id: 'b', t: 'E', l: b, x: 485, y: 55 }],
    edges: [{ a: 'a', b: 'r', ca, total: o && o.ta }, { a: 'b', b: 'r', ca: cb, total: o && o.tb }] }, o && o.extra));

  /* Diagrama de ejemplares (flechas entre puntos) */
  function inst(la, lb, A, B, links) {
    const W = 420, rowH = 30, n = Math.max(A.length, B.length), H = n * rowH + 50;
    let s = `<svg class="dg" viewBox="0 0 ${W} ${H}" style="max-width:${W}px" xmlns="http://www.w3.org/2000/svg">`;
    s += `<text class="dg-txt" x="80" y="16" text-anchor="middle">${la}</text><text class="dg-txt" x="340" y="16" text-anchor="middle">${lb}</text>`;
    s += `<rect class="dg-shape" x="20" y="26" width="120" height="${n * rowH + 14}" rx="18" style="fill:var(--dg-ent)"/>`;
    s += `<rect class="dg-shape" x="280" y="26" width="120" height="${n * rowH + 14}" rx="18" style="fill:var(--dg-ent)"/>`;
    const ya = (i) => 48 + i * rowH;
    links.forEach(([i, j]) => { s += `<line class="dg-line" x1="118" y1="${ya(i)}" x2="302" y2="${ya(j)}" style="stroke:var(--dg-role)"/>`; });
    A.forEach((t, i) => { s += `<circle cx="118" cy="${ya(i)}" r="4" fill="var(--dg-stroke)"/><text class="dg-lbl" style="font-weight:500;fill:var(--dg-text)" x="70" y="${ya(i)}" dy=".35em" text-anchor="middle">${t}</text>`; });
    B.forEach((t, i) => { s += `<circle cx="302" cy="${ya(i)}" r="4" fill="var(--dg-stroke)"/><text class="dg-lbl" style="font-weight:500;fill:var(--dg-text)" x="350" y="${ya(i)}" dy=".35em" text-anchor="middle">${t}</text>`; });
    return s + '</svg>';
  }

  const regla = box('key', 'Regla de lectura que usaremos en todo el curso', `<p><strong>Método de las dos preguntas</strong> para una relación entre A y B:</p>
    ${olist(['Toma <strong>UN</strong> ejemplar de A. ¿Con <strong>cuántos</strong> B se relaciona como máximo? → escribe la respuesta (1 o N) <strong>junto a B</strong>.',
      'Toma <strong>UN</strong> ejemplar de B. ¿Con <strong>cuántos</strong> A se relaciona como máximo? → escribe la respuesta <strong>junto a A</strong>.'])}
    <p>El número queda al lado de la entidad que se está <strong>contando</strong>. Así el diagrama se lee “cruzando”: <em>UN departamento tiene <strong>N</strong> empleados</em> (la N está junto a EMPLEADO).</p>`);

  const minmaxCase = (tit, nota, lectura, cot, bdTxt, dg, ej) => ({
    h: `${nota} — ${tit}`,
    que: `<p><strong>${nota}</strong> se lee “${lectura}”.</p>`,
    ejemplo: { cotidiano: cot, bd: bdTxt },
    grafico: dg,
    ejercicio: ej,
  });

  MER.add({
    id: 'cardinalidad', num: 6, orden: 6, grupo: 'Conceptos',
    titulo: 'Cardinalidad', resumen: '1:1, 1:N, N:1, N:M, mínimos y máximos, y cómo leerlos en un enunciado.',
    objetivo: 'Determinar la cardinalidad correcta de cualquier relación leyendo el enunciado en ambos sentidos.',
    requiere: ['relaciones'],
    items: [
      {
        titulo: '¿Qué es la cardinalidad?', corto: 'Qué es',
        que: '<p>La <strong>cardinalidad</strong> indica <strong>con cuántos</strong> ejemplares de una entidad se puede relacionar <strong>un</strong> ejemplar de la otra entidad.</p>',
        porque: '<p>Es la regla de negocio más importante del modelo: determina si un pedido puede tener varios clientes, si un empleado puede estar en dos departamentos… y decide cómo se construirán las tablas.</p>',
        como: `<p>Siempre se hacen <strong>dos preguntas</strong>, una en cada sentido. Las respuestas máximas (1 o muchos) dan el tipo:</p>
          ${table(['Tipo', 'Un A se relaciona con…', 'Un B se relaciona con…'], [['1:1', 'como máximo 1 B', 'como máximo 1 A'], ['1:N', 'muchos B', 'como máximo 1 A'], ['N:1', 'como máximo 1 B', 'muchos A'], ['N:M', 'muchos B', 'muchos A']])}
          ${regla}`,
        identificar: table(['Palabras del enunciado', 'Sugieren'], [['“un”, “una”, “un único”, “solo uno”, “exactamente uno”', 'máximo 1'], ['“varios”, “muchos”, “uno o más”, “cualquier número de”, plural', 'máximo N'], ['“ninguno”, “puede no tener”, “opcionalmente”', 'mínimo 0'], ['“al menos uno”, “debe”, “siempre”, “todo”', 'mínimo 1']]),
        ejemplo: {
          cotidiano: '<p>Una madre puede tener <strong>varios</strong> hijos; un hijo tiene <strong>una</strong> madre biológica → 1:N.</p>',
          bd: fig(bin('DEPARTAMENTO', 'tiene', 'EMPLEADO', '1', 'N'), 'Un departamento tiene N empleados; un empleado está en 1 departamento.'),
        },
        grafico: '<p>Se escribe <strong>1</strong>, <strong>N</strong> o <strong>M</strong> junto a cada línea, al lado de la entidad que se cuenta.</p>',
        error: {
          mal: '<p>Hacer una sola pregunta: “un departamento tiene muchos empleados → N:M”.</p>',
          bien: '<p>Falta la segunda pregunta: “un empleado, ¿en cuántos departamentos está?” → uno. Resultado: 1:N.</p>',
          porque: 'Nunca decidas la cardinalidad con una sola frase. Haz siempre las dos preguntas.',
        },
        ejercicio: {
          enunciado: 'Aplica el método de las dos preguntas: “Un autor escribe varios libros y un libro puede ser escrito por varios autores.”',
          respuesta: '<p><strong>N:M</strong> — N junto a LIBRO, M junto a AUTOR.</p>',
          explicacion: olist(['Un autor → ¿cuántos libros? Varios → N junto a LIBRO.', 'Un libro → ¿cuántos autores? Varios → M junto a AUTOR.', 'Muchos en ambos sentidos → N:M.']),
        },
      },
      {
        titulo: 'Cardinalidad 1:1 (uno a uno)', corto: '1:1',
        que: '<p>Un ejemplar de A se relaciona con <strong>como máximo uno</strong> de B, y un ejemplar de B con <strong>como máximo uno</strong> de A.</p>',
        porque: '<p>Refleja parejas exclusivas: nadie comparte su “pareja”.</p>',
        como: fig(inst('PERSONA', 'PASAPORTE', ['Ana', 'Luis', 'Eva'], ['P-001', 'P-002', 'P-003'], [[0, 0], [1, 1], [2, 2]]), 'Cada punto se une con un solo punto del otro lado.'),
        identificar: '<p>Las dos preguntas responden <strong>“uno”</strong>: “cada X tiene un Y” y “cada Y pertenece a un solo X”.</p>',
        ejemplo: {
          cotidiano: '<p>Una persona tiene un pasaporte vigente; un pasaporte es de una persona.</p>',
          bd: fig(bin('DEPARTAMENTO', 'dirige', 'GERENTE', '1', '1')),
        },
        grafico: '<p>Un <strong>1</strong> en cada lado del rombo.</p>',
        cuando: { si: ['Ambos sentidos dan “como máximo uno”.'], no: ['Si en algún momento uno de los dos lados puede tener varios (por ejemplo, historial de pasaportes).'] },
        error: {
          mal: '<p>Crear una relación 1:1 entre dos entidades que en realidad son la misma cosa (PERSONA 1:1 DATOS_PERSONA).</p>',
          bien: '<p>Si ambas tienen la misma clave y siempre existen juntas, probablemente deberían ser <strong>una sola entidad</strong>.</p>',
        },
        ejercicio: {
          enunciado: '“Cada sede de la empresa tiene un único administrador, y un administrador solo puede administrar una sede.” Determina la cardinalidad.',
          respuesta: '<p><strong>1:1</strong> entre SEDE y ADMINISTRADOR.</p>',
          explicacion: olist(['Una sede → ¿cuántos administradores? “un único” → 1.', 'Un administrador → ¿cuántas sedes? “solo una” → 1.', 'Uno y uno → 1:1.']),
        },
      },
      {
        titulo: 'Cardinalidad 1:N (uno a muchos)', corto: '1:N',
        que: '<p>Un ejemplar de A se relaciona con <strong>muchos</strong> de B, pero cada ejemplar de B se relaciona con <strong>como máximo uno</strong> de A.</p>',
        porque: '<p>Es la cardinalidad <strong>más común</strong>: modela pertenencia, jerarquía y creación (un cliente hace muchos pedidos).</p>',
        como: fig(inst('CLIENTE', 'PEDIDO', ['Ana', 'Luis'], ['#1', '#2', '#3', '#4'], [[0, 0], [0, 1], [0, 2], [1, 3]]), 'Ana tiene 3 pedidos; cada pedido llega a un solo cliente.'),
        identificar: '<p>Un sentido responde <strong>“varios”</strong> y el otro <strong>“uno”</strong>. Pista: “cada Y pertenece a <strong>un</strong> X” suele indicar el lado 1.</p>',
        ejemplo: {
          cotidiano: '<p>Una mamá gallina tiene muchos pollitos; cada pollito tiene una sola mamá.</p>',
          bd: fig(bin('CLIENTE', 'realiza', 'PEDIDO', '1', 'N')),
        },
        grafico: '<p><strong>1</strong> junto a la entidad del lado “uno” (CLIENTE) y <strong>N</strong> junto a la del lado “muchos” (PEDIDO).</p>',
        cuando: { si: ['Un X tiene varios Y, y cada Y es de un único X.'], no: ['Un Y también puede tener varios X (entonces es N:M).'] },
        error: {
          mal: fig(bin('CLIENTE', 'realiza', 'PEDIDO', 'N', '1')),
          bien: fig(bin('CLIENTE', 'realiza', 'PEDIDO', '1', 'N')),
          porque: 'La N va junto a la entidad de la que hay “muchos” por cada uno de la otra. Hay muchos PEDIDOS por cliente → la N junto a PEDIDO.',
        },
        ejercicio: {
          enunciado: '“Una ciudad tiene muchos barrios. Cada barrio pertenece a una sola ciudad.” Dibuja la cardinalidad.',
          respuesta: fig(bin('CIUDAD', 'tiene', 'BARRIO', '1', 'N')),
          explicacion: '<p>Una ciudad → muchos barrios (N junto a BARRIO). Un barrio → una ciudad (1 junto a CIUDAD).</p>',
        },
      },
      {
        titulo: 'Cardinalidad N:1 (muchos a uno)', corto: 'N:1',
        que: '<p>Es la <strong>misma</strong> cardinalidad que 1:N, pero leída en el <strong>orden contrario</strong>: muchos A se relacionan con un B.</p>',
        porque: '<p>Se usa según qué entidad nombres primero. EMPLEADO–DEPARTAMENTO es N:1; DEPARTAMENTO–EMPLEADO es 1:N. Es exactamente el mismo hecho.</p>',
        como: fig(inst('EMPLEADO', 'DEPARTAMENTO', ['Ana', 'Luis', 'Eva'], ['Ventas', 'TI'], [[0, 0], [1, 0], [2, 1]]), 'Muchos empleados llegan a un mismo departamento.'),
        identificar: '<p>Si la entidad que aparece <strong>primero</strong> en tu frase es la del lado “muchos”, dirás N:1.</p>',
        ejemplo: { cotidiano: '<p>Muchos estudiantes pertenecen a un mismo curso de colegio (11°A).</p>', bd: fig(bin('EMPLEADO', 'trabaja_en', 'DEPARTAMENTO', 'N', '1')) },
        grafico: '<p>Igual que 1:N: la <strong>N</strong> junto a EMPLEADO (lado muchos) y el <strong>1</strong> junto a DEPARTAMENTO.</p>',
        cuando: { si: ['Siempre que la leas desde el lado muchos.'], no: ['No existe diferencia de diseño con 1:N; no la trates como otra cosa.'] },
        error: { mal: '<p>Pensar que 1:N y N:1 son diseños distintos.</p>', bien: '<p>Son el mismo diseño visto desde lados diferentes. Lo importante es que la N quede junto a la entidad correcta.</p>' },
        ejercicio: {
          enunciado: '“Muchos productos pertenecen a una categoría; una categoría agrupa muchos productos.” ¿Es 1:N o N:1?',
          respuesta: '<p><strong>PRODUCTO–CATEGORÍA es N:1</strong> (o CATEGORÍA–PRODUCTO 1:N). Ambas descripciones son correctas.</p>',
          explicacion: '<p>La N va junto a PRODUCTO y el 1 junto a CATEGORÍA, sin importar cómo lo nombres.</p>',
        },
      },
      {
        titulo: 'Cardinalidad N:M (muchos a muchos)', corto: 'N:M',
        que: '<p>Un ejemplar de A se relaciona con <strong>muchos</strong> de B <strong>y</strong> un ejemplar de B se relaciona con <strong>muchos</strong> de A.</p>',
        porque: '<p>Modela asociaciones libres: matrículas, participaciones, compras de productos.</p>',
        como: fig(inst('ESTUDIANTE', 'CURSO', ['Ana', 'Luis', 'Eva'], ['BD', 'Cálculo', 'Física'], [[0, 0], [0, 1], [1, 0], [1, 2], [2, 1]]), 'Ana está en BD y Cálculo; BD tiene a Ana y a Luis.'),
        identificar: '<p>Las dos preguntas responden <strong>“varios”</strong>. Frases típicas: “… y cada Y puede tener varios X”.</p>',
        ejemplo: { cotidiano: '<p>Actores y películas: un actor sale en muchas películas y una película tiene muchos actores.</p>', bd: fig(bin('ESTUDIANTE', 'matricula', 'CURSO', 'N', 'M')) },
        grafico: '<p><strong>N</strong> y <strong>M</strong> (dos letras distintas indican que los “muchos” no tienen por qué ser iguales).</p>',
        cuando: { si: ['Ambos sentidos permiten varios.'], no: ['Uno de los sentidos está limitado a uno.'] },
        error: {
          mal: '<p>Leer “un estudiante se matricula en varios cursos” y concluir 1:N.</p>',
          bien: '<p>Pregunta también: “un curso, ¿cuántos estudiantes tiene?” → varios. Entonces es <strong>N:M</strong>.</p>',
          porque: 'Si el enunciado solo da un sentido, usa el sentido común del negocio para el otro, y anótalo como supuesto.',
        },
        ejercicio: {
          enunciado: '“Un proyecto tiene varios empleados asignados. Un empleado puede trabajar en varios proyectos a la vez.” Cardinalidad.',
          respuesta: fig(bin('EMPLEADO', 'asignado', 'PROYECTO', 'N', 'M')),
          explicacion: '<p>Proyecto → varios empleados. Empleado → varios proyectos. Muchos en ambos sentidos → N:M.</p>',
        },
      },
      {
        titulo: 'Cardinalidad mínima y máxima', corto: 'Mínima y máxima',
        que: `<p>Cada lado de una relación tiene dos números:</p>${table(['', 'Pregunta', 'Valores'], [['<strong>Mínima</strong>', '¿Con cuántos se relaciona <strong>como mínimo</strong>?', '0 (opcional) o 1 (obligatorio)'], ['<strong>Máxima</strong>', '¿Con cuántos se relaciona <strong>como máximo</strong>?', '1 o N (muchos)']])}`,
        porque: '<p>La máxima dice el tipo (1:1, 1:N, N:M). La mínima dice si la relación es <strong>opcional u obligatoria</strong>: “¿puede existir un cliente sin pedidos?”.</p>',
        como: `<p>Para cada sentido haz la pregunta completa: <em>“Un cliente realiza <strong>como mínimo ___</strong> y <strong>como máximo ___</strong> pedidos”</em>.</p>
          ${fig(bin('CLIENTE', 'realiza', 'PEDIDO', '(1,1)', '(0,N)'), 'Un cliente realiza de 0 a N pedidos (junto a PEDIDO). Un pedido lo realiza exactamente 1 cliente (junto a CLIENTE).')}`,
        identificar: '<p>Mínimo 0: “puede”, “algunos”, “no necesariamente”. Mínimo 1: “debe”, “todo”, “al menos uno”, “siempre”.</p>',
        ejemplo: { cotidiano: '<p>Un estudiante puede no tener mascota (mín 0) y puede tener varias (máx N).</p>', bd: '<p>Un empleado <strong>debe</strong> estar en un departamento (mín 1) y solo en uno (máx 1) → (1,1) junto a DEPARTAMENTO.</p>' },
        grafico: '<p>Pareja <strong>(mín, máx)</strong> junto a la entidad que se cuenta. Relación con la <strong>participación</strong> (módulo 7): si el mínimo es 1, la participación de la entidad del <em>otro lado</em> es total.</p>',
        error: { mal: '<p>Escribir (N,1) o (1,0).</p>', bien: '<p>El mínimo va primero y nunca es mayor que el máximo: (0,1), (1,1), (0,N), (1,N).</p>' },
        ejercicio: {
          enunciado: '“Todo curso debe tener al menos un estudiante inscrito y puede tener muchos. Un estudiante puede no estar inscrito en ningún curso o en varios.” Escribe las parejas (mín,máx).',
          respuesta: fig(bin('ESTUDIANTE', 'inscribe', 'CURSO', '(1,N)', '(0,M)')),
          explicacion: olist(['Un estudiante → cursos: mínimo 0, máximo varios → <strong>(0,M) junto a CURSO</strong>.', 'Un curso → estudiantes: mínimo 1, máximo varios → <strong>(1,N) junto a ESTUDIANTE</strong>.']),
        },
      },
      {
        titulo: 'Notación 0..1, 1..1, 0..N y 1..N', corto: '0..1 · 1..1 · 0..N · 1..N', tipo: 'multi',
        intro: 'Las cuatro combinaciones posibles de mínimo y máximo. También se escriben como (0,1), (1,1), (0,N), (1,N). En UML: 0..1, 1, 0..*, 1..*.',
        partes: [
          minmaxCase('opcional, como máximo uno', '0..1', 'cero o uno',
            '<p>Una persona tiene 0 o 1 vehículo asignado en el parqueadero de la empresa.</p>',
            '<p>Un empleado tiene 0 o 1 puesto de parqueo.</p>',
            fig(bin('EMPLEADO', 'asignado', 'PARQUEADERO', '(0,1)', '(0,1)'), 'Junto a PARQUEADERO: un empleado tiene 0 o 1 puesto.'),
            { enunciado: '“Un estudiante puede tener asignado un casillero (no todos lo tienen).” ¿Qué pareja va junto a CASILLERO?', respuesta: '<p><strong>(0,1)</strong>.</p>', explicacion: '<p>“puede” y “no todos” → mínimo 0; “un casillero” → máximo 1.</p>' }),
          minmaxCase('obligatorio, exactamente uno', '1..1', 'uno y solo uno',
            '<p>Toda persona tiene exactamente una madre biológica.</p>',
            '<p>Todo pedido pertenece a exactamente un cliente.</p>',
            fig(bin('CLIENTE', 'realiza', 'PEDIDO', '(1,1)', '(0,N)'), 'Junto a CLIENTE: un pedido tiene exactamente 1 cliente.'),
            { enunciado: '“Toda factura debe tener un único cliente.” ¿Qué pareja va junto a CLIENTE?', respuesta: '<p><strong>(1,1)</strong>.</p>', explicacion: '<p>“debe” → mínimo 1; “único” → máximo 1.</p>' }),
          minmaxCase('opcional, muchos', '0..N', 'cero o muchos',
            '<p>Una persona puede tener ninguna o muchas redes sociales.</p>',
            '<p>Un cliente puede no haber hecho pedidos todavía o haber hecho muchos.</p>',
            fig(bin('CLIENTE', 'realiza', 'PEDIDO', '(1,1)', '(0,N)'), 'Junto a PEDIDO: un cliente realiza de 0 a N pedidos.'),
            { enunciado: '“Un autor registrado puede aún no tener libros publicados, o tener varios.” ¿Pareja junto a LIBRO?', respuesta: '<p><strong>(0,N)</strong>.</p>', explicacion: '<p>“aún no tener” → mínimo 0; “varios” → máximo N.</p>' }),
          minmaxCase('obligatorio, muchos', '1..N', 'uno o muchos',
            '<p>Un equipo de fútbol tiene al menos un jugador (en realidad, muchos).</p>',
            '<p>Una factura tiene al menos un producto y puede tener muchos.</p>',
            fig(bin('FACTURA', 'incluye', 'PRODUCTO', '(0,N)', '(1,M)'), 'Junto a PRODUCTO: una factura incluye de 1 a M productos.'),
            { enunciado: '“Todo pedido debe incluir al menos un producto.” ¿Pareja junto a PRODUCTO?', respuesta: '<p><strong>(1,N)</strong>.</p>', explicacion: '<p>“debe… al menos un” → mínimo 1; sin límite superior → máximo N.</p>' }),
        ],
      },
      {
        titulo: 'Cómo determinar la cardinalidad leyendo un enunciado', corto: 'Leer el enunciado',
        que: '<p>Un procedimiento paso a paso para obtener la cardinalidad sin adivinar.</p>',
        porque: '<p>Es donde más errores se cometen. Un método fijo evita confundir 1:N con N:M.</p>',
        como: steps([
          { t: 'Escribe la relación como frase', html: '<p>ESTUDIANTE — <em>matricula</em> — CURSO.</p>' },
          { t: 'Pregunta desde la izquierda', html: '<p>“<strong>UN</strong> estudiante se matricula en ¿cuántos cursos como mínimo y como máximo?” Busca la respuesta en el texto.</p>' },
          { t: 'Anota junto a la entidad de la derecha', html: '<p>Ej.: (1,N) junto a CURSO si “todo estudiante debe matricular al menos un curso”.</p>' },
          { t: 'Pregunta desde la derecha', html: '<p>“<strong>UN</strong> curso tiene ¿cuántos estudiantes como mínimo y como máximo?”</p>' },
          { t: 'Anota junto a la entidad de la izquierda', html: '<p>Ej.: (0,M) junto a ESTUDIANTE si un curso puede abrir sin inscritos.</p>' },
          { t: 'Obtén el tipo con los máximos', html: '<p>Máximos N y M → <strong>N:M</strong>.</p>' },
          { t: 'Si el texto no dice algo, usa el sentido común y escribe el supuesto', html: '<p>“Supuesto: un curso puede tener varios estudiantes (es lo normal en una universidad).”</p>' },
        ]),
        identificar: box('tip', 'Frases trampa', list([
          '“Cada cliente hace <strong>un</strong> pedido <em>cada vez</em>” → el cliente hace muchos pedidos en total (máx N).',
          '“Un médico atiende pacientes” → plural sin cantidad: suele significar varios.',
          '“Se registra el curso del estudiante” → un solo curso (máx 1), singular.',
          'Piensa en el <strong>tiempo</strong>: ¿el sistema guarda historia? Un empleado está en un departamento <em>hoy</em>, pero si se guarda su historial, habrá estado en varios.',
        ])),
        ejemplo: {
          cotidiano: '<p>“Cada conductor maneja un bus por turno, pero en la semana puede manejar varios buses.” Si se registra la semana → N:M.</p>',
          bd: '<p>“Un paciente es atendido por un médico de cabecera; un médico tiene muchos pacientes.” → MÉDICO 1:N PACIENTE.</p>',
        },
        error: { mal: '<p>Decidir por la primera frase que leas.</p>', bien: '<p>Termina de leer todo el enunciado: muchas veces la segunda mitad cambia la cardinalidad.</p>' },
        ejercicio: [
          {
            enunciado: '“Un hospital tiene varias habitaciones. Cada paciente internado ocupa una habitación, y en una habitación puede haber hasta 4 pacientes.” Cardinalidad de PACIENTE–ocupa–HABITACIÓN.',
            respuesta: fig(bin('PACIENTE', 'ocupa', 'HABITACIÓN', '(0,4)', '(1,1)')),
            explicacion: olist(['Un paciente internado → 1 habitación: (1,1) junto a HABITACIÓN.', 'Una habitación → de 0 a 4 pacientes: (0,4) junto a PACIENTE.', 'Tipo por máximos: N:1 (el máximo 4 es “muchos”).']),
          },
          {
            enunciado: '“Un vuelo es operado por un avión. Un avión opera muchos vuelos a lo largo del tiempo. Un avión nuevo puede no haber operado ninguno.” Cardinalidad de AVIÓN–opera–VUELO.',
            respuesta: fig(bin('AVIÓN', 'opera', 'VUELO', '(1,1)', '(0,N)')),
            explicacion: '<p>1:N. Junto a VUELO (0,N) porque un avión opera de 0 a N vuelos; junto a AVIÓN (1,1) porque cada vuelo tiene exactamente un avión.</p>',
          },
        ],
      },
    ],
  });
})();
