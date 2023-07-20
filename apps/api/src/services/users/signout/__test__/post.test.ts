import test from 'node:test'
import assert from 'node:assert/strict'

import sinon from 'sinon'
import jwt from 'jsonwebtoken'
import { refreshTokenExample } from '@carolo/models'
import type { UserRefreshJWT } from '@carolo/models'

import { application } from '#src/application.js'
import prisma from '#src/tools/database/prisma.js'

await test('POST /users/signout', async (t) => {
  t.afterEach(() => {
    sinon.restore()
  })

  await t.test('succeeds', async () => {
    sinon.stub(prisma, 'refreshToken').value({
      findFirst: async () => {
        return refreshTokenExample
      },
      delete: async () => {}
    })
    sinon.stub(jwt, 'verify').value(() => {
      const value: UserRefreshJWT = {
        id: 1,
        tokenUUID: refreshTokenExample.token,
        currentStrategy: 'Local'
      }
      return value
    })
    const response = await application.inject({
      method: 'POST',
      url: '/users/signout',
      payload: { refreshToken: 'jwt token' }
    })
    assert.strictEqual(response.statusCode, 200)
  })

  await t.test('fails with invalid refreshToken', async () => {
    sinon.stub(prisma, 'refreshToken').value({
      findFirst: async () => {
        return null
      }
    })
    const response = await application.inject({
      method: 'POST',
      url: '/users/signout',
      payload: { refreshToken: 'somerandomtoken' }
    })
    assert.strictEqual(response.statusCode, 404)
  })
})
