/* Módulo 17 — Casos prácticos completos */
(function () {
  const { list, olist, table, ent, rel, att } = R;
  const T = (rows) => table(['Entidad', 'Atributos', 'Clave / observación'], rows);
  const TR = (rows) => table(['Relación', 'Entre', 'Frase del enunciado'], rows);
  const TC = (rows) => table(['Relación', 'Cardinalidad', 'Participación'], rows);

  const casos = [
    /* ---------------- UNIVERSIDAD ---------------- */
    {
      tipo: 'caso', titulo: 'Universidad', corto: 'Universidad',
      contexto: 'Un sistema académico con entidad débil, relación recursiva y atributo de relación.',
      enunciado: `La universidad ofrece programas (código, nombre). Cada estudiante (código, nombre, fecha de nacimiento, uno o varios teléfonos) está inscrito en exactamente un programa; se desea conocer su edad.
        Cada asignatura (código, nombre, créditos) pertenece a un programa, y una asignatura puede tener como prerrequisito a otras asignaturas.
        Cada asignatura se ofrece en grupos numerados 1, 2, 3… dentro de la asignatura, con un horario. Cada grupo es dictado por un profesor (cédula, nombre, uno o varios títulos); un profesor puede dictar varios grupos.
        Los estudiantes se matriculan en grupos y se registra la nota final de cada estudiante en cada grupo.`,
      etapas: [
        { t: 'Entidades', pregunta: '¿Qué entidades identificas? ¿Alguna es débil?', resp: `<p>${ent('PROGRAMA')} ${ent('ESTUDIANTE')} ${ent('ASIGNATURA')} ${ent('GRUPO')} ${ent('PROFESOR')}. <strong>GRUPO es débil</strong> de ASIGNATURA: el grupo 1 existe en cada asignatura.</p>` },
        { t: 'Atributos y claves', pregunta: 'Asigna atributos, indica sus tipos y las claves.', resp: T([['PROGRAMA', '<u>código</u>, nombre', '—'], ['ESTUDIANTE', '<u>código</u>, nombre, fecha_nac, {teléfono}, /edad', 'teléfono multivaluado; edad derivada'], ['ASIGNATURA', '<u>código</u>, nombre, créditos', '—'], ['GRUPO', 'número (parcial), horario', 'clave completa: (código_asignatura, número)'], ['PROFESOR', '<u>cédula</u>, nombre, {título}', 'título multivaluado']]) },
        { t: 'Relaciones', pregunta: 'Encuentra todas las relaciones.', resp: TR([['inscrito', 'PROGRAMA–ESTUDIANTE', '“está inscrito en exactamente un programa”'], ['pertenece', 'PROGRAMA–ASIGNATURA', '“pertenece a un programa”'], ['requiere', 'ASIGNATURA–ASIGNATURA', '“prerrequisito a otras asignaturas” (recursiva)'], ['tiene', 'ASIGNATURA–GRUPO', 'identificadora'], ['dicta', 'PROFESOR–GRUPO', '“dictado por un profesor”'], ['matricula', 'ESTUDIANTE–GRUPO', '“se matriculan en grupos” + atributo nota']]) },
        { t: 'Cardinalidad y participación', pregunta: 'Aplica las dos preguntas a cada relación.', resp: TC([['inscrito', 'PROGRAMA 1:N ESTUDIANTE', 'ESTUDIANTE total'], ['pertenece', 'PROGRAMA 1:N ASIGNATURA', 'ASIGNATURA total'], ['requiere', 'N:M (recursiva)', 'parcial en ambos roles'], ['tiene', 'ASIGNATURA 1:N GRUPO', 'GRUPO total (débil)'], ['dicta', 'PROFESOR 1:N GRUPO', 'GRUPO total'], ['matricula', 'ESTUDIANTE N:M GRUPO', 'parcial']]) },
        { t: 'Débiles, recursivas y generalización', pregunta: 'Revisa los casos especiales.', resp: list(['Débil: GRUPO (rombo doble <em>tiene</em>, clave parcial número).', 'Recursiva: <em>requiere</em> con roles “requisito” y “dependiente”.', 'Generalización: no hay “tipos de” con datos propios.']) },
      ],
      diagrama: D.diagram({ w: 1000, h: 610, nodes: [
        { id: 'pr', t: 'E', l: 'PROGRAMA', x: 220, y: 110, attrs: ['*código', 'nombre'], side: 'top' },
        { id: 'in', t: 'R', l: 'inscrito', x: 430, y: 110 },
        { id: 'es', t: 'E', l: 'ESTUDIANTE', x: 660, y: 110, attrs: ['*código', 'nombre', 'fecha_nac', '{teléfono}', '/edad'], side: 'top' },
        { id: 'pe', t: 'R', l: 'pertenece', x: 220, y: 250 },
        { id: 'as', t: 'E', l: 'ASIGNATURA', x: 220, y: 390, attrs: ['*código', 'nombre', 'créditos'], side: 'left' },
        { id: 'rq', t: 'R', l: 'requiere', x: 220, y: 520 },
        { id: 'ti', t: 'R', l: 'tiene', x: 440, y: 390, ident: true },
        { id: 'gr', t: 'E', l: 'GRUPO', x: 660, y: 390, weak: true, attrs: ['~número', 'horario'], side: 'right' },
        { id: 'ma', t: 'R', l: 'matricula', x: 660, y: 250, attrs: ['nota'], side: 'right' },
        { id: 'di', t: 'R', l: 'dicta', x: 660, y: 520 },
        { id: 'pf', t: 'E', l: 'PROFESOR', x: 880, y: 520, attrs: ['*cédula', 'nombre', '{título}'], side: 'top' }],
        edges: [{ a: 'pr', b: 'in', ca: '1' }, { a: 'es', b: 'in', ca: 'N', total: true }, { a: 'pr', b: 'pe', ca: '1' }, { a: 'as', b: 'pe', ca: 'N', total: true },
          { a: 'as', b: 'rq', ao: [-30, 21], via: [], bo: [-30, -14], ca: 'N', m: 'requisito', side: 1 }, { a: 'as', b: 'rq', ao: [30, 21], via: [], bo: [30, -14], ca: 'M', m: 'dependiente', side: -1 },
          { a: 'as', b: 'ti', ca: '1' }, { a: 'gr', b: 'ti', ca: 'N', total: true }, { a: 'es', b: 'ma', ca: 'N' }, { a: 'gr', b: 'ma', ca: 'M' },
          { a: 'gr', b: 'di', ca: 'N', total: true }, { a: 'pf', b: 'di', ca: '1' }] }),
      validacion: ['Cada estudiante está en un solo programa (1, línea doble) ✓', 'La nota está en <em>matricula</em>, porque depende de estudiante y grupo ✓', 'GRUPO es débil, identificado por (código_asignatura, número) ✓', 'Prerrequisitos modelados como recursiva N:M ✓', 'Profesor con títulos multivaluados ✓'],
    },

    /* ---------------- BIBLIOTECA ---------------- */
    {
      tipo: 'caso', titulo: 'Biblioteca', corto: 'Biblioteca',
      contexto: 'Diferencia entre “libro” y “ejemplar”, préstamos como entidad y especialización parcial.',
      enunciado: `Una biblioteca registra libros (ISBN, título, año) y sus autores (código, nombre); un libro puede tener varios autores y un autor, varios libros.
        De cada libro existen varios ejemplares físicos, numerados 1, 2, 3… por libro, con su estado de conservación.
        Los socios (carné, nombre, uno o varios teléfonos) realizan préstamos. Cada préstamo tiene un número único, fecha de préstamo y fecha de devolución, corresponde a un único ejemplar y lo realiza un único socio.
        Algunos socios son estudiantes (programa) y otros docentes (dependencia); también hay socios externos sin datos adicionales. Nadie es estudiante y docente a la vez.`,
      etapas: [
        { t: 'Entidades', pregunta: '¿Qué entidades hay? ¿Es lo mismo libro que ejemplar?', resp: `<p>${ent('LIBRO')} ${ent('AUTOR')} ${ent('EJEMPLAR')} (débil) ${ent('SOCIO')} ${ent('PRÉSTAMO')} ${ent('ESTUDIANTE')} ${ent('DOCENTE')}. LIBRO es la obra (título, ISBN); EJEMPLAR es cada copia física que se presta.</p>` },
        { t: 'Atributos y claves', pregunta: 'Atributos y claves de cada entidad.', resp: T([['LIBRO', '<u>isbn</u>, título, año', '—'], ['AUTOR', '<u>código</u>, nombre', '—'], ['EJEMPLAR', 'nro_copia (parcial), estado', 'débil de LIBRO'], ['SOCIO', '<u>carné</u>, nombre, {teléfono}', '—'], ['PRÉSTAMO', '<u>nro_préstamo</u>, fecha_prést, fecha_dev', 'número único → fuerte'], ['ESTUDIANTE / DOCENTE', 'programa / dependencia', 'heredan la clave carné']]) },
        { t: 'Relaciones', pregunta: '¿Qué relaciones hay?', resp: TR([['escribe', 'AUTOR–LIBRO', '“un libro puede tener varios autores”'], ['tiene', 'LIBRO–EJEMPLAR', 'identificadora'], ['de', 'PRÉSTAMO–EJEMPLAR', '“corresponde a un único ejemplar”'], ['realiza', 'SOCIO–PRÉSTAMO', '“lo realiza un único socio”']]) },
        { t: 'Cardinalidad y participación', pregunta: 'Cardinalidad y participación de cada relación.', resp: TC([['escribe', 'N:M', 'LIBRO total (asumido: todo libro tiene autor)'], ['tiene', 'LIBRO 1:N EJEMPLAR', 'EJEMPLAR total'], ['de', 'EJEMPLAR 1:N PRÉSTAMO', 'PRÉSTAMO total; EJEMPLAR parcial'], ['realiza', 'SOCIO 1:N PRÉSTAMO', 'PRÉSTAMO total; SOCIO parcial']]) },
        { t: 'Débiles, recursivas y generalización', pregunta: 'Casos especiales.', resp: list(['EJEMPLAR es débil de LIBRO.', 'SOCIO → ESTUDIANTE, DOCENTE: <strong>disjunta</strong> (“nadie es ambos”) y <strong>parcial</strong> (hay socios externos).', 'No hay recursivas.', '¿Por qué PRÉSTAMO es entidad y no relación? Porque un mismo socio puede prestar el mismo ejemplar varias veces, y tiene número propio.']) },
      ],
      diagrama: D.diagram({ w: 960, h: 660, nodes: [
        { id: 'au', t: 'E', l: 'AUTOR', x: 110, y: 110, attrs: ['*código', 'nombre'], side: 'top' },
        { id: 'es', t: 'R', l: 'escribe', x: 350, y: 110 },
        { id: 'li', t: 'E', l: 'LIBRO', x: 600, y: 110, attrs: ['*isbn', 'título', 'año'], side: 'top' },
        { id: 'ti', t: 'R', l: 'tiene', x: 600, y: 240, ident: true },
        { id: 'ej', t: 'E', l: 'EJEMPLAR', x: 600, y: 370, weak: true, attrs: ['~nro_copia', 'estado'], side: 'right' },
        { id: 'de', t: 'R', l: 'de', x: 460, y: 370 },
        { id: 'pr', t: 'E', l: 'PRÉSTAMO', x: 300, y: 370, attrs: ['*nro_préstamo', 'fecha_prést', 'fecha_dev'], side: 'top' },
        { id: 're', t: 'R', l: 'realiza', x: 300, y: 460 },
        { id: 'so', t: 'E', l: 'SOCIO', x: 300, y: 560, attrs: ['*carné', 'nombre', '{teléfono}'], side: 'left' },
        { id: 'is', t: 'ISA', l: 'd', x: 450, y: 560 },
        { id: 'et', t: 'E', l: 'ESTUDIANTE', x: 620, y: 510, attrs: ['programa'], side: 'right' },
        { id: 'dc', t: 'E', l: 'DOCENTE', x: 620, y: 615, attrs: ['dependencia'], side: 'right' }],
        edges: [{ a: 'au', b: 'es', ca: 'N' }, { a: 'li', b: 'es', ca: 'M', total: true }, { a: 'li', b: 'ti', ca: '1' }, { a: 'ej', b: 'ti', ca: 'N', total: true },
          { a: 'ej', b: 'de', ca: '1' }, { a: 'pr', b: 'de', ca: 'N', total: true }, { a: 'pr', b: 're', ca: 'N', total: true }, { a: 'so', b: 're', ca: '1' },
          { a: 'so', b: 'is' }, { a: 'is', b: 'et', subset: true }, { a: 'is', b: 'dc', subset: true }] }),
      validacion: ['Se presta el EJEMPLAR, no el LIBRO ✓', 'PRÉSTAMO como entidad permite préstamos repetidos ✓', 'Especialización d y parcial (socios externos) ✓', 'Teléfonos multivaluados ✓'],
    },

    /* ---------------- HOSPITAL ---------------- */
    {
      tipo: 'caso', titulo: 'Hospital', corto: 'Hospital',
      contexto: 'Especialización de personal, débil de habitación y relación N:M con atributos.',
      enunciado: `Un hospital registra a sus empleados (código, nombre, salario). Algunos empleados son médicos (registro médico, especialidad) y otros enfermeros (turno); el resto es personal administrativo sin datos extra. Nadie es médico y enfermero a la vez.
        Los pacientes (número de historia, nombre, fecha de nacimiento, uno o varios teléfonos) son atendidos por médicos: se registra la fecha y el diagnóstico de cada atención. Un médico atiende a muchos pacientes y un paciente puede ser atendido por muchos médicos.
        Las habitaciones (número, tipo) tienen camas numeradas 1, 2, 3… dentro de cada habitación. Un paciente hospitalizado ocupa una cama y cada cama es ocupada por como máximo un paciente.
        Cada enfermero cuida varias habitaciones y cada habitación es cuidada por varios enfermeros. Se desea conocer la edad de los pacientes.`,
      etapas: [
        { t: 'Entidades', pregunta: '¿Qué entidades hay?', resp: `<p>${ent('EMPLEADO')} ${ent('MÉDICO')} ${ent('ENFERMERO')} ${ent('PACIENTE')} ${ent('HABITACIÓN')} ${ent('CAMA')} (débil).</p>` },
        { t: 'Atributos y claves', pregunta: 'Atributos, tipos y claves.', resp: T([['EMPLEADO', '<u>código</u>, nombre, salario', 'superclase'], ['MÉDICO', 'registro, especialidad', 'subclase'], ['ENFERMERO', 'turno', 'subclase'], ['PACIENTE', '<u>nro_historia</u>, nombre, fecha_nac, {teléfono}, /edad', '—'], ['HABITACIÓN', '<u>número</u>, tipo', '—'], ['CAMA', 'nro_cama (parcial)', 'débil de HABITACIÓN']]) },
        { t: 'Relaciones', pregunta: 'Relaciones y dónde se conectan.', resp: TR([['atiende', 'MÉDICO–PACIENTE', 'solo médicos atienden → subclase MÉDICO'], ['cuida', 'ENFERMERO–HABITACIÓN', 'solo enfermeros'], ['contiene', 'HABITACIÓN–CAMA', 'identificadora'], ['ocupa', 'PACIENTE–CAMA', '“ocupa una cama”']]) },
        { t: 'Cardinalidad y participación', pregunta: 'Cardinalidades y participaciones.', resp: TC([['atiende', 'N:M (fecha, diagnóstico)', 'parcial'], ['cuida', 'N:M', 'parcial'], ['contiene', 'HABITACIÓN 1:N CAMA', 'CAMA total'], ['ocupa', '1:1', 'parcial en ambos (no todos los pacientes están hospitalizados; hay camas libres)']]) },
        { t: 'Débiles, recursivas y generalización', pregunta: 'Casos especiales.', resp: list(['CAMA débil de HABITACIÓN.', 'EMPLEADO → MÉDICO, ENFERMERO: disjunta y <strong>parcial</strong> (existe personal administrativo).', 'Sin recursivas.']) },
      ],
      diagrama: D.diagram({ w: 1000, h: 650, nodes: [
        { id: 'em', t: 'E', l: 'EMPLEADO', x: 420, y: 105, attrs: ['*código', 'nombre', 'salario'], side: 'top' },
        { id: 'is', t: 'ISA', l: 'd', x: 420, y: 185 },
        { id: 'me', t: 'E', l: 'MÉDICO', x: 230, y: 265, attrs: ['registro', 'especialidad'], side: 'left' },
        { id: 'en', t: 'E', l: 'ENFERMERO', x: 610, y: 265, attrs: ['turno'], side: 'bottom' },
        { id: 'cu', t: 'R', l: 'cuida', x: 820, y: 265 },
        { id: 'ha', t: 'E', l: 'HABITACIÓN', x: 820, y: 400, attrs: ['*número', 'tipo'], side: 'right' },
        { id: 'co', t: 'R', l: 'contiene', x: 820, y: 505, ident: true },
        { id: 'ca', t: 'E', l: 'CAMA', x: 620, y: 505, weak: true, attrs: ['~nro_cama'], side: 'bottom' },
        { id: 'oc', t: 'R', l: 'ocupa', x: 430, y: 505 },
        { id: 'pa', t: 'E', l: 'PACIENTE', x: 230, y: 505, attrs: ['*nro_historia', 'nombre', 'fecha_nac', '{teléfono}', '/edad'], side: 'bottom' },
        { id: 'at', t: 'R', l: 'atiende', x: 230, y: 385, attrs: ['fecha', 'diagnóstico'], side: 'left' }],
        edges: [{ a: 'em', b: 'is' }, { a: 'is', b: 'me', subset: true }, { a: 'is', b: 'en', subset: true },
          { a: 'en', b: 'cu', ca: 'N' }, { a: 'ha', b: 'cu', ca: 'M' }, { a: 'ha', b: 'co', ca: '1' }, { a: 'ca', b: 'co', ca: 'N', total: true },
          { a: 'ca', b: 'oc', ca: '1' }, { a: 'pa', b: 'oc', ca: '1' }, { a: 'me', b: 'at', ca: 'N' }, { a: 'pa', b: 'at', ca: 'M' }] }),
      validacion: ['Relaciones propias conectadas a la subclase correcta (atiende → MÉDICO, cuida → ENFERMERO) ✓', 'Especialización parcial por el personal administrativo ✓', 'CAMA débil y ocupada por un solo paciente ✓', 'Edad derivada y teléfonos multivaluados ✓'],
    },

    /* ---------------- TIENDA ---------------- */
    {
      tipo: 'caso', titulo: 'Tienda (cadena con inventario)', corto: 'Tienda',
      contexto: 'Inventario por sucursal, proveedores y categorías jerárquicas.',
      enunciado: `Una cadena de tiendas tiene varias sucursales (código, nombre, dirección compuesta por calle y ciudad). Vende productos (código, nombre, precio de venta).
        Cada sucursal tiene existencias de muchos productos y un producto está en muchas sucursales; se registra la cantidad disponible de cada producto en cada sucursal.
        Los productos pertenecen a una categoría (código, nombre). Las categorías se organizan en jerarquía: una categoría puede tener subcategorías, y cada subcategoría tiene una sola categoría padre.
        Los proveedores (NIT, nombre, uno o varios teléfonos) suministran productos al precio de compra que acuerdan con cada uno; un producto puede tener varios proveedores.
        Cada empleado (código, nombre, cargo) trabaja en una sucursal.`,
      etapas: [
        { t: 'Entidades', pregunta: 'Entidades del caso. ¿La “cadena” es entidad?', resp: `<p>${ent('SUCURSAL')} ${ent('PRODUCTO')} ${ent('CATEGORÍA')} ${ent('PROVEEDOR')} ${ent('EMPLEADO')}. La cadena es el sistema (no es entidad); SUCURSAL sí, porque hay varias.</p>` },
        { t: 'Atributos y claves', pregunta: 'Atributos y claves.', resp: T([['SUCURSAL', '<u>código</u>, nombre, dirección(calle, ciudad)', 'dirección compuesta'], ['PRODUCTO', '<u>código</u>, nombre, precio', '—'], ['CATEGORÍA', '<u>código</u>, nombre', '—'], ['PROVEEDOR', '<u>nit</u>, nombre, {teléfono}', '—'], ['EMPLEADO', '<u>código</u>, nombre, cargo', '—']]) },
        { t: 'Relaciones', pregunta: 'Relaciones y atributos de relación.', resp: TR([['existencia', 'SUCURSAL–PRODUCTO', '“cantidad disponible de cada producto en cada sucursal” → atributo cantidad'], ['pertenece', 'PRODUCTO–CATEGORÍA', '“pertenecen a una categoría”'], ['subcategoría', 'CATEGORÍA–CATEGORÍA', 'jerarquía (recursiva)'], ['suministra', 'PROVEEDOR–PRODUCTO', 'atributo precio_compra'], ['trabaja_en', 'EMPLEADO–SUCURSAL', '“trabaja en una sucursal”']]) },
        { t: 'Cardinalidad y participación', pregunta: 'Cardinalidades.', resp: TC([['existencia', 'N:M', 'parcial'], ['pertenece', 'CATEGORÍA 1:N PRODUCTO', 'PRODUCTO total'], ['subcategoría', '1:N recursiva', 'parcial (las raíces no tienen padre)'], ['suministra', 'N:M', 'parcial'], ['trabaja_en', 'SUCURSAL 1:N EMPLEADO', 'EMPLEADO total']]) },
        { t: 'Débiles, recursivas y generalización', pregunta: 'Casos especiales.', resp: list(['Recursiva: subcategoría (padre/hija).', 'Sin débiles: todo tiene código propio.', 'Sin generalización.', 'Ojo: el precio de compra NO es atributo de PRODUCTO, porque depende del proveedor.']) },
      ],
      diagrama: D.diagram({ w: 1000, h: 600, nodes: [
        { id: 'sc', t: 'R', l: 'subcategoría', x: 200, y: 60 },
        { id: 'ct', t: 'E', l: 'CATEGORÍA', x: 200, y: 210, attrs: ['*código', 'nombre'], side: 'left' },
        { id: 'pe', t: 'R', l: 'pertenece', x: 420, y: 210 },
        { id: 'pd', t: 'E', l: 'PRODUCTO', x: 640, y: 210, attrs: ['*código', 'nombre', 'precio'], side: 'top' },
        { id: 'su', t: 'R', l: 'suministra', x: 860, y: 210, attrs: ['precio_compra'], side: 'top' },
        { id: 'pv', t: 'E', l: 'PROVEEDOR', x: 860, y: 360, attrs: ['*nit', 'nombre', '{teléfono}'], side: 'bottom' },
        { id: 'ex', t: 'R', l: 'existencia', x: 640, y: 360, attrs: ['cantidad'], side: 'left' },
        { id: 'sl', t: 'E', l: 'SUCURSAL', x: 640, y: 500, attrs: ['*código', 'nombre', { l: 'dirección', sub: ['calle', 'ciudad'] }], side: 'right' },
        { id: 'tr', t: 'R', l: 'trabaja_en', x: 400, y: 500 },
        { id: 'em', t: 'E', l: 'EMPLEADO', x: 170, y: 500, attrs: ['*código', 'nombre', 'cargo'], side: 'top' }],
        edges: [{ a: 'ct', b: 'sc', ao: [-30, -21], via: [], bo: [-30, 14], ca: '1', m: 'padre', side: -1 }, { a: 'ct', b: 'sc', ao: [30, -21], via: [], bo: [30, 14], ca: 'N', m: 'hija' },
          { a: 'ct', b: 'pe', ca: '1' }, { a: 'pd', b: 'pe', ca: 'N', total: true }, { a: 'pd', b: 'su', ca: 'N' }, { a: 'pv', b: 'su', ca: 'M' },
          { a: 'pd', b: 'ex', ca: 'N' }, { a: 'sl', b: 'ex', ca: 'M' }, { a: 'sl', b: 'tr', ca: '1' }, { a: 'em', b: 'tr', ca: 'N', total: true }] }),
      validacion: ['cantidad en <em>existencia</em> (depende de sucursal y producto) ✓', 'precio_compra en <em>suministra</em> ✓', 'Jerarquía de categorías como recursiva 1:N ✓', 'Dirección compuesta ✓'],
    },

    /* ---------------- RESTAURANTE ---------------- */
    {
      tipo: 'caso', titulo: 'Restaurante', corto: 'Restaurante',
      contexto: 'Pedidos con detalle (entidad débil), meseros especializados y atributo derivado.',
      enunciado: `Un restaurante tiene mesas (número, capacidad). Sus empleados (código, nombre, uno o varios teléfonos) son meseros (zona que atienden) o cocineros (especialidad); todo empleado es exactamente uno de los dos.
        Cada pedido (número, fecha, hora) se hace en una mesa y lo toma un mesero; se desea conocer el total del pedido.
        Cada pedido tiene varias líneas de detalle, numeradas 1, 2, 3… dentro del pedido, con la cantidad pedida. Cada línea se refiere a un plato (código, nombre, precio); un plato aparece en muchas líneas.`,
      etapas: [
        { t: 'Entidades', pregunta: 'Entidades.', resp: `<p>${ent('MESA')} ${ent('EMPLEADO')} ${ent('MESERO')} ${ent('COCINERO')} ${ent('PEDIDO')} ${ent('DETALLE')} (débil) ${ent('PLATO')}.</p>` },
        { t: 'Atributos y claves', pregunta: 'Atributos y claves.', resp: T([['MESA', '<u>número</u>, capacidad', '—'], ['EMPLEADO', '<u>código</u>, nombre, {teléfono}', 'superclase'], ['MESERO / COCINERO', 'zona / especialidad', 'subclases'], ['PEDIDO', '<u>número</u>, fecha, hora, /total', 'total derivado (suma de líneas)'], ['DETALLE', 'nro_línea (parcial), cantidad', 'débil de PEDIDO'], ['PLATO', '<u>código</u>, nombre, precio', '—']]) },
        { t: 'Relaciones', pregunta: 'Relaciones.', resp: TR([['en', 'MESA–PEDIDO', '“se hace en una mesa”'], ['toma', 'MESERO–PEDIDO', '“lo toma un mesero” (subclase)'], ['contiene', 'PEDIDO–DETALLE', 'identificadora'], ['refiere', 'DETALLE–PLATO', '“se refiere a un plato”']]) },
        { t: 'Cardinalidad y participación', pregunta: 'Cardinalidades.', resp: TC([['en', 'MESA 1:N PEDIDO', 'PEDIDO total'], ['toma', 'MESERO 1:N PEDIDO', 'PEDIDO total'], ['contiene', 'PEDIDO 1:N DETALLE', 'DETALLE total; PEDIDO total (al menos una línea)'], ['refiere', 'PLATO 1:N DETALLE', 'DETALLE total']]) },
        { t: 'Débiles, recursivas y generalización', pregunta: 'Casos especiales.', resp: list(['DETALLE débil de PEDIDO.', 'EMPLEADO → MESERO, COCINERO: disjunta y total.', '¿Por qué no N:M PEDIDO–PLATO con cantidad? Sería válido, pero el enunciado numera las líneas: se modela como débil.']) },
      ],
      diagrama: D.diagram({ w: 1000, h: 680, nodes: [
        { id: 'em', t: 'E', l: 'EMPLEADO', x: 790, y: 105, attrs: ['*código', 'nombre', '{teléfono}'], side: 'top' },
        { id: 'is', t: 'ISA', l: 'd', x: 790, y: 185 },
        { id: 'ms', t: 'E', l: 'MESERO', x: 680, y: 270, attrs: ['zona'], side: 'left' },
        { id: 'cc', t: 'E', l: 'COCINERO', x: 900, y: 270, attrs: ['especialidad'], side: 'bottom' },
        { id: 'to', t: 'R', l: 'toma', x: 680, y: 400 },
        { id: 'pd', t: 'E', l: 'PEDIDO', x: 460, y: 400, attrs: ['*número', 'fecha', 'hora', '/total'], side: 'top' },
        { id: 'en', t: 'R', l: 'en', x: 270, y: 400 },
        { id: 'me', t: 'E', l: 'MESA', x: 100, y: 400, attrs: ['*número', 'capacidad'], side: 'top' },
        { id: 'co', t: 'R', l: 'contiene', x: 460, y: 510, ident: true },
        { id: 'de', t: 'E', l: 'DETALLE', x: 460, y: 620, weak: true, attrs: ['~nro_línea', 'cantidad'], side: 'left' },
        { id: 're', t: 'R', l: 'refiere', x: 680, y: 620 },
        { id: 'pl', t: 'E', l: 'PLATO', x: 880, y: 620, attrs: ['*código', 'nombre', 'precio'], side: 'top' }],
        edges: [{ a: 'em', b: 'is', total: true }, { a: 'is', b: 'ms', subset: true }, { a: 'is', b: 'cc', subset: true },
          { a: 'ms', b: 'to', ca: '1' }, { a: 'pd', b: 'to', ca: 'N', total: true }, { a: 'me', b: 'en', ca: '1' }, { a: 'pd', b: 'en', ca: 'N', total: true },
          { a: 'pd', b: 'co', ca: '1', total: true }, { a: 'de', b: 'co', ca: 'N', total: true }, { a: 'de', b: 're', ca: 'N', total: true }, { a: 'pl', b: 're', ca: '1' }] }),
      validacion: ['total derivado ✓', 'DETALLE débil con clave (nro_pedido, nro_línea) ✓', 'toma conectada a MESERO (no a EMPLEADO) ✓', 'Especialización d y total ✓'],
    },

    /* ---------------- EMPRESA ---------------- */
    {
      tipo: 'caso', titulo: 'Empresa', corto: 'Empresa',
      contexto: 'El caso clásico de los libros de bases de datos: casi todos los conceptos en un solo modelo.',
      enunciado: `Una empresa se organiza en departamentos (número, nombre, una o varias ubicaciones); se desea conocer el número de empleados de cada departamento.
        Cada empleado (cédula, nombre, salario, fecha de nacimiento) trabaja para un departamento. Cada departamento es dirigido por un empleado, y se registra la fecha en que empezó a dirigirlo.
        Cada departamento controla varios proyectos (número, nombre, ubicación); cada proyecto es controlado por un departamento. Los empleados trabajan en varios proyectos y se registran las horas semanales dedicadas a cada uno.
        Cada empleado puede tener un supervisor, que también es empleado.
        De cada empleado se registran sus dependientes (nombre, parentesco, fecha de nacimiento); dos dependientes de un mismo empleado no tienen el mismo nombre.`,
      etapas: [
        { t: 'Entidades', pregunta: 'Entidades.', resp: `<p>${ent('DEPARTAMENTO')} ${ent('EMPLEADO')} ${ent('PROYECTO')} ${ent('DEPENDIENTE')} (débil).</p>` },
        { t: 'Atributos y claves', pregunta: 'Atributos, tipos y claves.', resp: T([['DEPARTAMENTO', '<u>número</u>, nombre, {ubicación}, /nro_empleados', 'multivaluado y derivado'], ['EMPLEADO', '<u>cédula</u>, nombre, salario, fecha_nac', '—'], ['PROYECTO', '<u>número</u>, nombre, ubicación', '—'], ['DEPENDIENTE', 'nombre (parcial), parentesco, fecha_nac', 'débil de EMPLEADO']]) },
        { t: 'Relaciones', pregunta: 'Relaciones.', resp: TR([['trabaja_para', 'EMPLEADO–DEPARTAMENTO', '“trabaja para un departamento”'], ['dirige', 'EMPLEADO–DEPARTAMENTO', 'con atributo fecha_inicio'], ['controla', 'DEPARTAMENTO–PROYECTO', '—'], ['trabaja_en', 'EMPLEADO–PROYECTO', 'atributo horas'], ['supervisa', 'EMPLEADO–EMPLEADO', 'recursiva'], ['tiene', 'EMPLEADO–DEPENDIENTE', 'identificadora']]) },
        { t: 'Cardinalidad y participación', pregunta: 'Cardinalidades.', resp: TC([['trabaja_para', 'DEPARTAMENTO 1:N EMPLEADO', 'EMPLEADO total'], ['dirige', '1:1', 'DEPARTAMENTO total'], ['controla', 'DEPARTAMENTO 1:N PROYECTO', 'PROYECTO total'], ['trabaja_en', 'N:M', 'parcial'], ['supervisa', '1:N recursiva', 'parcial'], ['tiene', 'EMPLEADO 1:N DEPENDIENTE', 'DEPENDIENTE total']]) },
        { t: 'Débiles, recursivas y generalización', pregunta: 'Casos especiales.', resp: list(['DEPENDIENTE débil (clave parcial: nombre).', 'supervisa: recursiva con roles supervisor/supervisado.', 'Sin generalización.']) },
      ],
      diagrama: D.diagram({ w: 1000, h: 650, nodes: [
        { id: 'sv', t: 'R', l: 'supervisa', x: 300, y: 150 },
        { id: 'em', t: 'E', l: 'EMPLEADO', x: 300, y: 310, attrs: ['*cédula', 'nombre', 'salario', 'fecha_nac'], side: 'left' },
        { id: 'tp', t: 'R', l: 'trabaja_para', x: 540, y: 150 },
        { id: 'di', t: 'R', l: 'dirige', x: 540, y: 300, attrs: ['fecha_inicio'], side: 'bottom' },
        { id: 'de', t: 'E', l: 'DEPARTAMENTO', x: 790, y: 150, attrs: ['*número', 'nombre', '{ubicación}', '/nro_empleados'], side: 'top' },
        { id: 'ct', t: 'R', l: 'controla', x: 790, y: 310 },
        { id: 'pr', t: 'E', l: 'PROYECTO', x: 790, y: 470, attrs: ['*número', 'nombre', 'ubicación'], side: 'bottom' },
        { id: 'te', t: 'R', l: 'trabaja_en', x: 540, y: 470, attrs: ['horas'], side: 'bottom' },
        { id: 'ti', t: 'R', l: 'tiene', x: 300, y: 450, ident: true },
        { id: 'dp', t: 'E', l: 'DEPENDIENTE', x: 300, y: 580, weak: true, attrs: ['~nombre', 'parentesco', 'fecha_nac'], side: 'left' }],
        edges: [{ a: 'em', b: 'sv', ao: [-30, -21], via: [], bo: [-30, 14], ca: '1', m: 'supervisor', side: -1 }, { a: 'em', b: 'sv', ao: [30, -21], via: [], bo: [30, 14], ca: 'N', m: 'supervisado' },
          { a: 'em', b: 'tp', ca: 'N', total: true }, { a: 'de', b: 'tp', ca: '1' }, { a: 'em', b: 'di', ca: '1' }, { a: 'de', b: 'di', ca: '1', total: true },
          { a: 'de', b: 'ct', ca: '1' }, { a: 'pr', b: 'ct', ca: 'N', total: true }, { a: 'em', b: 'te', ca: 'N' }, { a: 'pr', b: 'te', ca: 'M' },
          { a: 'em', b: 'ti', ca: '1' }, { a: 'dp', b: 'ti', ca: 'N', total: true }] }),
      validacion: ['Dos relaciones distintas entre EMPLEADO y DEPARTAMENTO ✓', 'fecha_inicio en <em>dirige</em>; horas en <em>trabaja_en</em> ✓', 'Ubicaciones multivaluadas; nro_empleados derivado ✓', 'Supervisión recursiva y DEPENDIENTE débil ✓'],
    },

    /* ---------------- SISTEMA DE VENTAS ---------------- */
    {
      tipo: 'caso', titulo: 'Sistema de ventas', corto: 'Ventas',
      contexto: 'Facturación completa: clientes especializados, dos entidades débiles de la factura y derivados.',
      enunciado: `Una empresa vende productos (código, nombre, precio, stock) a clientes. De todo cliente se guarda un identificador, la dirección y uno o varios teléfonos. Los clientes son personas naturales (cédula, nombre) o empresas (NIT, razón social); todo cliente es de un tipo y solo uno.
        Cada venta se documenta en una factura (número, fecha) que corresponde a un único cliente y es emitida por un vendedor (código, nombre, porcentaje de comisión). Se desea conocer el total de cada factura.
        Cada factura tiene líneas numeradas 1, 2, 3… con la cantidad vendida de un producto; se desea conocer el subtotal de cada línea.
        Una factura puede pagarse en varios pagos, numerados por factura, de los que se guarda el monto y el medio de pago.`,
      etapas: [
        { t: 'Entidades', pregunta: 'Entidades. ¿Cuántas débiles hay?', resp: `<p>${ent('CLIENTE')} ${ent('PERSONA_NATURAL')} ${ent('EMPRESA')} ${ent('FACTURA')} ${ent('VENDEDOR')} ${ent('PRODUCTO')} ${ent('LÍNEA')} ${ent('PAGO')}. <strong>Dos débiles</strong> de FACTURA: LÍNEA y PAGO.</p>` },
        { t: 'Atributos y claves', pregunta: 'Atributos, tipos y claves.', resp: T([['CLIENTE', '<u>id_cliente</u>, dirección, {teléfono}', 'id artificial: cédula y NIT no aplican a todos'], ['PERSONA_NATURAL', 'cédula, nombre', 'subclase'], ['EMPRESA', 'nit, razón_social', 'subclase'], ['FACTURA', '<u>número</u>, fecha, /total', 'total derivado'], ['VENDEDOR', '<u>código</u>, nombre, comisión', '—'], ['PRODUCTO', '<u>código</u>, nombre, precio, stock', '—'], ['LÍNEA', 'nro_línea (parcial), cantidad, /subtotal', 'subtotal = cantidad × precio'], ['PAGO', 'nro_pago (parcial), monto, medio', '—']]) },
        { t: 'Relaciones', pregunta: 'Relaciones.', resp: TR([['compra', 'CLIENTE–FACTURA', '“corresponde a un único cliente”'], ['emite', 'VENDEDOR–FACTURA', '“emitida por un vendedor”'], ['contiene', 'FACTURA–LÍNEA', 'identificadora'], ['refiere', 'LÍNEA–PRODUCTO', '“cantidad vendida de un producto”'], ['registra', 'FACTURA–PAGO', 'identificadora']]) },
        { t: 'Cardinalidad y participación', pregunta: 'Cardinalidades.', resp: TC([['compra', 'CLIENTE 1:N FACTURA', 'FACTURA total'], ['emite', 'VENDEDOR 1:N FACTURA', 'FACTURA total'], ['contiene', 'FACTURA 1:N LÍNEA', 'LÍNEA total; FACTURA total (al menos una línea)'], ['refiere', 'PRODUCTO 1:N LÍNEA', 'LÍNEA total'], ['registra', 'FACTURA 1:N PAGO', 'PAGO total; FACTURA parcial (puede estar sin pagar)']]) },
        { t: 'Débiles, recursivas y generalización', pregunta: 'Casos especiales.', resp: list(['LÍNEA y PAGO débiles de FACTURA.', 'CLIENTE → PERSONA_NATURAL, EMPRESA: disjunta y total.', 'Sin recursivas.']) },
      ],
      diagrama: D.diagram({ w: 1080, h: 640, nodes: [
        { id: 'cl', t: 'E', l: 'CLIENTE', x: 200, y: 150, attrs: ['*id_cliente', 'dirección', '{teléfono}'], side: 'top' },
        { id: 'is', t: 'ISA', l: 'd', x: 200, y: 235 },
        { id: 'pn', t: 'E', l: 'PERSONA_NATURAL', x: 95, y: 330, attrs: ['cédula', 'nombre'], side: 'bottom' },
        { id: 'ep', t: 'E', l: 'EMPRESA', x: 290, y: 330, attrs: ['nit', 'razón_social'], side: 'bottom' },
        { id: 'cp', t: 'R', l: 'compra', x: 440, y: 150 },
        { id: 'fa', t: 'E', l: 'FACTURA', x: 680, y: 150, attrs: ['*número', 'fecha', '/total'], side: 'top' },
        { id: 'et', t: 'R', l: 'emite', x: 890, y: 150 },
        { id: 've', t: 'E', l: 'VENDEDOR', x: 890, y: 300, attrs: ['*código', 'nombre', 'comisión'], side: 'right' },
        { id: 'rg', t: 'R', l: 'registra', x: 470, y: 300, ident: true },
        { id: 'pg', t: 'E', l: 'PAGO', x: 470, y: 440, weak: true, attrs: ['~nro_pago', 'monto', 'medio'], side: 'bottom' },
        { id: 'ct', t: 'R', l: 'contiene', x: 680, y: 300, ident: true },
        { id: 'ln', t: 'E', l: 'LÍNEA', x: 680, y: 440, weak: true, attrs: ['~nro_línea', 'cantidad', '/subtotal'], side: 'bottom' },
        { id: 'rf', t: 'R', l: 'refiere', x: 890, y: 440 },
        { id: 'pd', t: 'E', l: 'PRODUCTO', x: 890, y: 570, attrs: ['*código', 'nombre', 'precio', 'stock'], side: 'right' }],
        edges: [{ a: 'cl', b: 'is', total: true }, { a: 'is', b: 'pn', subset: true }, { a: 'is', b: 'ep', subset: true },
          { a: 'cl', b: 'cp', ca: '1' }, { a: 'fa', b: 'cp', ca: 'N', total: true }, { a: 'fa', b: 'et', ca: 'N', total: true }, { a: 've', b: 'et', ca: '1' },
          { a: 'fa', b: 'rg', ca: '1' }, { a: 'pg', b: 'rg', ca: 'N', total: true }, { a: 'fa', b: 'ct', ca: '1', total: true }, { a: 'ln', b: 'ct', ca: 'N', total: true },
          { a: 'ln', b: 'rf', ca: 'N', total: true }, { a: 'pd', b: 'rf', ca: '1' }] }),
      validacion: ['Clave artificial id_cliente en la superclase ✓', 'Especialización d y total ✓', 'LÍNEA y PAGO débiles, cada una con su rombo doble ✓', 'total y subtotal derivados ✓'],
    },
  ];

  MER.add({
    id: 'casos', num: 17, orden: 17, grupo: 'Práctica',
    titulo: 'Casos prácticos', resumen: 'Universidad, biblioteca, hospital, tienda, restaurante, empresa y sistema de ventas.',
    objetivo: 'Resolver modelos completos desde el enunciado hasta el diagrama final, etapa por etapa.',
    requiere: ['ej-avanzados'],
    items: casos,
  });
})();
