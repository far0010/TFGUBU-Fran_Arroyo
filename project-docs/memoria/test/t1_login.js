import {BUTTON, USERNAME, PASSW, TITPAGPAL} from './constanst.js';

fixture`Test Suite`.page("http://localhost:8080/apex/f?p=100:LOGIN_DESKTOP:12651011480748:::::");

test('Validar si login exitoso', async t => {

    // Espera a que los campos estén disponibles
    await t.expect(USERNAME.exists).ok({ timeout: 5000 });
    await t.expect(PASSW.exists).ok({ timeout: 5000 });

    // Interacción con los elementos
    await t
        .typeText(USERNAME, 'user01')
        .typeText(PASSW, 'user01')
       
    await BUTTON();
    
    // Validar que el título de la página principal aparece
    await t.expect(TITPAGPAL.exists).ok({ timeout: 5000 });
});
