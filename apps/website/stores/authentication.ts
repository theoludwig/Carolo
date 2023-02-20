import { create } from 'zustand'
import type { UserCurrent } from '@carolo/models'

import type { Authentication } from '@/lib/Authentication'

interface AuthenticatedStore {
  user: UserCurrent['user']
  authentication: Authentication
}

type AuthenticationUnion =
  | (AuthenticatedStore & { authenticated: true })
  | ({ [K in keyof AuthenticatedStore]: null } & { authenticated: false })

export type AuthenticationStore = AuthenticationUnion & {
  updateUser: (user: Partial<UserCurrent['user']>) => void
}

export const useAuthentication = create<AuthenticationStore>()((set) => {
  return {
    authenticated: false,
    user: null,
    authentication: null,
    updateUser: (user) => {
      return set((state) => {
        if (!state.authenticated) {
          return {}
        }
        return {
          user: {
            ...state.user,
            ...user
          }
        }
      })
    }
  }
})
