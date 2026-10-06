/* Módulo 5 — Relaciones */
(function () {
  const { list, olist, table, box, fig, cmp, ent, rel, att } = R;
  const bin = (a, r, b, ca, cb, o) => D.diagram(Object.assign({ w: 560, h: 110, nodes: [
    { id: 'a', t: 'E', l: a, x: 90, y: 55 }, { id: 'r', t: 'R', l: r, x: 280, y: 55 }, { id: 'b', t: 'E', l: b, x: 470, y: 55 }],
    edges: [{ a: 'a', b: 'r', ca }, { a: 'b', b: 'r', ca: cb }] }, o || {}));

  const ternary = D.diagram({ w: 600, h: 290, nodes: [
    { id: 'p', t: 'E', l: 'PROVEEDOR', x: 110, y: 70 }, { id: 'q', t: 'E', l: 'PROYECTO', x: 490, y: 70 },
    { id: 'r', t: 'R', l: 'suministra', x: 300, y: 150, attrs: ['cantidad'], side: 'bottom' },
    { id: 'z', t: 'E', l: 'PIEZA', x: 300, y: 260 }],
    edges: [{ a: 'p', b: 'r', ca: 'N' }, { a: 'q', b: 'r', ca: 'M' }, { a: 'z', b: 'r', ca: 'P', side: -1 }] });

  MER.add({
    id: 'relaciones', num: 5, orden: 5, grupo: 'Conceptos',
    titulo: 'Relaciones', resumen: 'Cómo encontrar relaciones, su grado (binaria, ternaria, n-aria), recursivas e identificadoras.',
    objetivo: 'Encontrar los verbos que conectan entidades y dibujar la relación correcta.',
    requiere: ['entidades', 'atributos'],
    items: [
      {
        titulo: '¿Qué es una relación?', corto: 'Qué es',
        que: '<p>Una <strong>relación</strong> es una <strong>asociación</strong> entre dos o más entidades. Expresa cómo interactúan: un cliente <em>compra</em> productos, un profesor <em>dicta</em> asignaturas.</p>',
        porque: '<p>Las entidades aisladas no dicen nada del negocio. Las relaciones reflejan las <strong>reglas</strong>: quién compra qué, quién trabaja dónde.</p>',
        como: `<p>Cada ejemplar de la relación une ejemplares concretos: (Ana, Bases de Datos) es un ejemplar de ${rel('matricula')}.</p>
          ${box('key', '¿Por qué un rombo?', '<p>Chen eligió el rombo porque es una figura con “puntas” que <strong>apuntan hacia las entidades</strong> que conecta. Visualmente separa las <strong>cosas</strong> (rectángulos) de las <strong>acciones</strong> (rombos): así nunca se confunde una entidad con una relación.</p>')}`,
        identificar: '<p>Busca <strong>verbos</strong> que tengan un sustantivo-entidad a cada lado: “el <u>cliente</u> <strong>realiza</strong> <u>pedidos</u>”.</p>',
        ejemplo: { cotidiano: '<p>“Juan <strong>es amigo de</strong> Pedro”, “María <strong>vive en</strong> Medellín”.</p>', bd: fig(bin('PROFESOR', 'dicta', 'ASIGNATURA', '1', 'N')) },
        grafico: list(['<strong>Rombo</strong> con un verbo dentro.', 'Una línea a cada entidad participante.', 'Cardinalidad junto a cada línea (módulo 6).']),
        cuando: { si: ['Un verbo une dos entidades.', 'Hay que saber “quién con quién”.'], no: ['El verbo solo introduce un atributo (“tiene un precio”).'] },
        error: {
          mal: fig(D.diagram({ w: 400, h: 70, nodes: [{ id: 'a', t: 'E', l: 'CLIENTE', x: 80, y: 35 }, { id: 'b', t: 'E', l: 'PEDIDO', x: 320, y: 35 }], edges: [{ a: 'a', b: 'b' }] })),
          bien: fig(bin('CLIENTE', 'realiza', 'PEDIDO', '1', 'N')),
          porque: 'En Chen, dos rectángulos nunca se unen directamente. Siempre hay un rombo en medio.',
        },
        ejercicio: {
          enunciado: '“Los médicos atienden pacientes. Cada paciente tiene una historia clínica.” ¿Cuáles son las relaciones?',
          respuesta: `<p>${ent('MÉDICO')} — ${rel('atiende')} — ${ent('PACIENTE')} y ${ent('PACIENTE')} — ${rel('tiene')} — ${ent('HISTORIA_CLÍNICA')} (si la historia tiene datos propios).</p>`,
          explicacion: '<p>“atienden” une médico con paciente. “tiene” une paciente con historia clínica, siempre que la historia sea entidad (tiene número, fecha de apertura, etc.). Si fuera un simple número, sería atributo del paciente.</p>',
        },
      },
      {
        titulo: 'Cómo encontrar relaciones en un enunciado', corto: 'Encontrarlas',
        que: '<p>Un procedimiento para convertir los verbos del texto en relaciones del diagrama.</p>',
        porque: '<p>Los enunciados esconden relaciones en verbos, preposiciones (“de”, “en”) y frases como “cada X tiene varios Y”.</p>',
        como: olist([
          'Marca las <strong>entidades</strong> (ya sabes hacerlo).',
          'Marca los <strong>verbos</strong> que conectan dos entidades.',
          'Busca también conexiones <strong>implícitas</strong>: “los productos <em>de</em> un proveedor” = PROVEEDOR <em>suministra</em> PRODUCTO.',
          'Nombra la relación con un <strong>verbo en presente</strong> y singular.',
          'Descarta verbos que solo introducen atributos (“se registra”, “tiene un nombre”).',
          'Elimina relaciones <strong>redundantes</strong> (que se pueden deducir de otras).',
        ]),
        identificar: `<div class="stmt">Un <span class="mark-n">profesor</span> <span class="mark-v">dicta</span> varias <span class="mark-n">asignaturas</span>. Cada <span class="mark-n">asignatura</span> <span class="mark-v">pertenece a</span> un <span class="mark-n">programa</span>. Los <span class="mark-n">estudiantes</span> <span class="mark-v">se inscriben en</span> asignaturas.</div>
          ${table(['Verbo', 'Entidad 1', 'Entidad 2', 'Relación'], [['dicta', 'PROFESOR', 'ASIGNATURA', rel('dicta')], ['pertenece a', 'ASIGNATURA', 'PROGRAMA', rel('pertenece')], ['se inscriben en', 'ESTUDIANTE', 'ASIGNATURA', rel('inscribe')]])}`,
        ejemplo: {
          cotidiano: '<p>“El <em>libro de</em> Juan” → Juan <strong>posee</strong> libro. La preposición “de” esconde una relación.</p>',
          bd: '<p>“Los <strong>empleados de</strong> cada departamento” → DEPARTAMENTO <em>tiene</em> EMPLEADO.</p>',
        },
        grafico: '<p>Cada relación encontrada es un rombo entre las entidades del verbo.</p>',
        cuando: { si: ['El verbo une dos entidades distintas o la misma entidad con roles distintos.'], no: ['El verbo solo describe un dato: “el cliente tiene un correo”.'] },
        error: {
          mal: '<p>Crear una relación <strong>redundante</strong>: ESTUDIANTE—<em>estudia en</em>—PROGRAMA, cuando ya existe ESTUDIANTE—inscribe—ASIGNATURA—pertenece—PROGRAMA y el enunciado no dice nada más.</p>',
          bien: '<p>Solo agrégala si significa algo distinto (por ejemplo, el programa en el que el estudiante está <strong>matriculado oficialmente</strong>).</p>',
        },
        ejercicio: {
          enunciado: '“Una empresa de mensajería tiene repartidores. Cada repartidor conduce una moto. Los clientes envían paquetes, y cada paquete es entregado por un repartidor.” Lista las relaciones.',
          respuesta: `<p>${rel('conduce')} (REPARTIDOR–MOTO), ${rel('envía')} (CLIENTE–PAQUETE), ${rel('entrega')} (REPARTIDOR–PAQUETE).</p>`,
          explicacion: '<p>Empresa no es entidad (es el sistema). Cada verbo conecta dos entidades distintas.</p>',
        },
      },
      {
        titulo: 'Grado de una relación y relaciones binarias', corto: 'Binarias',
        que: '<p>El <strong>grado</strong> de una relación es el <strong>número de entidades</strong> que participan en ella. Una relación <strong>binaria</strong> (grado 2) une <strong>dos</strong> entidades.</p>' +
          table(['Grado', 'Nombre', 'Entidades'], [['1', 'Unaria / recursiva', 'una entidad consigo misma'], ['2', 'Binaria', 'dos'], ['3', 'Ternaria', 'tres'], ['n', 'n-aria', 'n']]),
        porque: '<p>La inmensa mayoría de relaciones son binarias. Son las más fáciles de leer y de convertir en tablas.</p>',
        como: '<p>El rombo tiene exactamente dos líneas, una hacia cada entidad.</p>',
        identificar: '<p>La frase tiene la forma <strong>SUJETO – verbo – OBJETO</strong>, y ambos son entidades.</p>',
        ejemplo: { cotidiano: '<p>“Una persona <strong>tiene</strong> una mascota.”</p>', bd: fig(bin('EMPLEADO', 'trabaja_en', 'DEPARTAMENTO', 'N', '1')) },
        grafico: '<p>Rombo con dos líneas.</p>',
        cuando: { si: ['El hecho se entiende completo con solo dos entidades.'], no: ['El hecho necesita tres entidades a la vez para tener sentido (ternaria).'] },
        error: { mal: '<p>Olvidar que puede haber <strong>varias</strong> relaciones binarias entre las mismas dos entidades.</p>', bien: '<p>EMPLEADO <em>trabaja_en</em> DEPARTAMENTO y EMPLEADO <em>dirige</em> DEPARTAMENTO son dos relaciones distintas, con dos rombos.</p>' },
        ejercicio: {
          enunciado: '“Cada departamento tiene muchos empleados y es dirigido por uno de ellos.” ¿Cuántas relaciones hay entre EMPLEADO y DEPARTAMENTO?',
          respuesta: '<p><strong>Dos</strong>: <em>trabaja_en</em> y <em>dirige</em>.</p>',
          explicacion: fig(D.diagram({ w: 560, h: 190, nodes: [{ id: 'e', t: 'E', l: 'EMPLEADO', x: 90, y: 95 }, { id: 'd', t: 'E', l: 'DEPARTAMENTO', x: 460, y: 95 },
            { id: 'r1', t: 'R', l: 'trabaja_en', x: 275, y: 40 }, { id: 'r2', t: 'R', l: 'dirige', x: 275, y: 150 }],
            edges: [{ a: 'e', b: 'r1', ca: 'N' }, { a: 'd', b: 'r1', ca: '1', side: -1 }, { a: 'e', b: 'r2', ca: '1', side: -1 }, { a: 'd', b: 'r2', ca: '1' }] }), 'Son hechos distintos: trabajar en un departamento no es lo mismo que dirigirlo.'),
        },
      },
      {
        titulo: 'Relaciones ternarias', corto: 'Ternarias',
        que: '<p>Una relación <strong>ternaria</strong> (grado 3) une <strong>tres entidades a la vez</strong> en un mismo hecho.</p>',
        porque: '<p>Hay hechos que <strong>solo tienen sentido</strong> con tres participantes. “El proveedor P suministra la pieza X al proyecto Y” no se puede partir sin perder información.</p>',
        como: `<p>Cada ejemplar de la relación es un trío: (Proveedor A, Tornillo, Proyecto Puente).</p>${fig(ternary, 'Relación ternaria con un atributo de relación (cantidad).')}`,
        identificar: list(['La frase menciona <strong>tres</strong> entidades en <strong>un solo hecho</strong>.', 'Prueba: ¿necesitas saber las tres a la vez para registrar el dato? (la cantidad depende de quién, qué y para dónde).']),
        ejemplo: {
          cotidiano: '<p>“El profesor <em>Pérez</em> dicta <em>Cálculo</em> en el <em>aula 201</em>.”</p>',
          bd: '<p>MÉDICO receta MEDICAMENTO a PACIENTE: la receta necesita saber quién la hizo, qué medicamento y para qué paciente.</p>',
        },
        grafico: '<p>Un rombo con <strong>tres líneas</strong>. La cardinalidad de cada lado se lee fijando las <strong>otras dos</strong> entidades: “para un proveedor y un proyecto dados, ¿cuántas piezas?”.</p>',
        cuando: { si: ['El hecho es único con los tres participantes a la vez.'], no: ['El hecho se puede expresar con dos binarias sin perder información.'] },
        error: {
          mal: '<p>Reemplazar la ternaria por tres binarias (PROVEEDOR–PIEZA, PIEZA–PROYECTO, PROVEEDOR–PROYECTO).</p>',
          bien: '<p>Con las tres binarias sabes que A vende tornillos y que el proyecto usa tornillos, pero <strong>no</strong> sabes si A le suministró tornillos a ese proyecto. Se pierde información: hace falta la ternaria.</p>',
        },
        ejercicio: {
          enunciado: '“Se registra qué empleado trabaja en qué proyecto y con qué rol (analista, programador…). Un empleado puede tener roles distintos en proyectos distintos.” ¿Es ternaria?',
          respuesta: '<p>Depende: si ROL es solo un nombre, es <strong>binaria</strong> EMPLEADO–trabaja–PROYECTO con atributo <em>rol</em>. Si ROL es entidad (tiene código, tarifa…), es <strong>ternaria</strong> EMPLEADO–PROYECTO–ROL.</p>',
          explicacion: '<p>Primero decide si cada participante es entidad o atributo. Solo cuando las tres son entidades y el hecho las necesita a la vez hay ternaria.</p>',
        },
      },
      {
        titulo: 'Relaciones de grado superior (n-arias)', corto: 'Grado superior',
        que: '<p>Relaciones con <strong>cuatro o más</strong> entidades. Son poco frecuentes.</p>',
        porque: '<p>Existen hechos con muchos participantes (un horario: profesor + asignatura + aula + franja horaria).</p>',
        como: `<p>Mismo símbolo: un rombo con n líneas.</p>${fig(D.diagram({ w: 600, h: 260, nodes: [
          { id: 'r', t: 'R', l: 'programa', x: 300, y: 130 }, { id: 'a', t: 'E', l: 'PROFESOR', x: 100, y: 50 }, { id: 'b', t: 'E', l: 'ASIGNATURA', x: 500, y: 50 },
          { id: 'c', t: 'E', l: 'AULA', x: 100, y: 215 }, { id: 'd', t: 'E', l: 'FRANJA', x: 500, y: 215 }],
          edges: [{ a: 'a', b: 'r' }, { a: 'b', b: 'r' }, { a: 'c', b: 'r' }, { a: 'd', b: 'r' }] }), 'Relación de grado 4.')}`,
        identificar: '<p>Un hecho que requiere cuatro o más entidades simultáneamente.</p>',
        ejemplo: { cotidiano: '<p>Un horario escolar.</p>', bd: '<p>Horario de clases: PROFESOR, ASIGNATURA, AULA, FRANJA_HORARIA.</p>' },
        grafico: '<p>Rombo con cuatro o más líneas.</p>',
        cuando: { si: ['Ninguna combinación de relaciones más pequeñas conserva la información.'], no: ['Casi siempre: es mejor convertir el hecho en una <strong>entidad</strong> (por ejemplo CLASE_PROGRAMADA) relacionada con cada participante mediante binarias. Es más fácil de leer y de ampliar.'] },
        error: { mal: '<p>Usar relaciones n-arias por comodidad.</p>', bien: '<p>Preferir una entidad asociativa (“evento”) con relaciones binarias; muchos profesores aceptan ambas.</p>' },
        ejercicio: {
          enunciado: 'Propón una alternativa con relaciones binarias para el horario de grado 4.',
          respuesta: '<p>Crear la entidad <strong>SESIÓN</strong> (con id_sesión) y relacionarla 1:N con PROFESOR, ASIGNATURA, AULA y FRANJA (cada sesión tiene 1 profesor, 1 asignatura, 1 aula y 1 franja).</p>',
          explicacion: '<p>Convertir un hecho complejo en una entidad es una técnica clave llamada <strong>reificación</strong>.</p>',
        },
      },
      {
        titulo: 'Relaciones recursivas (unarias) — vista previa', corto: 'Recursivas',
        intro: 'El módulo 9 está dedicado por completo a este tema.',
        que: '<p>Una relación <strong>recursiva</strong> (unaria, grado 1) une una entidad <strong>consigo misma</strong>: dos ejemplares de la misma entidad se relacionan.</p>',
        porque: '<p>Para jerarquías y conexiones entre iguales: un empleado supervisa a otro, un curso es prerrequisito de otro.</p>',
        como: '<p>La entidad participa <strong>dos veces</strong> con papeles (roles) distintos.</p>',
        identificar: '<p>El verbo une dos sustantivos del <strong>mismo tipo</strong>: “un empleado <em>supervisa</em> a otros empleados”.</p>',
        ejemplo: {
          cotidiano: '<p>“Una persona es <strong>madre de</strong> otra persona.”</p>',
          bd: fig(D.diagram({ w: 520, h: 160, nodes: [{ id: 'e', t: 'E', l: 'EMPLEADO', x: 130, y: 78 }, { id: 'r', t: 'R', l: 'supervisa', x: 390, y: 78 }],
            edges: [{ a: 'e', b: 'r', via: [[130, 20], [390, 20]], ca: '1', m: 'supervisor', side: -1 }, { a: 'e', b: 'r', via: [[130, 135], [390, 135]], ca: 'N', m: 'supervisado' }] })),
        },
        grafico: '<p>Un rombo con dos líneas que llegan al mismo rectángulo, cada una con su <strong>rol</strong>.</p>',
        cuando: { si: ['Ambos lados del verbo son la misma entidad.'], no: ['Los dos lados son entidades distintas aunque se parezcan.'] },
        error: { mal: '<p>Crear dos entidades SUPERVISOR y EMPLEADO con los mismos datos.</p>', bien: '<p>Una sola entidad EMPLEADO con una relación recursiva.</p>' },
        ejercicio: {
          enunciado: '“Un curso puede ser prerrequisito de otros cursos.” ¿Qué tipo de relación es?',
          respuesta: '<p>Recursiva sobre CURSO, con roles <em>requisito</em> y <em>requiere</em>.</p>',
          explicacion: '<p>Ambos lados del verbo son CURSO.</p>',
        },
      },
      {
        titulo: 'Relaciones identificadoras — vista previa', corto: 'Identificadoras',
        intro: 'El módulo 8 (Entidades débiles) profundiza este tema.',
        que: '<p>Una relación <strong>identificadora</strong> es la que une una <strong>entidad débil</strong> con su <strong>propietaria</strong>, y le “presta” la clave para identificarse.</p>',
        porque: '<p>Sin esta relación, la entidad débil no tendría forma de identificarse.</p>',
        como: '<p>La clave de la débil = clave de la propietaria (a través de la relación) + clave parcial.</p>',
        identificar: '<p>Si detectas una entidad débil, la relación con su propietaria es identificadora.</p>',
        ejemplo: {
          cotidiano: '<p>“Apartamento 302 <em>de</em> la torre B”.</p>',
          bd: fig(D.diagram({ w: 560, h: 110, nodes: [{ id: 'a', t: 'E', l: 'TORRE', x: 90, y: 55 }, { id: 'r', t: 'R', l: 'contiene', x: 280, y: 55, ident: true }, { id: 'b', t: 'E', l: 'APARTAMENTO', x: 460, y: 55, weak: true }],
            edges: [{ a: 'a', b: 'r', ca: '1' }, { a: 'b', b: 'r', ca: 'N', total: true }] })),
        },
        grafico: '<p><strong>Rombo doble</strong>, con línea doble hacia la entidad débil.</p>',
        cuando: { si: ['Una de las entidades es débil y la otra es su propietaria.'], no: ['Entre dos entidades fuertes.'] },
        error: { mal: '<p>Dibujar la entidad débil pero con rombo simple.</p>', bien: '<p>Rectángulo doble y rombo doble van siempre juntos.</p>' },
        ejercicio: {
          enunciado: 'En una biblioteca, LIBRO (isbn) tiene EJEMPLARES numerados 1, 2, 3… ¿Qué relación es identificadora?',
          respuesta: '<p>La relación LIBRO — <em>tiene</em> — EJEMPLAR (rombo doble).</p>',
          explicacion: '<p>EJEMPLAR es débil (el número de copia se repite en cada libro) y LIBRO es su propietario.</p>',
        },
      },
      {
        titulo: 'Atributos de una relación', corto: 'Atributos de relación',
        que: '<p>Algunos datos no pertenecen a ninguna de las entidades por separado, sino al <strong>hecho de que estén relacionadas</strong>. Esos datos son <strong>atributos de la relación</strong>.</p>',
        porque: '<p>Si los pones en una entidad, pierdes información o la repites.</p>',
        como: `<p>La <strong>nota</strong> no es del estudiante (tiene muchas notas) ni del curso (tiene notas de muchos estudiantes): es de la <strong>matrícula</strong> de ese estudiante en ese curso.</p>
          ${fig(D.diagram({ w: 560, h: 170, nodes: [{ id: 'a', t: 'E', l: 'ESTUDIANTE', x: 90, y: 60 }, { id: 'r', t: 'R', l: 'matricula', x: 280, y: 60, attrs: ['nota', 'semestre'], side: 'bottom' }, { id: 'b', t: 'E', l: 'CURSO', x: 470, y: 60 }],
            edges: [{ a: 'a', b: 'r', ca: 'N' }, { a: 'b', b: 'r', ca: 'M' }] }))}`,
        identificar: '<p>Pregunta: <strong>“¿de quién es este dato?”</strong> Si la respuesta es “de la combinación de los dos”, va en la relación.</p>',
        ejemplo: { cotidiano: '<p>La <strong>fecha en que te casaste</strong> no es tuya ni de tu pareja por separado: es del matrimonio.</p>', bd: '<p>EMPLEADO <em>trabaja_en</em> PROYECTO con <strong>horas</strong>: las horas son de ese empleado en ese proyecto.</p>' },
        grafico: '<p>Óvalo conectado al <strong>rombo</strong>.</p>',
        cuando: { si: ['El dato depende de los dos participantes a la vez (típico en N:M).'], no: ['El dato depende solo de una entidad: va en esa entidad. En relaciones 1:N suele poder moverse al lado N.'] },
        error: { mal: `<p>Poner ${att('nota')} como atributo de ${ent('ESTUDIANTE')}.</p>`, bien: '<p>Un estudiante tiene una nota <strong>por cada curso</strong>: la nota va en la relación.</p>' },
        ejercicio: {
          enunciado: '“Un cliente alquila películas. Se registra la fecha de alquiler y la fecha de devolución.” ¿Dónde van las fechas?',
          respuesta: '<p>En la relación <strong>alquila</strong> entre CLIENTE y PELÍCULA.</p>',
          explicacion: '<p>Cada fecha pertenece a un alquiler concreto (este cliente, esta película). Si un cliente puede alquilar la misma película varias veces, conviene convertir el alquiler en entidad ALQUILER.</p>',
        },
      },
    ],
  });
})();
