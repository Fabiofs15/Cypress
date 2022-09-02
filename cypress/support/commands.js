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
});

Cypress.Commands.add('getToken', (user, passwd)=>{
  cy.request({
      method: 'POST',
      url: '/signin',
      body: {
        email: user,
        redirecionar: false,
        senha: passwd 
      }
    }).its('body.token').should('not.be.empty').then(token =>{
      Cypress.env('token', token)
      return token
    })
});

Cypress.Commands.add('resetRest', ()=>{
cy.getToken('emaildosguri@gmail.com', 'teste123').then(token=>{
  cy.request({
    method: 'GET',
    url: '/reset',
    headers: {Authorization: `JWT ${token}`}
  }).its('status').should('be.equal', 200);
})
});
Cypress.Commands.add('getContaByName', nome =>{
cy.getToken('emaildosguri@gmail.com', 'teste123').then(token=>{
  cy.request({
    url: '/contas',
    method: 'GET',
    headers: {Authorization: `JWT ${token}`},
    qs: {
      nome: nome
    }
  }).then( res => {
    return res.body[0].id
  })
});
});

Cypress.Commands.overwrite('request', (originalFn, ...options) =>{
if(options.length === 1){
  if(Cypress.env('token')){
    options[0].headers = {
      Authorization: `JWT ${Cypress.env('token')}`
    }
  }
}

return originalFn(...options)
})