/// <reference types="cypress"/>
const dayjs = require('dayjs')
describe('Deve testar a aplicação a nivel de API', () => {
  //let token;
  before(()=>{
    cy.getToken('emaildosguri@gmail.com', 'teste123')
  });
  beforeEach(()=>{
    cy.resetRest();
  })
  it('Deve criar uma conta', () => {
      cy.request({
        method: 'POST',
        url: '/contas',
        body: {
          nome: "Conta API rest",
        }
      }).as('response')
      
      cy.get('@response').then(res =>{
        expect(res.status).to.be.eql(201);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('nome', 'Conta API rest');
      });
    });

    it('Deve alterar uma conta', ()=>{
      cy.getContaByName('Conta para movimentacoes').then(contaID =>{
        cy.request({
          url: `/contas/${contaID}`,
          method: 'PUT',
          body: {nome: 'Conta alterada via rest'}
        }).as('response');
      });
      cy.get('@response').its('status').should('be.equal', 200);
    });

    it('Não deve criar uma conta repetida', ()=>{
      cy.request({
        method: 'POST',
        url: '/contas',
        body: {
          nome: "Conta mesmo nome",
        },
        failOnStatusCode: false
      }).as('response')
      
      cy.get('@response').then(res =>{
        expect(res.status).to.be.eql(400);
        expect(res.body).to.have.property('error', 'Já existe uma conta com esse nome!');
      });
    });

    it('Deve criar uma transação', ()=>{
      cy.getContaByName('Conta para movimentacoes').then(contaID => {
        cy.request({
          method: 'POST',
          url: '/transacoes',
          body: {
            conta_id: contaID,
            data_pagamento: dayjs().add(1, 'day').format('DD/MM/YYYY'),
            data_transacao: dayjs().format('DD/MM/YYYY'),
            descricao: "Conta a pagar",
            envolvido: "Nubank",
            status: true,
            tipo: "REC",
            valor: "500",
          }
        }).as('response');
      });
      cy.get('@response').its('status').should('be.equal', 201);
      cy.get('@response').its('body.id').should('exist');
    });

    it('Deve pegar o saldo', ()=>{
      cy.request({
        url: '/saldo',
        method: 'GET',
      }).then(res =>{
        let saldoConta = null;
        res.body.forEach(c =>{
          if(c.conta === 'Conta para saldo') saldoConta = c.saldo
        })
        expect(saldoConta).to.be.eql('534.00');
      })

      cy.request({
        method: 'GET',
        url: '/transacoes',
        qs: {descricao: 'Movimentacao 1, calculo saldo'}
      }).then(res =>{
        cy.request({
          url: `/transacoes/${res.body[0].id}`,
          method: 'PUT',

          body: {
            status: true,
            data_transacao: dayjs(res.body[0].data_transacao).format('DD/MM/YYYY'),
            data_pagamento: dayjs(res.body[0].data_pagamento).format('DD/MM/YYYY'),
            descricao: res.body[0].descricao,
            envolvido: res.body[0].envolvido,
            valor: res.body[0].valor,
            conta_id: res.body[0].conta_id
          }
        }).its('status').should('be.equal', 200)
      });

      cy.request({
        url: '/saldo',
        method: 'GET',
      }).then(res =>{
        let saldoConta = null;
        res.body.forEach(c =>{
          if(c.conta === 'Conta para saldo') saldoConta = c.saldo
        })
        expect(saldoConta).to.be.eql('4034.00');
      })
    });

    it('Deve remover uma movimentação', ()=>{
      cy.request({
        method: 'GET',
        url: '/transacoes',
        qs: {descricao: 'Movimentacao para exclusao'}
      }).then(res=>{
        cy.request({
          url: `/transacoes/${res.body[0].id}`,
          method: 'DELETE',
        }).its('status').should('be.equal', 204)
      })
    })
});
