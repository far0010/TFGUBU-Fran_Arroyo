import {BUTTON, USERNAME, PASSW, MENSAJEERROR} from './constanst.js';

fixture`Test Suite`.page("http://localhost:8080/apex/f?p=100:LOGIN_DESKTOP:12651011480748:::::");


test('Login erróneo', async t => {
    
    // Espera a que los campos estén disponibles
    await t.expect(USERNAME.exists).ok({ timeout: 5000 });
    await t.expect(PASSW.exists).ok({ timeout: 5000 });

    

    // Interacción con los elementos
    await t
        .typeText(USERNAME, 'no_existe')
        .typeText(PASSW, 'ninguna')
    
        await BUTTON();
    await t.expect(MENSAJEERROR.innerText).contains('Invalid Login Credentials');
});