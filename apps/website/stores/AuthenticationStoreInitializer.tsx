'use client'

import { useRef } from 'react'
import type { TokensJWT, UserCurrent } from '@carolo/models'

import { Authentication } from '@/lib/Authentication'
import { useAuthentication } from '@/stores/authentication'

export interface AuthenticationStoreInitializerProps {
  tokens: TokensJWT | null
  user: UserCurrent['user'] | null
}

export const AuthenticationStoreInitializer = (
  props: AuthenticationStoreInitializerProps
): JSX.Element => {
  const { tokens, user } = props

  const initialized = useRef(false)
  if (!initialized.current) {
    const authentication = tokens != null ? new Authentication(tokens) : null
    useAuthentication.setState({ authentication, user })
    initialized.current = true
  }

  return <></>
}
