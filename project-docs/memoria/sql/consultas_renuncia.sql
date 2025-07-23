--- leer datos contrato

SELECT 
  C.REF_CONTRATO,
  S.NOM_SOL || ' ' || S.APE1_SOL || ' ' || S.APE2_SOL AS NOMBRE_COMPLETO,
  TO_CHAR(C.F_INI, 'DD-MM-YYYY') AS F_INI,
  TO_CHAR(C.F_FIN, 'DD-MM-YYYY') AS F_FIN,
  TO_CHAR(C.RET_MES, '999G999G990D00') || ' €' AS RET_MES,
  TO_CHAR(C.SS_MES, '999G999G990D00') || ' €' AS SS_MES,
  TO_CHAR(C.INDEMNIZACION, '999G999G990D00') || ' €' AS INDEMNIZACION
FROM CONTRATOS C
JOIN SOLICITANTE S ON C.CONTRATADO = S.DNI_SOL
WHERE C.REF_CONTRATO = :P14_SEL_CONT

--- leer dato seg social

$s("P14_SS_OCULTA", $v("P14_SEG_SOG"));

--- verificar fecha renuncia

//  parsear fechas en formato 'DD-MM-YYYY' o 'DD-MON-YYYY'
function parseFechaFlexible(fechaStr) {
  if (!fechaStr) {
    console.warn('Fecha vacía o null:', fechaStr);
    return null;
  }

  const partes = fechaStr.trim().split('-');
  if (partes.length !== 3) {
    console.error('Formato inesperado:', fechaStr);
    return null;
  }

  const dia = parseInt(partes[0], 10);
  const año = parseInt(partes[2], 10);

  // Detectar si el mes es número o texto
  const mesTexto = partes[1].toUpperCase();
  const meses = {
    'ENE': 0, 'FEB': 1, 'MAR': 2, 'ABR': 3,
    'MAY': 4, 'JUN': 5, 'JUL': 6, 'AGO': 7,
    'SEP': 8, 'OCT': 9, 'NOV': 10, 'DIC': 11
  };

  let mes;
  if (!isNaN(parseInt(mesTexto, 10))) {
    mes = parseInt(mesTexto, 10) - 1; // formato numérico
  } else {
    mes = meses[mesTexto]; // formato texto
  }

  if (mes === undefined || isNaN(dia) || isNaN(año)) {
    console.error(' Problema al interpretar partes de la fecha:', partes);
    return null;
  }

  return new Date(año, mes, dia);
}

// Leer valores 
const fechaInicioStr         = $v('P14_F_INI');
const fechaContratoFinStr    = $v('P14_F_FIN');
const nuevaFechaFinStr       = $v('P14_F_RENUNCIA');
// obtenemos la fecha del actual
const hoy = new Date();
// Extrae año, mes y día
const añoHoy = hoy.getFullYear();
const mesHoy = hoy.getMonth() + 1; 
const diaHoy = hoy.getDate();
const fechaHoy = new Date(añoHoy, mesHoy - 1, diaHoy); 

// Parsear las fechas
const fechaInicio            = parseFechaFlexible(fechaInicioStr);
const fechaContratoFin       = parseFechaFlexible(fechaContratoFinStr);
const nuevaFechaFin          = parseFechaFlexible(nuevaFechaFinStr);

// Logs para verificar valores
console.log('Fecha INICIO (raw):', fechaInicioStr);
console.log('Fecha FIN actual (raw):', fechaContratoFinStr);
console.log('Nueva fecha FIN (raw):', nuevaFechaFinStr);


console.log('INICIO (obj):', fechaInicio?.toLocaleDateString('es-ES'), typeof fechaInicio);
console.log('FIN actual (obj):', fechaContratoFin?.toLocaleDateString('es-ES'), typeof fechaContratoFin);
console.log('Nueva FIN (obj):', nuevaFechaFin?.toLocaleDateString('es-ES'), typeof nuevaFechaFin);
console.log('fechaHoy (obj):', nuevaFechaFin?.toLocaleDateString('es-ES'), typeof fechaHoy);
// semaforo
let estadoVerificacion = 'ok';
// nueva fecha debe ser posterior a actual
if (nuevaFechaFin && fechaContratoFin) {
  if (nuevaFechaFin > fechaContratoFin) {
    apex.message.alert("ℹ️ AVISO: La fecha de renuncia debe ser anterior a la fecha fin actual");
    $s('P14_F_RENUNCIA', '');
    $('#P14_F_RENUNCIA').trigger('change');
    estadoVerificacion = 'fail';
  }
}
// debe ser posterior a la de inicio y a la actual
if (nuevaFechaFin && fechaContratoFin) {
  if (nuevaFechaFin < fechaInicio || nuevaFechaFin < fechaHoy)  {
    apex.message.alert("ℹ️ AVISO: La fecha de renuncia debe ser posterior a la fecha actual");
    $s('P14_F_RENUNCIA', '');
    $('#P14_F_RENUNCIA').trigger('change');
    estadoVerificacion = 'fail';
  }
}

// cambio color si ok
const $boton = $('#btn_verifica2');

if ($boton.length) {
  // Elimina clases anteriores
  $boton.removeClass('t-Button--success t-Button--hot t-Button--danger');

  // Aplica color según estado
  if (estadoVerificacion === "ok") {
    $boton.addClass('t-Button--success');
    // HAY QUE CAMBIAR EL FORMATO DE LA SS MOSTRADA
    var ssRaw = $v("P14_SEG_SOG");                    
    var ssClean = ssRaw.replace("€", "")            
                   .replace(/\s/g, "");     
                             
    $s("P14_SS_OCULTA", ssClean);

  }
}


----- reactivar fecha si falla

apex.event.trigger('#P14_F_RENUNCIA', 'change');

---- borrado nóminas y actulizar fecha contrato

DECLARE
  v_fecha_ini        DATE := :P14_F_FIN; 
  v_fecha_fin        DATE := :P14_F_RENUNCIA;
  v_total_meses      PLS_INTEGER;
  v_meses_generados  PLS_INTEGER := 0;
  v_mes_actual       DATE;
  v_ss_mes           NUMBER := :P14_SS_OCULTA;
  v_indemnizacion    NUMBER := :P14_NEW_IND;

  v_dni              VARCHAR2(9);
  v_ultimo_mes       DATE;

BEGIN
  EXECUTE IMMEDIATE 'ALTER SESSION SET NLS_NUMERIC_CHARACTERS = '',.''';

  -- Obtengo el DNI
  SELECT CONTRATADO
  INTO v_dni
  FROM CONTRATOS
  WHERE REF_CONTRATO = :P14_SEL_CONT;
 DBMS_OUTPUT.PUT_LINE('DNI obtenido: ' || v_dni);
  -- Actualizo la fecha fin del contrato
  UPDATE CONTRATOS
  SET 
    F_FIN = :P14_F_RENUNCIA,
    INDEMNIZACION = v_indemnizacion,
    OBSERVACIONES = 'Renuncia'
  WHERE REF_CONTRATO = :P14_SEL_CONT;
 -- elimino nominas posteriores a la renuncia
  DELETE FROM NOMINA
  WHERE dni_nom = v_dni
    AND TO_DATE(anno || LPAD(mes, 2, '0'), 'YYYYMM') > TRUNC(v_fecha_fin, 'MM');

  -- veo cual es último mes de nómina
  SELECT TO_DATE(anno || LPAD(mes, 2, '0'), 'YYYYMM')
  INTO v_ultimo_mes
  FROM (
    SELECT mes, anno
    FROM NOMINA
    WHERE dni_nom = v_dni
    ORDER BY anno DESC, mes DESC
  )
  WHERE ROWNUM = 1;

  -- Actualizo última nómina con su nueva indemnización
  UPDATE NOMINA
  SET mensualidad = v_indemnizacion,
      seg_soc = v_ss_mes,
      observaciones = 'Último mes con indemnización'
  WHERE dni_nom = v_dni
    AND TO_DATE(anno || LPAD(mes, 2, '0'), 'YYYYMM') = TRUNC(v_fecha_fin, 'MM');

  -- Añado el siguiente mes con solo ss
  v_mes_actual := ADD_MONTHS(TRUNC(v_fecha_fin, 'MM'), 1);

  INSERT INTO NOMINA (
    dni_nom, mes, anno, mensualidad, seg_soc, observaciones
  ) VALUES (
    v_dni,
    TO_NUMBER(TO_CHAR(v_mes_actual, 'MM')),
    TO_NUMBER(TO_CHAR(v_mes_actual, 'YYYY')),
    0,
    v_ss_mes,
    'ultima ss'
  );

END;

