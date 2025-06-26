SELECT TIT_REQUERIDA
FROM CONVOCATORIA 
WHERE REFERENCIA = :P7_REF_CON

----------------

apex.message.clearErrors();

const valReq = $v('P7_TIT-REQ');
const valSol = $v('P7_TIT_SOL');

if (valReq !== '' && valSol !== '') {
  const tit_requerido = parseInt(valReq, 10);
  const tit_usuario = parseInt(valSol, 10);

  if (tit_usuario < tit_requerido) {
   // Buscar el texto asociado al valor requerido
    const select = document.getElementById('P7_TIT_SOL');
    const textoRequerido = Array.from(select.options).find(opt => opt.value === valReq)?.text || 'nivel superior';
    const mensaje = 'Nivel académico insuficiente. Se requiere al menos: ' + textoRequerido;
    apex.message.alert("ℹ️ AVISO: "+mensaje);
    $s('P7_REF_CON', ''); // Limpia la convocatoria para que elijan otra
  }
} 