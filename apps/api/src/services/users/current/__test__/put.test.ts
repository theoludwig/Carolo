import tap from 'tap'
import sinon from 'sinon'

import { application } from '#src/application.js'
import prisma from '#src/tools/database/prisma.js'
import { authenticateUserTest } from '#src/__test__/utils/authenticateUserTest.js'

await tap.test('PUT /users/current', async (t) => {
  t.afterEach(() => {
    sinon.restore()
  })

  await t.test('succeeds with valid accessToken and valid name', async (t) => {
    const newName = 'John DOE'
    const { accessToken, user, userStubValue } = await authenticateUserTest()
    sinon.stub(prisma, 'user').value({
      ...userStubValue,
      findFirst: async () => {
        return null
      },
      update: async () => {
        return {
          ...user,
          name: newName
        }
      }
    })
    const response = await application.inject({
      method: 'PUT',
      url: '/users/current',
      headers: {
        authorization: `Bearer ${accessToken}`
      },
      payload: {
        name: newName
      }
    })
    const responseJson = response.json()
    t.equal(response.statusCode, 200)
    t.equal(responseJson.user.name, newName)
  })

  await t.test('fails with name already used', async (t) => {
    const newName = 'John DOE'
    const { accessToken, user, userStubValue } = await authenticateUserTest()
    sinon.stub(prisma, 'user').value({
      ...userStubValue,
      findFirst: async () => {
        return user
      }
    })
    const response = await application.inject({
      method: 'PUT',
      url: '/users/current',
      headers: {
        authorization: `Bearer ${accessToken}`
      },
      payload: {
        name: newName
      }
    })
    t.equal(response.statusCode, 400)
  })
})
