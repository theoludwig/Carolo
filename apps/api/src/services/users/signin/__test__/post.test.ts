import test from "node:test"
import assert from "node:assert/strict"

import sinon from "sinon"
import bcrypt from "bcryptjs"
import { userExample, refreshTokenExample } from "@carolo/models"

import { application } from "#src/application.js"
import prisma from "#src/tools/database/prisma.js"
import { expiresIn } from "#src/tools/utils/jwtToken.js"

const payload = {
  email: userExample.email,
  password: userExample.password,
}

await test("POST /users/signin", async (t) => {
  t.afterEach(() => {
    sinon.restore()
  })

  await t.test("succeeds", async () => {
    sinon.stub(prisma, "user").value({
      findUnique: async () => {
        return {
          ...userExample,
          password: await bcrypt.hash(payload.password, 12),
        }
      },
    })
    sinon.stub(prisma, "refreshToken").value({
      create: async () => {
        return refreshTokenExample
      },
    })
    const response = await application.inject({
      method: "POST",
      url: "/users/signin",
      payload,
    })
    const responseJson = response.json()
    assert.strictEqual(response.statusCode, 200)
    assert.strictEqual(responseJson.type, "Bearer")
    assert.strictEqual(responseJson.expiresIn, expiresIn)
  })

  await t.test("fails with invalid user", async () => {
    sinon.stub(prisma, "user").value({
      findUnique: () => {
        return null
      },
    })
    const response = await application.inject({
      method: "POST",
      url: "/users/signin",
      payload,
    })
    assert.strictEqual(response.statusCode, 400)
  })

  await t.test("fails with invalid email", async () => {
    sinon.stub(prisma, "user").value({
      findUnique: () => {
        return null
      },
    })
    const response = await application.inject({
      method: "POST",
      url: "/users/signin",
      payload: {
        ...payload,
        email: "incorrect-email",
      },
    })
    assert.strictEqual(response.statusCode, 400)
  })

  await t.test("fails with incorrect password", async () => {
    sinon.stub(prisma, "user").value({
      findUnique: async () => {
        return userExample
      },
    })
    const response = await application.inject({
      method: "POST",
      url: "/users/signin",
      payload: {
        ...payload,
        password: "incorrect-password",
      },
    })
    assert.strictEqual(response.statusCode, 400)
  })
})
