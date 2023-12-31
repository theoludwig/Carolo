import crypto from "node:crypto"

import axios from "axios"
import bcrypt from "bcryptjs"
import type { FastifyPluginAsync, FastifySchema } from "fastify"
import type { AuthenticationStrategy, Services } from "@carolo/models"
import { fastifyErrors, servicesSchema } from "@carolo/models"

import prisma from "#src/tools/database/prisma.js"
import { sendEmail } from "#src/tools/email/sendEmail.js"
import { API_URL, GRAVATAR_URL } from "#src/tools/configurations.js"

const postSignupSchema: FastifySchema = {
  description:
    "Allows a new user to signup, if successful the user will need to confirm the email.",
  tags: ["users"] as string[],
  body: servicesSchema["/users/signup"].post.body,
  querystring: servicesSchema["/users/signup"].post.querystring,
  response: {
    201: servicesSchema["/users/signup"].post.response,
    400: fastifyErrors[400],
    429: fastifyErrors[429],
    500: fastifyErrors[500],
  },
} as const

export const postSignupUser: FastifyPluginAsync = async (fastify) => {
  fastify.route<{
    Body: Services["/users/signup"]["post"]["body"]
    Querystring: Services["/users/signup"]["post"]["querystring"]
    Reply: Services["/users/signup"]["post"]["response"]
  }>({
    method: "POST",
    url: "/users/signup",
    schema: postSignupSchema,
    handler: async (request, reply) => {
      return await prisma.$transaction(async (prisma) => {
        const { name, email, password, locale } = request.body
        const { redirectURI } = request.query
        const userValidation = await prisma.user.findFirst({
          where: {
            OR: [{ email }, { name }],
          },
        })
        if (userValidation != null) {
          throw fastify.httpErrors.badRequest(
            "body.email or body.name already taken.",
          )
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const temporaryToken = crypto.randomUUID()

        let logo: string | null = null
        const emailGravatarHash = crypto
          .createHash("md5")
          .update(email)
          .digest("hex")
        const emailGravatarURL = new URL(emailGravatarHash, GRAVATAR_URL)
        emailGravatarURL.searchParams.set("s", "256")
        emailGravatarURL.searchParams.set("d", "404")
        try {
          await axios.get(emailGravatarURL.toString())
          emailGravatarURL.searchParams.set("d", "mp")
          logo = emailGravatarURL.toString()
        } catch {}

        const user = await prisma.user.create({
          data: {
            name,
            email,
            logo,
            password: hashedPassword,
            temporaryToken,
          },
        })
        const userSettings = await prisma.userSetting.create({
          data: {
            userId: user.id,
            locale,
          },
        })
        const url = new URL("/users/confirm-email", API_URL)
        url.searchParams.set("temporaryToken", temporaryToken)
        if (redirectURI != null) {
          url.searchParams.set("redirectURI", redirectURI)
        }
        await sendEmail({
          type: "confirm-email",
          email,
          url: url.toString(),
          locale,
        })
        reply.statusCode = 201
        return {
          user: {
            ...user,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
            currentStrategy: "Local" as AuthenticationStrategy,
            strategies: ["Local"] as AuthenticationStrategy[],
            settings: {
              ...userSettings,
              locale,
              createdAt: userSettings.createdAt.toISOString(),
              updatedAt: userSettings.updatedAt.toISOString(),
            },
          },
        }
      })
    },
  })
}
