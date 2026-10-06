/* Módulo 9 — Relaciones recursivas */
(function () {
  const { list, olist, table, box, fig, cmp, ent, rel } = R;
  const rec = (e, r, c1, role1, c2, role2, attrs, t1, t2) => D.diagram({ w: 560, h: 210, nodes: [
    { id: 'e', t: 'E', l: e, x: 160, y: 105, attrs, side: 'left' }, { id: 'r', t: 'R', l: r, x: 420, y: 105 }],
    edges: [{ a: 'e', b: 'r', via: [[160, 32], [420, 32]], ca: c1, m: role1, total: t1, side: -1 },
      { a: 'e', b: 'r', via: [[160, 178], [420, 178]], ca: c2, m: role2, total: t2 }] });

  MER.add({
    id: 'recursivas', num: 9, orden: 9, grupo: 'Conceptos',
    titulo: 'Relaciones recursivas', resumen: 'Cuando una entidad se relaciona consigo misma: roles y cardinalidades.',
    objetivo: 'Modelar jerarquías y conexiones entre ejemplares de la misma entidad usando roles.',
    requiere: ['relaciones', 'cardinalidad', 'participacion'],
    items: [
      {
        titulo: '¿Qué es una relación recursiva?', corto: 'Qué es',
        que: '<p>Una relación <strong>recursiva</strong> (unaria o reflexiva) es una relación en la que participa <strong>una sola entidad</strong>, pero <strong>dos veces</strong>: un ejemplar se relaciona con <strong>otro ejemplar de la misma entidad</strong>.</p>',
        porque: '<p>Para modelar jerarquías (jefe–subordinado), secuencias (curso–prerrequisito) o parejas (persona–cónyuge) sin duplicar entidades.</p>',
        como: `${fig(rec('EMPLEADO', 'supervisa', '1', 'supervisor', 'N', 'supervisado'))}
          <p>Ejemplares: (Ana supervisa a Luis), (Ana supervisa a Eva), (Luis supervisa a Pedro). Todos son EMPLEADOS.</p>`,
        identificar: list(['El verbo tiene el <strong>mismo sustantivo</strong> a ambos lados: “un empleado supervisa a otros <strong>empleados</strong>”.', 'Palabras: “otro/otros”, “jefe de”, “prerrequisito de”, “casado con”, “recomienda a”.']),
        ejemplo: { cotidiano: '<p>“Una persona es <strong>amiga de</strong> otras personas.” Todos son personas.</p>', bd: '<p>CATEGORÍA <em>contiene</em> subcategorías: “Electrónica” contiene “Celulares”, que contiene “Accesorios”.</p>' },
        grafico: '<p>Un rectángulo con <strong>dos líneas</strong> hacia el mismo rombo. Cada línea lleva un <strong>rol</strong> y su cardinalidad.</p>',
        cuando: { si: ['Ambos participantes son del mismo tipo y guardan los mismos datos.'], no: ['Los participantes son de tipos distintos con datos distintos (usa entidades separadas).'] },
        error: {
          mal: fig(D.diagram({ w: 560, h: 110, nodes: [{ id: 'a', t: 'E', l: 'JEFE', x: 90, y: 55, bad: true }, { id: 'r', t: 'R', l: 'supervisa', x: 280, y: 55 }, { id: 'b', t: 'E', l: 'EMPLEADO', x: 470, y: 55 }], edges: [{ a: 'a', b: 'r', ca: '1' }, { a: 'b', b: 'r', ca: 'N' }] })),
          bien: fig(rec('EMPLEADO', 'supervisa', '1', 'supervisor', 'N', 'supervisado')),
          porque: 'Un jefe también es un empleado (tiene código, nombre, salario). Crear JEFE duplicaría datos.',
        },
        ejercicio: {
          enunciado: '¿Cuáles son recursivas? a) Un usuario sigue a otros usuarios. b) Un cliente compra productos. c) Un curso es prerrequisito de otro curso. d) Una ciudad limita con otras ciudades.',
          respuesta: '<p>a), c) y d).</p>',
          explicacion: '<p>En b) participan dos entidades distintas.</p>',
        },
      },
      {
        titulo: 'Los roles', corto: 'Roles',
        que: '<p>Un <strong>rol</strong> es el <strong>papel</strong> que cumple cada ejemplar en la relación. En una recursiva hay dos roles, uno por cada línea.</p>',
        porque: '<p>Sin roles no se sabe quién supervisa a quién: la relación sería ambigua.</p>',
        como: table(['Relación', 'Rol 1', 'Rol 2'], [['supervisa', 'supervisor', 'supervisado'], ['es_prerrequisito', 'requisito', 'dependiente'], ['casado_con', 'esposo(a)', 'esposo(a)'], ['sigue', 'seguidor', 'seguido'], ['contiene (categorías)', 'padre', 'hija']]),
        identificar: '<p>Convierte la frase en “<em>[rol 1]</em> verbo <em>[rol 2]</em>”: el <em>supervisor</em> supervisa al <em>supervisado</em>.</p>',
        ejemplo: { cotidiano: '<p>En una familia: “madre” e “hijo” son roles de PERSONA.</p>', bd: fig(rec('CURSO', 'requiere', 'N', 'requisito', 'M', 'dependiente')) },
        grafico: '<p>Texto en cursiva sobre cada línea.</p>',
        error: { mal: '<p>Dibujar las dos líneas sin roles.</p>', bien: '<p>Etiqueta siempre ambas líneas.</p>' },
        ejercicio: {
          enunciado: 'Nombra los roles de: “Un jugador puede recomendar a otros jugadores para el equipo.”',
          respuesta: '<p><strong>recomendador</strong> y <strong>recomendado</strong>.</p>',
          explicacion: '<p>Un rol es quien realiza la acción y el otro quien la recibe.</p>',
        },
      },
      {
        titulo: 'Cardinalidades en relaciones recursivas', corto: 'Cardinalidades', tipo: 'multi',
        intro: 'Se usa el mismo método de las dos preguntas, pero preguntando <strong>por rol</strong>: “Un <em>supervisor</em>, ¿a cuántos supervisa?” y “Un <em>supervisado</em>, ¿cuántos supervisores tiene?”.',
        partes: [
          { h: '1:N — Jerarquías', que: '<p>Un ejemplar tiene muchos “hijos”, cada hijo tiene un solo “padre”.</p>',
            grafico: fig(rec('EMPLEADO', 'supervisa', '1', 'supervisor', 'N', 'supervisado')) + list(['Un supervisor supervisa a N empleados (N junto al rol supervisado).', 'Un supervisado tiene 1 supervisor (1 junto al rol supervisor).', 'Parcial en ambos roles: el gerente general no tiene supervisor y muchos empleados no supervisan a nadie.']),
            ejercicio: { enunciado: '“Una categoría puede tener varias subcategorías; cada subcategoría pertenece a una sola categoría padre.” Cardinalidad.', respuesta: fig(rec('CATEGORÍA', 'contiene', '1', 'padre', 'N', 'hija')), explicacion: '<p>1:N. Las categorías raíz no tienen padre (participación parcial).</p>' } },
          { h: '1:1 — Parejas', que: '<p>Cada ejemplar se empareja con como máximo otro.</p>',
            grafico: fig(rec('PERSONA', 'casado_con', '1', 'esposo(a)', '1', 'esposo(a)')),
            ejercicio: { enunciado: '“Para las vacaciones, cada empleado puede tener asignado un único reemplazo (otro empleado), y un empleado puede ser reemplazo de como máximo un compañero.” Cardinalidad.', respuesta: fig(rec('EMPLEADO', 'reemplaza', '1', 'titular', '1', 'reemplazo')), explicacion: '<p>1:1 recursiva: un titular tiene como máximo 1 reemplazo y un reemplazo cubre como máximo a 1 titular. Participación parcial en ambos roles (“puede”).</p>' } },
          { h: 'N:M — Redes', que: '<p>Cada ejemplar puede relacionarse con muchos en ambos roles.</p>',
            grafico: fig(rec('CURSO', 'requiere', 'N', 'requisito', 'M', 'dependiente')) + '<p>Un curso puede tener varios prerrequisitos y ser prerrequisito de varios cursos.</p>',
            ejercicio: { enunciado: '“En una red social, un usuario puede seguir a muchos usuarios y ser seguido por muchos.” Cardinalidad.', respuesta: fig(rec('USUARIO', 'sigue', 'N', 'seguidor', 'M', 'seguido', undefined)), explicacion: '<p>N:M: ambas preguntas responden “muchos”.</p>' } },
        ],
      },
      {
        titulo: 'Ejercicios de relaciones recursivas', corto: 'Ejercicios', tipo: 'multi',
        partes: [
          { h: 'Ejercicio 1', ejercicio: {
            enunciado: '“Cada empleado tiene un código, nombre y salario. Todo empleado, excepto el gerente general, tiene un jefe inmediato, que también es empleado. Un jefe puede tener a cargo a varios empleados.” Modela con cardinalidad y participación.',
            respuesta: fig(rec('EMPLEADO', 'jefe_de', '1', 'jefe', 'N', 'subordinado', ['*código', 'nombre', 'salario'])),
            explicacion: olist(['Recursiva sobre EMPLEADO con roles jefe/subordinado.', 'Un jefe → varios subordinados: N junto al rol subordinado.', 'Un subordinado → un jefe: 1 junto al rol jefe.', 'Participación parcial en ambos roles: el gerente no tiene jefe, y no todos son jefes.']) } },
          { h: 'Ejercicio 2', ejercicio: {
            enunciado: '“Un medicamento puede tener interacciones peligrosas con otros medicamentos. Se registra el nivel de riesgo de cada interacción.”',
            respuesta: fig(rec('MEDICAMENTO', 'interactúa', 'N', 'med_A', 'M', 'med_B', ['*código'])) + '<p>Con el atributo <strong>nivel_riesgo</strong> en la relación.</p>',
            explicacion: '<p>N:M recursiva con atributo de relación: el riesgo pertenece al par de medicamentos, no a uno solo.</p>' } },
        ],
      },
    ],
  });
})();
