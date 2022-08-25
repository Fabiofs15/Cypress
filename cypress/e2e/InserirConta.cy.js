///  <reference types="cypress"/>

describe('Inserir uma conta', () => {
  before(()=>{
    cy.visit('http://barrigareact.wcaquino.me');
    //cy.registrar(); --> Utilizado para registrar um usuario
    cy.logar();
  })
  it('Inserindo conta', () => {
    cy.get('[data-test="menu-settings"]').click();
    cy.get('[href="/contas"]').click();
    cy.get('[data-test="nome"]').type('Conta de luz')
    cy.get('.btn').click()

    cy.get('.toast-success > .toast-message').should('exist').contains('Conta inserida com sucesso!')
  })
})