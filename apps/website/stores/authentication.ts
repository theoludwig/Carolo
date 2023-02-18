import { create } from 'zustand'
import type { UserCurrent } from '@carolo/models'

import type { Authentication } from '@/lib/Authentication'

export interface AuthenticationStore {
  user: UserCurrent['user'] | null
  authentication: Authentication | null
}

export const useAuthentication = create<AuthenticationStore>()(() => {
  return {
    user: null,
    authentication: null
  }
})
