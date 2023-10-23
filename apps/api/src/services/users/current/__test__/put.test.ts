import test from "node:test"
import assert from "node:assert/strict"

import sinon from "sinon"
import { PrismaClient } from "@prisma/client"

import { application } from "#src/application.js"
import prisma from "#src/tools/database/prisma.js"
import { authenticateUserTest } from "#src/__test__/utils/authenticateUserTest.js"

await test("PUT /users/current", async (t) => {
  t.afterEach(() => {
    sinon.restore()
  })

  await t.test("succeeds with valid accessToken and valid name", async () => {
    const newName = "John DOE"
    const { accessToken, user, userStubValue, userSettingStubValue } =
      await authenticateUserTest()
    sinon.stub(prisma, "$transaction").callsFake(async (callback) => {
      const prismaTransaction = new PrismaClient()
      sinon.stub(prismaTransaction, "user").value({
        ...userStubValue,
        findFirst: async () => {
          return null
        },
        update: async () => {
          return {
            ...user,
            name: newName,
          }
        },
      })
      sinon.stub(prismaTransaction, "userSetting").value(userSettingStubValue)
      return await callback(prismaTransaction)
    })
    const response = await application.inject({
      method: "PUT",
      url: "/users/current",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: {
        name: newName,
      },
    })
    const responseJson = response.json()
    assert.strictEqual(response.statusCode, 200)
    assert.strictEqual(responseJson.user.name, newName)
  })

  await t.test("fails with name already used", async () => {
    const newName = "John DOE"
    const { accessToken, user, userStubValue } = await authenticateUserTest()
    sinon.stub(prisma, "$transaction").callsFake(async (callback) => {
      const prismaTransaction = new PrismaClient()
      sinon.stub(prismaTransaction, "user").value({
        ...userStubValue,
        findFirst: async () => {
          return user
        },
      })
      return await callback(prismaTransaction)
    })
    const response = await application.inject({
      method: "PUT",
      url: "/users/current",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: {
        name: newName,
      },
    })
    assert.strictEqual(response.statusCode, 400)
  })
})
