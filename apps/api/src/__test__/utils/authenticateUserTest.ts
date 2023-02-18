import type { User } from '@prisma/client'
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
  const userStubValue = {
    findUnique: async () => {
      return userExample
    }
  }
  const userSettingStubValue = {
    findFirst: async () => {
      return userSettingsExample
    }
  }
  const refreshTokenStubValue = {
    create: async () => {
      return refreshTokenExample
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
    user: {
      ...userExample,
      temporaryExpirationToken: new Date(userExample.temporaryExpirationToken),
      createdAt: new Date(userExample.createdAt),
      updatedAt: new Date(userExample.updatedAt)
    },
    userStubValue,
    userSettingStubValue,
    refreshTokenStubValue
  }
}
