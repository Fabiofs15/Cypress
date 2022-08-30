///  <reference types="cypress"/>
import locators from '../support/locators';
import '../support/commandsContas';

describe('Teste funcional', () => {
  before(()=>{
    cy.logar('emaildosguri@gmail.com', 'teste123');
    cy.resetApp();
  });

  beforeEach(()=>{
    cy.get(locators.MENU.HOME).click();
    cy.resetApp();
    cy.wait(1000);
  })
  
  it('Deve inserir uma conta', () => {
    cy.acessarMenu();
    cy.inserirConta('Conta de teste');
    cy.get(locators.MESSAGE).should('contain', 'Conta inserida com sucesso!');
  });
  
  it('Deve alterar uma conta', ()=>{
    cy.acessarMenu();
    cy.xpath(locators.CONTAS.FN_XP_BTN_ALTERAR('Conta para alterar')).click();
    cy.get(locators.CONTAS.NOME).clear().type('Conta alterada');
    cy.get(locators.CONTAS.BTN_SALVAR).click();
    cy.get(locators.MESSAGE).should('contain', 'Conta atualizada com sucesso!');

  })

  it('Não deve criar uma conta repetida', () =>{
    cy.acessarMenu();
    cy.get(locators.CONTAS.NOME).clear().type('Conta mesmo nome');
    cy.get(locators.CONTAS.BTN_SALVAR).click();
    cy.get(locators.MESSAGE).should('contain', 'code 400');
  });

  it('Deve inserir uma movimentação', ()=>{
    cy.get(locators.MENU.MOVIMENTACAO).click()
    cy.get(locators.MOVIMENTACAO.DESCRICAO).type('Desc');
    cy.get(locators.MOVIMENTACAO.VALOR).type('123');
    cy.get(locators.MOVIMENTACAO.INTERESSADO).type('Inter');
    cy.get(locators.MOVIMENTACAO.CONTA).select('Conta para movimentacoes');
    cy.get(locators.MOVIMENTACAO.STATUS).click();
    cy.get(locators.MOVIMENTACAO.BTN_SALVAR).click();
    cy.get(locators.MESSAGE).should('contain', 'Movimentação inserida com sucesso!');

    cy.get(locators.EXTRATO.LINHAS).should('have.length', 7);
    cy.xpath(locators.EXTRATO.FN_XP_BUSCA_ELEMENTO('Desc', '123')).should('exist');
  });

  it('Deve pegar o saldo', ()=>{
    cy.get(locators.MENU.HOME).click();
    cy.xpath(locators.SALDO.FN_XP_SALDO_CONTA('Conta para saldo')).should('contain', '534,00');

    cy.get(locators.MENU.EXTRATO).click();
    cy.xpath(locators.EXTRATO.FN_XP_ALTERAR_ELEMENTO('Movimentacao 1, calculo saldo')).click();
    cy.get(locators.MOVIMENTACAO.DESCRICAO).should('have.value', 'Movimentacao 1, calculo saldo')
    cy.get(locators.MOVIMENTACAO.STATUS).click();
    cy.get(locators.MOVIMENTACAO.BTN_SALVAR).click();
    cy.get(locators.MESSAGE).should('contain', 'sucesso');
    cy.wait(1000);

    cy.get(locators.MENU.HOME).click();
    cy.xpath(locators.SALDO.FN_XP_SALDO_CONTA('Conta para saldo')).should('contain', '4.034,00');
  });

  it('Deve remover uma movimentação', ()=>{
    cy.get(locators.MENU.EXTRATO).click();
    cy.xpath(locators.EXTRATO.FN_XP_REMOVER_ELEMENTO('Movimentacao para exclusao')).click();
    cy.get(locators.MESSAGE).should('contain', 'Movimentação removida com sucesso!')
  })
})