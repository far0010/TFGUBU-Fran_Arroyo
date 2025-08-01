-- secuencia para contratos

CREATE SEQUENCE  "TFGUBU"."SEQ_CONTRATO_SEQ"  MINVALUE 1 MAXVALUE 99999999999999 
INCREMENT BY 1 START WITH 21 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;

-- triger para ref contratos
create or replace trigger TFGUBU."TRG_CONTRATOS_REF"
before 
insert on "CONTRATOS"
for each row
when (new.REF_CONTRATO is null)
begin
    :new.REF_CONTRATO := 'CONT' || LPAD (SEQ_CONTRATO_SEQ.NEXTVAL, 3, '0');
end;


--Mostrar datos contratado en vez de su nif

SELECT NOM_SOL || ' ' || APE1_SOL || ' ' || APE2_SOL AS DISPLAY_VALUE,
       DNI_SOL AS RETURN_VALUE
FROM SOLICITANTE
ORDER BY NOM_SOL

-- Mostrar solicitante de la convocatoria solicitada

SELECT NOM_SOL || ' ' || APE1_SOL || ' ' || APE2_SOL AS DISPLAY_VALUE,
       DNI_SOL AS RETURN_VALUE
FROM SOLICITANTE
WHERE REF_CON = :P12_CONVOCATORIA
ORDER BY APE1_SOL;

-- Modificación de solicitante de convocatoria para que solo refleje los que no tienen contrato

SELECT NOM_SOL || ' ' || APE1_SOL || ' ' || APE2_SOL AS DISPLAY_VALUE,
       DNI_SOL AS RETURN_VALUE
FROM SOLICITANTE S
WHERE REF_CON = :P12_CONVOCATORIA
  AND NOT EXISTS (
      SELECT 1
      FROM CONTRATOS C
      WHERE C.CONTRATADO = S.DNI_SOL
        AND C.F_FIN >= SYSDATE -- aún está activo o en el futuro
  )
ORDER BY APE1_SOL;


-- verificar la fecha inicio del contrato posterior a fecha proyecto
SELECT P.FECHA_INI
FROM CONVOCATORIA C 
JOIN PROYECTO P ON P.ORGANICA = C.REF_PROY
WHERE C.REF_PROY = :P12_CONVOCATORIA;

--

const fechaContrato = new Date($v('P12_F_INI'));
const fechaProyecto = new Date($v('P12_F_INI_OCULTO'));

if (fechaContrato < fechaProyecto) {
    const mensaje = 'La fecha de inicio debe ser igual o posterior a: ' + fechaProyecto;
    apex.message.alert("ℹ️ AVISO: "+mensaje);    
    $s('P12_FECHA_INICIO_CONTRATO', '');
}

-- creación de las nóminas una vez generado el contrato

DECLARE
  v_fecha_ini        DATE := TO_DATE(:P12_F_INI, 'DD-MM-YYYY');
  v_fecha_fin        DATE := TO_DATE(:P12_F_FIN, 'DD-MM-YYYY');
  v_total_meses      PLS_INTEGER;
  v_meses_generados  PLS_INTEGER := 0;
  v_mes_actual       DATE;
BEGIN
  -- Validaciones básicas
  IF :P12_CONTRATADO IS NULL THEN
    RAISE_APPLICATION_ERROR(-20001, 'El DNI está vacío.');
  END IF;

  IF :P12_F_INI IS NULL OR :P12_F_FIN IS NULL THEN
    RAISE_APPLICATION_ERROR(-20002, 'Faltan fechas de inicio o fin.');
  END IF;

  v_total_meses := MONTHS_BETWEEN(TRUNC(v_fecha_fin, 'MM'), TRUNC(v_fecha_ini, 'MM')) + 1;

  WHILE v_meses_generados < v_total_meses LOOP
    v_mes_actual := ADD_MONTHS(TRUNC(v_fecha_ini, 'MM'), v_meses_generados);

    INSERT INTO NOMINA (
      dni_nom, mes, anno, mensualidad, seg_soc, observaciones
    ) VALUES (
      :P12_CONTRATADO,
      TO_NUMBER(TO_CHAR(v_mes_actual, 'MM')),
      TO_NUMBER(TO_CHAR(v_mes_actual, 'YYYY')),
      TO_NUMBER(:P12_RET_MES),
      CASE
        WHEN v_meses_generados = 0 THEN 0
        ELSE TO_NUMBER(:P12_SS_MES)
      END,
      NULL
    );

    v_meses_generados := v_meses_generados + 1;
  END LOOP;

  -- Mes extra con indemnización
  v_mes_actual := ADD_MONTHS(TRUNC(v_fecha_ini, 'MM'), v_total_meses);

  INSERT INTO NOMINA (
    dni_nom, mes, anno, mensualidad, seg_soc, observaciones
  ) VALUES (
    :P12_CONTRATADO,
    TO_NUMBER(TO_CHAR(v_mes_actual, 'MM')),
    TO_NUMBER(TO_CHAR(v_mes_actual, 'YYYY')),
    TO_NUMBER(:P12_INDEMNIZACION),
    TO_NUMBER(:P12_SS_MES),
    'indemnización '
  );

EXCEPTION
  WHEN OTHERS THEN
    RAISE_APPLICATION_ERROR(-20099, 'Error interno: ' || SQLERRM);
END;