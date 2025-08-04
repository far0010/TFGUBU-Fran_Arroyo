SELECT 
    o.ORGANICA,
    s.NOM_SOL || ' ' || s.APE1_SOL || ' ' || s.APE2_SOL AS NOMBRE,
    n.MENSUALIDAD,
    n.SEG_SOC,
    n.MENSUALIDAD + n.SEG_SOC AS TOTAL,
    n.OBSERVACIONES
FROM PROYECTO o
JOIN CONVOCATORIA c ON c.REF_PROY = o.ORGANICA
JOIN CONTRATOS ct ON ct.CONVOCATORIA = c.REFERENCIA
JOIN SOLICITANTE s ON s.DNI_SOL = ct.CONTRATADO
JOIN NOMINA n ON n.DNI_NOM = s.DNI_SOL
WHERE n.MES = :P15_MES AND n.ANNO = :P15_ANNO

UNION ALL

SELECT 
    NULL AS ORGANICA,
    'TOTAL GENERAL' AS NOMBRE,
    SUM(n.MENSUALIDAD) AS MENSUALIDAD,
    SUM(n.SEG_SOC) AS SEG_SOC,
    SUM(n.MENSUALIDAD + n.SEG_SOC) AS TOTAL,
    NULL AS OBSERVACIONES
FROM PROYECTO o
JOIN CONVOCATORIA c ON c.REF_PROY = o.ORGANICA
JOIN CONTRATOS ct ON ct.CONVOCATORIA = c.REFERENCIA
JOIN SOLICITANTE s ON s.DNI_SOL = ct.CONTRATADO
JOIN NOMINA n ON n.DNI_NOM = s.DNI_SOL
WHERE n.MES = :P15_MES AND n.ANNO = :P15_ANNO


--https://www.apexofficeprint.com/docs/getting-started/plugin-install/

--Quick Install Guide - APEX Office Print (AOP)


--configurar ACL

BEGIN
  DBMS_NETWORK_ACL_ADMIN.APPEND_HOST_ACE(
    host => 'api.apexofficeprint.com',
    ace => xs$ace_type(
      privilege_list => xs$name_list('connect'),
      principal_name => 'APEX_240200',
      principal_type => xs_acl.ptype_db
    )
  );
END;
/

BEGIN
  DBMS_NETWORK_ACL_ADMIN.APPEND_HOST_ACE(
    host => 'api.apexofficeprint.com',
    ace => xs$ace_type(
      privilege_list => xs$name_list('connect'),
      principal_name => 'TFGUBU',
      principal_type => xs_acl.ptype_db
    )
  );
END;
/

api key:XXXXXXXXXXXXXXXXXXXXXXXXXXXX

#APP_FILES#plantilla_informe_nomina.docx

