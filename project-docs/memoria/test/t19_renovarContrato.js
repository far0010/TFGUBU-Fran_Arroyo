import { Selector} from 'testcafe';
import {BUTTON, USERNAME, PASSW, TOGICON3, RENOVARMENU,SOLICIRENOVAR
    , SEL_FEC_REN, BT_VERIFICA, BT_RENOVAR} from './constanst.js';

fixture`Test Suite`.page("https://192.168.2.61:8443/apex/f?p=100:LOGIN_DESKTOP:12651011480748:::::")
     .meta({TEST_RUN:'Investigacion',FEATURE: 'Contratos', STORY: 'US19-Zube #16'});

test.meta({SEVERITY:'critical', ISSUE_URL: 'https://github.com/far0010/TFGUBU-Fran_Arroyo/issues/12',
    STORY: 'US19-Zube #16'})
    ('US16-Zube #15: Se efectúa renovación de contrato 3 meses', async t => {
    
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
    await t.expect(RENOVARMENU.exists).ok({ timeout: 5000 });
       
    // Hace clic en el enlace "Renovar"
    await t.click(RENOVARMENU);

    await t.expect(SOLICIRENOVAR.exists).ok({ timeout: 5000 });
    const successButton = Selector('#btn_verifica').withAttribute('class', /t-Button--success/); 
    // meter los datos
    const contratoSelect = Selector('#P13_SEL_CONT');
    await t.maximizeWindow() //maximizamos la ventana para ver bien los campos.
    await t
        .click(contratoSelect)
        .click(contratoSelect.find('option').withAttribute('value', 'CONT123'))
        .expect(contratoSelect.value).eql('CONT123');

    // fecha de inicio renovación antes de que acabe este contrato
    await t
        .click(SEL_FEC_REN)
        .typeText(Selector('input[name="P13_NEW_F_FIN"]'), '30-SEP-2026') // fecha correct
        .pressKey('tab')   
        .click(BT_VERIFICA) // botón verifica en verde
        .expect(successButton.exists).ok({ timeout: 5000 }); // controla que el botón esté en verde
    // incluimos el resto de campos solicitados
    await t
        .typeText(Selector('input[name="P13_NEW_SAL"]'), '1100')
        .typeText(Selector('input[name="P13_NEW_SS"]'), '525')
        .typeText(Selector('input[name="P13_NEW_IND"]'), '1450')
        .click(BT_RENOVAR);
    // Verificar mensaje de confirmación
    // Espera el botón confirmación es visible
    const ConfirmRenov = Selector('button.js-confirmBtn').withText('Renovar');
    await t
        .expect(ConfirmRenov.exists).ok('Confirmación visible')
        .click(ConfirmRenov);
    const successAlert = Selector('h2.t-Alert-title').withText('La prorroga se ha realizado correctamente e insertado las nóminas correspondientes');
    await t.expect(successAlert.exists).ok('No se mostró el mensaje de éxito tras la renovación');
});
