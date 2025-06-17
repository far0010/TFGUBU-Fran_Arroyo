import {BUTTON, USERNAME, PASSW, TOGICON, SUBMEN, RESPONMENU,RESPONHEAD} from './constanst.js';

fixture`Test Suite`.page("http://localhost:8080/apex/f?p=100:LOGIN_DESKTOP:12651011480748:::::");


test('Login y desplegar Responsable', async t => {

    await t.navigateTo('http://192.168.2.61:8080/ords/f?p=100:1:34126906504519:::::');

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
});