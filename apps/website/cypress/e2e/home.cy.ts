describe('Page /', () => {
  beforeEach(() => {
    return cy.visit('/')
  })

  it('Home Title', () => {
    cy.get('h1').should('have.text', 'Carolo.org')
  })
})

export {}
