import { Selector} from 'testcafe';
import {BUTTON, USERNAME, PASSW, TOGICON3, RENUNMENU,SOLICIRENUN, SEL_FEC_RENUNCIA, BT_VERIFICA2} from './constanst.js';

fixture`Test Suite-22`.page("https://192.168.2.61:8443/apex/f?p=100:LOGIN_DESKTOP:12651011480748:::::")
     .meta({TEST_RUN:'Comprobar fechas renuncia',FEATURE: 'Autenticación', STORY: 'US22-Zube #16'});

test.meta({SEVERITY:'critical', ISSUE_URL: 'https://github.com/far0010/TFGUBU-Fran_Arroyo/issues/12',
    STORY: 'US22-Zube #16'})
    ('US22-Zube #16: Se validan fechas de ini fin renuncia de contrato', async t => {
    
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

    // fecha de inicio renovación antes de que acabe este contrato
    await t
        .click(SEL_FEC_RENUNCIA)
        .typeText(Selector('input[name="P14_F_RENUNCIA"]'), '31-07-2025') // fecha errónea
        .pressKey('tab')   
        .click(BT_VERIFICA2)

        .expect(okButton.with({ visibilityCheck: true }).exists).ok({ timeout: 5000 })
        .click(okButton);
    // fecha de inicio de renovación después de que termine el proyecto
    await t
        .click(SEL_FEC_RENUNCIA)
        .typeText(Selector('input[name="P14_F_RENUNCIA"]'), '01-08-2026') // fecha errónea
        .pressKey('tab')   
        .click(BT_VERIFICA2)

        .expect(okButton.with({ visibilityCheck: true }).exists).ok({ timeout: 5000 })
        .click(okButton);
});
