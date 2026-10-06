/* Módulo 8 — Entidades débiles */
(function () {
  const { list, olist, table, box, fig, cmp, ent, rel, att } = R;
  const weak = (own, ownAttrs, r, wk, wkAttrs, o) => D.diagram({ w: 620, h: 170, nodes: [
    Object.assign({ id: 'o', t: 'E', l: own, x: 100, y: 120, attrs: ownAttrs, side: 'top' }, o && o.own),
    Object.assign({ id: 'r', t: 'R', l: r, x: 310, y: 120, ident: true }, o && o.rel),
    Object.assign({ id: 'w', t: 'E', l: wk, x: 515, y: 120, weak: true, attrs: wkAttrs, side: 'top' }, o && o.wk)],
    edges: [{ a: 'o', b: 'r', ca: '1' }, { a: 'w', b: 'r', ca: 'N', total: true }] });

  const pedido = weak('PEDIDO', ['*nro_pedido', 'fecha'], 'contiene', 'LÍNEA_PEDIDO', ['~nro_línea', 'cantidad']);

  MER.add({
    id: 'debiles', num: 8, orden: 8, grupo: 'Conceptos',
    titulo: 'Entidades débiles', resumen: 'Clave parcial, entidad propietaria y relación identificadora en profundidad.',
    objetivo: 'Reconocer cuándo una entidad no puede identificarse sola y modelarla correctamente.',
    requiere: ['entidades', 'atributos', 'participacion'],
    items: [
      {
        titulo: '¿Qué es una entidad débil?', corto: 'Qué es',
        que: '<p>Es una entidad que <strong>no tiene atributos suficientes</strong> para formar su propia clave primaria. Para identificarse necesita la clave de otra entidad.</p>',
        porque: '<p>Porque en la realidad hay objetos que se nombran o numeran <strong>relativos a otro</strong>: la línea 3 de un pedido, el capítulo 5 de un libro.</p>',
        como: `${fig(pedido)}<p>La línea 1 existe en todos los pedidos. La línea (Pedido 500, línea 1) es única.</p>`,
        identificar: list(['Su número se <strong>reinicia</strong> en cada “padre” (1, 2, 3… en cada pedido).', 'El enunciado usa: “para cada”, “dentro de”, “de cada … se numeran”.', 'Si el padre desaparece, ella no tiene sentido.']),
        ejemplo: { cotidiano: '<p>Los <strong>asientos</strong> de un bus, las <strong>páginas</strong> de un libro, los <strong>pisos</strong> de un edificio.</p>', bd: '<p>DEPENDIENTE (hijos de un empleado, identificados por su nombre dentro del empleado) es el ejemplo clásico de los libros de texto.</p>' },
        grafico: '<p>Rectángulo doble. Se estudia a fondo en el tema 6 de este módulo.</p>',
        cuando: { si: ['No existe un identificador propio globalmente único.'], no: ['El enunciado da un código único (número de factura, placa).'] },
        error: { mal: '<p>Inventar un código único artificial para evitar la entidad débil cuando el enunciado describe claramente una numeración relativa.</p>', bien: '<p>Respeta el enunciado: si la numeración es relativa, modela la entidad débil.</p>' },
        ejercicio: {
          enunciado: '“Cada torneo tiene varias fechas (jornada 1, jornada 2…).” ¿Qué entidad es débil?',
          respuesta: '<p><strong>JORNADA</strong>, débil de TORNEO.</p>',
          explicacion: '<p>La jornada 1 existe en todos los torneos.</p>',
        },
      },
      {
        titulo: '¿Por qué necesita otra entidad?', corto: 'Por qué depende',
        que: '<p>Porque su clave parcial <strong>se repite</strong> y solo combinada con la clave de otra entidad se vuelve única. Esa dependencia es de <strong>identificación</strong> y también de <strong>existencia</strong>.</p>',
        porque: table(['Dependencia', 'Significado'], [['De identificación', 'Necesita la clave del propietario para saber cuál es.'], ['De existencia', 'No puede existir sin su propietario: si se borra el pedido, se borran sus líneas.']]),
        como: table(['nro_pedido', 'nro_línea', 'producto'], [['500', '1', 'Arroz'], ['500', '2', 'Leche'], ['501', '1', 'Pan'], ['501', '2', 'Huevos']]) + '<p class="muted">“nro_línea = 1” aparece dos veces; (500, 1) y (501, 1) son distintas.</p>',
        identificar: '<p>Haz la prueba: <strong>“Si te digo solo el número ___, ¿sabes exactamente cuál es?”</strong> Si no → débil.</p>',
        ejemplo: { cotidiano: '<p>Decir “la casa número 10” no basta; necesitas la calle.</p>', bd: '<p>Decir “la cuota 3” no basta; necesitas el número del crédito.</p>' },
        error: {
          mal: '<p>Confundir dependencia de existencia con debilidad: “un pedido no existe sin cliente, entonces PEDIDO es débil”.</p>',
          bien: '<p>PEDIDO tiene número único propio → es fuerte con participación total. Débil solo si <strong>además</strong> necesita la clave del otro para identificarse.</p>',
        },
        ejercicio: {
          enunciado: '“Toda cita médica debe tener un paciente. Las citas tienen un número consecutivo único en todo el sistema.” ¿CITA es débil?',
          respuesta: '<p><strong>No</strong>. Es fuerte, con participación total en su relación con PACIENTE.</p>',
          explicacion: '<p>Tiene identificador propio único. Que sea obligatorio tener paciente se expresa con línea doble, no con rectángulo doble.</p>',
        },
      },
      {
        titulo: 'Entidad propietaria', corto: 'Propietaria',
        que: '<p>La <strong>entidad propietaria</strong> (o identificadora, o dominante) es la entidad fuerte de la que depende la débil y cuya clave le presta.</p>',
        porque: '<p>Sin ella no se completa el identificador de la débil.</p>',
        como: '<p>La relación propietaria–débil es casi siempre <strong>1:N</strong>: un propietario tiene muchos ejemplares débiles; cada débil pertenece a un solo propietario.</p>',
        identificar: '<p>Es el “padre” en la frase “la ___ número X <strong>de</strong> ___”.</p>',
        ejemplo: { cotidiano: '<p>El edificio es propietario de sus apartamentos.</p>', bd: fig(weak('LIBRO', ['*isbn', 'título'], 'tiene', 'CAPÍTULO', ['~nro_capítulo', 'título'])) },
        grafico: '<p>Rectángulo simple (es fuerte), unido al rombo doble con línea simple o doble según su participación.</p>',
        cuando: { si: ['Siempre que exista una entidad débil.'], no: ['—'] },
        error: { mal: '<p>Dibujar la entidad débil sin relación con ninguna propietaria.</p>', bien: '<p>Toda débil debe estar unida a su propietaria mediante un rombo doble.</p>' },
        ejercicio: {
          enunciado: '“Un banco registra préstamos (número único). Cada préstamo se paga en cuotas numeradas.” ¿Quién es la propietaria?',
          respuesta: '<p><strong>PRÉSTAMO</strong>, propietaria de CUOTA.</p>',
          explicacion: '<p>La cuota 1, 2, 3… se numera dentro de cada préstamo.</p>',
        },
      },
      {
        titulo: 'Clave parcial', corto: 'Clave parcial',
        que: '<p>El atributo de la débil que, <strong>junto con la clave del propietario</strong>, identifica a cada ejemplar. También se llama <em>discriminante</em>.</p>',
        porque: '<p>Distingue a los ejemplares débiles de un mismo propietario.</p>',
        como: '<p>Clave completa = <code>clave propietaria + clave parcial</code>. Ejemplo: (isbn, nro_capítulo).</p>',
        identificar: '<p>El número o nombre que no se repite dentro de un mismo propietario, pero sí entre propietarios.</p>',
        ejemplo: { cotidiano: '<p>El número de habitación dentro de un hotel.</p>', bd: '<p>En DEPENDIENTE de EMPLEADO, la clave parcial suele ser el <strong>nombre</strong> del dependiente (dos hijos del mismo empleado no se llaman igual).</p>' },
        grafico: '<p>Subrayado <strong>punteado</strong>.</p>',
        cuando: { si: ['Siempre en una entidad débil.'], no: ['En entidades fuertes.'] },
        error: { mal: '<p>Poner como clave parcial un dato que se repite dentro del mismo propietario (por ejemplo “fecha” si puede haber dos cuotas con la misma fecha).</p>', bien: '<p>Debe ser único <strong>dentro</strong> del propietario.</p>' },
        ejercicio: {
          enunciado: 'SERIE tiene TEMPORADAS numeradas y cada temporada tiene EPISODIOS numerados. ¿Clave completa de un episodio?',
          respuesta: '<p><strong>(id_serie, nro_temporada, nro_episodio)</strong>.</p>',
          explicacion: '<p>EPISODIO es débil de TEMPORADA, que a su vez es débil de SERIE. Las claves se van acumulando.</p>',
        },
      },
      {
        titulo: 'Relación identificadora', corto: 'Relación identificadora',
        que: '<p>La relación entre la débil y su propietaria. A través de ella la débil obtiene la parte de la clave que le falta.</p>',
        porque: '<p>Hace explícito en el diagrama <strong>de quién</strong> depende la identificación.</p>',
        como: list(['Cardinalidad típica: <strong>1:N</strong> (propietaria 1, débil N). Puede ser 1:1.', 'Participación de la débil: <strong>siempre total</strong> (línea doble).', 'Participación de la propietaria: total o parcial, según el enunciado.']),
        identificar: '<p>El verbo que une la débil con su padre: “tiene”, “contiene”, “genera”, “pertenece”.</p>',
        ejemplo: { cotidiano: '<p>“La torre B <em>contiene</em> el apartamento 302.”</p>', bd: fig(weak('PRÉSTAMO', ['*nro_préstamo', 'monto'], 'genera', 'CUOTA', ['~nro_cuota', 'valor', 'fecha_pago'])) },
        grafico: '<p><strong>Rombo doble</strong>.</p>',
        cuando: { si: ['Une una débil con su propietaria.'], no: ['Otras relaciones de la débil con otras entidades (esas usan rombo simple).'] },
        error: { mal: '<p>Dibujar con rombo doble TODAS las relaciones en las que participa la débil.</p>', bien: '<p>Solo la relación con el propietario es identificadora. Si LÍNEA_PEDIDO se relaciona con PRODUCTO, ese rombo es simple.</p>' },
        ejercicio: {
          enunciado: 'LÍNEA_PEDIDO es débil de PEDIDO y cada línea se refiere a un PRODUCTO. ¿Cuál rombo es doble?',
          respuesta: '<p>Solo PEDIDO—<em>contiene</em>—LÍNEA_PEDIDO. La relación LÍNEA_PEDIDO—<em>refiere</em>—PRODUCTO es un rombo simple.</p>',
          explicacion: '<p>El producto no aporta a la identificación de la línea; solo el pedido lo hace.</p>',
        },
      },
      {
        titulo: 'Representación gráfica y diferencia con la fuerte', corto: 'Representación',
        que: fig(D.diagram({ w: 700, h: 250, nodes: [
          { id: 'p', t: 'E', l: 'PEDIDO', x: 100, y: 120, attrs: ['*nro_pedido', 'fecha'], side: 'top' },
          { id: 'r', t: 'R', l: 'contiene', x: 300, y: 120, ident: true },
          { id: 'l', t: 'E', l: 'LÍNEA_PEDIDO', x: 500, y: 120, weak: true, attrs: ['~nro_línea', 'cantidad'], side: 'top' },
          { id: 'q', t: 'R', l: 'refiere', x: 500, y: 215 },
          { id: 'x', t: 'E', l: 'PRODUCTO', x: 300, y: 215 }],
          edges: [{ a: 'p', b: 'r', ca: '1' }, { a: 'l', b: 'r', ca: 'N', total: true }, { a: 'l', b: 'q', ca: 'N', total: true, side: -1 }, { a: 'x', b: 'q', ca: '1' }] }), 'Modelo completo con una entidad débil.'),
        como: table(['Elemento', 'Símbolo', 'En el ejemplo'], [
          ['Entidad débil', 'Rectángulo doble', 'LÍNEA_PEDIDO'], ['Propietaria', 'Rectángulo simple', 'PEDIDO'], ['Relación identificadora', 'Rombo doble', 'contiene'],
          ['Participación de la débil', 'Línea doble', 'LÍNEA_PEDIDO–contiene'], ['Clave parcial', 'Subrayado punteado', 'nro_línea'], ['Otra relación de la débil', 'Rombo simple', 'refiere'],
        ]),
        identificar: table(['', 'Fuerte', 'Débil'], [['Clave', 'Primaria propia', 'Parcial + clave del propietario'], ['Rectángulo', 'Simple', 'Doble'], ['Existencia', 'Independiente', 'Depende del propietario'], ['Participación en la identificadora', '—', 'Siempre total']]),
        error: { mal: '<p>Olvidar alguno de los cuatro elementos: rectángulo doble, rombo doble, línea doble, subrayado punteado.</p>', bien: '<p>Revisa siempre los cuatro juntos.</p>' },
      },
      {
        titulo: 'Ejercicios de entidades débiles', corto: 'Ejercicios', tipo: 'multi',
        partes: [
          { h: 'Ejercicio 1', ejercicio: {
            enunciado: '“Un colegio tiene cursos (código único). Cada curso se divide en grupos A, B, C… y de cada grupo se guarda su jornada.” Modela.',
            respuesta: fig(weak('CURSO', ['*código', 'nombre'], 'divide', 'GRUPO', ['~letra', 'jornada'])),
            explicacion: '<p>El grupo “A” existe en todos los cursos → GRUPO es débil con clave parcial <em>letra</em>.</p>' } },
          { h: 'Ejercicio 2', ejercicio: {
            enunciado: '“Una empresa registra a sus empleados (código). De cada empleado se registran sus familiares beneficiarios con nombre, parentesco y fecha de nacimiento. Dos familiares del mismo empleado no tienen el mismo nombre.”',
            respuesta: fig(weak('EMPLEADO', ['*código', 'nombre'], 'tiene', 'FAMILIAR', ['~nombre', 'parentesco', 'fecha_nac'])),
            explicacion: '<p>FAMILIAR no tiene identificador propio; su nombre es único solo dentro de un empleado → clave parcial.</p>' } },
          { h: 'Ejercicio 3 — ¿Es débil o no?', ejercicio: {
            enunciado: '“Un taller registra vehículos (placa) y sus reparaciones. Cada reparación tiene un número de orden único del taller.” ¿REPARACIÓN es débil?',
            respuesta: '<p><strong>No</strong>: tiene número de orden único → fuerte, con participación total en su relación con VEHÍCULO.</p>',
            explicacion: '<p>Si el enunciado dijera “las reparaciones se numeran 1, 2, 3… por vehículo”, entonces sí sería débil.</p>' } },
        ],
      },
    ],
  });
})();
