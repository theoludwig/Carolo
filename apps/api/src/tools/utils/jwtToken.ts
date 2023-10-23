import crypto from "node:crypto"

import jwt from "jsonwebtoken"
import ms from "ms"
import type { UserJWT } from "@carolo/models"

import prisma from "#src/tools/database/prisma.js"
import {
  JWT_ACCESS_EXPIRES_IN,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
} from "#src/tools/configurations.js"

export const expiresIn = ms(JWT_ACCESS_EXPIRES_IN)

export const generateAccessToken = (user: UserJWT): string => {
  return jwt.sign(user, JWT_ACCESS_SECRET, { expiresIn })
}

export const generateRefreshToken = async (user: UserJWT): Promise<string> => {
  const tokenUUID = crypto.randomUUID()
  const refreshToken = jwt.sign(
    {
      ...user,
      tokenUUID,
    },
    JWT_REFRESH_SECRET,
  )
  await prisma.refreshToken.create({
    data: { token: tokenUUID, userId: user.id },
  })
  return refreshToken
}
