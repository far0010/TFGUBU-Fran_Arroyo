SELECT 
    p.ORGANICA, 
    p.TITULO, 
    r.NOMBRE || ' ' || r.ape1 || ' ' || r.ape2 AS REPONSABLE,
    p.fecha_ini as INICIO, 
    p.fecha_fin AS FIN  
FROM proyecto p
JOIN responsable r ON p.responsable = r.dni;