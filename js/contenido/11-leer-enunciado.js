/* Módulo 11 — Cómo leer un enunciado */
(function () {
  const { list, olist, table, box, fig, steps, ent, rel, att } = R;

  const enun = `Una <span class="mark-n">universidad</span> tiene <span class="mark-n">estudiantes</span>. Cada estudiante <span class="mark-v">puede matricularse</span> en <span class="mark-c">varios</span> <span class="mark-n">cursos</span> y cada curso <span class="mark-v">puede tener</span> <span class="mark-c">varios</span> estudiantes.
    De cada estudiante se guarda su <span class="mark-a">código</span>, <span class="mark-a">nombre</span> y <span class="mark-a">correo</span>; de cada curso, su <span class="mark-a">código</span>, <span class="mark-a">nombre</span> y <span class="mark-a">créditos</span>.
    Se registra la <span class="mark-a">nota</span> que obtiene cada estudiante en cada curso.`;

  const finalDg = D.diagram({ w: 640, h: 230, nodes: [
    { id: 'e', t: 'E', l: 'ESTUDIANTE', x: 100, y: 110, attrs: ['*código', 'nombre', 'correo'], side: 'top' },
    { id: 'r', t: 'R', l: 'matricula', x: 320, y: 110, attrs: ['nota'], side: 'bottom' },
    { id: 'c', t: 'E', l: 'CURSO', x: 540, y: 110, attrs: ['*código', 'nombre', 'créditos'], side: 'top' }],
    edges: [{ a: 'e', b: 'r', ca: '(0,N)' }, { a: 'c', b: 'r', ca: '(0,M)' }] });

  const PASOS = [
    ['Identificar sustantivos', 'Subraya todos los sustantivos.', 'Sustantivos = candidatos a entidad o atributo.'],
    ['Encontrar posibles entidades', 'Aplica la prueba: ¿varios datos? ¿muchos ejemplares?', 'Descarta el sistema/organización.'],
    ['Identificar atributos', 'Busca “de cada X se guarda…”.', 'Asigna cada dato a su entidad.'],
    ['Identificar claves', 'Busca código, número, id, documento.', 'Subraya la clave de cada entidad fuerte.'],
    ['Identificar verbos', 'Subraya los verbos que unen dos entidades.', 'Ignora los verbos que solo introducen datos.'],
    ['Convertir verbos en relaciones', 'Un rombo por cada verbo relevante.', 'Nombra con verbo en presente.'],
    ['Determinar cardinalidades', 'Método de las dos preguntas.', '1:1, 1:N, N:M y (mín,máx).'],
    ['Determinar participación', '¿Puede existir un X sin Y?', 'Línea doble si es obligatorio.'],
    ['Revisar entidades débiles', '¿Algo se numera dentro de otra cosa?', 'Rectángulo y rombo dobles.'],
    ['Revisar generalización', '¿Hay “tipos de” con datos propios?', 'Superclase + subclases, d/o, total/parcial.'],
    ['Dibujar el modelo', 'Entidades primero, luego relaciones y atributos.', 'Evita cruces de líneas.'],
    ['Validar el modelo', 'Lee cada relación en voz alta en ambos sentidos.', 'Compara con el enunciado frase por frase.'],
  ];

  MER.add({
    id: 'leer', num: 11, orden: 11, grupo: 'Método de resolución',
    titulo: 'Cómo leer un enunciado', resumen: 'Metodología de 12 pasos para analizar cualquier ejercicio.',
    objetivo: 'Tener un procedimiento fijo que funcione con cualquier enunciado, sin depender de la inspiración.',
    requiere: ['entidades', 'atributos', 'relaciones', 'cardinalidad', 'participacion', 'debiles', 'generalizacion'],
    items: [
      {
        titulo: 'La metodología de 12 pasos', corto: 'Metodología',
        que: '<p>Un <strong>procedimiento ordenado</strong> para convertir cualquier enunciado en un diagrama MER. Cada paso usa lo que aprendiste en un módulo anterior.</p>',
        porque: '<p>Los errores más comunes aparecen al intentar dibujar todo a la vez. Paso a paso, cada decisión es pequeña y verificable.</p>',
        como: table(['#', 'Paso', 'Qué haces', 'Resultado'], PASOS.map((p, i) => [`<strong>${i + 1}</strong>`, `<strong>${p[0]}</strong>`, p[1], p[2]])),
        identificar: box('tip', 'Consejo: usa tres colores', `<p>Al leer el enunciado marca: <span class="mark-n">sustantivos</span> (posibles entidades), <span class="mark-a">datos</span> (atributos) y <span class="mark-v">verbos</span> (relaciones). Las palabras de cantidad en <span class="mark-c">rojo</span>.</p>`),
        error: { mal: '<p>Empezar a dibujar al leer la primera línea.</p>', bien: '<p>Lee el enunciado <strong>completo dos veces</strong> antes de dibujar. Muchas reglas aparecen al final.</p>' },
      },
      {
        titulo: 'Diccionario de palabras clave', corto: 'Palabras clave',
        que: '<p>Las palabras del enunciado que casi siempre indican un elemento concreto del modelo.</p>',
        como: table(['Si lees…', 'Piensa en…', 'Ejemplo'], [
          ['“De cada X se guarda / registra / conoce…”', 'Atributos de X', 'De cada cliente se guarda su nombre'],
          ['“código”, “número”, “identificado por”, “único”', 'Clave primaria', 'identificado por su cédula'],
          ['“uno o varios”, “puede tener varios” (un dato)', 'Atributo multivaluado', 'uno o varios teléfonos'],
          ['“se desea conocer / calcular”', 'Atributo derivado', 'se desea conocer la edad'],
          ['“(calle, número, ciudad)”', 'Atributo compuesto', 'dirección (calle, ciudad)'],
          ['Verbo entre dos entidades', 'Relación', 'el médico atiende pacientes'],
          ['“cada”, “un”, “único”, “solo uno”', 'Máximo 1', 'cada pedido es de un cliente'],
          ['“varios”, “muchos”, plural', 'Máximo N', 'tiene varios empleados'],
          ['“debe”, “todo”, “siempre”, “al menos uno”', 'Participación total / mínimo 1', 'todo empleado debe pertenecer…'],
          ['“puede”, “algunos”, “opcionalmente”', 'Participación parcial / mínimo 0', 'puede tener un tutor'],
          ['“numerado dentro de”, “para cada … se numeran”', 'Entidad débil', 'las habitaciones se numeran por hotel'],
          ['“tipos de”, “pueden ser A o B”, “se clasifican”', 'Generalización', 'los empleados pueden ser…'],
          ['“o ambos”, “a la vez”', 'Solapada (o)', 'puede ser estudiante y empleado a la vez'],
          ['“uno de los dos”, “no puede ser ambos”', 'Disjunta (d)', 'o es efectivo o es tarjeta'],
          ['“otro(s) X” (mismo sustantivo)', 'Relación recursiva', 'un empleado supervisa a otros empleados'],
          ['Dato que depende de dos entidades', 'Atributo de relación', 'la nota del estudiante en el curso'],
        ]),
        error: { mal: '<p>Aplicar el diccionario de forma mecánica.</p>', bien: '<p>Las palabras son <strong>pistas</strong>, no reglas absolutas. Confirma siempre con la prueba del concepto correspondiente.</p>' },
        ejercicio: {
          enunciado: 'Clasifica usando el diccionario: “Todo vuelo debe tener un piloto. Los pilotos pueden ser comandantes o copilotos, pero no ambos. De cada piloto se desea conocer sus años de experiencia.”',
          respuesta: list(['“Todo vuelo debe tener” → participación total de VUELO.', '“un piloto” → máximo 1 piloto por vuelo.', '“pueden ser comandantes o copilotos” → especialización de PILOTO.', '“pero no ambos” → disjunta (d).', '“se desea conocer sus años de experiencia” → atributo derivado.']),
          explicacion: '<p>Cada frase activó una entrada del diccionario. Luego se verifica con el sentido del negocio.</p>',
        },
      },
      {
        titulo: 'Ejemplo guiado: la universidad', corto: 'Ejemplo guiado', tipo: 'html',
        html: () => `<p class="lead">Aplicaremos los 12 pasos a un enunciado sencillo. Pulsa <strong>“Siguiente paso”</strong> para avanzar. Antes de cada paso, intenta adivinar el resultado.</p>
          <section class="blk blk-q"><h3 class="blk-h"><span class="blk-i">📄</span>Enunciado</h3><div class="blk-b"><div class="stmt">${enun}</div></div></section>
          ${steps([
            { t: 'Identificar sustantivos', html: `<p>universidad, estudiante(s), curso(s), código, nombre, correo, créditos, nota.</p>` },
            { t: 'Encontrar posibles entidades', html: table(['Sustantivo', 'Decisión', 'Por qué'], [['universidad', '✗', 'Es el sistema: solo existe una.'], ['estudiante', `✓ ${ent('ESTUDIANTE')}`, 'Muchos, con varios datos.'], ['curso', `✓ ${ent('CURSO')}`, 'Muchos, con varios datos.'], ['código, nombre, correo, créditos, nota', '✗', 'Son datos → atributos.']]) },
            { t: 'Identificar atributos', html: `<p>${ent('ESTUDIANTE')}: código, nombre, correo · ${ent('CURSO')}: código, nombre, créditos · <strong>nota</strong>: ¿de quién es? Un estudiante tiene una nota <em>por cada curso</em>, y un curso tiene notas de muchos estudiantes → es de la <strong>relación</strong>.</p>` },
            { t: 'Identificar claves', html: `<p>ESTUDIANTE → ${att('<u>código</u>')} · CURSO → ${att('<u>código</u>')}. Nombre y correo no sirven: nombre se repite y correo puede cambiar.</p>` },
            { t: 'Identificar verbos', html: '<p>“tiene” (universidad–estudiantes): la universidad no es entidad → se descarta. “puede matricularse en” (estudiante–curso) ✓. “puede tener” (curso–estudiantes): es la <strong>misma</strong> relación leída al revés.</p>' },
            { t: 'Convertir verbos en relaciones', html: `<p>Una sola relación: ${ent('ESTUDIANTE')} — ${rel('matricula')} — ${ent('CURSO')}, con el atributo ${att('nota')}.</p>` },
            { t: 'Determinar cardinalidades', html: olist(['Un estudiante → “varios cursos” → máximo N.', 'Un curso → “varios estudiantes” → máximo M.', 'Resultado: <strong>N:M</strong>.']) },
            { t: 'Determinar participación', html: '<p>“<strong>puede</strong> matricularse” → un estudiante puede no tener cursos (mínimo 0). “<strong>puede</strong> tener” → un curso puede no tener estudiantes (mínimo 0). Ambas <strong>parciales</strong>: líneas simples, (0,N) y (0,M).</p>' },
            { t: 'Revisar entidades débiles', html: '<p>¿Algo se numera dentro de otra cosa? No: estudiante y curso tienen código propio. <strong>No hay débiles.</strong></p>' },
            { t: 'Revisar generalización', html: '<p>¿Se mencionan “tipos de” estudiantes o cursos con datos propios? No. <strong>No hay generalización.</strong></p>' },
            { t: 'Dibujar el modelo', html: fig(finalDg) },
            { t: 'Validar el modelo', html: list(['“Un estudiante se matricula en 0 a N cursos” ✓ (el enunciado dice “puede… varios”).', '“Un curso tiene 0 a M estudiantes” ✓.', '“La nota es de un estudiante en un curso” ✓.', 'Todos los datos pedidos aparecen; no sobra ninguno ✓.']) },
          ], { next: 'Siguiente paso →' })}`,
      },
      {
        titulo: 'Practica tú: la clínica', corto: 'Practica tú', tipo: 'caso',
        contexto: 'Ahora hazlo tú. Cada etapa agrupa uno o varios de los 12 pasos.',
        enunciado: `Una clínica desea registrar a sus <strong>pacientes</strong> (número de historia, nombre, fecha de nacimiento y uno o varios teléfonos) y a sus <strong>médicos</strong> (número de registro, nombre, especialidad).
          Cada paciente tiene asignado un único médico de cabecera, y un médico puede ser médico de cabecera de muchos pacientes. Todo paciente debe tener médico de cabecera.
          Además, los pacientes solicitan <strong>citas</strong>. Cada cita se numera de forma consecutiva para cada paciente (cita 1, 2, 3…) y tiene fecha y motivo. Se desea conocer la edad de cada paciente.`,
        etapas: [
          { t: 'Pasos 1–2: sustantivos y entidades', pregunta: '¿Qué entidades hay? ¿Cuáles sustantivos descartas?', resp: `<p>${ent('PACIENTE')} ${ent('MÉDICO')} ${ent('CITA')}. Se descarta “clínica” (el sistema) y los datos (nombre, teléfono…).</p>` },
          { t: 'Pasos 3–4: atributos y claves', pregunta: 'Lista los atributos de cada entidad, indica su tipo y la clave.', resp: table(['Entidad', 'Atributos'], [['PACIENTE', '<u>nro_historia</u>, nombre, fecha_nac, {teléfono} (multivaluado), /edad (derivado)'], ['MÉDICO', '<u>nro_registro</u>, nombre, especialidad'], ['CITA', '<u style="text-decoration-style:dashed">nro_cita</u> (clave parcial), fecha, motivo']]) },
          { t: 'Pasos 5–6: verbos y relaciones', pregunta: '¿Qué relaciones hay y entre qué entidades?', resp: list([`${rel('cabecera')} (MÉDICO–PACIENTE): “tiene asignado un médico de cabecera”.`, `${rel('solicita')} (PACIENTE–CITA): “los pacientes solicitan citas”.`]) },
          { t: 'Pasos 7–8: cardinalidad y participación', pregunta: 'Aplica el método de las dos preguntas a cada relación.', resp: table(['Relación', 'Cardinalidad', 'Participación'], [['cabecera', 'MÉDICO 1 : N PACIENTE', 'PACIENTE total (“todo paciente debe”), MÉDICO parcial'], ['solicita', 'PACIENTE 1 : N CITA', 'CITA total (no existe cita sin paciente), PACIENTE parcial']]) },
          { t: 'Pasos 9–10: débiles y generalización', pregunta: '¿Hay entidades débiles? ¿Generalización?', resp: '<p><strong>CITA es débil</strong> de PACIENTE: “se numera de forma consecutiva para cada paciente”. La relación <em>solicita</em> es identificadora (rombo doble). No hay generalización: no se mencionan tipos.</p>' },
        ],
        diagrama: D.diagram({ w: 720, h: 330, nodes: [
          { id: 'm', t: 'E', l: 'MÉDICO', x: 110, y: 110, attrs: ['*nro_registro', 'nombre', 'especialidad'], side: 'top' },
          { id: 'rc', t: 'R', l: 'cabecera', x: 330, y: 110 },
          { id: 'p', t: 'E', l: 'PACIENTE', x: 560, y: 110, attrs: ['*nro_historia', 'nombre', 'fecha_nac', '{teléfono}', '/edad'], side: 'top' },
          { id: 'rs', t: 'R', l: 'solicita', x: 560, y: 205, ident: true },
          { id: 'c', t: 'E', l: 'CITA', x: 560, y: 290, weak: true, attrs: ['~nro_cita', 'fecha', 'motivo'], side: 'left' }],
          edges: [{ a: 'm', b: 'rc', ca: '1' }, { a: 'p', b: 'rc', ca: 'N', total: true }, { a: 'p', b: 'rs', ca: '1' }, { a: 'c', b: 'rs', ca: 'N', total: true }] }),
        validacion: ['Un médico es de cabecera de N pacientes; un paciente tiene 1 médico de cabecera ✓.', 'Todo paciente tiene médico (línea doble en PACIENTE) ✓.', 'Cita débil: se identifica por (nro_historia, nro_cita) ✓.', 'Teléfonos multivaluados y edad derivada ✓.'],
      },
    ],
  });
})();
