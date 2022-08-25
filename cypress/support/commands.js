Cypress.Commands.add('registrar', ()=>{
    cy.get(':nth-child(2) > .nav-link').click();
    cy.get('.jumbotron > :nth-child(1) > .form-control')
      .type('Teste---Udemy');
    cy.get('.input-group > .form-control')
      .type('emaildosguri@gmail.com');
    cy.get(':nth-child(3) > .form-control')
      .type('teste123');
    cy.get('.btn').click();
})

Cypress.Commands.add('logar', ()=>{
    cy.get('[data-test="email"]').type('emaildosguri@gmail.com');
    cy.get('[data-test="passwd"]').type('teste123');
    cy.get('.btn').click();
})