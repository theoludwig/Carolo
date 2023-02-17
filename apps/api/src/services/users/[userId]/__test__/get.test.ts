import tap from 'tap'
import sinon from 'sinon'
import { userExample, userSettingsExample } from '@carolo/models'

import { application } from '#src/application.js'
import prisma from '#src/tools/database/prisma.js'

await tap.test('GET /users/[userId]', async (t) => {
  t.afterEach(() => {
    sinon.restore()
  })

  await t.test('succeeds', async (t) => {
    sinon.stub(prisma, 'user').value({
      findUnique: async () => {
        return userExample
      }
    })
    sinon.stub(prisma, 'userSetting').value({
      findFirst: async () => {
        return userSettingsExample
      }
    })
    const response = await application.inject({
      method: 'GET',
      url: `/users/${userExample.id}`
    })
    const responseJson = response.json()
    t.equal(response.statusCode, 200)
    t.equal(responseJson.user.id, userExample.id)
    t.equal(responseJson.user.name, userExample.name)
  })

  await t.test('fails with not found user', async (t) => {
    sinon.stub(prisma, 'userSetting').value({
      findFirst: async () => {
        return null
      }
    })
    const response = await application.inject({
      method: 'GET',
      url: `/users/1`
    })
    const responseJson = response.json()
    t.equal(response.statusCode, 404)
    t.equal(responseJson.message, 'User not found')
  })
})
