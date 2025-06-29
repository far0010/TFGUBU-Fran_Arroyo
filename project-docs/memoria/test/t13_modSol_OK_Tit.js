import { Selector} from 'testcafe';
import {BUTTON, USERNAME, PASSW, TOGICON2,SOLICITANTEMENU, SOLICITHEAD, SELECTITSOL, 
    SOLICDIPLO, SELECONVSOL,SOLICSITIT} from './constanst.js';

fixture`Test Suite`.page("https://192.168.2.61:8443/apex/f?p=100:LOGIN_DESKTOP:12651011480748:::::");

test('Crear Solicitante a convocatoria con titulación OK', async t => {
    
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
    //await t.expect(CONVOMENU.exists).ok({ timeout: 5000 });

     await t
            .click(TOGICON2)  // Hace clic en el ícono de despliegue
    // Esperar a que aparezca en Convocatorias
    await t.expect(SOLICITANTEMENU.exists).ok({ timeout: 5000 });
       
    // Hace clic en el enlace "Solicitante"
    await t.click(SOLICITANTEMENU);

    await t.expect(SOLICITHEAD.exists).ok({ timeout: 5000 });
    
    // pulsar en el icono de edición
    const iconoEditar = Selector('img.apex-edit-pencil').withAttribute('alt', 'Edit');

    await t
        .expect(iconoEditar.exists)
        .ok('No se encontró el icono del lápiz de edición');

    await t
        .click(iconoEditar);

    
    const iframe = Selector('iframe[title="Datos"]');
    //para la selección del botón ok

    await t.switchToIframe(iframe);

    await t
        
        // cogemos la solicitud ok
        .click(SELECONVSOL)
        .click(SOLICSITIT)
        // tiene que dar error, ya que hemos elegido la concocatoria errónea
        //.click(Selector('span.t-Button-label').withText('Create').parent('button'));

        // pulsamos el botón de aviso primero volvemos al padre
    await t
        //.switchToMainWindow()
        //.expect(okButton.with({ visibilityCheck: true }).exists).ok({ timeout: 5000 })
        //.click(okButton)
        // pulsamos crear pero tenemos que volver al iframe que estábamos.
        //.switchToIframe(iframe)
        .click(Selector('span.t-Button-label').withText('Apply Changes').parent('button'))
        // contamos las filas de vuleta
        .switchToMainWindow();
   //await t.expect(CONFILASTABLA.count).eql(filasAntes, {timeout: 5000});
   // Esperamos a que aparezca la nueva fila (posición siguiente)
    const valorConvo = Selector('td').withAttribute('headers', 'C16390651676072709');
    await t
        .expect(valorConvo.innerText)
        .eql('CONV017', 'Debe haber valor en el campo REF_CON');
});
