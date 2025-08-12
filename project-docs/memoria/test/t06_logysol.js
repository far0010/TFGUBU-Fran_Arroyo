import {BUTTON, USERNAME, PASSW, TOGICON2, SOLICITANTEMENU, SOLICITHEAD} from './constanst.js';

fixture`Test Suite`.page("https://192.168.2.61:8443/apex/f?p=100:LOGIN_DESKTOP:12651011480748:::::");

test('Login y desplegar Solicitante', async t => {
    
    await t.navigateTo('https://192.168.2.61:8443/ords/f?p=100:1:34126906504519:::::');

// Espera a que los campos estén disponibles
    await t.expect(USERNAME.exists).ok({ timeout: 5000 });
    await t.expect(PASSW.exists).ok({ timeout: 5000 });

    // Interacción con los elementos
    await t
        .typeText(USERNAME, 'user01')
        .typeText(PASSW, 'user01')
       
    await BUTTON();

    // Hacer clic en el menú y verificar si se ha expandido
    // click en Convocatorias
    //await t.expect(CONVOMENU.exists).ok({ timeout: 5000 });

    await t
        .click(TOGICON2)  // Hace clic en el ícono de despliegue 2 de convocatorias
        //.expect(SUBMEN.visible).ok({ timeout: 5000 }); // Verifica que el submenú esté visible

    // click en Convocatorias
    await t.expect(SOLICITANTEMENU.exists).ok({ timeout: 5000 });
    
    // Hace clic en el enlace "Solicitante"
     await t.click(SOLICITANTEMENU);
   
     await t.expect(SOLICITHEAD.exists).ok({ timeout: 5000 });
});
