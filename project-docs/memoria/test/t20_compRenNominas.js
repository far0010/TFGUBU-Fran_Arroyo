import { getNominaCount, getFechaFin } from './db-utils.js';

fixture`Test Suite`.page("https://192.168.2.61:8443/apex/f?p=100:LOGIN_DESKTOP:12651011480748:::::")
     .meta({TEST_RUN:'Investigacion',FEATURE: 'Contratos', STORY: 'US17-Zube #15'});

test.meta({SEVERITY:'critical', ISSUE_URL: 'https://github.com/far0010/TFGUBU-Fran_Arroyo/issues/12',
    STORY: 'US20-Zube #15'})
    ('US20-Zube #15: Comprobación de si se han creado las nóminas de la renovación', async t => {
    const nif = '12345678l'; // Corresponde a Luis Pérez López
    const total = await getNominaCount(nif);
    console.log(`Total nóminas para ${nif}:`, total);
    // debe haber 12 primer contrato, más 4 de la renovación (el finiquito, es pisado por primera nómina renovación)
    await t.expect(total).eql(16, ` No se generaron las nóminas para el NIF ${nif}`);
    const contrato='CONT123'; // contrato renovado
    const fechabd = await getFechaFin(contrato);
    const fechaLocal = fechabd.toLocaleDateString('en-CA'); // ISO-like → '2026-09-30'
    await t.expect(fechaLocal).eql('2026-09-30', `No se modificó la fecha del contrato ${contrato}`);

});
