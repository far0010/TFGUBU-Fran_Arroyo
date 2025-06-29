import { Selector} from 'testcafe';
import {BUTTON, USERNAME, PASSW, TOGICON2,SOLICITANTEMENU, SOLICITHEAD, SELECTITSOL, 
    SOLICDIPLO, SELECONVSOL,SOLICSITIT} from './constanst.js';

fixture`Test Suite`.page("https://192.168.2.61:8443/apex/f?p=100:LOGIN_DESKTOP:12651011480748:::::");

test('Borrar el solicitante', async t => {
    
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

    const okButton = Selector('button.js-confirmBtn').withText('OK');
    // cambio de contexto

    await t.switchToIframe(iframe);

    await t
        // Selección de Delete
        .click(Selector('span.t-Button-label').withText('Delete').parent('button'))
        // contamos las filas de vuleta
        .switchToMainWindow()
        .expect(okButton.with({ visibilityCheck: true }).exists).ok({ timeout: 5000 })
        .click(okButton);
      
    // Verificar mensaje de confirmación
    const successAlert = Selector('h2.t-Alert-title').withText('Action Processed.');
    await t.expect(successAlert.exists).ok('No se mostró el mensaje de éxito tras la eliminación');  
    
});
