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
    
    const iframeGeNomIn = Selector('iframe[name="GeNomIn"]'); // Ajusta el selector si es necesario
    const titlePaginaPrincipal = Selector('.content-body .title').withText('PÁGINA PRINCIPAL');

    // Espera a que los campos estén disponibles
    await t.expect(usernameField.exists).ok({ timeout: 5000 });
    await t.expect(passwordField.exists).ok({ timeout: 5000 });

    // Interacción con los elementos
    await t
        .typeText(usernameField, 'Fran')
        .typeText(passwordField, 'epdrntr')
       
    await clickButton();

    // Cambiar al iframe antes de buscar el título
    await t.switchToIframe(iframeGeNomIn);

    // Validar que el título de la página principal aparece
    await t.expect(titlePaginaPrincipal.exists).ok({ timeout: 5000 });
});
