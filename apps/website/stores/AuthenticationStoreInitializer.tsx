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
    if (authentication != null && user != null) {
      useAuthentication.setState({ authenticated: true, authentication, user })
    } else {
      useAuthentication.setState({
        authenticated: false,
        authentication: null,
        user: null
      })
    }
    initialized.current = true
  }

  return <></>
}
