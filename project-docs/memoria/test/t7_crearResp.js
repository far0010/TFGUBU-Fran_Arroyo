import { Selector} from 'testcafe';
import {BUTTON, USERNAME, PASSW, TOGICON, SUBMEN, RESPONMENU,RESPONHEAD, FILASANTES, FILASDESPUES, SELECDEPTO, FISICA, CONFILASTABLA} from './constanst.js';

fixture`Test Suite`.page("http://localhost:8080/apex/f?p=100:LOGIN_DESKTOP:12651011480748:::::");

test('Crear nuevo responsable', async t => {
    
    await t.navigateTo('http://192.168.2.61:8080/ords/f?p=100:1:34126906504519:::::');

// Espera a que los campos estén disponibles
    await t.expect(USERNAME.exists).ok({ timeout: 5000 });
    await t.expect(PASSW.exists).ok({ timeout: 5000 });

    // Interacción con los elementos
    await t
        .typeText(USERNAME, 'user01')
        .typeText(PASSW, 'user01')
       
    await BUTTON();;

    // Hacer clic en el menú y verificar si se ha expandido
    await t
        .click(TOGICON)  // Hace clic en el ícono de despliegue
        .expect(SUBMEN.visible).ok({ timeout: 5000 }); // Verifica que el submenú esté visible

    // click en responsable
    await t.expect(RESPONMENU.exists).ok({ timeout: 5000 });

    // Hace clic en el enlace "Responsables"
     await t.click(RESPONMENU);

     await t.expect(RESPONHEAD.exists).ok({ timeout: 5000 });

    const filasAntes = await FILASANTES();
    console.log('Filas antes:', filasAntes);
    // Espera a que cargue la tabla o el botón
    await t.click(Selector('span.t-Button-label').withText('Create').parent('button'));

    // Continúa con el test

    await t
        .click(Selector('button').withText('Create'))
        .typeText(Selector('input[name="P5_DNI"]'), '00000005E')
        .typeText(Selector('input[name="P5_APE1"]'), 'Pérez')
        .typeText(Selector('input[name="P5_APE2"]'), 'López')
        .typeText(Selector('input[name="P5_NOMBRE"]'), 'Juan')
        .click(SELECDEPTO)
        .click(FISICA)
        .click(Selector('span.t-Button-label').withText('Create').parent('button'));

    await t.expect(CONFILASTABLA.count).eql(filasAntes + 1, {timeout: 5000});
   // Esperamos a que aparezca la nueva fila (posición siguiente)
    const nuevaFila = CONFILASTABLA.nth(filasAntes);
    await t.expect(nuevaFila.exists).ok({ timeout: 5000 });

    const filasDespues = await FILASDESPUES();
    console.log('Filas después:', await FILASDESPUES());
    await t.expect(CONFILASTABLA.count).eql(filasAntes + 1, 'Debe haber una fila más en la tabla');

   
    
});
