/* Módulo 10 — Generalización y especialización */
(function () {
  const { list, olist, table, box, fig, cmp, steps, ent, rel, att } = R;

  /* Diagrama de jerarquía: superclase, círculo d/o, subclases */
  function gen(sup, supAttrs, dj, total, subs, o) {
    o = o || {};
    const W = o.w || 640, n = subs.length;
    const nodes = [
      { id: 's', t: 'E', l: sup, x: W / 2, y: o.sy || 105, attrs: supAttrs, side: 'top' },
      { id: 'c', t: 'ISA', l: dj, x: W / 2, y: (o.sy || 105) + 80 },
    ];
    const edges = [{ a: 's', b: 'c', total }];
    subs.forEach((sb, i) => {
      const x = n === 1 ? W / 2 : 90 + ((W - 180) * i) / (n - 1);
      nodes.push({ id: 'b' + i, t: 'E', l: sb.l, x, y: (o.sy || 105) + 165, attrs: sb.attrs, side: 'bottom', hl: sb.hl });
      edges.push({ a: 'c', b: 'b' + i, subset: true });
    });
    (o.extraNodes || []).forEach((x) => nodes.push(x));
    (o.extraEdges || []).forEach((x) => edges.push(x));
    return D.diagram({ w: W, h: o.h || 360, nodes, edges });
  }

  const persona = gen('PERSONA', ['*documento', 'nombre', 'fecha_nac'], 'o', false, [
    { l: 'ESTUDIANTE', attrs: ['código', 'carrera'] }, { l: 'EMPLEADO', attrs: ['cargo', 'salario'] }]);

  MER.add({
    id: 'generalizacion', num: 10, orden: 10, grupo: 'Conceptos',
    titulo: 'Generalización y especialización', resumen: 'Superclases, subclases, herencia y restricciones disjunta/solapada y total/parcial.',
    objetivo: 'Reconocer jerarquías de “tipos de” entidades, decidir cuándo usarlas y dibujarlas con sus restricciones.',
    requiere: ['entidades', 'atributos', 'relaciones', 'participacion'],
    items: [
      {
        titulo: '¿Qué es la especialización?', corto: 'Especialización',
        que: '<p>La <strong>especialización</strong> es el proceso de <strong>dividir</strong> una entidad general en <strong>subgrupos más específicos</strong> que tienen características propias.</p><p>Va de <strong>arriba hacia abajo</strong> (de lo general a lo particular).</p>',
        porque: '<p>Porque no todos los ejemplares de una entidad tienen los mismos datos. Un <em>empleado</em> por horas tiene “valor_hora”; uno de planta tiene “salario_mensual”. Si todo va en una sola entidad, muchos atributos quedarían vacíos.</p>',
        como: `${olist(['Partes de una entidad existente: EMPLEADO.', 'Descubres que hay tipos con datos distintos: de planta, por horas.', 'Creas una subclase por cada tipo y le pones <strong>solo sus datos propios</strong>.'])}
          ${fig(gen('EMPLEADO', ['*código', 'nombre'], 'd', true, [{ l: 'DE_PLANTA', attrs: ['salario_mensual'] }, { l: 'POR_HORAS', attrs: ['valor_hora'] }], { h: 330 }))}`,
        identificar: list(['“Existen dos tipos de…”, “los X pueden ser A o B”.', 'Algunos ejemplares tienen datos que otros no tienen.']),
        ejemplo: { cotidiano: '<p>“Vehículo” se especializa en “carro”, “moto” y “camión”: todos tienen placa, pero solo el camión tiene capacidad de carga.</p>', bd: '<p>CUENTA se especializa en AHORROS (tasa_interés) y CORRIENTE (cupo_sobregiro).</p>' },
        grafico: '<p>Superclase arriba, círculo en medio y subclases abajo. Símbolos explicados en detalle en los temas 7 a 9.</p>',
        error: { mal: '<p>Especializar sin que las subclases tengan nada propio.</p>', bien: '<p>Cada subclase debe tener <strong>al menos</strong> un atributo o una relación propia.</p>' },
        ejercicio: {
          enunciado: '“Los productos de una tienda pueden ser perecederos (con fecha de vencimiento) o no perecederos (con garantía en meses).” ¿Hay especialización? ¿Cuáles serían las subclases?',
          respuesta: '<p>Sí. Superclase PRODUCTO; subclases PERECEDERO (fecha_vencimiento) y NO_PERECEDERO (meses_garantía).</p>',
          explicacion: '<p>Cada tipo tiene un dato que el otro no tiene. Eso justifica la especialización.</p>',
        },
      },
      {
        titulo: '¿Qué es la generalización?', corto: 'Generalización',
        que: '<p>La <strong>generalización</strong> es el proceso <strong>inverso</strong>: <strong>unir</strong> varias entidades que comparten atributos en una entidad más general.</p><p>Va de <strong>abajo hacia arriba</strong> (de lo particular a lo general).</p>',
        porque: '<p>Para <strong>no repetir</strong> los atributos comunes en cada entidad y poder tratar a todas de la misma forma cuando haga falta.</p>',
        como: `${cmp(fig(D.diagram({ w: 460, h: 150, nodes: [
            { id: 'a', t: 'E', l: 'AUTO', x: 110, y: 110, attrs: ['*placa', 'marca', 'nro_puertas'], side: 'top' },
            { id: 'b', t: 'E', l: 'MOTO', x: 350, y: 110, attrs: ['*placa', 'marca', 'cilindraje'], side: 'top' }] })),
            fig(gen('VEHÍCULO', ['*placa', 'marca'], 'd', true, [{ l: 'AUTO', attrs: ['nro_puertas'] }, { l: 'MOTO', attrs: ['cilindraje'] }], { w: 460, h: 330 })),
            'Antes: datos repetidos', 'Después: generalizado')}`,
        identificar: '<p>Ves dos o más entidades con <strong>varios atributos iguales</strong> (misma clave incluso) y que en el fondo son “el mismo tipo de cosa”.</p>',
        ejemplo: { cotidiano: '<p>Perros y gatos → “mascota” (nombre, edad, dueño comunes).</p>', bd: '<p>PROFESOR y ESTUDIANTE (documento, nombre, correo) → PERSONA.</p>' },
        grafico: '<p>La misma notación que la especialización. El dibujo final es idéntico: solo cambia el <strong>camino mental</strong> por el que llegaste.</p>',
        error: { mal: '<p>Generalizar entidades que solo comparten un atributo “nombre” (CLIENTE y PRODUCTO tienen nombre).</p>', bien: '<p>Solo se generaliza si <strong>son el mismo tipo de cosa</strong> (“todo auto <strong>es un</strong> vehículo”). Un producto no “es un” cliente.</p>' },
        ejercicio: {
          enunciado: 'Tienes MÉDICO (documento, nombre, teléfono, especialidad) y ENFERMERO (documento, nombre, teléfono, turno). ¿Cómo generalizas?',
          respuesta: fig(gen('PERSONAL', ['*documento', 'nombre', 'teléfono'], 'd', false, [{ l: 'MÉDICO', attrs: ['especialidad'] }, { l: 'ENFERMERO', attrs: ['turno'] }], { h: 330 })),
          explicacion: '<p>Los atributos repetidos suben a la superclase; los específicos se quedan en cada subclase. Total/parcial y d/o dependen del enunciado (aquí se asumió disjunta y parcial: puede haber personal administrativo).</p>',
        },
      },
      {
        titulo: 'Diferencia entre generalización y especialización', corto: 'Diferencia',
        que: table(['', 'Especialización', 'Generalización'], [
          ['Dirección', 'Arriba → abajo', 'Abajo → arriba'], ['Parte de', 'Una entidad general', 'Varias entidades parecidas'], ['Pregunta', '¿Hay tipos con datos propios?', '¿Estas entidades comparten datos y son el mismo tipo de cosa?'],
          ['Resultado', 'Superclase + subclases', 'Superclase + subclases'], ['Símbolos', 'Iguales', 'Iguales'],
        ]),
        porque: '<p>Conocer ambos caminos te ayuda a detectar la jerarquía, venga del enunciado de la forma que venga.</p>',
        como: '<p>En un ejercicio da igual cómo llegaste: el diagrama final es el mismo. Lo importante es que la jerarquía sea correcta.</p>',
        identificar: list(['El enunciado <strong>describe una entidad y luego sus tipos</strong> → especialización.', 'El enunciado <strong>describe entidades separadas con datos repetidos</strong> → generalización.']),
        ejemplo: { cotidiano: '<p>Especializar: “animal” → mamífero, ave. Generalizar: “mamífero”, “ave” → animal.</p>', bd: '<p>Especializar: CLIENTE → PERSONA_NATURAL, EMPRESA. Generalizar: CAMIÓN, BUS → VEHÍCULO.</p>' },
        error: { mal: '<p>Pensar que se dibujan distinto.</p>', bien: '<p>Se dibujan igual; por eso muchos textos hablan de “generalización/especialización” como un solo concepto (a veces se le llama <strong>jerarquía ES-UN</strong> o <strong>IS-A</strong>).</p>' },
        ejercicio: {
          enunciado: 'Indica si es especialización o generalización: a) “Los clientes pueden ser personas naturales o empresas.” b) “Tenemos las entidades CAMIÓN y BUS; ambas tienen placa, marca y modelo.”',
          respuesta: '<p>a) Especialización · b) Generalización</p>',
          explicacion: '<p>a) parte de CLIENTE y lo divide. b) parte de dos entidades y las une.</p>',
        },
      },
      {
        titulo: 'Superclase y subclase', corto: 'Superclase y subclase',
        que: table(['Concepto', 'Definición', 'Ejemplo'], [
          ['<strong>Superclase</strong>', 'Entidad general que contiene los atributos y relaciones comunes.', 'PERSONA'],
          ['<strong>Subclase</strong>', 'Entidad específica que es un subconjunto de la superclase y añade datos propios.', 'ESTUDIANTE, EMPLEADO'],
        ]),
        porque: '<p>Separar lo común de lo específico evita repetición y atributos vacíos.</p>',
        como: `<p>Relación <strong>ES-UN</strong>: todo ESTUDIANTE <strong>es una</strong> PERSONA. Un ejemplar de la subclase es <strong>el mismo</strong> ejemplar de la superclase (no es otra cosa): Ana la estudiante es Ana la persona.</p>${fig(persona)}`,
        identificar: '<p>Prueba de la frase: “<strong>Todo</strong> [subclase] <strong>es un</strong> [superclase]”. Si suena correcto siempre, la jerarquía es válida.</p>',
        ejemplo: { cotidiano: '<p>“Todo perro es un animal” ✓. “Todo animal es un perro” ✗.</p>', bd: '<p>“Todo empleado es una persona” ✓. “Todo pedido es un cliente” ✗ (no es jerarquía, es relación).</p>' },
        grafico: list(['Superclase: rectángulo arriba.', 'Subclases: rectángulos abajo.', 'Unidas a través de un <strong>círculo</strong>, con el símbolo <strong>⊂</strong> en las líneas a las subclases.', 'Las subclases <strong>no llevan clave propia</strong>: usan la de la superclase.']),
        error: { mal: '<p>Poner una clave primaria en cada subclase (ESTUDIANTE con <u>id_estudiante</u>).</p>', bien: '<p>La subclase hereda la clave de la superclase (documento). Puede tener otros atributos únicos (código de estudiante) como atributos normales.</p>' },
        ejercicio: {
          enunciado: 'Aplica la prueba ES-UN: a) CUENTA_AHORROS / CUENTA b) FACTURA / CLIENTE c) GERENTE / EMPLEADO d) RUEDA / AUTO',
          respuesta: '<p>Válidas: a) y c). No válidas: b) y d).</p>',
          explicacion: '<p>b) es una relación (un cliente tiene facturas). d) es composición (un auto <em>tiene</em> ruedas), no “es un”.</p>',
        },
      },
      {
        titulo: 'Herencia de atributos', corto: 'Herencia de atributos',
        que: '<p>Las subclases <strong>heredan todos los atributos</strong> de la superclase (incluida la clave) y además tienen los suyos.</p>',
        porque: '<p>Así los atributos comunes se definen una sola vez.</p>',
        como: `${fig(persona)}
          ${table(['Entidad', 'Atributos propios', 'Atributos heredados', 'Total de atributos'], [
            ['PERSONA', 'documento, nombre, fecha_nac', '—', '3'],
            ['ESTUDIANTE', 'código, carrera', 'documento, nombre, fecha_nac', '5'],
            ['EMPLEADO', 'cargo, salario', 'documento, nombre, fecha_nac', '5'],
          ])}`,
        identificar: '<p>Para cada atributo pregunta: <strong>¿lo tienen TODOS los ejemplares de la superclase?</strong> Sí → va arriba. Solo algunos → va en la subclase correspondiente.</p>',
        ejemplo: { cotidiano: '<p>Todos los animales respiran (arriba); solo las aves tienen plumas (subclase AVE).</p>', bd: '<p>Todas las personas tienen nombre (PERSONA); solo los empleados tienen salario (EMPLEADO).</p>' },
        grafico: '<p>Los atributos heredados <strong>no se vuelven a dibujar</strong> en las subclases.</p>',
        error: {
          mal: fig(gen('PERSONA', ['*documento', 'nombre'], 'o', false, [{ l: 'ESTUDIANTE', attrs: ['nombre', 'carrera'] }, { l: 'EMPLEADO', attrs: ['nombre', 'salario'] }], { h: 330 })),
          bien: fig(gen('PERSONA', ['*documento', 'nombre'], 'o', false, [{ l: 'ESTUDIANTE', attrs: ['carrera'] }, { l: 'EMPLEADO', attrs: ['salario'] }], { h: 330 })),
          porque: '“nombre” ya está en PERSONA; repetirlo en las subclases es redundante.',
        },
        ejercicio: {
          enunciado: 'VEHÍCULO se especializa en AUTO y CAMIÓN. Ubica: placa, color, nro_puertas, capacidad_carga, marca, nro_ejes.',
          respuesta: '<p>VEHÍCULO: placa (clave), color, marca · AUTO: nro_puertas · CAMIÓN: capacidad_carga, nro_ejes.</p>',
          explicacion: '<p>Todo vehículo tiene placa, color y marca → arriba. Los demás solo aplican a un tipo.</p>',
        },
      },
      {
        titulo: 'Herencia de relaciones', corto: 'Herencia de relaciones',
        que: '<p>Las subclases también <strong>heredan las relaciones</strong> de la superclase, y pueden tener <strong>relaciones propias</strong>.</p>',
        porque: '<p>Si toda persona <em>vive en</em> una ciudad, también el estudiante y el empleado viven en una ciudad, sin dibujarlo dos veces.</p>',
        como: fig(gen('PERSONA', ['*documento', 'nombre'], 'o', false, [{ l: 'ESTUDIANTE' }, { l: 'EMPLEADO' }], {
          w: 700, h: 470,
          extraNodes: [{ id: 'r1', t: 'R', l: 'vive_en', x: 590, y: 105 }, { id: 'ci', t: 'E', l: 'CIUDAD', x: 590, y: 25 },
            { id: 'r2', t: 'R', l: 'inscribe', x: 90, y: 360 }, { id: 'cu', t: 'E', l: 'CURSO', x: 90, y: 440 },
            { id: 'r3', t: 'R', l: 'trabaja_en', x: 610, y: 360 }, { id: 'de', t: 'E', l: 'DEPARTAMENTO', x: 610, y: 440 }],
          extraEdges: [{ a: 's', b: 'r1', ca: 'N' }, { a: 'ci', b: 'r1', ca: '1' }, { a: 'b0', b: 'r2', ca: 'N' }, { a: 'cu', b: 'r2', ca: 'M' },
            { a: 'b1', b: 'r3', ca: 'N' }, { a: 'de', b: 'r3', ca: '1' }],
        }), 'vive_en es de PERSONA (la heredan ambas subclases). inscribe es solo de ESTUDIANTE y trabaja_en solo de EMPLEADO.'),
        identificar: '<p>Para cada relación pregunta: <strong>¿participan todos los tipos?</strong> Sí → conéctala a la superclase. Solo un tipo → conéctala a esa subclase.</p>',
        ejemplo: { cotidiano: '<p>Todos los empleados de un hospital marcan asistencia (superclase); solo los médicos firman recetas (subclase).</p>', bd: '<p>Solo ESTUDIANTE se <em>inscribe</em> en CURSO; solo EMPLEADO <em>trabaja_en</em> DEPARTAMENTO.</p>' },
        grafico: '<p>La relación se dibuja conectada a la entidad (superclase o subclase) donde corresponde.</p>',
        error: { mal: '<p>Conectar <em>inscribe</em> a PERSONA, permitiendo que un empleado que no estudia se inscriba en cursos.</p>', bien: '<p>Conectarla solo a ESTUDIANTE.</p>' },
        ejercicio: {
          enunciado: '“Toda cuenta bancaria pertenece a un cliente. Solo las cuentas corrientes tienen chequeras asociadas.” ¿Dónde conectas cada relación?',
          respuesta: '<p><em>pertenece</em> a CUENTA (superclase). <em>tiene</em> CHEQUERA a CORRIENTE (subclase).</p>',
          explicacion: '<p>La primera aplica a todas las cuentas; la segunda solo a un tipo.</p>',
        },
      },
      {
        titulo: 'Restricción de disyunción: disjunta vs. solapada', corto: 'Disjunta / solapada',
        que: table(['Restricción', 'Pregunta', 'Letra', 'Ejemplo'], [
          ['<strong>Disjunta</strong>', '¿Un ejemplar puede ser de <strong>solo una</strong> subclase?', '<strong>d</strong>', 'Un vehículo es auto <em>o</em> moto, nunca ambos'],
          ['<strong>Solapada</strong> (superpuesta)', '¿Un ejemplar puede ser de <strong>varias</strong> subclases a la vez?', '<strong>o</strong>', 'Una persona puede ser estudiante <em>y</em> empleado'],
        ]),
        porque: '<p>Define una regla importante: ¿puede un registro estar en dos subclases?</p>',
        como: cmp(fig(gen('VEHÍCULO', ['*placa'], 'd', true, [{ l: 'AUTO' }, { l: 'MOTO' }], { w: 420, h: 300 })), fig(gen('PERSONA', ['*documento'], 'o', false, [{ l: 'ESTUDIANTE' }, { l: 'EMPLEADO' }], { w: 420, h: 300 })), 'Disjunta (d)', 'Solapada (o)').replace(/cmp-bad/, 'cmp-good').replace(/✗ Disjunta/, '✓ Disjunta'),
        identificar: list(['Disjunta: “o bien … o bien”, “solo uno de”, “no puede ser ambos”, tipos excluyentes.', 'Solapada: “puede ser a la vez”, “también”, “uno o varios de estos tipos”.']),
        ejemplo: { cotidiano: '<p>Disjunta: tu estado civil (soltero, casado…). Solapada: tus pasatiempos (músico, deportista…).</p>', bd: '<p>Disjunta: PAGO en EFECTIVO / TARJETA. Solapada: USUARIO comprador / vendedor en un marketplace.</p>' },
        grafico: '<p>La letra dentro del círculo: <strong>d</strong> = disjoint (disjunta), <strong>o</strong> = overlapping (solapada).</p>',
        error: { mal: '<p>Olvidar poner la letra en el círculo.</p>', bien: '<p>El círculo siempre lleva <strong>d</strong> u <strong>o</strong>.</p>' },
        ejercicio: {
          enunciado: '“Un miembro de la universidad puede ser profesor, investigador o ambos.” ¿d u o?',
          respuesta: '<p><strong>o</strong> (solapada).</p>',
          explicacion: '<p>“o ambos” indica que un ejemplar puede estar en dos subclases.</p>',
        },
      },
      {
        titulo: 'Restricción de completitud: total vs. parcial', corto: 'Total / parcial',
        que: table(['Restricción', 'Pregunta', 'Símbolo', 'Ejemplo'], [
          ['<strong>Total</strong>', '¿Todo ejemplar de la superclase <strong>debe</strong> pertenecer a alguna subclase?', 'Línea <strong>doble</strong> superclase–círculo', 'Todo vehículo es auto o moto'],
          ['<strong>Parcial</strong>', '¿Puede haber ejemplares que <strong>no</strong> estén en ninguna subclase?', 'Línea <strong>simple</strong>', 'Hay personas que no son ni estudiantes ni empleados'],
        ]),
        porque: '<p>Indica si la superclase puede tener ejemplares “genéricos”, sin tipo específico.</p>',
        como: '<p>Es la misma idea de participación total/parcial del módulo 7, aplicada a la jerarquía.</p>',
        identificar: list(['Total: “todo X es A o B”, “debe ser de uno de los tipos”.', 'Parcial: “algunos X son…”, “puede haber otros”, o hay tipos que el sistema no detalla.']),
        ejemplo: { cotidiano: '<p>Total: toda moneda es de cara o sello. Parcial: no todos los animales de un zoológico son felinos o aves.</p>', bd: '<p>Total: todo PAGO es EFECTIVO o TARJETA. Parcial: algunos EMPLEADOS son INGENIEROS; los demás no tienen subclase.</p>' },
        grafico: cmp(fig(gen('PAGO', ['*nro_pago'], 'd', true, [{ l: 'EFECTIVO' }, { l: 'TARJETA' }], { w: 420, h: 300 })), fig(gen('EMPLEADO', ['*código'], 'd', false, [{ l: 'INGENIERO' }, { l: 'SECRETARIA' }], { w: 420, h: 300 })), 'Total (línea doble)', 'Parcial (línea simple)').replace(/cmp-bad/, 'cmp-good').replace(/✗ Total/, '✓ Total'),
        error: { mal: '<p>Confundir la línea doble de la jerarquía con “disjunta”.</p>', bien: '<p>La línea doble habla de <strong>completitud</strong> (total); la letra del círculo habla de <strong>disyunción</strong> (d/o). Son independientes.</p>' },
        ejercicio: {
          enunciado: '“Todo cliente de la aseguradora es persona natural o empresa.” ¿Total o parcial?',
          respuesta: '<p><strong>Total</strong> (y además disjunta).</p>',
          explicacion: '<p>“Todo cliente es…” obliga a que cada cliente sea de un tipo.</p>',
        },
      },
      {
        titulo: 'Las cuatro combinaciones', corto: 'Combinaciones',
        que: '<p>Las dos restricciones son independientes, así que hay <strong>cuatro combinaciones</strong>:</p>',
        como: `<div class="cols cols-2">
          <div>${fig(gen('VEHÍCULO', ['*placa'], 'd', true, [{ l: 'AUTO' }, { l: 'MOTO' }], { w: 420, h: 300 }), '<strong>Disjunta + total</strong>: todo vehículo es exactamente uno de los tipos.')}</div>
          <div>${fig(gen('EMPLEADO', ['*código'], 'd', false, [{ l: 'INGENIERO' }, { l: 'CONTADOR' }], { w: 420, h: 300 }), '<strong>Disjunta + parcial</strong>: como máximo un tipo; puede no tener ninguno.')}</div>
          <div>${fig(gen('USUARIO', ['*id'], 'o', true, [{ l: 'COMPRADOR' }, { l: 'VENDEDOR' }], { w: 420, h: 300 }), '<strong>Solapada + total</strong>: al menos un tipo; puede tener varios.')}</div>
          <div>${fig(gen('PERSONA', ['*documento'], 'o', false, [{ l: 'ESTUDIANTE' }, { l: 'EMPLEADO' }], { w: 420, h: 300 }), '<strong>Solapada + parcial</strong>: ninguno, uno o varios tipos.')}</div></div>`,
        identificar: table(['', 'Total (doble)', 'Parcial (simple)'], [['<strong>Disjunta (d)</strong>', 'exactamente 1 subclase', '0 o 1 subclase'], ['<strong>Solapada (o)</strong>', '1 o más subclases', '0, 1 o más subclases']]),
        grafico: table(['Símbolo', 'Significado'], [['Círculo', 'Punto de especialización'], ['d', 'Disjunta'], ['o', 'Solapada'], ['Línea doble superclase–círculo', 'Total'], ['Línea simple superclase–círculo', 'Parcial'], ['⊂ en línea a subclase', 'La subclase es subconjunto de la superclase']]),
        ejercicio: {
          enunciado: '“En un hospital, todo el personal es médico, enfermero o administrativo, y nadie ocupa dos de esos cargos.” ¿Qué combinación?',
          respuesta: '<p><strong>Disjunta + total</strong>: círculo con <strong>d</strong> y línea doble.</p>',
          explicacion: '<p>“todo el personal es…” → total. “nadie ocupa dos” → disjunta.</p>',
        },
      },
      {
        titulo: 'Cómo identificarla en un enunciado · cuándo usarla y cuándo no', corto: 'Identificar y decidir',
        que: '<p>Un método para decidir si un enunciado requiere generalización/especialización.</p>',
        como: steps([
          { t: 'Busca las frases de tipos', html: '<p>“tipos de”, “pueden ser”, “se clasifican en”, “existen dos clases de”, “A o B”.</p>' },
          { t: 'Aplica la prueba ES-UN', html: '<p>“Todo A <strong>es un</strong> X”. Si no suena bien, no es jerarquía.</p>' },
          { t: 'Verifica diferencias reales', html: '<p>¿Cada tipo tiene <strong>atributos propios</strong> o <strong>relaciones propias</strong>? Si no, usa un simple atributo <code>tipo</code>.</p>' },
          { t: 'Reparte atributos y relaciones', html: '<p>Lo común arriba; lo específico abajo.</p>' },
          { t: 'Decide d/o', html: '<p>¿Puede ser de dos tipos a la vez?</p>' },
          { t: 'Decide total/parcial', html: '<p>¿Todo ejemplar debe ser de algún tipo?</p>' },
        ]),
        cuando: {
          si: ['Los tipos tienen atributos distintos.', 'Los tipos participan en relaciones distintas.', 'El enunciado pide tratar a todos juntos y también por separado.'],
          no: ['Los tipos solo se diferencian por el nombre (usa un atributo <em>tipo</em> o <em>categoría</em>).', 'La supuesta subclase no “es un” tipo de la superclase.', 'Los “tipos” son en realidad estados que cambian (activo/inactivo → atributo <em>estado</em>).'],
        },
        error: {
          mal: fig(gen('PRODUCTO', ['*código', 'precio'], 'd', true, [{ l: 'ROJO' }, { l: 'AZUL' }, { l: 'VERDE' }], { w: 520, h: 300 })),
          bien: `<p>${ent('PRODUCTO')} con atributo ${att('color')}. Las subclases ROJO, AZUL y VERDE no tienen nada propio.</p>`,
          porque: 'Si al quitar la subclase no pierdes ningún atributo ni relación, no la necesitabas.',
        },
      },
      {
        titulo: 'Ejercicios: ¿corresponde usar generalización?', corto: 'Ejercicios', tipo: 'multi',
        intro: 'En cada caso decide primero <strong>si corresponde</strong> y solo después dibuja.',
        partes: [
          { h: 'Caso 1', ejercicio: {
            enunciado: '“Los clientes de un banco pueden ser personas naturales (cédula, fecha de nacimiento) o empresas (NIT, razón social, representante legal). De todos se guarda dirección y teléfono. Todo cliente es de uno de los dos tipos.”',
            respuesta: fig(gen('CLIENTE', ['*id_cliente', 'dirección', 'teléfono'], 'd', true, [{ l: 'PERSONA_NATURAL', attrs: ['cédula', 'fecha_nac'] }, { l: 'EMPRESA', attrs: ['nit', 'razón_social', 'representante'] }], { w: 680, h: 360 })),
            explicacion: list(['Sí corresponde: cada tipo tiene atributos propios.', 'Clave común: se crea id_cliente porque cédula y NIT no aplican a todos.', 'Total (“todo cliente es…”) y disjunta (no se puede ser ambas).']) } },
          { h: 'Caso 2', ejercicio: {
            enunciado: '“Los productos se clasifican en categorías: aseo, alimentos y bebidas. De todos se guarda código, nombre y precio.”',
            respuesta: '<p><strong>No</strong> corresponde. Basta un atributo <em>categoría</em> en PRODUCTO (o una entidad CATEGORÍA si tiene datos propios).</p>',
            explicacion: '<p>Los tipos no tienen atributos ni relaciones diferentes.</p>' } },
          { h: 'Caso 3', ejercicio: {
            enunciado: '“En un club, los miembros pueden ser deportistas (con deporte y categoría), entrenadores (con licencia) o ambos. También hay miembros que solo son socios sociales, sin datos adicionales.”',
            respuesta: fig(gen('MIEMBRO', ['*nro_miembro', 'nombre'], 'o', false, [{ l: 'DEPORTISTA', attrs: ['deporte', 'categoría'] }, { l: 'ENTRENADOR', attrs: ['licencia'] }], { h: 360 })),
            explicacion: list(['Sí corresponde: datos propios en cada tipo.', '“o ambos” → solapada (o).', 'Hay miembros sin tipo (socios sociales) → parcial (línea simple).']) } },
          { h: 'Caso 4', ejercicio: {
            enunciado: '“Un pedido puede estar en estado pendiente, enviado o entregado.”',
            respuesta: '<p><strong>No</strong> corresponde: es un atributo <em>estado</em>.</p>',
            explicacion: '<p>Los estados cambian con el tiempo y no aportan datos propios. Un pedido no “es un” enviado: <em>está</em> enviado.</p>' } },
        ],
      },
    ],
  });
})();
