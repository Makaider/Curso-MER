/* Módulo 1 — Fundamentos */
(function () {
  const { list, olist, table, box, fig, cmp, ent, rel, att } = R;

  const dgMini = D.diagram({
    w: 560, h: 190,
    nodes: [
      { id: 'e', t: 'E', l: 'ESTUDIANTE', x: 100, y: 120, attrs: ['*código', 'nombre'], side: 'top' },
      { id: 'r', t: 'R', l: 'matricula', x: 280, y: 120 },
      { id: 'c', t: 'E', l: 'CURSO', x: 460, y: 120, attrs: ['*id_curso', 'nombre'], side: 'top' },
    ],
    edges: [{ a: 'e', b: 'r', ca: 'N' }, { a: 'c', b: 'r', ca: 'M' }],
  });

  MER.add({
    id: 'fundamentos', num: 1, orden: 1, grupo: 'Conceptos',
    titulo: 'Fundamentos',
    resumen: 'Base de datos, modelo de datos, MER y los tres niveles de diseño.',
    objetivo: 'Entender qué problema resuelve el Modelo Entidad-Relación antes de aprender a dibujarlo.',
    items: [
      /* 1.1 ----------------------------------------------------------- */
      {
        titulo: '¿Qué es una base de datos?', corto: 'Base de datos',
        que: `<p>Una <strong>base de datos</strong> es un conjunto de datos <strong>organizados y relacionados</strong> entre sí, guardados de forma que se puedan consultar, modificar y proteger fácilmente.</p>
          <p>La palabra clave es <em>organizados</em>: no es un montón de información, es información con una estructura.</p>`,
        porque: list([
          'Para <strong>no repetir</strong> la misma información en muchos lugares.',
          'Para <strong>encontrar</strong> datos rápido (¿qué notas tiene Ana?).',
          'Para que <strong>varias personas</strong> usen los mismos datos a la vez sin contradicciones.',
          'Para <strong>proteger</strong> la información (quién puede ver o cambiar qué).',
        ]),
        como: `<p>Los datos se guardan en estructuras (normalmente tablas). Un programa llamado <strong>SGBD</strong> (Sistema Gestor de Bases de Datos, por ejemplo MySQL, PostgreSQL u Oracle) se encarga de guardarlos, buscarlos y cuidarlos.</p>
          ${table(['código', 'nombre', 'carrera'], [['1001', 'Ana Ruiz', 'Sistemas'], ['1002', 'Luis Mora', 'Industrial']])}
          <p class="muted">Cada fila es un estudiante; cada columna es un dato sobre él.</p>`,
        identificar: `<p>Hay una base de datos detrás cuando un sistema <strong>recuerda</strong> información entre un uso y otro: tu historial de compras, tus notas en la plataforma de la universidad, tus contactos del teléfono.</p>`,
        ejemplo: {
          cotidiano: `<p>La <strong>agenda de contactos</strong> de tu teléfono: cada contacto tiene nombre, teléfono y correo, y puedes buscarlos por nombre.</p>`,
          bd: `<p>El sistema de una <strong>biblioteca</strong> guarda libros, socios y préstamos. Cuando preguntas “¿quién tiene el libro X?”, la base de datos lo responde relacionando el préstamo con el socio.</p>`,
        },
        error: {
          mal: '<p>“Una base de datos es un archivo de Excel con muchos datos.”</p>',
          bien: '<p>Una base de datos exige <strong>estructura y relaciones</strong>, y se gestiona con un SGBD. Una hoja de cálculo suelta repite datos y no controla que sean coherentes.</p>',
          porque: 'Piensa siempre en “datos + organización + relaciones”. Si falta la organización, no es una base de datos bien diseñada.',
        },
        ejercicio: {
          enunciado: '¿Cuáles de estas situaciones necesitan una base de datos? a) Una lista de compras en un papel. b) El registro de pacientes y citas de una clínica. c) Una nota mental. d) Las ventas diarias de una cadena de tiendas.',
          respuesta: '<p><strong>b) y d).</strong></p>',
          explicacion: list([
            '<strong>b)</strong> Muchos pacientes, muchas citas, varios médicos que consultan los mismos datos: necesita organización y relaciones.',
            '<strong>d)</strong> Gran volumen de datos que deben consultarse (¿cuánto se vendió?) y relacionarse (producto, tienda, fecha).',
            '<strong>a) y c)</strong> Son datos pequeños, personales y temporales. No necesitan estructura ni acceso compartido.',
          ]),
        },
      },

      /* 1.2 ----------------------------------------------------------- */
      {
        titulo: '¿Qué es un modelo de datos?', corto: 'Modelo de datos',
        que: `<p>Un <strong>modelo de datos</strong> es una forma de <strong>describir</strong> qué datos vamos a guardar, cómo se organizan y cómo se relacionan, <strong>antes</strong> de construir la base de datos.</p>
          <p>Es como el <strong>plano</strong> de una casa: primero se dibuja, luego se construye.</p>`,
        porque: list([
          'Construir sin plano produce errores caros de corregir.',
          'Permite hablar con el cliente usando un dibujo, no código.',
          'Ayuda a descubrir datos que faltan o que sobran.',
        ]),
        como: `<p>Todo modelo de datos ofrece tres cosas:</p>
          ${olist(['<strong>Elementos</strong> para representar la realidad (por ejemplo: entidades, atributos, relaciones).', '<strong>Reglas</strong> que deben cumplir los datos (por ejemplo: “cada pedido pertenece a un cliente”).', '<strong>Una notación</strong>: símbolos para dibujarlo.'])}
          <p>Existen varios modelos: <strong>Entidad-Relación</strong> (conceptual), <strong>Relacional</strong> (tablas), orientado a objetos, documental, etc.</p>`,
        identificar: `<p>Si ves un dibujo o esquema que describe <em>qué datos existen</em> y <em>cómo se conectan</em>, sin datos reales concretos, estás ante un modelo de datos.</p>`,
        ejemplo: {
          cotidiano: `<p>El <strong>plano de un edificio</strong>: dice cuántos pisos, qué habitaciones y cómo se conectan, pero no dice quién vive en cada una.</p>`,
          bd: `<p>“Existen <strong>clientes</strong> y <strong>pedidos</strong>; cada pedido pertenece a un cliente.” Esta frase ya es un modelo: no dice que el cliente se llama Pedro, solo describe la estructura.</p>`,
        },
        error: {
          mal: '<p>Confundir el <strong>modelo</strong> con los <strong>datos</strong>: “El modelo es Pedro, que compró 3 camisas.”</p>',
          bien: '<p>El modelo describe <strong>tipos</strong> de cosas: CLIENTE compra PRODUCTO. “Pedro” y “camisa” son <strong>datos</strong> concretos que se guardarán después.</p>',
          porque: 'Pregúntate: ¿estoy describiendo una estructura general o un caso particular? El modelo siempre es general.',
        },
        ejercicio: {
          enunciado: 'Clasifica cada frase como <strong>modelo</strong> o <strong>dato</strong>: a) “Todo empleado trabaja en un departamento.” b) “María trabaja en Contabilidad.” c) “Cada producto tiene un precio.” d) “El arroz cuesta 4.500.”',
          respuesta: '<p>a) Modelo · b) Dato · c) Modelo · d) Dato</p>',
          explicacion: '<p>Las frases a) y c) hablan de <strong>todos</strong> los empleados o productos (estructura general). Las frases b) y d) hablan de un caso concreto (María, el arroz): son datos que se guardarán dentro de esa estructura.</p>',
        },
      },

      /* 1.3 ----------------------------------------------------------- */
      {
        titulo: '¿Qué es el Modelo Entidad-Relación?', corto: 'El MER',
        que: `<p>El <strong>Modelo Entidad-Relación (MER)</strong> es un modelo de datos <strong>conceptual</strong> que representa la realidad usando tres ideas:</p>
          ${table(['Idea', 'Pregunta que responde', 'Ejemplo'], [
            [ent('Entidad'), '¿De <strong>qué cosas</strong> necesito guardar información?', 'ESTUDIANTE, CURSO'],
            [att('Atributo'), '¿<strong>Qué datos</strong> guardo de cada cosa?', 'nombre, código'],
            [rel('Relación'), '¿Cómo se <strong>conectan</strong> esas cosas?', 'un estudiante <em>se matricula</em> en cursos'],
          ])}
          <p>Lo propuso <strong>Peter Chen en 1976</strong>. Por eso a su forma de dibujarlo se le llama <em>notación de Chen</em>.</p>`,
        porque: `<p>Porque es <strong>fácil de entender</strong> para cualquier persona (no requiere saber programar) y a la vez es lo bastante <strong>preciso</strong> para convertirlo después en tablas.</p>`,
        como: `<p>Se lee un problema del mundo real, se detectan las cosas importantes (entidades), sus datos (atributos) y las acciones que las unen (relaciones), y se dibujan con símbolos estándar.</p>`,
        identificar: `<p>Un diagrama MER se reconoce porque tiene <strong>rectángulos</strong> (entidades), <strong>rombos</strong> (relaciones) y <strong>óvalos</strong> (atributos) unidos por líneas.</p>`,
        ejemplo: {
          cotidiano: `<p>“Los <strong>estudiantes</strong> se <strong>matriculan</strong> en <strong>cursos</strong>.” Dos cosas (estudiantes y cursos) y una acción que las une (matricularse).</p>`,
          bd: fig(dgMini, 'Dos entidades, una relación y sus atributos.'),
        },
        grafico: `<p>En el diagrama anterior:</p>${list([
          `${ent('ESTUDIANTE')} y ${ent('CURSO')} son rectángulos → <strong>entidades</strong>.`,
          `${rel('matricula')} es un rombo → <strong>relación</strong>.`,
          `${att('nombre')} es un óvalo → <strong>atributo</strong>. Si está subrayado es la <strong>clave</strong>.`,
          '<strong>N</strong> y <strong>M</strong> indican cuántos pueden relacionarse (lo verás en Cardinalidad).',
        ])}<p class="muted">No te preocupes si aún no entiendes todos los símbolos: el módulo 2 los explica uno por uno.</p>`,
        error: {
          mal: '<p>Pensar que el MER ya son las tablas de la base de datos.</p>',
          bien: '<p>El MER es un <strong>dibujo conceptual</strong>. Las tablas se obtienen <strong>después</strong>, al transformar el MER al modelo relacional.</p>',
        },
        ejercicio: {
          enunciado: 'En la frase “Un <em>cliente</em> realiza <em>pedidos</em>; de cada pedido se guarda la <em>fecha</em>”, indica qué es entidad, qué es relación y qué es atributo.',
          respuesta: `<p>Entidades: ${ent('CLIENTE')}, ${ent('PEDIDO')} · Relación: ${rel('realiza')} · Atributo: ${att('fecha')} (de PEDIDO).</p>`,
          explicacion: list([
            '<strong>Cliente</strong> y <strong>pedido</strong> son cosas de las que se guardan varios datos y existen muchas → entidades.',
            '<strong>Realiza</strong> es un verbo que une cliente con pedido → relación.',
            '<strong>Fecha</strong> es un dato que describe al pedido → atributo.',
          ]),
        },
      },

      /* 1.4 ----------------------------------------------------------- */
      {
        titulo: '¿Para qué sirve el MER?', corto: 'Para qué sirve',
        que: `<p>El MER sirve como <strong>puente</strong> entre la persona que conoce el negocio (el cliente) y la persona que construye la base de datos (el desarrollador).</p>`,
        porque: list([
          '<strong>Comunicar</strong>: un dibujo se entiende mejor que un texto largo.',
          '<strong>Validar</strong>: el cliente puede decir “eso está mal, un pedido puede tener varios clientes”.',
          '<strong>Planificar</strong>: define qué tablas y columnas tendrá la base de datos.',
          '<strong>Documentar</strong>: quien llegue después al proyecto entiende la estructura rápidamente.',
        ]),
        como: olist([
          'El cliente describe su negocio (enunciado).',
          'El diseñador dibuja el MER.',
          'Juntos revisan el diagrama y lo corrigen.',
          'El MER se transforma en tablas (modelo relacional).',
          'Se crea la base de datos real.',
        ]),
        identificar: `<p>Siempre que te pidan “diseñar la base de datos de…” el primer paso es el MER.</p>`,
        ejemplo: {
          cotidiano: `<p>Antes de hacer un viaje dibujas la <strong>ruta en un mapa</strong> y la revisas con tus acompañantes. Si alguien ve un error, se corrige en el mapa, no a mitad del viaje.</p>`,
          bd: `<p>Un restaurante pide un sistema. Con el MER descubren que “una mesa puede tener varios pedidos en el día”, algo que el programador no sabía. Se corrige en el dibujo, sin haber escrito código.</p>`,
        },
        error: {
          mal: '<p>Saltarse el MER y crear tablas directamente “porque es más rápido”.</p>',
          bien: '<p>Diseñar primero: corregir un diagrama toma minutos; corregir una base de datos con datos reales puede tomar semanas.</p>',
        },
        ejercicio: {
          enunciado: 'Menciona dos beneficios concretos de hacer el MER antes de programar un sistema de inscripciones de un gimnasio.',
          respuesta: '<p>Ejemplos válidos: (1) el dueño del gimnasio puede revisar si faltan datos (por ejemplo, el horario de las clases); (2) se detectan reglas antes de programar (un socio puede inscribirse en varias clases); (3) sirve de documentación para futuros programadores.</p>',
          explicacion: '<p>Cualquier beneficio que implique <strong>comunicar, validar, planificar o documentar</strong> antes de construir es correcto.</p>',
        },
      },

      /* 1.5 ----------------------------------------------------------- */
      {
        titulo: '¿Qué problema resuelve el MER?', corto: 'Qué problema resuelve',
        que: `<p>Resuelve el problema de <strong>pasar de una descripción en lenguaje natural</strong> (confusa, incompleta, ambigua) a una <strong>estructura de datos precisa</strong>.</p>`,
        porque: `<p>Cuando los datos se guardan sin diseño aparecen tres problemas clásicos:</p>
          ${table(['Problema', 'Qué pasa', 'Ejemplo'], [
            ['<strong>Redundancia</strong>', 'El mismo dato se repite muchas veces.', 'El teléfono del cliente se escribe en cada una de sus 50 compras.'],
            ['<strong>Inconsistencia</strong>', 'Copias del mismo dato no coinciden.', 'Se actualiza el teléfono en una compra pero no en las otras 49.'],
            ['<strong>Ambigüedad</strong>', 'No está claro qué significa un dato.', '¿La columna “fecha” es de pedido o de entrega?'],
          ])}`,
        como: `<p>El MER separa cada “cosa” en su propia entidad y las conecta con relaciones. Así, cada dato se guarda <strong>una sola vez</strong> y en el lugar correcto.</p>`,
        identificar: `<p>Señal de alarma en un diseño: si ves el mismo dato (nombre, teléfono, dirección) repetido en muchas filas, falta separar una entidad.</p>`,
        ejemplo: {
          cotidiano: `<p>Si en tu cuaderno anotas la dirección de tu amigo cada vez que le prestas algo, y él se muda, tendrás que corregir muchas páginas. Mejor anotarla <strong>una vez</strong> en la página de “amigos”.</p>`,
          bd: `${cmp(
            table(['venta', 'cliente', 'teléfono'], [['1', 'Pedro', '300111'], ['2', 'Pedro', '300111'], ['3', 'Pedro', '<span style="color:var(--c-err)">311999</span>']]),
            `<p>${ent('CLIENTE')} guarda el teléfono una vez; ${ent('VENTA')} solo se relaciona con el cliente.</p>`,
            'Sin diseño', 'Con MER')}`,
        },
        error: {
          mal: '<p>Guardar todo en una sola lista grande “para tenerlo junto”.</p>',
          bien: '<p>Separar en entidades (CLIENTE, VENTA) y relacionarlas.</p>',
        },
        ejercicio: {
          enunciado: 'Una hoja tiene las columnas: <code>préstamo, fecha, nombre_socio, dirección_socio, título_libro, autor_libro</code>. ¿Qué problema aparecerá cuando un mismo socio pida 20 libros?',
          respuesta: '<p><strong>Redundancia</strong> (su nombre y dirección se repiten 20 veces) y riesgo de <strong>inconsistencia</strong> (si cambia la dirección, hay que cambiarla en 20 filas).</p>',
          explicacion: '<p>La solución con MER sería tener las entidades SOCIO, LIBRO y PRÉSTAMO (o una relación “presta”), guardando los datos del socio una sola vez.</p>',
        },
      },

      /* 1.6 ----------------------------------------------------------- */
      {
        titulo: 'Modelo conceptual, lógico y físico', corto: 'Conceptual · lógico · físico',
        que: `<p>El diseño de una base de datos se hace en <strong>tres niveles</strong>, de lo más general a lo más técnico:</p>
          ${table(['Nivel', '¿Qué describe?', '¿Quién lo entiende?', 'Herramienta'], [
            ['<strong>1. Conceptual</strong>', '<em>Qué</em> datos existen y cómo se relacionan.', 'Cualquier persona.', '<strong>MER</strong>'],
            ['<strong>2. Lógico</strong>', 'Cómo se organizan en tablas, claves foráneas.', 'Diseñadores de BD.', 'Modelo relacional'],
            ['<strong>3. Físico</strong>', 'Cómo se guardan en un SGBD concreto: tipos de datos, índices.', 'Programadores / DBA.', 'SQL (CREATE TABLE)'],
          ])}`,
        porque: `<p>Separar niveles permite pensar primero en el <strong>problema</strong> y después en la <strong>tecnología</strong>. El MER no cambia si mañana pasas de MySQL a PostgreSQL.</p>`,
        como: `<div class="ex-grid">
          <div class="ex-card"><div class="ex-h">1 · Conceptual (MER)</div><p>${ent('ESTUDIANTE')} con ${att('código')} y ${att('nombre')}</p></div>
          <div class="ex-card"><div class="ex-h">2 · Lógico (tabla)</div><p><code>ESTUDIANTE(<u>codigo</u>, nombre)</code></p></div>
          <div class="ex-card"><div class="ex-h">3 · Físico (SQL)</div><p><code>CREATE TABLE estudiante (codigo INT PRIMARY KEY, nombre VARCHAR(80));</code></p></div>
          <div class="ex-card"><div class="ex-h">Este curso</div><p>Se centra en el <strong>nivel conceptual</strong>: el MER.</p></div></div>`,
        identificar: list([
          'Si ves <strong>rectángulos, rombos y óvalos</strong> → conceptual.',
          'Si ves <strong>tablas con columnas y claves foráneas (FK)</strong> → lógico.',
          'Si ves <strong>tipos de dato</strong> (INT, VARCHAR) o código SQL → físico.',
        ]),
        ejemplo: {
          cotidiano: `<p>Construir una casa: (1) <strong>boceto</strong> con el cliente (“quiero 3 cuartos y un patio”), (2) <strong>plano técnico</strong> del arquitecto con medidas, (3) <strong>obra</strong> con materiales concretos.</p>`,
          bd: `<p>“Un cliente hace pedidos” (conceptual) → <code>PEDIDO(num, fecha, id_cliente FK)</code> (lógico) → <code>id_cliente INT NOT NULL REFERENCES cliente</code> (físico).</p>`,
        },
        error: {
          mal: '<p>Poner tipos de dato (<code>VARCHAR(50)</code>) o claves foráneas en el diagrama MER.</p>',
          bien: '<p>El MER no lleva claves foráneas ni tipos: <strong>las relaciones ya expresan la conexión</strong>. Las FK aparecen en el modelo lógico.</p>',
          porque: 'Si en tu MER una entidad tiene un atributo que es la clave de otra entidad (por ejemplo, <code>id_cliente</code> dentro de PEDIDO), bórralo y dibuja una relación.',
        },
        ejercicio: {
          enunciado: 'Indica el nivel: a) <code>precio DECIMAL(10,2)</code> b) Un rombo “compra” entre CLIENTE y PRODUCTO c) <code>COMPRA(id_cliente FK, id_producto FK, fecha)</code>',
          respuesta: '<p>a) Físico · b) Conceptual · c) Lógico</p>',
          explicacion: '<p>a) tiene tipo de dato → físico. b) usa símbolos del MER → conceptual. c) es una tabla con claves foráneas pero sin tipos → lógico.</p>',
        },
      },

      /* 1.7 ----------------------------------------------------------- */
      {
        titulo: '¿Qué es un diagrama MER?', corto: 'Diagrama MER',
        que: `<p>Un <strong>diagrama MER</strong> (o DER, diagrama entidad-relación) es el <strong>dibujo</strong> del modelo: usa símbolos estándar para mostrar entidades, atributos y relaciones.</p>`,
        porque: `<p>Porque una imagen permite ver <strong>todo el sistema de un vistazo</strong> y detectar errores (una entidad sin relaciones, un dato que falta).</p>`,
        como: `<p>Un diagrama se lee como frases: <strong>ENTIDAD — verbo — ENTIDAD</strong>.</p>
          ${fig(D.diagram({ w: 560, h: 110, nodes: [
            { id: 'a', t: 'E', l: 'AUTOR', x: 90, y: 55 }, { id: 'r', t: 'R', l: 'escribe', x: 280, y: 55 }, { id: 'b', t: 'E', l: 'LIBRO', x: 470, y: 55 }],
            edges: [{ a: 'a', b: 'r', ca: 'N' }, { a: 'b', b: 'r', ca: 'M' }] }), 'Se lee: “Un AUTOR escribe LIBROS” y “Un LIBRO es escrito por AUTORES”.')}
          <p>Siempre se lee en <strong>los dos sentidos</strong>.</p>`,
        identificar: list(['Tiene figuras geométricas conectadas por líneas.', 'Los nombres de las entidades suelen ir en MAYÚSCULAS y en singular.', 'Las relaciones son verbos.']),
        ejemplo: {
          cotidiano: `<p>Un <strong>mapa de metro</strong>: estaciones (cosas) conectadas por líneas (relaciones), con una leyenda de símbolos.</p>`,
          bd: fig(dgMini),
        },
        grafico: table(['Figura', 'Significa'], [
          ['Rectángulo', 'Entidad (una “cosa”)'], ['Rombo', 'Relación (una acción que une cosas)'], ['Óvalo', 'Atributo (un dato)'], ['Línea', 'Conexión entre los elementos'],
        ]),
        error: {
          mal: '<p>Leer el diagrama en un solo sentido: “Un autor escribe libros” y olvidar “un libro puede tener varios autores”.</p>',
          bien: '<p>Leer <strong>siempre</strong> en ambos sentidos. Esa lectura doble es la base de la cardinalidad.</p>',
        },
        ejercicio: {
          enunciado: 'Escribe las dos frases que se leen en un diagrama: CLIENTE — <em>realiza</em> — PEDIDO.',
          respuesta: '<p>“Un cliente realiza pedidos” y “Un pedido es realizado por un cliente”.</p>',
          explicacion: '<p>La primera frase se lee de izquierda a derecha y la segunda de derecha a izquierda (con el verbo en voz pasiva). Practicar esta doble lectura te ayudará mucho en el módulo de cardinalidad.</p>',
        },
        resumen: ['Base de datos = datos organizados y relacionados.', 'Modelo de datos = plano antes de construir.', 'MER = modelo conceptual con entidades, atributos y relaciones.', 'Niveles: conceptual (MER) → lógico (tablas) → físico (SQL).'],
      },
    ],
  });
})();
