import { create } from 'zustand'
import type { UserCurrent } from '@carolo/models'

import type { Authentication } from '@/lib/Authentication'

interface AuthenticatedStore {
  user: UserCurrent['user']
  authentication: Authentication
}

export type AuthenticationStore =
  | (AuthenticatedStore & { authenticated: true })
  | ({ [K in keyof AuthenticatedStore]: null } & { authenticated: false })

export const useAuthentication = create<AuthenticationStore>()(() => {
  return {
    authenticated: false,
    user: null,
    authentication: null
  }
})
