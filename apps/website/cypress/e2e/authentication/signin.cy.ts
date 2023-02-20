import { userExample } from '@carolo/models'

import { authenticationHandlers } from '@/cypress/fixtures/handler'
import {
  postUsersSigninHandler,
  postUsersSigninInvalidCredentialsHandler
} from '@/cypress/fixtures/users/signin/post'

describe('/authentication/signin', () => {
  beforeEach(() => {
    cy.task('stopMockServer')
    cy.visit('/authentication/signin')
  })

  it('should succeeds and sign in the user', () => {
    cy.task('startMockServer', [
      ...authenticationHandlers,
      postUsersSigninHandler
    ])
    cy.get('#error-email').should('not.exist')
    cy.get('#error-password').should('not.exist')
    cy.get('[data-cy=input-email]').type(userExample.email)
    cy.get('[data-cy=input-password]').type('randompassword')
    cy.get('button[type=submit]').click()
    cy.location('pathname').should('eq', '/')
  })

  it('should fails with unreachable api server', () => {
    cy.get('#error-email').should('not.exist')
    cy.get('#error-password').should('not.exist')
    cy.get('[data-cy=input-email]').type(userExample.email)
    cy.get('[data-cy=input-password]').type('randompassword')
    cy.get('button[type=submit]').click()
    cy.get('#message').should('contain.text', 'Erreur')
    cy.get('#error-email').should('not.exist')
    cy.get('#error-password').should('not.exist')
  })

  it('should fails with invalid credentials', () => {
    cy.task('startMockServer', [
      ...authenticationHandlers,
      postUsersSigninInvalidCredentialsHandler
    ])
    cy.get('#error-email').should('not.exist')
    cy.get('#error-password').should('not.exist')
    cy.get('[data-cy=input-email]').type(userExample.email)
    cy.get('[data-cy=input-password]').type('randompassword')
    cy.get('button[type=submit]').click()
    cy.get('#message').should('contain.text', 'Erreur')
    cy.get('#error-email').should('not.exist')
    cy.get('#error-password').should('not.exist')
  })
})

export {}
