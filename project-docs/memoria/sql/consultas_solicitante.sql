-- comprobar si convocatoria abierta
SELECT ABIERTO
FROM CONVOCATORIA 
WHERE REFERENCIA = :P7_REF_CON

-- muestro mensaje en js

apex.message.clearErrors();

const abierto = $v('P7_CON_OPEN');

if (abierto == '0') {
    const mensaje = 'Esta convocatoria está cerrada: ';
    apex.message.alert("ℹ️ AVISO: "+mensaje);
    $s('P7_REF_CON', ''); // Limpia la convocatoria para que elijan otra
} 

-- mostrar las convocatorias en el desplegable, solo las que no están llenas

SELECT C.TITULO, C.REFERENCIA
FROM CONVOCATORIA C
LEFT JOIN (
    SELECT REF_CON, COUNT(*) AS NUM_SOLICITANTES
    FROM SOLICITANTE
    GROUP BY REF_CON
) S ON C.REFERENCIA = S.REF_CON
WHERE NVL(S.NUM_SOLICITANTES, 0) < C.NUM_PLAZAS
ORDER BY C.TITULO, C.REFERENCIA;

-- comprobar titulación requerida

SELECT TIT_REQUERIDA
FROM CONVOCATORIA 
WHERE REFERENCIA = :P7_REF_CON

-- muestro mensaje en js

apex.message.clearErrors();
if ($v('P7_CON_OPEN') == '1'){
    // compruebo que la convocatoira está abierta
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
}