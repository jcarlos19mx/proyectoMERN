export const ejerciciosOracleIniciales = [
  // MÓDULO 1 — DDL (10 h sugeridas)
  {
    numero: '1.1',
    modulo: 1,
    moduloNombre: 'Lenguaje de definición de datos (DDL)',
    subtema: 'Instalación de un SGBD',
    titulo: 'Verificar instalación de Oracle Database 26ai',
    enunciado: `Conéctate a Oracle Database 26ai con SQL*Plus o SQL Developer y ejecuta las consultas necesarias para verificar:
1. La versión del motor de base de datos.
2. El nombre de la instancia (INSTANCE_NAME).
3. El nombre del servicio (SERVICE_NAME).
4. El tablespace por defecto del usuario conectado.

Documenta los resultados en tu bitácora del taller.`,
    contexto: 'Oracle 26ai introduce capacidades de IA integradas. Antes de practicar DDL/DML debes confirmar que la instancia está activa y accesible.',
    scriptBase: `-- Conectar como usuario del taller (ejemplo)
-- sqlplus taller_bd/tu_password@localhost:1521/FREEPDB1

SELECT banner FROM v$version WHERE banner LIKE 'Oracle%';

SELECT instance_name, host_name, version_full
FROM v$instance;

SHOW user;`,
    pista: 'Usa las vistas dinámicas V$VERSION y V$INSTANCE. Para el tablespace por defecto consulta USER_USERS.',
    solucion: `SELECT banner FROM v$version WHERE ROWNUM = 1;

SELECT instance_name, host_name, version_full FROM v$instance;

SELECT username, default_tablespace, temporary_tablespace
FROM user_users;`,
    dificultad: 'basico',
    horasSugeridas: 2,
    orden: 1,
  },
  {
    numero: '1.2',
    modulo: 1,
    moduloNombre: 'Lenguaje de definición de datos (DDL)',
    subtema: 'Creación del esquema de la base de datos',
    titulo: 'Diseñar esquema académico: departamentos y empleados',
    enunciado: `Crea el esquema para un sistema académico con las tablas:
- **DEPARTAMENTOS** (id_depto NUMBER PK, nombre VARCHAR2(50) NOT NULL, presupuesto NUMBER(12,2))
- **EMPLEADOS** (id_emp NUMBER PK, nombre VARCHAR2(80) NOT NULL, email VARCHAR2(100) UNIQUE, id_depto NUMBER, fecha_ingreso DATE DEFAULT SYSDATE)

Incluye la FK de EMPLEADOS hacia DEPARTAMENTOS con ON DELETE SET NULL.`,
    contexto: 'Este esquema se reutilizará en ejercicios de DML, joins y control de acceso del taller de 64 horas.',
    scriptBase: `-- Ejecutar conectado al PDB del taller
-- CREATE USER taller_bd IDENTIFIED BY "TuPassword" QUOTA UNLIMITED ON USERS;
-- GRANT CONNECT, RESOURCE TO taller_bd;`,
    pista: 'Usa CREATE TABLE con CONSTRAINT nombreado para PK, UNIQUE y FK.',
    solucion: `CREATE TABLE departamentos (
  id_depto   NUMBER PRIMARY KEY,
  nombre     VARCHAR2(50) NOT NULL,
  presupuesto NUMBER(12,2)
);

CREATE TABLE empleados (
  id_emp       NUMBER PRIMARY KEY,
  nombre       VARCHAR2(80) NOT NULL,
  email        VARCHAR2(100) UNIQUE,
  id_depto     NUMBER,
  fecha_ingreso DATE DEFAULT SYSDATE,
  CONSTRAINT fk_emp_depto
    FOREIGN KEY (id_depto) REFERENCES departamentos(id_depto)
    ON DELETE SET NULL
);`,
    dificultad: 'basico',
    horasSugeridas: 2,
    orden: 2,
  },
  {
    numero: '1.2a',
    modulo: 1,
    moduloNombre: 'Lenguaje de definición de datos (DDL)',
    subtema: 'Modificación del esquema de la base de datos',
    titulo: 'Alterar tablas: nuevas columnas e índices',
    enunciado: `Sobre el esquema académico:
1. Agrega la columna **salario NUMBER(10,2)** a EMPLEADOS.
2. Agrega la columna **activo CHAR(1) DEFAULT 'S'** con CHECK (activo IN ('S','N')).
3. Renombra la columna presupuesto a **presupuesto_anual** en DEPARTAMENTOS.
4. Crea un índice **idx_emp_depto** sobre EMPLEADOS(id_depto).`,
    contexto: 'En Oracle 26ai puedes usar ALTER TABLE para evolucionar el esquema sin perder datos existentes.',
    scriptBase: `-- Asume tablas departamentos y empleados ya creadas`,
    pista: 'ALTER TABLE ... ADD / RENAME COLUMN. Para índices usa CREATE INDEX.',
    solucion: `ALTER TABLE empleados ADD (salario NUMBER(10,2));

ALTER TABLE empleados ADD (
  activo CHAR(1) DEFAULT 'S' CHECK (activo IN ('S','N'))
);

ALTER TABLE departamentos RENAME COLUMN presupuesto TO presupuesto_anual;

CREATE INDEX idx_emp_depto ON empleados(id_depto);`,
    dificultad: 'intermedio',
    horasSugeridas: 2,
    orden: 3,
  },
  {
    numero: '1.2b',
    modulo: 1,
    moduloNombre: 'Lenguaje de definición de datos (DDL)',
    subtema: 'Aplicación de constraints',
    titulo: 'Constraints avanzados: dominio y tabla',
    enunciado: `Implementa las siguientes restricciones:
1. Salario de empleados debe ser mayor a 0 (si no es NULL).
2. Email debe contener '@' (usa CHECK con LIKE).
3. Crea tabla **ASIGNACIONES** (id_emp, id_depto, porcentaje) con PK compuesta y CHECK porcentaje BETWEEN 1 AND 100.
4. Agrega FK desde ASIGNACIONES hacia EMPLEADOS y DEPARTAMENTOS.`,
    contexto: 'Los constraints garantizan integridad a nivel de dominio, entidad y referencial.',
    scriptBase: `-- Tablas departamentos y empleados existentes`,
    pista: 'Nombra cada constraint con CONSTRAINT nombre_tipo para facilitar mantenimiento.',
    solucion: `ALTER TABLE empleados ADD CONSTRAINT ck_emp_salario
  CHECK (salario IS NULL OR salario > 0);

ALTER TABLE empleados ADD CONSTRAINT ck_emp_email
  CHECK (email LIKE '%@%');

CREATE TABLE asignaciones (
  id_emp     NUMBER,
  id_depto   NUMBER,
  porcentaje NUMBER(3),
  CONSTRAINT pk_asignaciones PRIMARY KEY (id_emp, id_depto),
  CONSTRAINT ck_asig_pct CHECK (porcentaje BETWEEN 1 AND 100),
  CONSTRAINT fk_asig_emp FOREIGN KEY (id_emp) REFERENCES empleados(id_emp),
  CONSTRAINT fk_asig_depto FOREIGN KEY (id_depto) REFERENCES departamentos(id_depto)
);`,
    dificultad: 'intermedio',
    horasSugeridas: 2,
    orden: 4,
  },

  // MÓDULO 2 — DML (18 h sugeridas)
  {
    numero: '2.1',
    modulo: 2,
    moduloNombre: 'Lenguaje de manipulación de datos (DML)',
    subtema: 'Inserción, eliminación y modificación de registros',
    titulo: 'Carga y mantenimiento de datos académicos',
    enunciado: `1. Inserta 3 departamentos y 5 empleados (al menos uno sin departamento).
2. Actualiza el salario de todos los empleados del departamento 'Sistemas' incrementándolo 10%.
3. Elimina empleados inactivos (activo = 'N').
4. Usa MERGE para insertar o actualizar un empleado por id_emp.`,
    contexto: 'Practica INSERT, UPDATE, DELETE y MERGE — operaciones fundamentales del DML.',
    scriptBase: `INSERT INTO departamentos VALUES (10, 'Sistemas', 500000);
INSERT INTO departamentos VALUES (20, 'Académico', 800000);
INSERT INTO departamentos VALUES (30, 'Administración', 300000);`,
    pista: 'MERGE requiere cláusula USING con los datos fuente y WHEN MATCHED / WHEN NOT MATCHED.',
    solucion: `INSERT INTO empleados (id_emp, nombre, email, id_depto, salario)
VALUES (1, 'Ana López', 'ana@uni.edu', 10, 25000);

UPDATE empleados SET salario = salario * 1.10
WHERE id_depto = (SELECT id_depto FROM departamentos WHERE nombre = 'Sistemas');

DELETE FROM empleados WHERE activo = 'N';

MERGE INTO empleados e
USING (SELECT 6 AS id_emp, 'Carlos Ruiz' AS nombre, 'carlos@uni.edu' AS email,
              20 AS id_depto, 22000 AS salario FROM dual) s
ON (e.id_emp = s.id_emp)
WHEN MATCHED THEN UPDATE SET e.salario = s.salario
WHEN NOT MATCHED THEN INSERT (id_emp, nombre, email, id_depto, salario)
  VALUES (s.id_emp, s.nombre, s.email, s.id_depto, s.salario);`,
    dificultad: 'basico',
    horasSugeridas: 2,
    orden: 5,
  },
  {
    numero: '2.2',
    modulo: 2,
    moduloNombre: 'Lenguaje de manipulación de datos (DML)',
    subtema: 'Consultas',
    titulo: 'Consultas básicas con filtros y proyección',
    enunciado: `Escribe consultas para:
1. Listar empleados activos ordenados por nombre.
2. Empleados con salario entre 20,000 y 30,000.
3. Departamentos sin empleados asignados.
4. Contar empleados por departamento mostrando nombre del departamento.`,
    contexto: 'Domina SELECT, WHERE, ORDER BY y funciones de agregación básicas.',
    scriptBase: `-- Datos cargados en ejercicio 2.1`,
    pista: 'Para departamentos sin empleados usa NOT EXISTS o LEFT JOIN con filtro IS NULL.',
    solucion: `SELECT id_emp, nombre, salario FROM empleados
WHERE activo = 'S' ORDER BY nombre;

SELECT * FROM empleados WHERE salario BETWEEN 20000 AND 30000;

SELECT d.id_depto, d.nombre
FROM departamentos d
WHERE NOT EXISTS (
  SELECT 1 FROM empleados e WHERE e.id_depto = d.id_depto
);

SELECT d.nombre, COUNT(e.id_emp) AS total
FROM departamentos d
LEFT JOIN empleados e ON d.id_depto = e.id_depto
GROUP BY d.nombre;`,
    dificultad: 'basico',
    horasSugeridas: 2,
    orden: 6,
  },
  {
    numero: '2.3',
    modulo: 2,
    moduloNombre: 'Lenguaje de manipulación de datos (DML)',
    subtema: 'Funciones, conversión, agrupamiento, ordenamiento',
    titulo: 'Funciones SQL y agrupamientos analíticos',
    enunciado: `1. Muestra nombre en mayúsculas, email en minúsculas y antigüedad en años (TRUNC con SYSDATE).
2. Convierte salario a VARCHAR2 con formato monetario.
3. Agrupa por departamento: salario promedio, máximo y mínimo (solo deptos con 2+ empleados).
4. Ordena departamentos por salario promedio descendente usando HAVING.`,
    contexto: 'Oracle ofrece funciones escalares (UPPER, TO_CHAR) y de grupo (AVG, MAX, MIN).',
    scriptBase: `SELECT nombre, fecha_ingreso, salario, id_depto FROM empleados;`,
    pista: 'HAVING filtra después del GROUP BY. Para años usa MONTHS_BETWEEN / 12.',
    solucion: `SELECT UPPER(nombre) AS nombre_may,
       LOWER(email) AS email_min,
       TRUNC(MONTHS_BETWEEN(SYSDATE, fecha_ingreso) / 12) AS anios
FROM empleados;

SELECT nombre, TO_CHAR(salario, 'L999,999.00') AS salario_fmt FROM empleados;

SELECT d.nombre,
       ROUND(AVG(e.salario), 2) AS prom,
       MAX(e.salario) AS max_sal,
       MIN(e.salario) AS min_sal
FROM empleados e
JOIN departamentos d ON e.id_depto = d.id_depto
GROUP BY d.nombre
HAVING COUNT(*) >= 2
ORDER BY prom DESC;`,
    dificultad: 'intermedio',
    horasSugeridas: 3,
    orden: 7,
  },
  {
    numero: '2.4',
    modulo: 2,
    moduloNombre: 'Lenguaje de manipulación de datos (DML)',
    subtema: 'Joins',
    titulo: 'INNER, LEFT, RIGHT y FULL JOIN',
    enunciado: `Resuelve con joins explícitos:
1. Empleados con nombre de su departamento (INNER JOIN).
2. Todos los departamentos y sus empleados, incluidos deptos vacíos (LEFT JOIN).
3. Empleados sin departamento asignado.
4. Cruce completo departamentos-empleados (FULL OUTER JOIN).`,
    contexto: 'Los joins relacionan tablas mediante claves. Oracle soporta la sintaxis ANSI SQL.',
    scriptBase: `-- Esquema departamentos / empleados`,
    pista: 'Empleados sin depto: e.id_depto IS NULL después de LEFT JOIN desde empleados.',
    solucion: `SELECT e.nombre, d.nombre AS departamento, e.salario
FROM empleados e
INNER JOIN departamentos d ON e.id_depto = d.id_depto;

SELECT d.nombre AS depto, e.nombre AS empleado
FROM departamentos d
LEFT JOIN empleados e ON d.id_depto = e.id_depto
ORDER BY d.nombre, e.nombre;

SELECT nombre, email FROM empleados WHERE id_depto IS NULL;

SELECT d.nombre AS depto, e.nombre AS empleado
FROM departamentos d
FULL OUTER JOIN empleados e ON d.id_depto = e.id_depto;`,
    dificultad: 'intermedio',
    horasSugeridas: 3,
    orden: 8,
  },
  {
    numero: '2.5',
    modulo: 2,
    moduloNombre: 'Lenguaje de manipulación de datos (DML)',
    subtema: 'Subconsultas',
    titulo: 'Subconsultas escalares, IN y EXISTS',
    enunciado: `1. Empleados cuyo salario supera el promedio general (subconsulta escalar).
2. Empleados del departamento con mayor presupuesto (subconsulta en WHERE).
3. Departamentos que tienen al menos un empleado con salario > 25000 (EXISTS).
4. Lista empleados cuyo id_depto está en (10, 20) usando IN.`,
    contexto: 'Las subconsultas pueden ir en SELECT, FROM, WHERE y HAVING.',
    scriptBase: `-- Datos del esquema académico`,
    pista: 'Para EXISTS devuelve SELECT 1 ... no necesitas columnas del subselect.',
    solucion: `SELECT nombre, salario FROM empleados
WHERE salario > (SELECT AVG(salario) FROM empleados);

SELECT e.nombre, e.salario FROM empleados e
WHERE e.id_depto = (
  SELECT id_depto FROM departamentos
  ORDER BY presupuesto_anual DESC FETCH FIRST 1 ROW ONLY
);

SELECT d.nombre FROM departamentos d
WHERE EXISTS (
  SELECT 1 FROM empleados e
  WHERE e.id_depto = d.id_depto AND e.salario > 25000
);

SELECT nombre FROM empleados WHERE id_depto IN (10, 20);`,
    dificultad: 'intermedio',
    horasSugeridas: 3,
    orden: 9,
  },
  {
    numero: '2.6',
    modulo: 2,
    moduloNombre: 'Lenguaje de manipulación de datos (DML)',
    subtema: 'Operadores set',
    titulo: 'UNION, INTERSECT y MINUS',
    enunciado: `Crea dos consultas sobre empleados y combínalas:
1. UNION de empleados de Sistemas y Académico (sin duplicados).
2. INTERSECT: empleados que también aparecen en ASIGNACIONES.
3. MINUS: empleados activos que no tienen asignación.
4. UNION ALL para comparar conteo con UNION.`,
    contexto: 'Los operadores de conjunto combinan resultados de SELECT compatibles en columnas.',
    scriptBase: `-- Tablas empleados y asignaciones pobladas`,
    pista: 'Las columnas deben coincidir en número y tipo. UNION elimina duplicados; UNION ALL no.',
    solucion: `SELECT e.nombre, d.nombre AS depto
FROM empleados e JOIN departamentos d ON e.id_depto = d.id_depto
WHERE d.nombre = 'Sistemas'
UNION
SELECT e.nombre, d.nombre
FROM empleados e JOIN departamentos d ON e.id_depto = d.id_depto
WHERE d.nombre = 'Académico';

SELECT nombre FROM empleados
INTERSECT
SELECT e.nombre FROM empleados e JOIN asignaciones a ON e.id_emp = a.id_emp;

SELECT nombre FROM empleados WHERE activo = 'S'
MINUS
SELECT e.nombre FROM empleados e JOIN asignaciones a ON e.id_emp = a.id_emp;`,
    dificultad: 'intermedio',
    horasSugeridas: 2,
    orden: 10,
  },
  {
    numero: '2.7',
    modulo: 2,
    moduloNombre: 'Lenguaje de manipulación de datos (DML)',
    subtema: 'Vistas',
    titulo: 'Vistas simples, con CHECK OPTION y materializadas',
    enunciado: `1. Crea vista **V_EMP_ACTIVOS** con empleados activos y su departamento.
2. Crea vista actualizable **V_EMP_SISTEMAS** solo para depto Sistemas con WITH CHECK OPTION.
3. Inserta un empleado a través de la vista (si es actualizable).
4. Crea vista materializada **MV_RESUMEN_DEPTO** con conteo y salario promedio por departamento.`,
    contexto: 'Las vistas simplifican consultas y controlan acceso lógico a datos.',
    scriptBase: `-- Permisos CREATE VIEW concedidos al usuario del taller`,
    pista: 'WITH CHECK OPTION impide DML que dejaría filas fuera de la vista.',
    solucion: `CREATE OR REPLACE VIEW v_emp_activos AS
SELECT e.id_emp, e.nombre, e.salario, d.nombre AS departamento
FROM empleados e LEFT JOIN departamentos d ON e.id_depto = d.id_depto
WHERE e.activo = 'S';

CREATE OR REPLACE VIEW v_emp_sistemas AS
SELECT id_emp, nombre, email, salario, id_depto
FROM empleados
WHERE id_depto = 10
WITH CHECK OPTION;

CREATE MATERIALIZED VIEW mv_resumen_depto
BUILD IMMEDIATE REFRESH COMPLETE ON DEMAND AS
SELECT d.nombre, COUNT(e.id_emp) AS total, AVG(e.salario) AS salario_prom
FROM departamentos d
LEFT JOIN empleados e ON d.id_depto = e.id_depto
GROUP BY d.nombre;`,
    dificultad: 'avanzado',
    horasSugeridas: 3,
    orden: 11,
  },

  // MÓDULO 3 — Control de acceso (8 h)
  {
    numero: '3.1',
    modulo: 3,
    moduloNombre: 'Control de acceso',
    subtema: 'Tipos de usuario',
    titulo: 'Identificar tipos de cuentas en Oracle 26ai',
    enunciado: `Investiga y documenta:
1. Diferencia entre usuario común, SYS y SYSTEM.
2. Qué es un **PDB** (Pluggable Database) en arquitectura multitenant.
3. Consulta DBA_USERS para listar usuarios del PDB actual (account_status, default_tablespace).
4. Explica cuándo usar usuario dedicado de aplicación vs usuario administrador.`,
    contexto: 'Oracle 26ai usa arquitectura CDB/PDB. El control de acceso inicia con el modelo de usuarios.',
    scriptBase: `SELECT name, open_mode FROM v$pdbs;`,
    pista: 'SYS es propietario del diccionario de datos; la app debe usar cuentas con privilegios mínimos.',
    solucion: `SELECT username, account_status, default_tablespace, created
FROM dba_users
ORDER BY created;

-- Usuario aplicación: privilegios limitados
-- Usuario admin (DBA): gestión de instancia, no para apps`,
    dificultad: 'basico',
    horasSugeridas: 2,
    orden: 12,
  },
  {
    numero: '3.2',
    modulo: 3,
    moduloNombre: 'Control de acceso',
    subtema: 'Creación de usuarios',
    titulo: 'Crear usuarios del taller con tablespaces',
    enunciado: `Como DBA del PDB:
1. Crea usuarios **app_lectura** y **app_escritura** con contraseñas seguras.
2. Asigna tablespace USERS con cuota 100M.
3. Concede CREATE SESSION.
4. Bloquea cuenta de app_lectura con ACCOUNT LOCK y luego desbloquéala.`,
    contexto: 'La creación de usuarios es prerequisito para asignar privilegios y roles.',
    scriptBase: `-- Conectar como ADMIN del PDB con privilegios DBA`,
    pista: 'CREATE USER ... IDENTIFIED BY ... DEFAULT TABLESPACE ... QUOTA ...',
    solucion: `CREATE USER app_lectura IDENTIFIED BY "Lectura2026!"
  DEFAULT TABLESPACE users QUOTA 100M ON users;

CREATE USER app_escritura IDENTIFIED BY "Escritura2026!"
  DEFAULT TABLESPACE users QUOTA 100M ON users;

GRANT CREATE SESSION TO app_lectura, app_escritura;

ALTER USER app_lectura ACCOUNT LOCK;
ALTER USER app_lectura ACCOUNT UNLOCK;`,
    dificultad: 'basico',
    horasSugeridas: 2,
    orden: 13,
  },
  {
    numero: '3.3',
    modulo: 3,
    moduloNombre: 'Control de acceso',
    subtema: 'Privilegios a usuarios',
    titulo: 'GRANT y REVOKE sobre tablas del esquema académico',
    enunciado: `1. Concede SELECT sobre EMPLEADOS y DEPARTAMENTOS a **app_lectura**.
2. Concede SELECT, INSERT, UPDATE, DELETE sobre EMPLEADOS a **app_escritura**.
3. Concede SELECT sobre V_EMP_ACTIVOS a app_lectura.
4. Revoca DELETE sobre EMPLEADOS a app_escritura.
5. Verifica privilegios con DBA_TAB_PRIVS.`,
    contexto: 'Privilegios de sistema vs privilegios de objeto. Principio de mínimo privilegio.',
    scriptBase: `-- Usuarios creados en ejercicio 3.2`,
    pista: 'GRANT privilegio ON esquema.tabla TO usuario;',
    solucion: `GRANT SELECT ON empleados TO app_lectura;
GRANT SELECT ON departamentos TO app_lectura;
GRANT SELECT, INSERT, UPDATE, DELETE ON empleados TO app_escritura;
GRANT SELECT ON v_emp_activos TO app_lectura;
REVOKE DELETE ON empleados FROM app_escritura;

SELECT grantee, table_name, privilege
FROM dba_tab_privs
WHERE grantee IN ('APP_LECTURA', 'APP_ESCRITURA')
ORDER BY grantee, table_name;`,
    dificultad: 'intermedio',
    horasSugeridas: 2,
    orden: 14,
  },
  {
    numero: '3.4',
    modulo: 3,
    moduloNombre: 'Control de acceso',
    subtema: 'Roles',
    titulo: 'Roles rol_consulta y rol_mantenimiento',
    enunciado: `1. Crea rol **rol_consulta** con SELECT sobre tablas del esquema académico.
2. Crea rol **rol_mantenimiento** que incluya rol_consulta + DML sobre EMPLEADOS.
3. Asigna roles a usuarios con GRANT rol TO usuario.
4. Habilita roles por defecto con ALTER USER ... DEFAULT ROLE.`,
    contexto: 'Los roles agrupan privilegios y simplifican administración de seguridad.',
    scriptBase: `-- Esquema taller_bd con tablas académicas`,
    pista: 'Un rol puede recibir otro rol: GRANT rol_consulta TO rol_mantenimiento;',
    solucion: `CREATE ROLE rol_consulta;
GRANT SELECT ON empleados TO rol_consulta;
GRANT SELECT ON departamentos TO rol_consulta;

CREATE ROLE rol_mantenimiento;
GRANT rol_consulta TO rol_mantenimiento;
GRANT INSERT, UPDATE, DELETE ON empleados TO rol_mantenimiento;

GRANT rol_consulta TO app_lectura;
GRANT rol_mantenimiento TO app_escritura;

ALTER USER app_lectura DEFAULT ROLE rol_consulta;
ALTER USER app_escritura DEFAULT ROLE rol_mantenimiento;`,
    dificultad: 'intermedio',
    horasSugeridas: 2,
    orden: 15,
  },

  // MÓDULO 4 — Concurrencia (10 h)
  {
    numero: '4.1',
    modulo: 4,
    moduloNombre: 'Concurrencia',
    subtema: 'Conceptos',
    titulo: 'Escenario de concurrencia: doble actualización',
    enunciado: `Simula dos sesiones que actualizan el mismo registro:
1. Sesión A: SELECT salario FOR UPDATE de empleado id=1.
2. Sesión B: intenta UPDATE del mismo empleado.
3. Documenta qué ocurre y cómo Oracle maneja el bloqueo.
4. Explica diferencia entre bloqueo a nivel fila vs tabla.`,
    contexto: 'La concurrencia ocurre cuando múltiples transacciones acceden datos simultáneamente.',
    scriptBase: `-- Sesión A
SELECT salario FROM empleados WHERE id_emp = 1 FOR UPDATE;

-- Sesión B (en otra conexión)
UPDATE empleados SET salario = salario + 1000 WHERE id_emp = 1;`,
    pista: 'FOR UPDATE bloquea filas seleccionadas hasta COMMIT o ROLLBACK de la sesión A.',
    solucion: `-- Sesión B esperará (lock wait) hasta que A haga COMMIT o ROLLBACK
-- Oracle usa bloqueo a nivel de fila por defecto (TX locks)
COMMIT; -- en sesión A libera el bloqueo`,
    dificultad: 'basico',
    horasSugeridas: 2,
    orden: 16,
  },
  {
    numero: '4.2',
    modulo: 4,
    moduloNombre: 'Concurrencia',
    subtema: 'Propiedades de las transacciones',
    titulo: 'Demostrar propiedades ACID',
    enunciado: `Diseña transacciones que demuestren:
- **Atomicidad:** transferencia de presupuesto entre dos departamentos (todo o nada).
- **Consistencia:** violación de CHECK al insertar salario negativo y rollback.
- **Aislamiento:** lectura sucia evitada con COMMIT explícito.
- **Durabilidad:** tras COMMIT, datos persisten tras reconexión.`,
    contexto: 'ACID es el marco teórico de las transacciones en Oracle.',
    scriptBase: `UPDATE departamentos SET presupuesto_anual = presupuesto_anual - 50000 WHERE id_depto = 10;
UPDATE departamentos SET presupuesto_anual = presupuesto_anual + 50000 WHERE id_depto = 20;`,
    pista: 'Encierra ambos UPDATE en una transacción; usa ROLLBACK si la suma de presupuestos no cuadra.',
    solucion: `UPDATE departamentos SET presupuesto_anual = presupuesto_anual - 50000 WHERE id_depto = 10;
UPDATE departamentos SET presupuesto_anual = presupuesto_anual + 50000 WHERE id_depto = 20;
COMMIT;

-- Consistencia
INSERT INTO empleados (id_emp, nombre, salario) VALUES (99, 'Test', -1); -- falla CHECK
ROLLBACK;`,
    dificultad: 'intermedio',
    horasSugeridas: 2,
    orden: 17,
  },
  {
    numero: '4.3',
    modulo: 4,
    moduloNombre: 'Concurrencia',
    subtema: 'Grados de consistencia',
    titulo: 'Lecturas repetibles vs fantasma',
    enunciado: `Explica y observa:
1. Qué es una lectura no repetible.
2. Qué es una lectura fantasma.
3. Cómo Oracle con MVCC reduce bloqueos de lectores.
4. Consulta V$TRANSACTION durante una transacción abierta.`,
    contexto: 'Los grados de consistencia definen qué anomalías puede ver una transacción.',
    scriptBase: `-- Sesión 1: inicia transacción y consulta COUNT de empleados
SELECT COUNT(*) FROM empleados;
-- Sesión 2: INSERT + COMMIT
-- Sesión 1: vuelve a consultar COUNT`,
    pista: 'Sin aislamiento SERIALIZABLE, la segunda lectura en sesión 1 puede ver más filas (fantasma).',
    solucion: `SELECT COUNT(*) FROM empleados; -- primera lectura
-- otra sesión inserta y hace COMMIT
SELECT COUNT(*) FROM empleados; -- posible lectura fantasma

SELECT addr, status, start_time FROM v$transaction;`,
    dificultad: 'intermedio',
    horasSugeridas: 2,
    orden: 18,
  },
  {
    numero: '4.4',
    modulo: 4,
    moduloNombre: 'Concurrencia',
    subtema: 'Niveles de aislamiento',
    titulo: 'READ COMMITTED vs SERIALIZABLE',
    enunciado: `1. Identifica el nivel por defecto en Oracle (READ COMMITTED).
2. Cambia a SERIALIZABLE en una sesión: ALTER SESSION SET ISOLATION_LEVEL = SERIALIZABLE.
3. Reproduce escenario donde SERIALIZABLE lanza ORA-08177 (can't serialize access).
4. Documenta cuándo usar cada nivel en el sistema académico.`,
    contexto: 'Oracle soporta READ COMMITTED (default) y SERIALIZABLE.',
    scriptBase: `ALTER SESSION SET ISOLATION_LEVEL = SERIALIZABLE;`,
    pista: 'SERIALIZABLE es útil para reportes consistentes pero puede generar errores de serialización.',
    solucion: `ALTER SESSION SET ISOLATION_LEVEL = SERIALIZABLE;
SELECT salario FROM empleados WHERE id_emp = 1;
-- otra sesión modifica y hace COMMIT
UPDATE empleados SET salario = salario + 100 WHERE id_emp = 1;
COMMIT; -- puede lanzar ORA-08177`,
    dificultad: 'avanzado',
    horasSugeridas: 2,
    orden: 19,
  },
  {
    numero: '4.5',
    modulo: 4,
    moduloNombre: 'Concurrencia',
    subtema: 'Commit y rollback',
    titulo: 'SAVEPOINT y control de transacciones',
    enunciado: `1. Inicia transacción con varios UPDATE a empleados.
2. Crea SAVEPOINT sp1 después del primer UPDATE.
3. Ejecuta más cambios y haz ROLLBACK TO sp1.
4. Confirma con COMMIT solo los cambios previos al savepoint.
5. Usa ROLLBACK completo en un segundo escenario.`,
    contexto: 'SAVEPOINT permite deshacer parcialmente dentro de una transacción.',
    scriptBase: `UPDATE empleados SET salario = salario + 500 WHERE id_emp = 1;
SAVEPOINT sp1;
UPDATE empleados SET salario = salario + 500 WHERE id_emp = 2;`,
    pista: 'ROLLBACK TO sp1 deshace todo después del savepoint, mantiene lo anterior.',
    solucion: `UPDATE empleados SET salario = salario + 500 WHERE id_emp = 1;
SAVEPOINT sp1;
UPDATE empleados SET salario = salario + 500 WHERE id_emp = 2;
ROLLBACK TO sp1;
COMMIT; -- solo persiste cambio del empleado 1`,
    dificultad: 'intermedio',
    horasSugeridas: 2,
    orden: 20,
  },

  // MÓDULO 5 — SQL Procedural (12 h)
  {
    numero: '5.1',
    modulo: 5,
    moduloNombre: 'SQL Procedural',
    subtema: 'Stored Procedures',
    titulo: 'Procedimiento sp_aumento_masivo',
    enunciado: `Crea procedimiento **sp_aumento_masivo(p_id_depto IN NUMBER, p_porcentaje IN NUMBER)** que:
1. Valide que el porcentaje esté entre 0 y 50.
2. Actualice salarios del departamento indicado.
3. Registre cuántas filas fueron afectadas (SQL%ROWCOUNT).
4. Maneje excepción si el departamento no existe.`,
    contexto: 'PL/SQL permite lógica procedural en el servidor Oracle 26ai.',
    scriptBase: `CREATE OR REPLACE PROCEDURE sp_aumento_masivo(
  p_id_depto   IN NUMBER,
  p_porcentaje IN NUMBER
) IS
BEGIN
  NULL;
END;`,
    pista: 'Usa RAISE_APPLICATION_ERROR(-20001, mensaje) para errores de negocio.',
    solucion: `CREATE OR REPLACE PROCEDURE sp_aumento_masivo(
  p_id_depto   IN NUMBER,
  p_porcentaje IN NUMBER
) IS
  v_count NUMBER;
BEGIN
  IF p_porcentaje < 0 OR p_porcentaje > 50 THEN
    RAISE_APPLICATION_ERROR(-20001, 'Porcentaje inválido');
  END IF;

  SELECT COUNT(*) INTO v_count FROM departamentos WHERE id_depto = p_id_depto;
  IF v_count = 0 THEN
    RAISE_APPLICATION_ERROR(-20002, 'Departamento no existe');
  END IF;

  UPDATE empleados SET salario = salario * (1 + p_porcentaje/100)
  WHERE id_depto = p_id_depto;

  DBMS_OUTPUT.PUT_LINE('Filas actualizadas: ' || SQL%ROWCOUNT);
END;`,
    dificultad: 'intermedio',
    horasSugeridas: 4,
    orden: 21,
  },
  {
    numero: '5.2',
    modulo: 5,
    moduloNombre: 'SQL Procedural',
    subtema: 'Functions',
    titulo: 'Función fn_salario_neto',
    enunciado: `Crea función **fn_salario_neto(p_salario NUMBER, p_isr_pct NUMBER DEFAULT 10)** que:
1. Retorne salario neto descontando ISR.
2. Sea determinística y usable en SQL (RETURN NUMBER).
3. Úsala en SELECT listando empleados con salario bruto y neto.
4. Prueba con salario NULL (debe retornar NULL).`,
    contexto: 'Las funciones PL/SQL pueden invocarse desde consultas SQL.',
    scriptBase: `-- Habilitar salida
SET SERVEROUTPUT ON;`,
    pista: 'CREATE OR REPLACE FUNCTION ... RETURN NUMBER IS ... RETURN valor; END;',
    solucion: `CREATE OR REPLACE FUNCTION fn_salario_neto(
  p_salario  NUMBER,
  p_isr_pct  NUMBER DEFAULT 10
) RETURN NUMBER DETERMINISTIC IS
BEGIN
  IF p_salario IS NULL THEN RETURN NULL; END IF;
  RETURN ROUND(p_salario * (1 - p_isr_pct/100), 2);
END;

SELECT nombre, salario, fn_salario_neto(salario) AS neto FROM empleados;`,
    dificultad: 'intermedio',
    horasSugeridas: 4,
    orden: 22,
  },
  {
    numero: '5.3',
    modulo: 5,
    moduloNombre: 'SQL Procedural',
    subtema: 'Triggers',
    titulo: 'Trigger de auditoría en EMPLEADOS',
    enunciado: `1. Crea tabla **AUDITORIA_EMP** (id_aud, id_emp, operacion, usuario, fecha, salario_ant, salario_nuevo).
2. Crea trigger **trg_emp_aud** BEFORE INSERT OR UPDATE OR DELETE ON EMPLEADOS.
3. Registra operación, usuario (USER) y valores relevantes.
4. Prueba con INSERT, UPDATE de salario y DELETE.`,
    contexto: 'Los triggers automatizan reglas de negocio y auditoría a nivel de fila.',
    scriptBase: `CREATE TABLE auditoria_emp (
  id_aud        NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_emp        NUMBER,
  operacion     VARCHAR2(10),
  usuario       VARCHAR2(50),
  fecha         TIMESTAMP DEFAULT SYSTIMESTAMP,
  salario_ant   NUMBER,
  salario_nuevo NUMBER
);`,
    pista: 'En DELETE usa :OLD; en INSERT usa :NEW; en UPDATE ambos.',
    solucion: `CREATE OR REPLACE TRIGGER trg_emp_aud
BEFORE INSERT OR UPDATE OR DELETE ON empleados
FOR EACH ROW
BEGIN
  IF INSERTING THEN
    INSERT INTO auditoria_emp (id_emp, operacion, usuario, salario_nuevo)
    VALUES (:NEW.id_emp, 'INSERT', USER, :NEW.salario);
  ELSIF UPDATING THEN
    INSERT INTO auditoria_emp (id_emp, operacion, usuario, salario_ant, salario_nuevo)
    VALUES (:NEW.id_emp, 'UPDATE', USER, :OLD.salario, :NEW.salario);
  ELSE
    INSERT INTO auditoria_emp (id_emp, operacion, usuario, salario_ant)
    VALUES (:OLD.id_emp, 'DELETE', USER, :OLD.salario);
  END IF;
END;`,
    dificultad: 'avanzado',
    horasSugeridas: 4,
    orden: 23,
  },

  // MÓDULO 6 — Conectividad (6 h)
  {
    numero: '6.1',
    modulo: 6,
    moduloNombre: 'Conectividad de Bases de Datos',
    subtema: 'ODBC, ADO.NET, JDBC',
    titulo: 'Cadena de conexión y drivers Oracle',
    enunciado: `Documenta para Oracle 26ai:
1. Componentes de una cadena JDBC (host, port, service_name/SID).
2. Diferencia entre thin driver y OCI.
3. Ejemplo de cadena para SQL Developer y JDBC.
4. Qué es ODBC y en qué escenarios se usa frente a JDBC.
5. Mención de ADO.NET con Oracle.ManagedDataAccess para .NET.`,
    contexto: 'La conectividad estándar permite que aplicaciones accedan al SGBD sin depender del cliente SQL.',
    scriptBase: `-- JDBC thin (Java)
-- jdbc:oracle:thin:@localhost:1521/FREEPDB1

-- ODBC DSN de ejemplo
-- Driver=Oracle ODBC Driver;Dbq=//localhost:1521/FREEPDB1;Uid=app_lectura;Pwd=***;`,
    pista: 'En Oracle 26ai el formato recomendado usa SERVICE_NAME del PDB, no SID legacy.',
    solucion: `/*
JDBC:  jdbc:oracle:thin:@//localhost:1521/FREEPDB1
SQL Developer: Tipo BASIC, Host localhost, Puerto 1521, Service FREEPDB1
ODBC:  Puente para herramientas legacy / Excel
ADO.NET: Oracle.ManagedDataAccess.Client para apps .NET
*/`,
    dificultad: 'basico',
    horasSugeridas: 2,
    orden: 24,
  },
  {
    numero: '6.2',
    modulo: 6,
    moduloNombre: 'Conectividad de Bases de Datos',
    subtema: 'Conectividad desde lenguaje huésped o dispositivos móviles',
    titulo: 'Conectar Node.js al esquema académico con node-oracledb',
    enunciado: `Desde Node.js (lenguaje huésped del proyecto MERN):
1. Instala el paquete **oracledb**.
2. Configura pool de conexiones hacia Oracle 26ai.
3. Ejecuta SELECT sobre V_EMP_ACTIVOS y devuelve JSON.
4. Expón endpoint GET /api/oracle/empleados-activos (opcional, integración con este proyecto).
5. Menciona consideraciones para apps móviles (API intermedia, no conexión directa).`,
    contexto: 'Las apps móviles y web no se conectan directamente a Oracle; usan una API intermedia como Express.',
    scriptBase: `// npm install oracledb
import oracledb from 'oracledb';

const dbConfig = {
  user: 'app_lectura',
  password: process.env.ORACLE_PASSWORD,
  connectString: 'localhost:1521/FREEPDB1',
};`,
    pista: 'Usa async/await con connection.execute() y result.rows.',
    solucion: `import oracledb from 'oracledb';

async function getEmpleadosActivos() {
  const conn = await oracledb.getConnection({
    user: 'app_lectura',
    password: process.env.ORACLE_PASSWORD,
    connectString: 'localhost:1521/FREEPDB1',
  });
  const result = await conn.execute(
    'SELECT id_emp, nombre, salario, departamento FROM v_emp_activos',
    [],
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );
  await conn.close();
  return result.rows;
}`,
    dificultad: 'avanzado',
    horasSugeridas: 4,
    orden: 25,
  },
];
