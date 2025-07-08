import { Selector} from 'testcafe';
import {BUTTON, USERNAME, PASSW, TOGICON3,CONTRATOMENU, SOLICICONTRATO, SELEC_CONVO,
     COGE_CONVO, COGE_CONTRATADO, SELEC_CONTRATADO,SELEC_TIPOCON, COGE_TIPOCON,
    FILASANTES, CONFILASTABLA, FILASDESPUES} from './constanst.js';

fixture`Test Suite`.page("https://192.168.2.61:8443/apex/f?p=100:LOGIN_DESKTOP:12651011480748:::::")
     .meta({TEST_RUN:'Investigacion',FEATURE: 'Autenticación', STORY: 'US14-Zube #15'});

test.meta({SEVERITY:'critical', ISSUE_URL: 'https://github.com/far0010/TFGUBU-Fran_Arroyo/issues/12',
    STORY: 'US14-Zube #15'})
    ('US14-Zube #15: Crear un contrato de un solicitante y nóminas asociadas', async t => {
    
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
    await t.switchToIframe(iframe);
    // meter los datos
    await t

        .click(SELEC_CONVO)
        .click(COGE_CONVO)
        .click(SELEC_CONTRATADO)
        .click(COGE_CONTRATADO)
        .click(SELEC_TIPOCON)
        .click(COGE_TIPOCON)
        .typeText(Selector('input[name="P12_F_INI"]'), '01-NOV-2025')
        .typeText(Selector('input[name="P12_F_FIN"]'), '31-OCT-2027')
        .typeText(Selector('input[name="P12_RET_TOT"]'), '49000')
        .typeText(Selector('input[name="P12_RET_MES"]'), '1500')
        .typeText(Selector('input[name="P12_SS_MES"]'), '500')
        .typeText(Selector('input[name="P12_INDEMNIZACION"]'), '1000')
        .typeText(Selector('input[name="P12_RESERVA"]'), '49000')
        .typeText(Selector('input[name="P12_OBSERVACIONES"]'), 'PRUEBA DE TEST')
        .click(Selector('span.t-Button-label').withText('Create').parent('button'))

    // CLIC EN CONFIRMACIÓN
    const CreateButton = Selector('button.js-confirmBtn').withText('Create');
    await t
        .switchToMainWindow()
        
    const ConfirmCreateBtn = Selector('button.js-confirmBtn').withText('Create');

    // Espera el botón 2ª confirmación es visible
    const ConfirmCreate = Selector('button.js-confirmBtn').withText('Create');
    await t
        .expect(ConfirmCreate.exists).ok('Confirmación visible')
        .click(ConfirmCreate);
        
    await t.switchToIframe(iframe);
    // Esperamos a que termine de rellenar nóminas
    await t.switchToMainWindow();
       
    await t.expect(CONFILASTABLA.count).eql(filasAntes + 1, {timeout: 5000});
       // Esperamos a que aparezca la nueva fila (posición siguiente)
    const nuevaFila = CONFILASTABLA.nth(filasAntes);
    await t.expect(nuevaFila.exists).ok({ timeout: 5000 });
    const filasDespues = await FILASDESPUES();
    console.log('Filas después:', await FILASDESPUES());
    await t.expect(CONFILASTABLA.count).eql(filasAntes + 1, 'Debe haber una fila más en la tabla');
});
