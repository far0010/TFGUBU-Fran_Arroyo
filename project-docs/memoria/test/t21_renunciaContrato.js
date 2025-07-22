import { Selector} from 'testcafe';
import {BUTTON, USERNAME, PASSW, TOGICON3, RENUNMENU,SOLICIRENUN, SEL_FEC_RENUNCIA, BT_VERIFICA2,
    BT_RENUNCIAR} from './constanst.js';

fixture`Test Suite-21`.page("https://192.168.2.61:8443/apex/f?p=100:LOGIN_DESKTOP:12651011480748:::::")
     .meta({TEST_RUN:'Renuncia contrato',FEATURE: 'Renuncia Contrato', STORY: 'US21-Zube #16'});

test.meta({SEVERITY:'critical', ISSUE_URL: 'https://github.com/far0010/TFGUBU-Fran_Arroyo/issues/12',
    STORY: 'US21-Zube #16'})
    ('US21-Zube #18: Se efectúa la renuncia del contrato de 12345678M', async t => {
    
    await t.navigateTo('https://192.168.2.61:8443/ords/f?p=100:1:34126906504519:::::');

    // Espera a que los campos estén disponibles
    await t.expect(USERNAME.exists).ok({ timeout: 5000 });
    await t.expect(PASSW.exists).ok({ timeout: 5000 });

    // Interacción con los elementos
    await t
        .typeText(USERNAME, 'user01')
        .typeText(PASSW, 'user01')
       
    await BUTTON();;

    await t
            .click(TOGICON3)  // Hace clic en el ícono de despliegue
    // Esperar a que aparezca Contratos
    await t.expect(RENUNMENU.exists).ok({ timeout: 5000 });
       
    // Hace clic en el enlace "Renovar"
    await t.click(RENUNMENU);

    await t.expect(SOLICIRENUN.exists).ok({ timeout: 5000 });
    const okButton = Selector('button.js-confirmBtn').withText('OK');
    // meter los datos
    const contratoSelect = Selector('#P14_SEL_CONT');
    await t.maximizeWindow() //maximizamos la ventana para ver bien los campos.
    await t
        .click(contratoSelect)
        .click(contratoSelect.find('option').withAttribute('value', 'CONT141'))
        .expect(contratoSelect.value).eql('CONT141');

    // fecha de renuncia antes de que acabe este contrato
    const successButton2 = Selector('#btn_verifica2').withAttribute('class', /t-Button--success/); 
    await t
        .click(SEL_FEC_RENUNCIA)
        .typeText(Selector('input[name="P14_F_RENUNCIA"]'), '31-DIC-2025') 
        .pressKey('tab')   
        .click(BT_VERIFICA2)
        .expect(successButton2.exists).ok({ timeout: 5000 }); // controla que el botón esté en verde
    // Resto de datos
    await t
        .typeText(Selector('input[name="P14_NEW_IND"]'), '1450')
        .click(BT_RENUNCIAR);
    // Verificar mensaje de confirmación
    // Espera el botón confirmación es visible
    const ConfirmRenov = Selector('button.js-confirmBtn').withText('Renunciar');
    await t
        .expect(ConfirmRenov.exists).ok('Confirmación visible')
        .click(ConfirmRenov);
    const successAlert = Selector('h2.t-Alert-title').withText('La RENUNCIA se ha realizado correctamente y borrado las nóminas correspondientes');
    await t.expect(successAlert.exists).ok('No se mostró el mensaje de éxito tras la renovación');
});
