SELECT 
	o.ORGANICA,
	s.NOM_SOL || ' ' || s.APE1_SOL || ' ' || s.APE2_SOL AS NOMBRE,
	n.MENSUALIDAD,
	n.SEG_SOC,
	n.MENSUALIDAD + n.SEG_SOC AS TOTAL,
	n.OBSERVACIONES,
	:P18_MES AS MES_PEDIDO,
	:P18_ANNO AS ANNO_PEDIDO,
	(
	SELECT SUM(n2.MENSUALIDAD + n2.SEG_SOC)
	FROM PROYECTO o2
	JOIN CONVOCATORIA c2 ON c2.REF_PROY = o2.ORGANICA
	JOIN CONTRATOS ct2 ON ct2.CONVOCATORIA = c2.REFERENCIA
	JOIN SOLICITANTE s2 ON s2.DNI_SOL = ct2.CONTRATADO
	JOIN NOMINA n2 ON n2.DNI_NOM = s2.DNI_SOL
	WHERE n2.MES = :P18_MES
	AND n2.ANNO = :P18_ANNO
	AND (:P18_FILTRO IS NULL OR o2.ORGANICA = :P18_FILTRO)
	) AS TOTAL_GENERAL
	FROM PROYECTO o
	JOIN CONVOCATORIA c ON c.REF_PROY = o.ORGANICA
	JOIN CONTRATOS ct ON ct.CONVOCATORIA = c.REFERENCIA
	JOIN SOLICITANTE s ON s.DNI_SOL = ct.CONTRATADO
	JOIN NOMINA n ON n.DNI_NOM = s.DNI_SOL
	WHERE n.MES = :P18_MES
	AND n.ANNO = :P18_ANNO
	AND (:P18_FILTRO IS NULL OR o.ORGANICA = :P18_FILTRO)

-- mostrar el total del listado
$("td[headers='TOTAL_GENERAL']").first().text().trim();
	total = total.replace(",", ".");
	$s("P18_T_GEN", total);

-- filtro por orgánica
SELECT NULL AS display_value, NULL AS return_value
	UNION
	SELECT DISTINCT o.ORGANICA AS display_value, o.ORGANICA AS return_value
	FROM PROYECTO o
	JOIN CONVOCATORIA c ON c.REF_PROY = o.ORGANICA
	JOIN CONTRATOS ct ON ct.CONVOCATORIA = c.REFERENCIA
	JOIN SOLICITANTE s ON s.DNI_SOL = ct.CONTRATADO
	JOIN NOMINA n ON n.DNI_NOM = s.DNI_SOL
	WHERE n.MES = :P18_MES
	AND n.ANNO = :P18_ANNO
	ORDER BY 1

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

