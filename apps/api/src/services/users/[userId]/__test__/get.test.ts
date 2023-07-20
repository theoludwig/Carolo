import test from 'node:test'
import assert from 'node:assert/strict'

import sinon from 'sinon'
import { userExample, userSettingsExample } from '@carolo/models'

import { application } from '#src/application.js'
import prisma from '#src/tools/database/prisma.js'

await test('GET /users/[userId]', async (t) => {
  t.afterEach(() => {
    sinon.restore()
  })

  await t.test('succeeds', async () => {
    sinon.stub(prisma, 'user').value({
      findUnique: async () => {
        return {
          ...userExample,
          createdAt: new Date(userExample.createdAt),
          updatedAt: new Date(userExample.updatedAt)
        }
      }
    })
    sinon.stub(prisma, 'userSetting').value({
      findFirst: async () => {
        return {
          ...userSettingsExample,
          createdAt: new Date(userSettingsExample.createdAt),
          updatedAt: new Date(userSettingsExample.updatedAt)
        }
      }
    })
    sinon.stub(prisma, 'game').value({
      count: async () => {
        return 0
      }
    })
    const response = await application.inject({
      method: 'GET',
      url: `/users/${userExample.id}`
    })
    const responseJson = response.json()
    assert.strictEqual(response.statusCode, 200)
    assert.strictEqual(responseJson.user.id, userExample.id)
    assert.strictEqual(responseJson.user.name, userExample.name)
  })

  await t.test('fails with not found user', async () => {
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
    assert.strictEqual(response.statusCode, 404)
    assert.strictEqual(responseJson.message, 'User not found.')
  })
})
