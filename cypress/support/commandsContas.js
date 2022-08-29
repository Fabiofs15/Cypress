import locators from './locators';

Cypress.Commands.add('acessarMenu', ()=>{
    cy.get(locators.MENU.SETTINGS).click();
    cy.get(locators.MENU.CONTAS).click();
})

Cypress.Commands.add('inserirConta', (title)=>{
    cy.get(locators.CONTAS.NOME).type(title);
    cy.get(locators.CONTAS.BTN_SALVAR).click();
})
    