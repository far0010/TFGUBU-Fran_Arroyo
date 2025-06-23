import { Selector} from 'testcafe';
import {BUTTON, USERNAME, PASSW,  CONVOMENU, CONVOHEAD} from './constanst.js';

fixture`Test Suite`.page("https://192.168.2.61:8443/apex/f?p=100:LOGIN_DESKTOP:12651011480748:::::");

test('Borrar Convocatoria simple', async t => {
    
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
    const titBORRAR='PRUEBA PARA BORRAR';

    // Campo de búsqueda
    const searchField = Selector('input.a-IRR-search-field');
    const searchButton = Selector('button.a-IRR-button--search');

    // Escribir Título y buscar
    await t
        .typeText(searchField, titBORRAR, { replace: true })
        .click(searchButton);

     // Localizar directamente el <td> con el enlace del lápiz
    const editLinkCell = Selector('td.a-IRR-linkCol').withText(titBORRAR);
    const editIcon = Selector('img.apex-edit-pencil-alt');

    await t
        .expect(editIcon.exists).ok('No se encontró el icono del lápiz', { timeout: 5000 })
        .click(editIcon);
// cambio de iframe
    const iframe = Selector('iframe[title="Nueva Convocatoria"]');
    await t.switchToIframe(iframe);

// En la página de edición, hacer clic en Delete
    const botonEliminar = Selector('button').withText('Delete');
   
    await t
        .click(botonEliminar)
        .click(Selector('button').withText('Delete').filterVisible()); 

    // Seleccion del iframe dentro del diálogo
    const iframe2 = Selector('iframe[src*="f?p=100:9"]');

    // Salimos del iframe 
    await t.switchToMainWindow();

    // Seleccion del botón de confirmación
    const confirmBtn = Selector('button.js-confirmBtn');

    // Espera a que el botón esté presente
    await t
        .expect(confirmBtn.exists).ok('El botón js-confirmBtn no se ha encontrado')
        .expect(confirmBtn.visible).ok('El botón js-confirmBtn no está visible')
        .click(confirmBtn);

    // Volver a buscar la convocatoria y comprobar que ya no existe
    await t
        //.switchToMainWindow()
        .typeText(searchField, titBORRAR, { replace: true })
        .pressKey('enter');
    
    // Esperar y validar el mensaje "No data found"
    const noDataMessage = Selector('span.a-IRR-noDataMsg-text').withText('No data found.');
    await t
    .expect(noDataMessage.exists).ok('El mensaje "No data found" no apareció, el registro exite');

});
