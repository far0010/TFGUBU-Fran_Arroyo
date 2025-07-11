import { getNominaCount } from './constanst.js';

fixture`Test Suite`.page("https://192.168.2.61:8443/apex/f?p=100:LOGIN_DESKTOP:12651011480748:::::")
     .meta({TEST_RUN:'Investigacion',FEATURE: 'Contratos', STORY: 'US17-Zube #15'});

test.meta({SEVERITY:'critical', ISSUE_URL: 'https://github.com/far0010/TFGUBU-Fran_Arroyo/issues/12',
    STORY: 'US17-Zube #15'})
    ('US17-Zube #15: Comprobación de si se han creado las nóminas del contrato', async t => {
    const nif = '12345678H'; // Corresponde a Juncal Álvarez
    const total = await getNominaCount(nif);
    await t.expect(total).eql(25, ` No se generaron las nóminas para el NIF ${nif}`);
});
