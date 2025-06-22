import { Selector} from 'testcafe';
import {BUTTON, USERNAME, PASSW, FILASANTES, FILASDESPUES, CONFILASTABLA, CONVOMENU, 
    CONVOHEAD, GRADUADO, SELECOPEN, ABIERTO, SELECTIT, INVEST, SELINVEST, PROYEC, SELPROY} from './constanst.js';

fixture`Test Suite`.page("https://192.168.2.61:8443/apex/f?p=100:LOGIN_DESKTOP:12651011480748:::::");

test('Crear convocatoria', async t => {
    
    await t.navigateTo('https://192.168.2.61:8443/ords/f?p=100:1:34126906504519:::::');

// Espera a que los campos estén disponibles
    await t.expect(USERNAME.exists).ok({ timeout: 5000 });
    await t.expect(PASSW.exists).ok({ timeout: 5000 });

    // Interacción con los elementos
    await t
        .typeText(USERNAME, 'user01')
        .typeText(PASSW, 'user01')
       
    await BUTTON();;

    // click en Convocatorias
    await t.expect(CONVOMENU.exists).ok({ timeout: 5000 });

    // Hace clic en el enlace "Convocatorias"
    await t.click(CONVOMENU);

    await t.expect(CONVOHEAD.exists).ok({ timeout: 5000 });
    
    const filasAntes = await FILASANTES();
    console.log('Filas antes:', filasAntes);
    // Espera a que cargue la tabla o el botón
    await t.click(Selector('span.t-Button-label').withText('Create').parent('button'));

    const TITULO = Selector('#P9_TITULO');
    const iframe = Selector('iframe[title="Nueva Convocatoria"]');
    //para la selección del botón ok
    const okButton = Selector('button.js-confirmBtn').withText('OK');
    // cambiamos de contexto

    await t.switchToIframe(iframe);

    await t
        
        .expect(TITULO.exists).ok()
        .typeText(TITULO, 'PRUEBA 3')
        
        .expect(SELECTIT.exists).ok({ timeout: 5000 })
        .expect(SELECTIT.hasAttribute('disabled')).notOk('El select está deshabilitado')
        .click(SELECTIT)
        .expect(GRADUADO.exists).ok({ timeout: 5000 })
        .click(GRADUADO)
        .typeText(Selector('input[name="P9_NUM_PLAZAS"]'), '1')
        .click(SELECOPEN)
        .click(ABIERTO)
        .click(INVEST)
        .expect(INVEST.exists).ok({ timeout: 5000 })
        .click(SELINVEST)
        .click(PROYEC)
        .expect(PROYEC.exists).ok({ timeout: 5000 })
        .click(SELPROY)
        // pulsamos el botón de aviso primero volvemos al padre
        .switchToMainWindow()
        .expect(okButton.with({ visibilityCheck: true }).exists).ok({ timeout: 5000 })
        .click(okButton)
        // pulsamos crear pero tenemos que volver al iframe que estábamos.
        .switchToIframe(iframe)
        .click(Selector('span.t-Button-label').withText('Create').parent('button'))
        // contamos las filas de vuleta
        .switchToMainWindow();
    await t.expect(CONFILASTABLA.count).eql(filasAntes + 1, {timeout: 5000});
   // Esperamos a que aparezca la nueva fila (posición siguiente)
        const nuevaFila = CONFILASTABLA.nth(filasAntes);
    await t.expect(nuevaFila.exists).ok({ timeout: 5000 });
        const filasDespues = await FILASDESPUES();
        console.log('Filas después:', await FILASDESPUES());
    await t.expect(CONFILASTABLA.count).eql(filasAntes + 1, 'Debe haber una fila más en la tabla');
});
