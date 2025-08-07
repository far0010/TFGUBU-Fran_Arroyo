import { Selector } from 'testcafe';
import {NOMINAMENU, BUTTON, USERNAME, PASSW, TOGICON4, BT_CONNOM, VTOMENU } from './constanst.js';

fixture`Test Suite-25`.page("https://192.168.2.61:8443/apex/f?p=100:LOGIN_DESKTOP:12651011480748:::::")
     .meta({TEST_RUN:'Informe de contratos entre fechas',FEATURE: 'Informes', STORY: 'US25-Zube #23'});

test.meta({SEVERITY:'critical', ISSUE_URL: 'https://github.com/far0010/TFGUBU-Fran_Arroyo/issues/16',
    STORY: 'US25-Zube #23'})
    ('US25-Zube #23: Informe de contratos entre fechas', async t => {
    const INI = '01-ENE-2025'; 
    const FIN = '31-DIC-2025';
    // Espera a que los campos estén disponibles
        await t.expect(USERNAME.exists).ok({ timeout: 5000 });
        await t.expect(PASSW.exists).ok({ timeout: 5000 });
    
        // Interacción con los elementos
        await t
            .typeText(USERNAME, 'user01')
            .typeText(PASSW, 'user01')
           
        await BUTTON();;
    await t
            .click(TOGICON4)  // Hace clic en el ícono de despliegue
    // Esperar a que aparezca Nómina mes
    await t.expect(VTOMENU.exists).ok({ timeout: 5000 });
       
    // Hace clic en el enlace Nómina mes
    await t.click(VTOMENU);
    // introducir fechas inicio - fin
    const BT_VTOS = Selector('#B18949343265529115')
    await t
            .typeText(Selector('input[name="P17_FDESDE"]'), INI)
            .typeText(Selector('input[name="P17_FHASTA"]'), FIN)
            .click(BT_VTOS);
    
    // comprobamos que ofrece las filas deseadas 3
    const filasDatos = Selector('#R18949894423529120_data_panel tbody tr')
            .filter(node => node.querySelectorAll('td').length > 0);
    await t
        .expect(filasDatos.count)
        .eql(3, 'La tabla no muestra exactamente 3 filas de datos');
        
});
