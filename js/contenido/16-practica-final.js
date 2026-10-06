/* Módulo 18 — Práctica final */
(function () {
  const { list, olist, table, box, fig, ent, rel, att } = R;
  const bin = (a, r, b, ca, cb, o) => D.diagram({ w: 520, h: 110, nodes: [
    Object.assign({ id: 'a', t: 'E', l: a, x: 85, y: 55 }, o && o.na), Object.assign({ id: 'r', t: 'R', l: r, x: 260, y: 55 }, o && o.nr), Object.assign({ id: 'b', t: 'E', l: b, x: 435, y: 55 }, o && o.nb)],
    edges: [{ a: 'a', b: 'r', ca, total: o && o.ta }, { a: 'b', b: 'r', ca: cb, total: o && o.tb }] });

  const preguntas = [
    { q: '¿Qué representa un rectángulo doble?', op: ['Una entidad con muchos atributos', 'Una entidad débil', 'Una relación identificadora', 'Una superclase'], ok: 1, exp: '<p>Rectángulo doble = entidad débil. El rombo doble es la relación identificadora.</p>' },
    { q: '“De cada empleado se registran uno o varios correos.” El atributo correo es…', op: ['Compuesto', 'Derivado', 'Multivaluado', 'Clave'], ok: 2, exp: '<p>“uno o varios” valores para el mismo ejemplar → multivaluado (óvalo doble).</p>' },
    { q: '“Se desea conocer la antigüedad de cada empleado a partir de su fecha de ingreso.” Antigüedad es…', op: ['Derivado', 'Multivaluado', 'Compuesto', 'Clave parcial'], ok: 0, exp: '<p>Se calcula con otro dato → derivado (óvalo punteado).</p>' },
    { q: '“Un autor escribe varios libros y un libro puede tener varios autores.” La cardinalidad es…', op: ['1:1', '1:N', 'N:1', 'N:M'], ok: 3, exp: '<p>Ambas preguntas responden “varios” → N:M.</p>' },
    { q: 'En el diagrama, ¿qué significa la N junto a PEDIDO?', fig: bin('CLIENTE', 'realiza', 'PEDIDO', '1', 'N', { tb: true }), op: ['Un pedido tiene N clientes', 'Un cliente realiza N pedidos', 'Hay N pedidos en total', 'El pedido es obligatorio'], ok: 1, exp: '<p>Se lee cruzando: UN cliente realiza N pedidos. La N está junto a la entidad que se cuenta.</p>' },
    { q: 'En el mismo diagrama, la línea doble junto a PEDIDO indica que…', op: ['Hay muchos pedidos', 'Todo pedido debe tener un cliente', 'Todo cliente debe tener pedidos', 'PEDIDO es débil'], ok: 1, exp: '<p>Línea doble = participación total de PEDIDO: ningún pedido existe sin cliente.</p>' },
    { q: '“Las habitaciones se numeran 101, 102… dentro de cada hotel.” HABITACIÓN es…', op: ['Fuerte con clave número', 'Débil con clave parcial número', 'Atributo multivaluado de HOTEL', 'Subclase de HOTEL'], ok: 1, exp: '<p>El número se repite entre hoteles: necesita la clave del hotel → débil, clave parcial número.</p>' },
    { q: '“Un curso puede ser prerrequisito de otros cursos.” Es una relación…', op: ['Ternaria', 'Identificadora', 'Recursiva', 'De especialización'], ok: 2, exp: '<p>Ambos lados son CURSO → recursiva (unaria), con roles.</p>' },
    { q: '“Una persona puede ser estudiante, empleado o ambos; hay personas que no son ninguno.” La especialización es…', op: ['Disjunta y total', 'Disjunta y parcial', 'Solapada y total', 'Solapada y parcial'], ok: 3, exp: '<p>“o ambos” → solapada (o). “hay personas que no son ninguno” → parcial (línea simple).</p>' },
    { q: '¿Dónde va el atributo “nota” si un estudiante tiene una nota por cada curso?', op: ['En ESTUDIANTE', 'En CURSO', 'En la relación matricula', 'Como entidad NOTA'], ok: 2, exp: '<p>Depende del par (estudiante, curso) → atributo de la relación.</p>' },
    { q: 'La entidad PEDIDO tiene el atributo id_cliente. ¿Qué error es?', op: ['Ninguno', 'Confundir atributo con relación', 'Entidad débil no detectada', 'Cardinalidad invertida'], ok: 1, exp: '<p>Una “clave foránea” en el MER oculta una relación: dibuja CLIENTE—realiza—PEDIDO.</p>' },
    { q: '“Los productos son de categoría A, B o C”, sin datos distintos para cada categoría. ¿Qué haces?', op: ['Generalización disjunta', 'Tres entidades separadas', 'Un atributo categoría', 'Relación ternaria'], ok: 2, exp: '<p>Sin atributos ni relaciones propias no hay motivo para subclases.</p>' },
    { q: '¿Qué indica el símbolo ⊂ en una línea?', op: ['Participación total', 'Que la entidad es subclase (subconjunto) de la superclase', 'Relación recursiva', 'Clave compuesta'], ok: 1, exp: '<p>⊂ marca la línea que llega a una subclase: todo ejemplar de la subclase es también de la superclase.</p>' },
    { q: '“Se registra qué proveedor suministra qué pieza a qué proyecto y en qué cantidad.” Lo más adecuado es…', op: ['Tres relaciones binarias', 'Una relación ternaria con atributo cantidad', 'Una relación recursiva', 'Un atributo multivaluado'], ok: 1, exp: '<p>El hecho necesita los tres participantes a la vez: ternaria. Con binarias se pierde quién suministró qué a quién.</p>' },
    { q: 'Participación y cardinalidad…', op: ['Son lo mismo', 'La participación responde al mínimo (¿obligatorio?) y la cardinalidad máxima a “¿cuántos como máximo?”', 'La participación solo existe en relaciones 1:1', 'La cardinalidad solo se usa en entidades débiles'], ok: 1, exp: '<p>Son preguntas independientes: total/parcial (mínimo) y 1/N (máximo).</p>' },
    { q: 'Una entidad débil siempre tiene participación ____ en su relación identificadora.', op: ['parcial', 'total', 'solapada', 'recursiva'], ok: 1, exp: '<p>No puede existir sin su propietaria → total (línea doble).</p>' },
    { q: '¿Cuál es la mejor clave primaria para EMPLEADO?', op: ['nombre', 'correo (puede cambiar)', 'código de empleado', 'fecha de ingreso'], ok: 2, exp: '<p>Única, obligatoria y estable.</p>' },
    { q: 'En el modelo conceptual (MER)…', op: ['Se escriben los tipos de dato (VARCHAR, INT)', 'Se colocan claves foráneas', 'Se representan entidades, atributos y relaciones sin detalles técnicos', 'Se crean índices'], ok: 2, exp: '<p>Tipos de dato e índices son del modelo físico; claves foráneas, del lógico.</p>' },
  ];

  const bad = D.diagram({ w: 760, h: 250, nodes: [
    { id: 'c', t: 'E', l: 'CLIENTES', x: 110, y: 150, attrs: ['*nombre', 'teléfono1', 'teléfono2'], side: 'top' },
    { id: 'r', t: 'R', l: 'compra', x: 330, y: 150 },
    { id: 'p', t: 'E', l: 'PEDIDO', x: 540, y: 150, attrs: ['*número', 'fecha', 'id_cliente'], side: 'top' },
    { id: 'l', t: 'E', l: 'LÍNEA', x: 540, y: 225 + 0, attrs: [], side: 'bottom' },
    { id: 'x', t: 'E', l: 'TIENDA', x: 700, y: 60 }],
    edges: [{ a: 'c', b: 'r', ca: 'N' }, { a: 'p', b: 'r', ca: '1' }, { a: 'p', b: 'l' }] });

  MER.add({
    id: 'final', num: 18, orden: 18, grupo: 'Práctica',
    titulo: 'Práctica final', resumen: 'Evaluación que mezcla todos los temas del curso.',
    objetivo: 'Comprobar tu dominio de todo el MER. Las respuestas no se muestran hasta que respondas o las pidas.',
    requiere: ['casos'],
    items: [
      { tipo: 'quiz', titulo: 'Cuestionario de conceptos', corto: 'Cuestionario', intro: 'Responde cada pregunta y pulsa “Comprobar”. Al final, calcula tu puntuación. Si fallas, lee la explicación y repasa el módulo correspondiente.', preguntas },
      {
        tipo: 'multi', titulo: 'Encuentra los errores', corto: 'Encuentra errores',
        intro: 'Un estudiante entregó este diagrama para: “Una tienda registra clientes (cédula, nombre, uno o varios teléfonos) y sus pedidos (número, fecha). Un cliente hace muchos pedidos; cada pedido es de un cliente. Cada pedido tiene líneas numeradas 1, 2, 3… con la cantidad.”',
        partes: [{
          extra: fig(bad, 'Diagrama entregado por el estudiante.'),
          ejercicio: {
            enunciado: 'Encuentra al menos <strong>siete</strong> errores y explica cómo corregir cada uno.',
            respuesta: olist([
              '<strong>TIENDA</strong> sobra: es el sistema (una sola tienda) y además está aislada.',
              '<strong>CLIENTES</strong> en plural: debe ser CLIENTE.',
              'Clave <strong>nombre</strong>: se repite. Debe ser <u>cédula</u>.',
              '<strong>teléfono1, teléfono2</strong>: debe ser un único atributo multivaluado {teléfono}.',
              'Cardinalidad <strong>invertida</strong>: debe ser 1 junto a CLIENTE y N junto a PEDIDO.',
              '<strong>id_cliente</strong> en PEDIDO: sobra, la relación <em>compra</em> ya lo expresa.',
              '<strong>PEDIDO–LÍNEA</strong> unidas sin rombo: falta la relación.',
              '<strong>LÍNEA</strong> debe ser débil (numerada por pedido): rectángulo doble, rombo doble, línea doble, clave parcial nro_línea y atributo cantidad.',
              'Falta participación total de PEDIDO en <em>compra</em> (todo pedido es de un cliente).',
            ]),
            explicacion: fig(D.diagram({ w: 900, h: 220, nodes: [
              { id: 'c', t: 'E', l: 'CLIENTE', x: 100, y: 140, attrs: ['*cédula', 'nombre', '{teléfono}'], side: 'top' },
              { id: 'r', t: 'R', l: 'compra', x: 290, y: 140 },
              { id: 'p', t: 'E', l: 'PEDIDO', x: 480, y: 140, attrs: ['*número', 'fecha'], side: 'top' },
              { id: 'q', t: 'R', l: 'contiene', x: 640, y: 140, ident: true },
              { id: 'l', t: 'E', l: 'LÍNEA', x: 810, y: 140, weak: true, attrs: ['~nro_línea', 'cantidad'], side: 'top' }],
              edges: [{ a: 'c', b: 'r', ca: '1' }, { a: 'p', b: 'r', ca: 'N', total: true }, { a: 'p', b: 'q', ca: '1' }, { a: 'l', b: 'q', ca: 'N', total: true }] }), 'Diagrama corregido.'),
          },
        }],
      },
      {
        tipo: 'ejercicio', nivel: 3, titulo: 'Integrador 1: gimnasio', corto: 'Gimnasio', temas: ['todo'],
        enunciado: 'Un gimnasio registra a sus socios (documento, nombre, fecha de nacimiento, uno o varios teléfonos; se desea conocer su edad). Los socios pueden ser regulares o premium (con fecha de vencimiento del plan premium); todo socio es de uno solo de estos tipos, pero los regulares no tienen datos adicionales. Los entrenadores (código, nombre, una o varias certificaciones) dictan clases (código, nombre, horario); cada clase la dicta un único entrenador. Los socios se inscriben en varias clases y cada clase tiene varios socios; se registra la fecha de inscripción. Cada socio premium tiene asignado un entrenador personal, y un entrenador puede tener varios socios premium a cargo. Algunos entrenadores son mentores de otros entrenadores (un mentor guía a varios entrenadores; cada entrenador tiene como máximo un mentor).',
        diagrama: D.diagram({ w: 960, h: 560, nodes: [
          { id: 'so', t: 'E', l: 'SOCIO', x: 180, y: 120, attrs: ['*documento', 'nombre', 'fecha_nac', '{teléfono}', '/edad'], side: 'top' },
          { id: 'is', t: 'ISA', l: 'd', x: 180, y: 220 },
          { id: 'pr', t: 'E', l: 'PREMIUM', x: 180, y: 320, attrs: ['vencimiento'], side: 'left' },
          { id: 'in', t: 'R', l: 'inscribe', x: 460, y: 120, attrs: ['fecha_insc'], side: 'bottom' },
          { id: 'cl', t: 'E', l: 'CLASE', x: 720, y: 120, attrs: ['*código', 'nombre', 'horario'], side: 'top' },
          { id: 'di', t: 'R', l: 'dicta', x: 720, y: 250 },
          { id: 'en', t: 'E', l: 'ENTRENADOR', x: 720, y: 390, attrs: ['*código', 'nombre', '{certificación}'], side: 'bottom' },
          { id: 'pe', t: 'R', l: 'personal', x: 440, y: 320 },
          { id: 'me', t: 'R', l: 'mentor_de', x: 900, y: 390 }],
          edges: [{ a: 'so', b: 'is', total: true }, { a: 'is', b: 'pr', subset: true },
            { a: 'so', b: 'in', ca: 'N' }, { a: 'cl', b: 'in', ca: 'M' }, { a: 'cl', b: 'di', ca: 'N', total: true }, { a: 'en', b: 'di', ca: '1' },
            { a: 'pr', b: 'pe', ca: 'N', total: true }, { a: 'en', b: 'pe', ca: '1' },
            { a: 'en', b: 'me', ao: [40, -21], via: [[760, 330], [900, 330]], ca: '1', m: 'mentor', side: -1 },
            { a: 'en', b: 'me', ao: [40, 21], via: [[760, 450], [900, 450]], ca: 'N', m: 'guiado' }] }),
        leyenda: 'Se dibuja solo la subclase PREMIUM, porque REGULAR no tiene atributos ni relaciones propias; la especialización es disjunta y total (algunos autores dibujan también REGULAR vacía).',
        pasos: ['Entidades: SOCIO, PREMIUM (subclase), CLASE, ENTRENADOR.', 'SOCIO: teléfono multivaluado, edad derivada.', 'Especialización de SOCIO: disjunta y total; solo PREMIUM tiene datos propios.', 'inscribe N:M con fecha; dicta 1:N (CLASE total).', 'personal: conectada a PREMIUM (subclase), 1:N, PREMIUM total (“tiene asignado”).', 'mentor_de: recursiva 1:N sobre ENTRENADOR, parcial.'],
        entidades: [['SOCIO', 'Datos propios, muchos ejemplares.'], ['PREMIUM', 'Subclase: tiene vencimiento y relación propia.'], ['CLASE', 'Datos propios.'], ['ENTRENADOR', 'Datos propios.']],
        atributos: [['SOCIO', '<u>documento</u>, nombre, fecha_nac, {teléfono}, /edad', 'multivaluado y derivado'], ['PREMIUM', 'vencimiento', 'solo premium'], ['ENTRENADOR', '<u>código</u>, nombre, {certificación}', 'multivaluado'], ['inscribe', 'fecha_insc', 'del par socio–clase']],
        relaciones: [['inscribe', 'SOCIO – CLASE', 'Inscripción.'], ['dicta', 'ENTRENADOR – CLASE', '“cada clase la dicta un único entrenador”.'], ['personal', 'ENTRENADOR – PREMIUM', 'Solo los premium.'], ['mentor_de', 'ENTRENADOR – ENTRENADOR', 'Recursiva.']],
        cardinalidades: [['inscribe', 'N:M', 'parcial'], ['dicta', '1:N', 'CLASE total'], ['personal', '1:N', 'PREMIUM total'], ['mentor_de', '1:N', 'parcial en ambos roles']],
      },
      {
        tipo: 'ejercicio', nivel: 3, titulo: 'Integrador 2: sistema de eventos', corto: 'Eventos', temas: ['todo'],
        enunciado: 'Una empresa organiza eventos (código, nombre, fecha) en lugares (código, nombre, ciudad). Cada evento se realiza en un solo lugar. Cada lugar tiene zonas numeradas (1, 2, 3…) dentro del lugar, con su capacidad y precio. Los asistentes (documento, nombre, correo) compran boletas; cada boleta tiene un número único, es para un evento y una zona determinados, y la compra un asistente. Los eventos pueden ser conciertos (género musical) o conferencias (tema); un evento puede ser ambas cosas a la vez. Todo evento es de al menos uno de los dos tipos.',
        diagrama: D.diagram({ w: 1010, h: 560, nodes: [
          { id: 'lu', t: 'E', l: 'LUGAR', x: 120, y: 120, attrs: ['*código', 'nombre', 'ciudad'], side: 'top' },
          { id: 'se', t: 'R', l: 'se_realiza', x: 360, y: 120 },
          { id: 'ev', t: 'E', l: 'EVENTO', x: 620, y: 120, attrs: ['*código', 'nombre', 'fecha'], side: 'top' },
          { id: 'is', t: 'ISA', l: 'o', x: 820, y: 120 },
          { id: 'cn', t: 'E', l: 'CONCIERTO', x: 850, y: 230, attrs: ['género'], side: 'right' },
          { id: 'cf', t: 'E', l: 'CONFERENCIA', x: 850, y: 30, attrs: ['tema'], side: 'right' },
          { id: 'ti', t: 'R', l: 'tiene', x: 120, y: 260, ident: true },
          { id: 'zo', t: 'E', l: 'ZONA', x: 120, y: 400, weak: true, attrs: ['~número', 'capacidad', 'precio'], side: 'bottom' },
          { id: 'ez', t: 'R', l: 'en_zona', x: 360, y: 400 },
          { id: 'bo', t: 'E', l: 'BOLETA', x: 620, y: 400, attrs: ['*número'], side: 'bottom' },
          { id: 'pa', t: 'R', l: 'para', x: 620, y: 260 },
          { id: 'co', t: 'R', l: 'compra', x: 830, y: 400 },
          { id: 'as', t: 'E', l: 'ASISTENTE', x: 830, y: 500, attrs: ['*documento', 'nombre', 'correo'], side: 'left' }],
          edges: [{ a: 'lu', b: 'se', ca: '1' }, { a: 'ev', b: 'se', ca: 'N', total: true }, { a: 'ev', b: 'is', total: true }, { a: 'is', b: 'cn', subset: true }, { a: 'is', b: 'cf', subset: true },
            { a: 'lu', b: 'ti', ca: '1' }, { a: 'zo', b: 'ti', ca: 'N', total: true }, { a: 'zo', b: 'ez', ca: '1' }, { a: 'bo', b: 'ez', ca: 'N', total: true },
            { a: 'ev', b: 'pa', ca: '1' }, { a: 'bo', b: 'pa', ca: 'N', total: true }, { a: 'bo', b: 'co', ca: 'N', total: true }, { a: 'as', b: 'co', ca: '1' }] }),
        pasos: ['ZONA es débil de LUGAR (numerada dentro del lugar).', 'BOLETA tiene número único → fuerte, con tres relaciones 1:N obligatorias (evento, zona, asistente).', 'EVENTO → CONCIERTO, CONFERENCIA: “puede ser ambas” → solapada (o); “al menos uno” → total.', 'se_realiza: LUGAR 1:N EVENTO, EVENTO total.'],
        entidades: [['LUGAR', 'Fuerte.'], ['ZONA', 'Débil de LUGAR.'], ['EVENTO', 'Superclase.'], ['CONCIERTO, CONFERENCIA', 'Subclases.'], ['BOLETA', 'Fuerte (número único).'], ['ASISTENTE', 'Fuerte.']],
        atributos: [['ZONA', 'número (parcial), capacidad, precio', 'El precio depende de la zona.'], ['CONCIERTO / CONFERENCIA', 'género / tema', 'Propios de cada subclase.']],
        relaciones: [['se_realiza', 'LUGAR – EVENTO', '—'], ['tiene', 'LUGAR – ZONA', 'Identificadora.'], ['para', 'EVENTO – BOLETA', '—'], ['en_zona', 'ZONA – BOLETA', '—'], ['compra', 'ASISTENTE – BOLETA', '—']],
        cardinalidades: [['se_realiza, tiene, para, en_zona, compra', 'todas 1:N', 'El lado N (EVENTO, ZONA, BOLETA) participa totalmente.'], ['Jerarquía', 'o, total', '“puede ser ambas” y “al menos uno”.']],
        notas: '<p>Alternativa válida: una relación ternaria ASISTENTE–EVENTO–ZONA. Pero como la boleta tiene número único propio, modelarla como entidad es más claro.</p>',
      },
      {
        tipo: 'html', titulo: 'Autoevaluación y siguientes pasos', corto: 'Autoevaluación',
        html: `<p class="lead">Marca mentalmente cada afirmación. Si alguna no es cierta, vuelve al módulo indicado.</p>
          ${table(['Puedo…', 'Si no, repasa'], [
            ['Nombrar cada símbolo del diagrama y su significado', '<a href="#/simbologia">2. Simbología</a>'],
            ['Decidir si un sustantivo es entidad o atributo', '<a href="#/entidades/1">3. Entidades</a>'],
            ['Clasificar atributos (compuesto, multivaluado, derivado, clave)', '<a href="#/atributos">4. Atributos</a>'],
            ['Encontrar relaciones y su grado', '<a href="#/relaciones">5. Relaciones</a>'],
            ['Obtener la cardinalidad con el método de las dos preguntas', '<a href="#/cardinalidad">6. Cardinalidad</a>'],
            ['Distinguir participación de cardinalidad', '<a href="#/participacion/3">7. Participación</a>'],
            ['Reconocer una entidad débil y dibujar sus 4 elementos', '<a href="#/debiles">8. Entidades débiles</a>'],
            ['Modelar una recursiva con roles', '<a href="#/recursivas">9. Recursivas</a>'],
            ['Decidir si usar generalización y con qué restricciones', '<a href="#/generalizacion">10. Generalización</a>'],
            ['Aplicar los 12 pasos a un enunciado nuevo', '<a href="#/leer">11. Leer un enunciado</a>'],
          ])}
          ${box('sum', '¿Y después del MER?', '<p>El siguiente tema en un curso de bases de datos es la <strong>transformación del MER al modelo relacional</strong> (tablas, claves foráneas) y luego la <strong>normalización</strong>. Todo lo que aprendiste aquí es la base para ambos.</p>')}`,
      },
    ],
  });
})();
