import type { FastifyPluginAsync } from 'fastify'

import { postSignupUser } from '#src/services/users/signup/post.js'
import { getConfirmEmail } from '#src/services/users/confirm-email/get.js'
import { postSigninUser } from '#src/services/users/signin/post.js'
import { postSignoutUser } from '#src/services/users/signout/post.js'
import { deleteSignoutUser } from '#src/services/users/signout/delete.js'
import { postRefreshTokenUser } from '#src/services/users/refresh-token/post.js'
import { putResetPasswordUser } from '#src/services/users/reset-password/put.js'
import { postResetPasswordUser } from '#src/services/users/reset-password/post.js'
import { getCurrentUser } from '#src/services/users/current/get.js'
import { putCurrentUser } from '#src/services/users/current/put.js'
import { putCurrentUserSettings } from '#src/services/users/current/settings/put.js'
import { getUserById } from '#src/services/users/[userId]/get.js'
import { getGamesByUserId } from '#src/services/users/[userId]/games/get.js'

export const usersService: FastifyPluginAsync = async (fastify) => {
  await fastify.register(postSignupUser)
  await fastify.register(getConfirmEmail)
  await fastify.register(postSigninUser)
  await fastify.register(postSignoutUser)
  await fastify.register(deleteSignoutUser)
  await fastify.register(postRefreshTokenUser)
  await fastify.register(putResetPasswordUser)
  await fastify.register(postResetPasswordUser)
  await fastify.register(getCurrentUser)
  await fastify.register(putCurrentUser)
  await fastify.register(putCurrentUserSettings)
  await fastify.register(getUserById)
  await fastify.register(getGamesByUserId)
}
