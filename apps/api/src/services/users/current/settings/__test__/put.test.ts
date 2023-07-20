import test from 'node:test'
import assert from 'node:assert/strict'

import sinon from 'sinon'
import { userSettingsExample } from '@carolo/models'

import { application } from '#src/application.js'
import { authenticateUserTest } from '#src/__test__/utils/authenticateUserTest.js'
import prisma from '#src/tools/database/prisma.js'

await test('PUT /users/current/settings', async (t) => {
  t.afterEach(() => {
    sinon.restore()
  })

  await t.test('succeeds and edit the locale', async () => {
    const newSettings = {
      locale: 'fr-FR'
    }
    const { accessToken, userSettingStubValue } = await authenticateUserTest()
    sinon.stub(prisma, 'userSetting').value({
      ...userSettingStubValue,
      findFirst: async () => {
        return userSettingsExample
      },
      update: async () => {
        return {
          ...userSettingsExample,
          ...newSettings
        }
      }
    })
    const response = await application.inject({
      method: 'PUT',
      url: '/users/current/settings',
      headers: {
        authorization: `Bearer ${accessToken}`
      },
      payload: newSettings
    })
    const responseJson = response.json()
    assert.strictEqual(response.statusCode, 200)
    assert.strictEqual(responseJson.settings.locale, newSettings.locale)
  })

  await t.test('fails with invalid locale', async () => {
    const newSettings = {
      locale: 'somerandomlocale'
    }
    const { accessToken, userSettingStubValue } = await authenticateUserTest()
    sinon.stub(prisma, 'userSetting').value({
      ...userSettingStubValue,
      findFirst: async () => {
        return userSettingsExample
      },
      update: async () => {
        return {
          ...userSettingsExample,
          ...newSettings
        }
      }
    })
    const response = await application.inject({
      method: 'PUT',
      url: '/users/current/settings',
      headers: {
        authorization: `Bearer ${accessToken}`
      },
      payload: newSettings
    })
    assert.strictEqual(response.statusCode, 400)
  })
})
