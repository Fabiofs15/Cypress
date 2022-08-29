import locators from '../support/locators'

Cypress.Commands.add('logar', (email, senha)=>{
    cy.visit('http://barrigareact.wcaquino.me');
    cy.get(locators.LOGIN.USER).type(email);
    cy.get(locators.LOGIN.PASSWORD).type(senha);
    cy.get(locators.LOGIN.BTN_LOGIN).click();
})

Cypress.Commands.add('resetApp', ()=>{
  cy.get(locators.MENU.SETTINGS).click();
  cy.get(locators.MENU.RESET).click();
})