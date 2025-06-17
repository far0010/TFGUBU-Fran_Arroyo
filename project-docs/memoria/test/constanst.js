import { Selector, ClientFunction, Role } from 'testcafe';

export const BUTTON = ClientFunction(() => {
    document.querySelector('button').click();
});

export const LOGINUSER = Role('http://192.168.2.61:8080/ords/f?p=100:101:1167215640460:::::', async t => {
    await t
        .typeText(USERNAME, 'user01')
        .typeText(PASSW, 'user01');
    await BUTTON();
    await t.expect(TOGICON.exists).ok({ timeout: 5000 });
}, {preserveUrl: true });

export const USERNAME = Selector('input').withAttribute('name', 'P101_USERNAME');
export const PASSW= Selector('input').withAttribute('name', 'P101_PASSWORD');
export const LOGBUT = Selector('.region-buttons').find('button').withText('LOGIN');
export const TITPAGPAL = Selector('h2.t-Region-title').withText('PÁGINA PRINCIPAL');
export const MENSAJEERROR = Selector('.t-Alert-body');
export const ADMINMENU = Selector('.a-TreeView-label').withText('Administración');
export const TOGICON = Selector('.a-TreeView-toggle').nth(0); // Primer ícono de expansión
export const SUBMEN = Selector('#t_TreeNav_1_subtree');
export const ADMINMENUS = Selector('#admin-menu');
export const SUBMENSEL = Selector('.submenu');
export const RESPONMENU = Selector('.a-TreeView-label').withText('Responsable');
export const RESPONHEAD = Selector('h1.t-Breadcrumb-label').withText('Responsables');
export const PROYECTMENU = Selector('.a-TreeView-label').withText('Proyectos');
export const PROYECTHEAD = Selector('h1.t-Breadcrumb-label').withText('Proyectos');
export const SOLICITANTEMENU = Selector('.a-TreeView-label').withText('Solicitante');
export const SOLICITHEAD = Selector('h1.t-Breadcrumb-label').withText('Solicitante');
export const TABLARESP = Selector('table') // Ajusta según el selector real de la tabla

export const CONFILASTABLA = Selector('table.a-IRR-table tbody tr').filter((node) => {
    return node.querySelectorAll('td').length > 0;
});
export const FILASANTES = async () => {
    return await CONFILASTABLA.count;
};

export const FILASDESPUES = async () => {
    return await CONFILASTABLA.count;
};

export const SELECDEPTO = Selector('#P5_DEPTO');
export const FISICA = SELECDEPTO.find('option').withText('FISICA');