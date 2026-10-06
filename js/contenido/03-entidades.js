/* Módulo 3 — Entidades */
(function () {
  const { list, olist, table, box, fig, cmp, ent, rel, att } = R;

  const weakDg = D.diagram({ w: 600, h: 160, nodes: [
    { id: 'e', t: 'E', l: 'EDIFICIO', x: 90, y: 110, attrs: ['*código', 'nombre'], side: 'top' },
    { id: 'r', t: 'R', l: 'contiene', x: 300, y: 110, ident: true },
    { id: 'a', t: 'E', l: 'AULA', x: 500, y: 110, weak: true, attrs: ['~número', 'capacidad'], side: 'top' }],
    edges: [{ a: 'e', b: 'r', ca: '1' }, { a: 'a', b: 'r', ca: 'N', total: true }] });

  MER.add({
    id: 'entidades', num: 3, orden: 3, grupo: 'Conceptos',
    titulo: 'Entidades', resumen: 'Qué es una entidad, cómo encontrarla y la diferencia entre fuerte y débil.',
    objetivo: 'Encontrar las entidades de cualquier enunciado y decidir si son fuertes o débiles.',
    requiere: ['fundamentos', 'simbologia'],
    items: [
      {
        titulo: '¿Qué es una entidad?', corto: 'Qué es',
        que: `<p>Una <strong>entidad</strong> es un <strong>tipo de objeto</strong> (persona, cosa, lugar, evento o concepto) del que el sistema necesita <strong>guardar información</strong> y del que existen <strong>muchos ejemplares</strong> distinguibles entre sí.</p>
          ${box('key', 'Entidad vs. ejemplar (ocurrencia o instancia)', `<p>${ent('ESTUDIANTE')} es la <strong>entidad</strong> (el molde). “Ana Ruiz, código 1001” es un <strong>ejemplar</strong> (un caso concreto). El diagrama muestra entidades, nunca ejemplares.</p>`)}`,
        porque: '<p>Las entidades son los “cajones” donde se guardarán los datos. Si no identificas bien las entidades, todo lo demás (atributos, relaciones) queda mal.</p>',
        como: table(['Tipo', 'Ejemplos'], [
          ['Personas', 'CLIENTE, EMPLEADO, PACIENTE, ESTUDIANTE'], ['Cosas físicas', 'PRODUCTO, LIBRO, VEHÍCULO, EQUIPO'], ['Lugares', 'SUCURSAL, BODEGA, CIUDAD, AULA'],
          ['Eventos', 'PEDIDO, CITA, VENTA, PRÉSTAMO, PARTIDO'], ['Conceptos', 'CURSO, CATEGORÍA, CUENTA, PROYECTO'],
        ]),
        identificar: '<p>Lo verás en detalle en el siguiente tema. En resumen: busca <strong>sustantivos</strong> de los que se guarden <strong>varios datos</strong>.</p>',
        ejemplo: {
          cotidiano: '<p>En tu colegio: <strong>estudiantes</strong>, <strong>profesores</strong>, <strong>salones</strong>, <strong>materias</strong>. De cada uno se sabe algo (nombre, número, horario).</p>',
          bd: fig(D.diagram({ w: 520, h: 150, nodes: [{ id: 'a', t: 'E', l: 'ESTUDIANTE', x: 260, y: 110, attrs: ['*código', 'nombre', 'correo', 'carrera'], side: 'top' }] }), 'Una entidad con sus atributos.'),
        },
        grafico: `<p>Un <strong>rectángulo</strong> con el nombre en <strong>singular</strong> y en MAYÚSCULAS.</p>${cmp('<p>ESTUDIANTES · Ana · la tabla estudiante</p>', `<p>${ent('ESTUDIANTE')}</p>`, 'Nombres incorrectos', 'Nombre correcto')}`,
        error: {
          mal: '<p>Dibujar como entidad un ejemplar concreto: <code>ANA</code>, <code>MATEMÁTICAS</code>, <code>BOGOTÁ</code>.</p>',
          bien: '<p>La entidad es el tipo general: ESTUDIANTE, ASIGNATURA, CIUDAD. Ana, Matemáticas y Bogotá son <strong>datos</strong> que se guardarán en ellas.</p>',
        },
        ejercicio: {
          enunciado: '¿Cuáles son entidades y cuáles ejemplares? Toyota Corolla ABC123 · VEHÍCULO · Dr. Pérez · MÉDICO · CITA · la cita del lunes 3.',
          respuesta: '<p>Entidades: VEHÍCULO, MÉDICO, CITA. Ejemplares: Toyota Corolla ABC123, Dr. Pérez, la cita del lunes 3.</p>',
          explicacion: '<p>Cada ejemplar pertenece a una entidad: el Corolla es un VEHÍCULO, el Dr. Pérez es un MÉDICO y la cita del lunes es una CITA.</p>',
        },
      },
      {
        titulo: 'Cómo identificar una entidad', corto: 'Cómo identificarla',
        que: '<p>Un método para decidir si un sustantivo del enunciado debe ser una entidad.</p>',
        porque: '<p>Los enunciados tienen muchos sustantivos, pero solo algunos son entidades. Los otros suelen ser atributos o sobran.</p>',
        como: `<p>Aplica esta <strong>prueba de 4 preguntas</strong> a cada sustantivo:</p>
          ${table(['#', 'Pregunta', 'Si la respuesta es “sí”…'], [
            ['1', '¿Se guardan <strong>varios datos</strong> sobre él?', 'Probable entidad.'],
            ['2', '¿Existen <strong>muchos ejemplares</strong> distintos?', 'Probable entidad.'],
            ['3', '¿Se puede <strong>identificar</strong> cada ejemplar (código, número, nombre único)?', 'Entidad fuerte (si no, quizá débil).'],
            ['4', '¿Es solo una <strong>característica</strong> de otra cosa?', 'NO es entidad: es atributo.'],
          ])}
          ${box('warn', 'Descarta también', list(['El <strong>propio sistema</strong> o la organización cuando es única: “La empresa X desea un sistema…” → la empresa normalmente no es entidad.', '<strong>Usuarios del sistema</strong> que no guardan datos (“el operador consulta…”).', '<strong>Sinónimos</strong>: “cliente” y “comprador” pueden ser la misma entidad.']))}`,
        identificar: `<p>Subraya los sustantivos y pásalos por la prueba:</p>
          <div class="stmt">Una <span class="mark-n">biblioteca</span> presta <span class="mark-n">libros</span> a sus <span class="mark-n">socios</span>. De cada libro se guarda el <span class="mark-n">título</span> y el <span class="mark-n">autor</span>; de cada socio, su <span class="mark-n">nombre</span> y <span class="mark-n">teléfono</span>.</div>
          ${table(['Sustantivo', '¿Varios datos?', '¿Muchos?', 'Decisión'], [
            ['biblioteca', 'No se piden', 'Solo una', '✗ Es el sistema'], ['libro', 'Sí (título, autor)', 'Sí', '✓ Entidad'], ['socio', 'Sí (nombre, teléfono)', 'Sí', '✓ Entidad'],
            ['título, nombre, teléfono', '—', '—', '✗ Atributos'], ['autor', 'Solo el nombre', '—', 'Atributo (salvo que se pidan más datos del autor)'],
          ])}`,
        ejemplo: {
          cotidiano: '<p>En una lista de mercado, “manzana” es una cosa, pero “roja” es una característica de la manzana. Las cosas son candidatas a entidad; las características, a atributo.</p>',
          bd: '<p>“De cada <strong>autor</strong> se guarda nombre, nacionalidad y fecha de nacimiento” → ahora AUTOR sí es entidad, porque tiene sus propios datos.</p>',
        },
        cuando: { si: ['El sustantivo tiene datos propios.', 'Participa en acciones con otros sustantivos (verbos).'], no: ['Es un valor (“rojo”, “Bogotá”) o una característica.', 'Es el nombre del sistema u organización única.'] },
        error: {
          mal: `<p>Convertir cada sustantivo en entidad: ${ent('TÍTULO')} ${ent('NOMBRE')} ${ent('TELÉFONO')}.</p>`,
          bien: `<p>${ent('LIBRO')} con ${att('título')} y ${ent('SOCIO')} con ${att('nombre')} ${att('teléfono')}.</p>`,
          porque: 'Si un sustantivo solo tiene un valor y describe a otro, es atributo.',
        },
        ejercicio: {
          enunciado: '“Una aerolínea registra sus <em>vuelos</em>, indicando <em>origen</em>, <em>destino</em> y <em>fecha</em>. Cada vuelo es operado por un <em>avión</em>, del cual se conoce <em>matrícula</em>, <em>modelo</em> y <em>capacidad</em>. Los <em>pasajeros</em> (con <em>pasaporte</em> y <em>nombre</em>) compran <em>tiquetes</em>.” Identifica las entidades.',
          respuesta: `<p>${ent('VUELO')} ${ent('AVIÓN')} ${ent('PASAJERO')} ${ent('TIQUETE')}</p>`,
          explicacion: list(['Aerolínea: es la organización dueña del sistema → no.', 'Origen, destino, fecha → atributos de VUELO.', 'Matrícula, modelo, capacidad → atributos de AVIÓN.', 'Pasaporte, nombre → atributos de PASAJERO.', 'TIQUETE: evento del que existen muchos y une pasajero con vuelo → entidad.']),
        },
      },
      {
        titulo: 'Entidad fuerte', corto: 'Entidad fuerte',
        que: '<p>Una <strong>entidad fuerte</strong> (o regular) es la que <strong>existe por sí misma</strong> y tiene un atributo propio que identifica a cada ejemplar (su clave primaria).</p>',
        porque: '<p>La mayoría de entidades son fuertes. Son la base del modelo: las demás dependen de ellas.</p>',
        como: '<p>Tiene una clave propia (subrayada). Para saber quién es un cliente basta su cédula; no necesitas saber nada más.</p>',
        identificar: list(['Tiene un <strong>código, número o identificador propio</strong> que no se repite en todo el sistema.', 'Tiene sentido por sí misma aunque no se relacione con nada.']),
        ejemplo: {
          cotidiano: '<p>Una persona tiene su <strong>documento de identidad</strong>: la identifica en todo el país, sin necesitar a nadie más.</p>',
          bd: fig(D.diagram({ w: 520, h: 140, nodes: [{ id: 'a', t: 'E', l: 'PRODUCTO', x: 260, y: 105, attrs: ['*código_barras', 'nombre', 'precio'], side: 'top' }] })),
        },
        grafico: '<p><strong>Rectángulo simple</strong> y una clave <strong>subrayada con línea continua</strong>.</p>',
        cuando: { si: ['La cosa tiene identificador propio y único.'], no: ['Su número se repite en distintos “padres” (habitación 101 en cada hotel) → débil.'] },
        error: {
          mal: '<p>Pensar que una entidad es débil porque “pertenece” a otra. Ej.: “un auto pertenece a una persona, entonces AUTO es débil”.</p>',
          bien: '<p>AUTO tiene <strong>placa</strong>, que es única en todo el país → es <strong>fuerte</strong>. Pertenecer no es lo mismo que depender para identificarse.</p>',
        },
        ejercicio: {
          enunciado: '¿Son fuertes? a) EMPLEADO con código de empleado. b) CUOTA de un préstamo, numeradas 1, 2, 3… en cada préstamo. c) FACTURA con número consecutivo único de la empresa.',
          respuesta: '<p>a) Fuerte · b) Débil · c) Fuerte</p>',
          explicacion: '<p>En b) la cuota “3” existe en todos los préstamos: para saber de cuál hablamos necesitamos el número del préstamo. En a) y c) el identificador es único por sí solo.</p>',
        },
      },
      {
        titulo: 'Entidad débil', corto: 'Entidad débil',
        intro: 'Aquí verás la idea básica. El módulo 8 profundiza en las entidades débiles.',
        que: '<p>Una <strong>entidad débil</strong> es la que <strong>no puede identificarse por sí sola</strong>: necesita la clave de otra entidad (llamada <strong>propietaria</strong> o identificadora).</p>',
        porque: '<p>Porque en la realidad hay cosas que se numeran <strong>dentro</strong> de otras. Sin la propietaria, sus números se repiten y no sabríamos de cuál hablamos.</p>',
        como: `<p>Su identificador completo se forma así:</p><div class="stmt"><strong>clave de la propietaria + clave parcial de la débil</strong></div><p>Ejemplo: aula “201” del edificio “B” → (B, 201).</p>`,
        identificar: list(['El enunciado dice que se numera “dentro de”, “para cada”, “de cada”…', 'Su número se <strong>repite</strong> en diferentes propietarios.', 'Si la propietaria se elimina, la débil deja de tener sentido.']),
        ejemplo: {
          cotidiano: '<p>El <strong>apartamento 302</strong> existe en muchos edificios. Para enviar una carta necesitas “Edificio Los Pinos, apto 302”.</p>',
          bd: fig(weakDg, 'AULA depende de EDIFICIO: la aula 201 existe en varios edificios.'),
        },
        grafico: list(['<strong>Rectángulo doble</strong> para la entidad débil.', '<strong>Rombo doble</strong> para la relación con la propietaria.', '<strong>Línea doble</strong> del lado de la débil (siempre participa).', '<strong>Clave parcial</strong> subrayada con línea punteada.']),
        cuando: { si: ['La cosa se numera dentro de otra y no tiene código global.'], no: ['La cosa tiene su propio código único, aunque siempre esté asociada a otra.'] },
        error: {
          mal: '<p>Dibujar AULA con rectángulo simple y <code>número</code> subrayado como clave primaria.</p>',
          bien: '<p>“número” no es único (hay aula 201 en cada edificio). AULA debe ser débil con clave parcial “número”.</p>',
        },
        ejercicio: {
          enunciado: 'Un banco tiene cuentas (número de cuenta único). Cada cuenta genera movimientos, numerados 1, 2, 3… dentro de cada cuenta. ¿Qué entidad es débil y cuál es su propietaria?',
          respuesta: '<p>MOVIMIENTO es débil; su propietaria es CUENTA. Clave parcial: número de movimiento.</p>',
          explicacion: '<p>El movimiento “1” existe en todas las cuentas. Solo (número_cuenta, número_movimiento) identifica un movimiento concreto.</p>',
        },
      },
      {
        titulo: 'Fuerte vs. débil: diferencias y cuándo usar cada una', corto: 'Fuerte vs. débil',
        que: table(['Característica', 'Entidad fuerte', 'Entidad débil'], [
          ['Identificación', 'Por sí misma (clave primaria propia)', 'Necesita la clave de la propietaria'],
          ['Clave', 'Clave primaria (subrayado continuo)', 'Clave parcial (subrayado punteado)'],
          ['Símbolo', 'Rectángulo simple', 'Rectángulo doble'],
          ['Relación con la que se identifica', '—', 'Rombo doble (identificadora)'],
          ['Participación', 'Puede ser total o parcial', 'Siempre total en la relación identificadora'],
          ['Existencia', 'Independiente', 'Dependiente: sin propietaria no existe'],
        ]),
        como: `<p>Pregunta clave:</p><div class="stmt"><strong>“Si solo conozco el identificador de esta cosa, ¿sé exactamente de cuál se trata?”</strong></div>
          ${list(['<strong>Sí</strong> → fuerte.', '<strong>No, necesito saber a qué otra cosa pertenece</strong> → débil.'])}`,
        identificar: fig(D.diagram({ w: 640, h: 170, nodes: [
          { id: 'l', t: 'E', l: 'LIBRO', x: 90, y: 120, attrs: ['*isbn', 'título'], side: 'top' }, { id: 'r', t: 'R', l: 'tiene', x: 300, y: 120, ident: true },
          { id: 'e', t: 'E', l: 'EJEMPLAR', x: 520, y: 120, weak: true, attrs: ['~nro_copia', 'estado'], side: 'top' }],
          edges: [{ a: 'l', b: 'r', ca: '1' }, { a: 'e', b: 'r', ca: 'N', total: true }] }), 'Una biblioteca tiene la copia 1, 2 y 3 de cada libro: EJEMPLAR es débil.'),
        ejemplo: {
          cotidiano: '<p>Tu documento de identidad (fuerte) vs. “el asiento 12” de un bus (débil: existe en todos los buses).</p>',
          bd: '<p>PEDIDO (número único) → fuerte. LÍNEA DE PEDIDO (línea 1, 2, 3 de cada pedido) → débil de PEDIDO.</p>',
        },
        cuando: { si: ['Débil: “para cada X se numeran sus Y”.'], no: ['Débil: solo porque Y “pertenece” a X pero Y tiene código propio.'] },
        error: {
          mal: '<p>Hacer débil toda entidad que tenga participación obligatoria (“todo empleado debe tener departamento, entonces EMPLEADO es débil”).</p>',
          bien: '<p>La obligatoriedad se expresa con <strong>línea doble</strong>. Ser débil depende de la <strong>identificación</strong>, no de la obligatoriedad.</p>',
        },
        ejercicio: {
          enunciado: 'Clasifica como fuerte o débil: a) CAPÍTULO de un libro (capítulo 1, 2…). b) PASAJERO con pasaporte. c) HABITACIÓN de hotel. d) FACTURA con número único. e) EPISODIO de una serie (T1E1, T1E2…).',
          respuesta: '<p>a) Débil (de LIBRO) · b) Fuerte · c) Débil (de HOTEL) · d) Fuerte · e) Débil (de SERIE)</p>',
          explicacion: '<p>a), c) y e) se numeran dentro de otra entidad; b) y d) tienen identificador único global.</p>',
        },
      },
      {
        titulo: 'Práctica: identificar entidades en enunciados', corto: 'Práctica', tipo: 'multi',
        intro: 'Tres enunciados de dificultad creciente. Subraya los sustantivos, aplica la prueba de 4 preguntas y solo después abre la respuesta.',
        partes: [
          { h: 'Enunciado 1 — Básico', ejercicio: {
            enunciado: '“Un gimnasio registra a sus socios (documento, nombre, teléfono) y las clases que ofrece (código, nombre, horario). Los socios se inscriben en clases.”',
            respuesta: `<p>${ent('SOCIO')} ${ent('CLASE')}</p>`,
            explicacion: list(['Gimnasio: organización única → no es entidad.', 'Socio: muchos, con varios datos → entidad.', 'Clase: muchas, con varios datos → entidad.', '“se inscriben” es un verbo → será una relación.']) } },
          { h: 'Enunciado 2 — Intermedio', ejercicio: {
            enunciado: '“Una concesionaria vende vehículos. De cada vehículo se conoce la placa, marca, modelo y color. Los clientes (cédula, nombre) compran vehículos, y cada venta la realiza un vendedor (código, nombre, comisión) en una fecha.”',
            respuesta: `<p>${ent('VEHÍCULO')} ${ent('CLIENTE')} ${ent('VENDEDOR')} y, según el enfoque, ${ent('VENTA')}.</p>`,
            explicacion: list(['Marca, modelo, color son atributos (no se piden más datos de ellos).', 'La venta une cliente, vehículo y vendedor y tiene fecha: puede modelarse como entidad VENTA o como relación con atributo fecha. Modelarla como entidad suele ser más claro cuando une a tres o más entidades.']) } },
          { h: 'Enunciado 3 — Con entidad débil', ejercicio: {
            enunciado: '“Un conjunto residencial tiene torres (identificadas por una letra) y cada torre tiene apartamentos numerados (101, 102…). Los residentes (cédula, nombre) viven en apartamentos. Se registran los vehículos de los residentes con su placa.”',
            respuesta: `<p>${ent('TORRE')} ${ent('APARTAMENTO')} (débil de TORRE) ${ent('RESIDENTE')} ${ent('VEHÍCULO')}</p>`,
            explicacion: list(['Conjunto residencial: sistema único → no.', 'Apartamento 101 existe en cada torre → débil, clave parcial número.', 'Vehículo tiene placa única → fuerte, aunque pertenezca a un residente.']) } },
        ],
      },
    ],
  });
})();
