import { userExample } from '@carolo/models'

import {
  postUsersSignupHandler,
  postUsersSignupAlreadyUsedHandler
} from '@/cypress/fixtures/users/signup/post'

describe('/authentication/signup', () => {
  beforeEach(() => {
    cy.task('stopMockServer')
    cy.visit('/authentication/signup')
  })

  it('should succeeds and sign up the user', () => {
    cy.task('startMockServer', [postUsersSignupHandler])
    cy.get('#error-name').should('not.exist')
    cy.get('#error-email').should('not.exist')
    cy.get('#error-password').should('not.exist')
    cy.get('[data-cy=input-name]').type(userExample.name)
    cy.get('[data-cy=input-email]').type(userExample.email)
    cy.get('[data-cy=input-password]').type('randompassword')
    cy.get('button[type=submit]').click()
    cy.get('#message').should('contain.text', 'Succès')
  })

  it('should fails with name or email already used', () => {
    cy.task('startMockServer', [postUsersSignupAlreadyUsedHandler])
    cy.get('#error-name').should('not.exist')
    cy.get('#error-email').should('not.exist')
    cy.get('#error-password').should('not.exist')
    cy.get('[data-cy=input-name]').type(userExample.name)
    cy.get('[data-cy=input-email]').type(userExample.email)
    cy.get('[data-cy=input-password]').type('randompassword')
    cy.get('button[type=submit]').click()
    cy.get('#message').should('contain.text', 'déjà utilisé')
    cy.get('#error-name').should('not.exist')
    cy.get('#error-email').should('not.exist')
    cy.get('#error-password').should('not.exist')
  })

  it('should fails with unreachable api server', () => {
    cy.get('#error-name').should('not.exist')
    cy.get('#error-email').should('not.exist')
    cy.get('#error-password').should('not.exist')
    cy.get('[data-cy=input-name]').type(userExample.name)
    cy.get('[data-cy=input-email]').type(userExample.email)
    cy.get('[data-cy=input-password]').type('randompassword')
    cy.get('button[type=submit]').click()
    cy.get('#message').should('contain.text', 'Erreur')
    cy.get('#error-name').should('not.exist')
    cy.get('#error-email').should('not.exist')
    cy.get('#error-password').should('not.exist')
  })

  it('should fails with all inputs as required with error messages', () => {
    cy.get('#error-name').should('not.exist')
    cy.get('#error-email').should('not.exist')
    cy.get('#error-password').should('not.exist')
    cy.get('button[type=submit]').click()
    cy.get('#error-name').should('contain.text', 'Erreur')
    cy.get('#error-email').should('contain.text', 'Erreur')
    cy.get('#error-password').should('contain.text', 'Erreur')
  })

  it('should fails with wrong email format', () => {
    cy.get('#error-email').should('not.exist')
    cy.get('[data-cy=input-email]').type('test')
    cy.get('button[type=submit]').click()
    cy.get('#error-email').should('contain.text', 'Erreur')
  })
})

export {}
