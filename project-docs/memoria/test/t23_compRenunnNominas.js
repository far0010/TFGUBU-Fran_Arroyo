import { getNominaCount, getFechaFin } from './db-utils.js';

fixture`Test Suite-23`.page("https://192.168.2.61:8443/apex/f?p=100:LOGIN_DESKTOP:12651011480748:::::")
     .meta({TEST_RUN:'Verificación fin contrato a 31-12-2025 y 6 nóminas',FEATURE: 'Contratos', STORY: 'US23-Zube #16'});

test.meta({SEVERITY:'critical', ISSUE_URL: 'https://github.com/far0010/TFGUBU-Fran_Arroyo/issues/16',
    STORY: 'US23-Zube #16'})
    ('US23-Zube #16: Comprobación si elimina las nóminas después renuncia y la fecha contrato', async t => {
    const nif = '12345678M'; // Corresponde a Luis Pérez López
    const total = await getNominaCount(nif);
    console.log(`Total nóminas para ${nif}:`, total);
    // debe haber de agosto a dicimebre 5 + la ss en enero 6
    await t.expect(total).eql(6, ` No se generaron las nóminas para el NIF ${nif}`);
    const contrato='CONT141'; // contrato al que renuncia
    const fechabd = await getFechaFin(contrato);
    const fechaLocal = fechabd.toLocaleDateString('en-CA'); 
    await t.expect(fechaLocal).eql('2025-12-31', `No se modificó la fecha del contrato ${contrato}`);

});
