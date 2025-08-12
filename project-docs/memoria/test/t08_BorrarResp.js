import { Selector} from 'testcafe';
import {BUTTON, USERNAME, PASSW, TOGICON, SUBMEN, RESPONMENU,RESPONHEAD} from './constanst.js';

fixture`Test Suite`.page("https://192.168.2.61:8443/apex/f?p=100:LOGIN_DESKTOP:12651011480748:::::");

test('Borrar responsable', async t => {
    
    await t.navigateTo('https://192.168.2.61:8443/ords/f?p=100:1:34126906504519:::::');

// Espera a que los campos estén disponibles
    await t.expect(USERNAME.exists).ok({ timeout: 5000 });
    await t.expect(PASSW.exists).ok({ timeout: 5000 });

    // Interacción con los elementos
    await t
        .typeText(USERNAME, 'user01')
        .typeText(PASSW, 'user01')
       
    await BUTTON();;

    // Hacer clic en el menú y verificar si se ha expandido
    await t
        .click(TOGICON)  // Hace clic en el ícono de despliegue
        .expect(SUBMEN.visible).ok({ timeout: 5000 }); // Verifica que el submenú esté visible

    // click en responsable
    await t.expect(RESPONMENU.exists).ok({ timeout: 5000 });

    // Hace clic en el enlace "Responsables"
    await t.click(RESPONMENU);

    await t.expect(RESPONHEAD.exists).ok({ timeout: 5000 });
    // elemento a eliminar que insertamos en el test anterior
    const dniObjetivo = '00000005E';
    // Campo de búsqueda
    const searchField = Selector('input.a-IRR-search-field');
    const searchButton = Selector('button.a-IRR-button--search');

    // Escribir DNI y buscar
    await t
        .typeText(searchField, dniObjetivo, { replace: true })
        .click(searchButton);
    
     // Localizar directamente el <td> con el enlace del lápiz
    
    const editIcon = Selector('img.apex-edit-pencil');

    await t
        .expect(editIcon.exists).ok('No se encontró el icono del lápiz', { timeout: 5000 })
        .click(editIcon);
    
    // En la página de edición, hacer clic en Delete
    const botonEliminar = Selector('button').withText('Delete');
   
    await t
        .click(botonEliminar)
        .click(Selector('button').withText('OK').filterVisible()); 
    
    // Verificar mensaje de confirmación
    const successAlert = Selector('h2.t-Alert-title').withText('Action Processed.');
    await t.expect(successAlert.exists).ok('No se mostró el mensaje de éxito tras la eliminación');

    // Volver a buscar al responsable y comprobar que ya no existe
    await t
        .typeText(searchField, dniObjetivo, { replace: true })
        .pressKey('enter');
    
    // Esperar y validar el mensaje "No data found"
    const noDataMessage = Selector('span.a-IRR-noDataMsg-text').withText('No data found.');
    await t
    .expect(noDataMessage.exists).ok('El mensaje "No data found" no apareció, el registro exite');
});
