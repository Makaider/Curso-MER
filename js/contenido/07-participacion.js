/* Módulo 7 — Participación */
(function () {
  const { list, olist, table, box, fig, cmp, ent, rel } = R;
  const bin = (a, r, b, ca, cb, ta, tb) => D.diagram({ w: 580, h: 110, nodes: [
    { id: 'a', t: 'E', l: a, x: 95, y: 55 }, { id: 'r', t: 'R', l: r, x: 290, y: 55 }, { id: 'b', t: 'E', l: b, x: 485, y: 55 }],
    edges: [{ a: 'a', b: 'r', ca, total: ta }, { a: 'b', b: 'r', ca: cb, total: tb }] });

  MER.add({
    id: 'participacion', num: 7, orden: 7, grupo: 'Conceptos',
    titulo: 'Participación', resumen: 'Participación total (obligatoria) y parcial (opcional), y su diferencia con la cardinalidad.',
    objetivo: 'Decidir si cada entidad está obligada a participar en una relación y dibujarlo con línea simple o doble.',
    requiere: ['cardinalidad'],
    items: [
      {
        titulo: '¿Qué es la participación?', corto: 'Qué es',
        que: '<p>La <strong>participación</strong> indica si <strong>todos</strong> los ejemplares de una entidad <strong>deben</strong> estar en la relación o si algunos pueden quedar fuera.</p>' +
          table(['Tipo', 'Significa', 'Símbolo'], [['<strong>Total</strong> (obligatoria)', 'Todos los ejemplares participan', 'Línea doble'], ['<strong>Parcial</strong> (opcional)', 'Algunos pueden no participar', 'Línea simple']]),
        porque: '<p>Expresa reglas del negocio: “no puede existir un pedido sin cliente”, “puede haber clientes que aún no compran”.</p>',
        como: '<p>Se analiza <strong>por separado para cada entidad</strong> de la relación: una puede ser total y la otra parcial.</p>',
        identificar: '<p>Pregunta: <strong>“¿Puede existir un ___ que no ___?”</strong> Si la respuesta es NO → total. Si es SÍ → parcial.</p>',
        ejemplo: {
          cotidiano: '<p>Todo estudiante matriculado debe pertenecer a un programa (total). No todo programa tiene estudiantes en su primer semestre de apertura (parcial).</p>',
          bd: fig(bin('CLIENTE', 'realiza', 'PEDIDO', '1', 'N', false, true), '¿Puede existir un pedido sin cliente? No → total (línea doble). ¿Un cliente sin pedidos? Sí → parcial.'),
        },
        grafico: '<p>Línea <strong>doble</strong> entre la entidad obligada y el rombo; línea simple si es opcional.</p>',
        error: { mal: '<p>Poner la línea doble del lado de la entidad “importante”.</p>', bien: '<p>La línea doble va del lado de la entidad cuyos ejemplares <strong>están obligados</strong> a participar, sea cual sea su importancia.</p>' },
        ejercicio: {
          enunciado: '“Todo empleado debe estar asignado a un departamento. Puede haber departamentos recién creados sin empleados.” ¿Qué participación tiene cada entidad?',
          respuesta: fig(bin('EMPLEADO', 'trabaja_en', 'DEPARTAMENTO', 'N', '1', true, false)),
          explicacion: list(['¿Puede existir un empleado sin departamento? No → EMPLEADO total (doble).', '¿Puede existir un departamento sin empleados? Sí → DEPARTAMENTO parcial (simple).']),
        },
      },
      {
        titulo: 'Participación total', corto: 'Total',
        que: '<p><strong>Todos</strong> los ejemplares de la entidad participan <strong>al menos una vez</strong> en la relación. También se llama <em>dependencia de existencia</em>.</p>',
        porque: '<p>Obliga al sistema a no guardar un dato “huérfano”: una línea de factura sin factura, un pedido sin cliente.</p>',
        como: '<p>Al crear un ejemplar, obligatoriamente se debe indicar con quién se relaciona.</p>',
        identificar: list(['“todo”, “cada … debe”, “obligatoriamente”, “siempre”, “al menos uno”.', 'Entidades débiles: siempre total en su relación identificadora.']),
        ejemplo: { cotidiano: '<p>Todo hijo tiene una madre biológica.</p>', bd: fig(bin('FACTURA', 'contiene', 'LÍNEA', '1', 'N', false, true), 'Toda línea pertenece a una factura.') },
        grafico: '<p>Línea <strong>doble</strong>.</p>',
        cuando: { si: ['El enunciado usa palabras de obligación.', 'No tiene sentido que el ejemplar exista sin la relación.'], no: ['Hay casos, aunque sean raros o temporales, de ejemplares sin relación.'] },
        error: { mal: '<p>Marcar como total a un cliente respecto a pedidos (“todo cliente compra”).</p>', bien: '<p>Normalmente un cliente se registra antes de comprar: parcial, salvo que el enunciado diga lo contrario.</p>' },
        ejercicio: {
          enunciado: '“Cada vuelo debe ser operado por un avión.” ¿Qué entidad tiene participación total en <em>opera</em>?',
          respuesta: '<p><strong>VUELO</strong>.</p>',
          explicacion: '<p>No puede existir un vuelo sin avión. Nada dice que todo avión deba operar vuelos (uno nuevo puede no haber volado), así que AVIÓN es parcial.</p>',
        },
      },
      {
        titulo: 'Participación parcial', corto: 'Parcial',
        que: '<p><strong>Algunos</strong> ejemplares de la entidad pueden <strong>no participar</strong> en la relación.</p>',
        porque: '<p>Refleja situaciones opcionales o temporales: clientes sin compras, empleados sin proyectos.</p>',
        como: '<p>El ejemplar puede crearse y existir sin relacionarse.</p>',
        identificar: list(['“puede”, “algunos”, “opcionalmente”, “no necesariamente”.', 'Si el enunciado no dice nada, suele asumirse parcial (y se anota el supuesto).']),
        ejemplo: { cotidiano: '<p>No todos los estudiantes tienen beca.</p>', bd: fig(bin('EMPLEADO', 'participa', 'PROYECTO', 'N', 'M', false, false)) },
        grafico: '<p>Línea <strong>simple</strong>.</p>',
        cuando: { si: ['Existe algún ejemplar que no se relaciona.'], no: ['El enunciado exige la relación para todos.'] },
        error: { mal: '<p>Suponer que “parcial” significa “participa poco”.</p>', bien: '<p>Parcial significa que <strong>puede no participar</strong>; los que sí participan pueden hacerlo muchas veces.</p>' },
        ejercicio: {
          enunciado: '“Los estudiantes pueden pertenecer a grupos de investigación.” ¿Participación de ESTUDIANTE?',
          respuesta: '<p><strong>Parcial</strong>.</p>',
          explicacion: '<p>“pueden” indica que es opcional: hay estudiantes que no pertenecen a ningún grupo.</p>',
        },
      },
      {
        titulo: 'Participación vs. cardinalidad', corto: 'Participación vs. cardinalidad',
        que: table(['', 'Cardinalidad máxima', 'Participación (cardinalidad mínima)'], [
          ['Pregunta', '¿Con <strong>cuántos</strong> como máximo?', '¿<strong>Debe</strong> participar?'], ['Valores', '1 o N', 'total u opcional (mín 1 o 0)'], ['Símbolo', '1, N, M', 'línea doble o simple'],
        ]),
        porque: '<p>Son dos preguntas independientes: una relación puede ser 1:N con cualquier combinación de participaciones.</p>',
        como: `<p><strong>Conexión con la notación (mín,máx)</strong> en la convención de este curso:</p>
          ${fig(bin('EMPLEADO', 'trabaja_en', 'DEPARTAMENTO', '(0,N)', '(1,1)', true, false))}
          ${olist(['Pregunta desde EMPLEADO: “un empleado trabaja en (1,1) departamentos” → se escribe junto a DEPARTAMENTO.', 'Como ese mínimo es 1, <strong>todo empleado</strong> participa → la línea <strong>doble</strong> va del lado de EMPLEADO.', 'Regla: <strong>mínimo 1 escrito junto a B ⇔ línea doble del lado de A</strong>.'])}
          ${box('warn', 'Atención', 'Por eso la línea doble y el “1” mínimo aparecen en lados opuestos. No es un error: la línea describe a la entidad que se obliga, y el número describe cuántos ejemplares de la otra entidad le corresponden.')}`,
        identificar: '<p>Para cada entidad responde dos cosas: <strong>¿cuántos como máximo?</strong> (cardinalidad) y <strong>¿es obligatorio?</strong> (participación).</p>',
        ejemplo: {
          cotidiano: '<p>“Todo estudiante debe tener un tutor (total), y un tutor puede tener varios estudiantes (1:N)”.</p>',
          bd: table(['Caso', 'Cardinalidad', 'Participación'], [['CLIENTE–PEDIDO', '1:N', 'CLIENTE parcial, PEDIDO total'], ['EMPLEADO–PROYECTO', 'N:M', 'ambas parciales'], ['PAÍS–CAPITAL', '1:1', 'ambas totales']]),
        },
        error: { mal: '<p>Decir “la relación es total 1:N” como si fuera una sola propiedad.</p>', bien: '<p>La participación es <strong>de cada entidad</strong>. Di: “1:N; PEDIDO participa totalmente y CLIENTE parcialmente”.</p>' },
        ejercicio: [
          {
            enunciado: '“Un profesor puede dictar varias asignaturas o ninguna (si está de licencia). Toda asignatura es dictada por exactamente un profesor.” Da la cardinalidad y la participación.',
            respuesta: fig(bin('PROFESOR', 'dicta', 'ASIGNATURA', '(1,1)', '(0,N)', false, true)),
            explicacion: olist(['Cardinalidad 1:N (profesor 1, asignatura N).', 'ASIGNATURA total (toda asignatura tiene profesor) → línea doble junto a ASIGNATURA.', 'PROFESOR parcial (puede no dictar) → línea simple.']),
          },
          {
            enunciado: '“Cada país tiene exactamente una capital y cada capital pertenece a un país.”',
            respuesta: fig(bin('PAÍS', 'tiene', 'CAPITAL', '(1,1)', '(1,1)', true, true)),
            explicacion: '<p>1:1 con participación total en ambos lados: no hay país sin capital ni capital sin país.</p>',
          },
        ],
      },
    ],
  });
})();
