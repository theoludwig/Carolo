import type { RefreshToken, User, UserSetting } from '@prisma/client'
import sinon from 'sinon'
import type { UserJWT } from '@carolo/models'
import {
  refreshTokenExample,
  userExample,
  userSettingsExample
} from '@carolo/models'

import {
  generateAccessToken,
  generateRefreshToken
} from '#src/tools/utils/jwtToken.js'
import prisma from '#src/tools/database/prisma.js'

export const authenticateUserTest = async (): Promise<{
  accessToken: string
  refreshToken: string
  user: User
  userStubValue: any
  userSettingStubValue: any
  refreshTokenStubValue: any
}> => {
  const user = {
    ...userExample,
    temporaryExpirationToken:
      userExample.temporaryExpirationToken != null
        ? new Date(userExample.temporaryExpirationToken)
        : null,
    createdAt: new Date(userExample.createdAt),
    updatedAt: new Date(userExample.updatedAt)
  }
  const userStubValue = {
    findUnique: async (): Promise<User> => {
      return user
    }
  }
  const userSettingStubValue = {
    findFirst: async (): Promise<UserSetting> => {
      return {
        ...userSettingsExample,
        createdAt: new Date(userSettingsExample.createdAt),
        updatedAt: new Date(userSettingsExample.updatedAt)
      }
    }
  }
  const refreshTokenStubValue = {
    create: async (): Promise<RefreshToken> => {
      return {
        ...refreshTokenExample,
        createdAt: new Date(refreshTokenExample.createdAt),
        updatedAt: new Date(refreshTokenExample.updatedAt)
      }
    }
  }
  sinon.stub(prisma, 'user').value(userStubValue)
  sinon.stub(prisma, 'userSetting').value(userSettingStubValue)
  sinon.stub(prisma, 'refreshToken').value(refreshTokenStubValue)
  const userJWT: UserJWT = {
    currentStrategy: 'Local',
    id: 1
  }
  const accessToken = generateAccessToken(userJWT)
  const refreshToken = await generateRefreshToken(userJWT)
  return {
    accessToken,
    refreshToken,
    user,
    userStubValue,
    userSettingStubValue,
    refreshTokenStubValue
  }
}
