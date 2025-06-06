-- comprobaciones de las tablas, todos los test pasados correctamente

-- comprobación contratos y solicitantes

SELECT c.ref_contrato , c.f_ini, c.f_fin, c.ret_tot, s.nom_sol, s.ape1_sol, s.ape2_sol
FROM contratos c
JOIN solicitante s ON c.contratado = s.dni_sol;

-- comprobación convocatorias asociadas a proyectos

SELECT conv.referencia, conv.titulo, p.organica , p.titulo, p.responsable
FROM convocatoria conv
JOIN proyecto p ON conv.ref_proy = p.organica;

-- comprobar responsables de proyectos

SELECT p.organica, p.titulo, r.nombre, r.ape1, r.ape2
FROM proyecto p
JOIN responsable r ON p.responsable = r.dni;

-- listar contratos con solicitante y proyecto

SELECT c.ref_contrato, s.nom_sol, s.ape1_sol, p.titulo
FROM contratos c
JOIN solicitante s ON c.contratado = s.dni_sol
JOIN convocatoria conv ON c.convocatoria = conv.referencia
JOIN proyecto p ON conv.ref_proy = p.organica;

-- listar solicitantes por convocatoria y su proyecto

SELECT s.nom_sol, s.ape1_sol, conv.referencia as convocatoria, conv.titulo, p.organica AS proyecto
FROM contratos c
JOIN solicitante s ON c.contratado = s.dni_sol
JOIN convocatoria conv ON c.convocatoria = conv.referencia
JOIN proyecto p ON conv.ref_proy = p.organica;

-- comprobar si todos los contratos tienen convocatoria debe devolver null

SELECT c.ref_contrato, c.convocatoria
FROM contratos c
LEFT JOIN convocatoria conv ON c.convocatoria = conv.referencia
WHERE conv.referencia IS NULL;

-- comprobar si hay solicitantes sin contrato, no debe haber

SELECT s.dni_sol, s.nom_sol, s.ape1_sol
FROM solicitante s
LEFT JOIN contratos c ON s.dni_sol = c.contratado
WHERE c.contratado IS NULL;

-- comprobar si hay convocatorias sin proyectos, de salir null

SELECT conv.referencia, conv.titulo
FROM convocatoria conv
LEFT JOIN proyecto p ON conv.ref_proy = p.organica
WHERE p.organica IS NULL;

-- comprobar si hay contratos fuera de las fechas del proyecto, debe ser null

SELECT c.ref_contrato, c.f_ini AS inicio_contrato, c.f_fin AS fin_contrato,
       p.organica, p.titulo, p.fecha_ini AS inicio_proyecto, p.fecha_fin AS fin_proyecto
FROM contratos c
JOIN convocatoria conv ON c.convocatoria = conv.referencia
JOIN proyecto p ON conv.ref_proy = p.organica
WHERE c.f_ini < p.fecha_ini OR c.f_fin > p.fecha_fin;

-- comprobar si se repite un contratado en la convocatoria, debe ser null

SELECT c.contratado, COUNT(DISTINCT c.convocatoria) AS cantidad_convocatorias
FROM contratos c
GROUP BY c.contratado
HAVING COUNT(DISTINCT c.convocatoria) > 1;

-- identificar si hay más contratos que los que da la convocatoria

SELECT c.convocatoria, conv.titulo, conv.num_plazas, COUNT(c.ref_contrato) AS total_contratos
FROM contratos c
JOIN convocatoria conv ON c.convocatoria = conv.referencia
GROUP BY c.convocatoria, conv.titulo, conv.num_plazas
HAVING COUNT(c.ref_contrato) > conv.num_plazas;

-- ver si una persona tiene contratos solapados, debe ser null

SELECT c1.contratado, s.nom_sol, s.ape1_sol, 
       c1.ref_contrato AS contrato_1, c1.f_ini AS inicio_1, c1.f_fin AS fin_1,
       c2.ref_contrato AS contrato_2, c2.f_ini AS inicio_2, c2.f_fin AS fin_2
FROM contratos c1
JOIN contratos c2 ON c1.contratado = c2.contratado 
                   AND c1.ref_contrato <> c2.ref_contrato -- Evita comparar el mismo contrato
                   AND (c1.f_ini BETWEEN c2.f_ini AND c2.f_fin 
                        OR c1.f_fin BETWEEN c2.f_ini AND c2.f_fin
                        OR c2.f_ini BETWEEN c1.f_ini AND c1.f_fin)
JOIN solicitante s ON c1.contratado = s.dni_sol
ORDER BY c1.contratado;
