import { Selector, ClientFunction } from 'testcafe';

fixture`Login Suite`.page("http://localhost:8080/apex/f?p=100:LOGIN_DESKTOP:12651011480748:::::");

const clickButton = ClientFunction(() => {
    document.querySelector('button').click();
});

test('Validar si login exitoso', async t => {
    // Selecciona los campos usando el atributo 'name'
    const usernameField = Selector('input').withAttribute('name', 'P101_USERNAME');
    const passwordField = Selector('input').withAttribute('name', 'P101_PASSWORD');
    const loginButton = Selector('.region-buttons').find('button').withText('LOGIN');
    
    // Seleccionar el iframe y el título dentro de Content Body
    const titlePaginaPrincipal = Selector('h2.t-Region-title').withText('PÁGINA PRINCIPAL');

    // Espera a que los campos estén disponibles
    await t.expect(usernameField.exists).ok({ timeout: 5000 });
    await t.expect(passwordField.exists).ok({ timeout: 5000 });

    // Interacción con los elementos
    await t
        .typeText(usernameField, 'user01')
        .typeText(passwordField, 'user01')
       
    await clickButton();

     //await t.debug();
    
    // Validar que el título de la página principal aparece
    await t.expect(titlePaginaPrincipal.exists).ok({ timeout: 5000 });
});

test('Login erróneo', async t => {
    // Selecciona los campos usando el atributo 'name'
    const usernameField = Selector('input').withAttribute('name', 'P101_USERNAME');
    const passwordField = Selector('input').withAttribute('name', 'P101_PASSWORD');
    const loginButton = Selector('.region-buttons').find('button').withText('LOGIN');
    
    // Seleccionar el iframe y el título dentro de Content Body
    const titlePaginaPrincipal = Selector('h2.t-Region-title').withText('PÁGINA PRINCIPAL');

    // Espera a que los campos estén disponibles
    await t.expect(usernameField.exists).ok({ timeout: 5000 });
    await t.expect(passwordField.exists).ok({ timeout: 5000 });

    const errorMessage = Selector('.t-Alert-body');

    // Interacción con los elementos
    await t
        .typeText(usernameField, 'no_existe')
        .typeText(passwordField, 'ninguna')
    
        await clickButton();
    await t.expect(errorMessage.innerText).contains('Invalid Login Credentials');
});

test('Login y desplegar Administración', async t => {
    // Despliega el menú administración
    const adminMenu = Selector('#admin-menu');
    const submenu = Selector('.submenu');
    // Selecciona los campos usando el atributo 'name'
    const usernameField = Selector('input').withAttribute('name', 'P101_USERNAME');
    const passwordField = Selector('input').withAttribute('name', 'P101_PASSWORD');
    const loginButton = Selector('.region-buttons').find('button').withText('LOGIN');
    const admiMenu = Selector('.a-TreeView-label').withText('Administración');
    const toggleIcon = Selector('.a-TreeView-toggle').nth(0); // Primer ícono de expansión
    const subMenu = Selector('#t_TreeNav_1_subtree');

    await t.navigateTo('http://192.168.2.61:8080/ords/f?p=100:1:34126906504519:::::');

// Espera a que los campos estén disponibles
    await t.expect(usernameField.exists).ok({ timeout: 5000 });
    await t.expect(passwordField.exists).ok({ timeout: 5000 });

    // Interacción con los elementos
    await t
        .typeText(usernameField, 'user01')
        .typeText(passwordField, 'user01')
       
    await clickButton();

    // Hacer clic en el menú y verificar si se ha expandido
    await t
        .click(toggleIcon)  // Hace clic en el ícono de despliegue
        .expect(subMenu.visible).ok({ timeout: 5000 }); // Verifica que el submenú esté visible

});