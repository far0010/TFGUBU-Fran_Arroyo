import { Selector} from 'testcafe';
import {BUTTON, USERNAME, PASSW, TOGICON3,CONTRATOMENU, SOLICICONTRATO, SELEC_CONVO,
     COGE_CONVO, COGE_CONTRATADO2, SELEC_CONTRATADO,SELEC_TIPOCON, COGE_TIPOCON,
    FILASANTES} from './constanst.js';

fixture`Test Suite`.page("https://192.168.2.61:8443/apex/f?p=100:LOGIN_DESKTOP:12651011480748:::::")
     .meta({TEST_RUN:'Investigacion',FEATURE: 'Autenticación', STORY: 'US16-Zube #15'});

test.meta({SEVERITY:'critical', ISSUE_URL: 'https://github.com/far0010/TFGUBU-Fran_Arroyo/issues/12',
    STORY: 'US16-Zube #15'})
    ('US16-Zube #15: Se validan fechas de ini fin contrato', async t => {
    
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
    // Esperar a que aparezca en Convocatorias
    await t.expect(CONTRATOMENU.exists).ok({ timeout: 5000 });
       
    // Hace clic en el enlace "Solicitante"
    await t.click(CONTRATOMENU);

    await t.expect(SOLICICONTRATO.exists).ok({ timeout: 5000 });
    
    const filasAntes = await FILASANTES();
    //  console.log('Filas antes:', filasAntes);
    // Espera a que cargue la tabla o el botón
    await t.click(Selector('span.t-Button-label').withText('Create').parent('button'));
    
    //comprobar si está en el iframe Nuevo Contratado y cambiamos de contesto
    const iframe = Selector('iframe[title="Nuevo Contratado"]');

    const okButton = Selector('button.js-confirmBtn').withText('OK');

    await t.switchToIframe(iframe);
    // meter los datos
    await t

        .click(SELEC_CONVO)
        .click(COGE_CONVO)
        .click(SELEC_CONTRATADO)
        .click(COGE_CONTRATADO2)
        .click(SELEC_TIPOCON)
        .click(COGE_TIPOCON)
        // PRIMERA FECHA ANTERIOR AL PROYECTO
        .typeText(Selector('input[name="P12_F_INI"]'), '01-JUL-2023')
        .pressKey('tab')
        .switchToMainWindow()
        .expect(okButton.with({ visibilityCheck: true }).exists).ok({ timeout: 5000 })
        .click(okButton)
        .switchToIframe(iframe)
        // SEGUNDA FECHA ANTERIOR A LA PRIMERA
        .typeText(Selector('input[name="P12_F_INI"]'), '01-JUL-2025')
        .typeText(Selector('input[name="P12_F_FIN"]'), '30-JUN-2025')
        .pressKey('tab')
        .switchToMainWindow()
        .expect(okButton.with({ visibilityCheck: true }).exists).ok({ timeout: 5000 })
        .click(okButton)
        .switchToIframe(iframe)
        // SEGUNDA FECHA POSTERIOR A FIN PROYECTO
        .typeText(Selector('input[name="P12_F_FIN"]'), '30-JUN-2028', { replace: true })
        .pressKey('tab')
        .switchToMainWindow()
        .expect(okButton.with({ visibilityCheck: true }).exists).ok({ timeout: 5000 })
        .click(okButton)
        .switchToIframe(iframe)
});
