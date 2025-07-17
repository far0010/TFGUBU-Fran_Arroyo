-- obtener datos del contrato

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
WHERE C.REF_CONTRATO = :P13_SEL_CONT

-- obtener fecha fin

SELECT P.FECHA_FIN
FROM CONTRATOS C
JOIN CONVOCATORIA V ON C.CONVOCATORIA = V.REFERENCIA
JOIN PROYECTO P ON V.REF_PROY = P.ORGANICA
WHERE C.REF_CONTRATO = :P13_SEL_CONT

-- verificar fechas del contrato

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
const fechaInicioStr         = $v('P13_F_INI');
const fechaContratoFinStr    = $v('P13_F_FIN');
const nuevaFechaFinStr       = $v('P13_NEW_F_FIN');
const fechaProyectoFinStr    = $v('P13_NEW_FECHA');

// Parsear las fechas
const fechaInicio            = parseFechaFlexible(fechaInicioStr);
const fechaContratoFin       = parseFechaFlexible(fechaContratoFinStr);
const nuevaFechaFin          = parseFechaFlexible(nuevaFechaFinStr);
const fechaProyectoFin       = parseFechaFlexible(fechaProyectoFinStr);

// Logs para verificar valores
console.log('Fecha INICIO (raw):', fechaInicioStr);
console.log('Fecha FIN actual (raw):', fechaContratoFinStr);
console.log('Nueva fecha FIN (raw):', nuevaFechaFinStr);
console.log('Fecha FIN proyecto (raw):', fechaProyectoFinStr);

console.log('INICIO (obj):', fechaInicio?.toLocaleDateString('es-ES'), typeof fechaInicio);
console.log('FIN actual (obj):', fechaContratoFin?.toLocaleDateString('es-ES'), typeof fechaContratoFin);
console.log('Nueva FIN (obj):', nuevaFechaFin?.toLocaleDateString('es-ES'), typeof nuevaFechaFin);
console.log('Proyecto FIN (obj):', fechaProyectoFin?.toLocaleDateString('es-ES'), typeof fechaProyectoFin);
// semaforo
let estadoVerificacion = 'ok';
// nueva fecha debe ser posterior a actual
if (nuevaFechaFin && fechaContratoFin) {
  if (nuevaFechaFin <= fechaContratoFin) {
    apex.message.alert("ℹ️ AVISO: La nueva fecha debe ser posterior a la actual");
    $s('P13_NEW_F_FIN', '');
    $('#P13_NEW_F_FIN').trigger('change');
    estadoVerificacion = 'fail';
  }
}

// nueva fecha no debe pasar la fecha fin de proyecto
if (nuevaFechaFin && fechaProyectoFin) {
  if (nuevaFechaFin > fechaProyectoFin) {
    apex.message.alert("ℹ️ AVISO: La nueva fecha debe ser igual o anterior a: " + fechaProyectoFin.toLocaleDateString('es-ES'));
    $s('P13_NEW_F_FIN', '');
    $('#P13_NEW_F_FIN').trigger('change');
    estadoVerificacion = 'fail';
  }
}

// cambio color si ok
const $boton = $('#btn_verifica');

if ($boton.length) {
  // Elimina clases anteriores
  $boton.removeClass('t-Button--success t-Button--hot t-Button--danger');

  // Aplica color según estado
  if (estadoVerificacion === "ok") {
    $boton.addClass('t-Button--success');
  }
}

---- generar nominas y modificar f fin contrato

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
const fechaInicioStr         = $v('P13_F_INI');
const fechaContratoFinStr    = $v('P13_F_FIN');
const nuevaFechaFinStr       = $v('P13_NEW_F_FIN');
const fechaProyectoFinStr    = $v('P13_NEW_FECHA');

// Parsear las fechas
const fechaInicio            = parseFechaFlexible(fechaInicioStr);
const fechaContratoFin       = parseFechaFlexible(fechaContratoFinStr);
const nuevaFechaFin          = parseFechaFlexible(nuevaFechaFinStr);
const fechaProyectoFin       = parseFechaFlexible(fechaProyectoFinStr);

// Logs para verificar valores
console.log('Fecha INICIO (raw):', fechaInicioStr);
console.log('Fecha FIN actual (raw):', fechaContratoFinStr);
console.log('Nueva fecha FIN (raw):', nuevaFechaFinStr);
console.log('Fecha FIN proyecto (raw):', fechaProyectoFinStr);

console.log('INICIO (obj):', fechaInicio?.toLocaleDateString('es-ES'), typeof fechaInicio);
console.log('FIN actual (obj):', fechaContratoFin?.toLocaleDateString('es-ES'), typeof fechaContratoFin);
console.log('Nueva FIN (obj):', nuevaFechaFin?.toLocaleDateString('es-ES'), typeof nuevaFechaFin);
console.log('Proyecto FIN (obj):', fechaProyectoFin?.toLocaleDateString('es-ES'), typeof fechaProyectoFin);
// semaforo
let estadoVerificacion = 'ok';
// nueva fecha debe ser posterior a actual
if (nuevaFechaFin && fechaContratoFin) {
  if (nuevaFechaFin <= fechaContratoFin) {
    apex.message.alert("ℹ️ AVISO: La nueva fecha debe ser posterior a la actual");
    $s('P13_NEW_F_FIN', '');
    $('#P13_NEW_F_FIN').trigger('change');
    estadoVerificacion = 'fail';
  }
}

// nueva fecha no debe pasar la fecha fin de proyecto
if (nuevaFechaFin && fechaProyectoFin) {
  if (nuevaFechaFin > fechaProyectoFin) {
    apex.message.alert("ℹ️ AVISO: La nueva fecha debe ser igual o anterior a: " + fechaProyectoFin.toLocaleDateString('es-ES'));
    $s('P13_NEW_F_FIN', '');
    $('#P13_NEW_F_FIN').trigger('change');
    estadoVerificacion = 'fail';
  }
}

// cambio color si ok
const $boton = $('#btn_verifica');

if ($boton.length) {
  // Elimina clases anteriores
  $boton.removeClass('t-Button--success t-Button--hot t-Button--danger');

  // Aplica color según estado
  if (estadoVerificacion === "ok") {
    $boton.addClass('t-Button--success');
  }
}


