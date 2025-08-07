import { Selector } from 'testcafe';
import {NOMINAMENU, BUTTON, USERNAME, PASSW, TOGICON4, BT_CONNOM } from './constanst.js';

fixture`Test Suite-24`.page("https://192.168.2.61:8443/apex/f?p=100:LOGIN_DESKTOP:12651011480748:::::")
     .meta({TEST_RUN:'Generación nomina mes/año determinado e informe en PDF',FEATURE: 'Informes', STORY: 'US24-Zube #23'});

test.meta({SEVERITY:'critical', ISSUE_URL: 'https://github.com/far0010/TFGUBU-Fran_Arroyo/issues/16',
    STORY: 'US24-Zube #23'})
    ('US24-Zube #23: Generación nomina mes/año determinado e informe en PDF', async t => {
    const MES = 'Diciembre'; 
    const ANNO = '2025';
    // Espera a que los campos estén disponibles
        await t.expect(USERNAME.exists).ok({ timeout: 5000 });
        await t.expect(PASSW.exists).ok({ timeout: 5000 });
    
        // Interacción con los elementos
        await t
            .typeText(USERNAME, 'user01')
            .typeText(PASSW, 'user01')
           
        await BUTTON();;
    await t
            .click(TOGICON4)  // Hace clic en el ícono de despliegue
    // Esperar a que aparezca Nómina mes
    await t.expect(NOMINAMENU.exists).ok({ timeout: 5000 });
       
    // Hace clic en el enlace Nómina mes
    await t.click(NOMINAMENU);
    // introducir el mes
    const mesSelect = Selector('#P18_MES');

    await t
        .click(mesSelect)
        .click(mesSelect.find('option').withAttribute('value', '12'))
        .expect(mesSelect.value).eql('12');
    // introducir el año
    await t
            .typeText(Selector('input[name="P18_ANNO"]'), '2025')
            .click(BT_CONNOM);
    
    // comprobamos que ofrece las filas deseadas por el importe total
    const totalGenInput = Selector('#P18_T_GEN');
    await t.expect(totalGenInput.innerText).eql('5470.25', `No se muestran los datos correctos`);

    // pulsamos en el filtro para que seleccione una fila ORGA33 y total 1300
    const FiltroSelect = Selector('#P18_FILTRO');

    await t
        .click(FiltroSelect)
        .click(FiltroSelect.find('option').withAttribute('value', 'ORGA33'))
        .expect(FiltroSelect.value).eql('ORGA33')
        .click(BT_CONNOM);
    
    // comprobamos que ofrece las filas deseadas por el importe total
    await t.expect(totalGenInput.innerText).eql('1300', `No se muestran los datos correctos`);
    // como testcafé no puede interactuar con SO, solo se comprueba que el botón se clica
    // visualmente ya se aprecia que se pide la descarga, testeamos hasta su clic
    const botonPDF = Selector('#B19026326418799653');
    await t
        .expect(botonPDF.exists).ok('El botón PDF no existe')
        .expect(botonPDF.visible).ok('El botón PDF no está visible')
        .expect(botonPDF.hasAttribute('disabled')).notOk('El botón PDF está deshabilitado')
        .click(botonPDF);
    
        
});
