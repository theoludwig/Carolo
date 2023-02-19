import type { AxiosInstance } from 'axios'
import axios from 'axios'
import type { TokensJWT, UserCurrent } from '@carolo/models'

import { API_URL, api } from '@/lib/configurations'
import { useAuthentication } from '@/stores/authentication'
import { cookies } from '@/lib/cookies'

export const fetchRefreshToken = async (
  refreshToken: string
): Promise<TokensJWT> => {
  const { data } = await api.post<TokensJWT>('/users/refresh-token', {
    refreshToken
  })
  return { ...data, refreshToken }
}

export interface SigninResult {
  tokens: TokensJWT | null
  user: UserCurrent['user'] | null
  authentication: Authentication | null
}

export class Authentication {
  public tokens: TokensJWT
  public accessTokenAge: number
  public api: AxiosInstance

  constructor(tokens: TokensJWT) {
    this.tokens = tokens
    this.accessTokenAge = Date.now()
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.api.interceptors.request.use(
      async (config) => {
        const isValidAccessToken =
          this.accessTokenAge + tokens.expiresIn > Date.now()
        if (!isValidAccessToken) {
          const { accessToken } = await fetchRefreshToken(
            this.tokens.refreshToken
          )
          this.setAccessToken(accessToken)
        }
        config.headers.Authorization = `${this.tokens.type} ${this.tokens.accessToken}`
        return config
      },
      async (error) => {
        this.signout()
        return await Promise.reject(error)
      }
    )
    this.api.interceptors.response.use(
      (response) => {
        return response
      },
      async (error) => {
        if (error.response.status !== 403 || (error.config._retry as boolean)) {
          return await Promise.reject(error)
        }
        error.config._retry = true
        try {
          const { accessToken } = await fetchRefreshToken(
            this.tokens.refreshToken
          )
          this.setAccessToken(accessToken)
          error.response.config.headers.Authorization = `${this.tokens.type} ${this.tokens.accessToken}`
          return await this.api.request(error.response.config)
        } catch {
          this.signout()
          return await Promise.reject(error)
        }
      }
    )
  }

  public setAccessToken(accessToken: string): void {
    this.tokens.accessToken = accessToken
    this.accessTokenAge = Date.now()
  }

  public signout(): void {
    cookies.remove('refreshToken')
    useAuthentication.setState({
      authenticated: false,
      authentication: null,
      user: null
    })
  }

  public async signoutServerSide(): Promise<void> {
    try {
      await this.api.post('/users/signout', {
        refreshToken: this.tokens.refreshToken
      })
    } catch {}
    this.signout()
  }

  public async signoutAllDevicesServerSide(): Promise<void> {
    try {
      await this.api.delete('/users/signout')
    } catch {}
    this.signout()
  }

  public static async signin(refreshToken: string): Promise<SigninResult> {
    cookies.set('refreshToken', refreshToken)
    let tokens: TokensJWT | null = null
    let authentication: Authentication | null = null
    let user: UserCurrent['user'] | null = null
    try {
      tokens = await fetchRefreshToken(refreshToken)
      authentication = new Authentication(tokens)
      const { data } = await authentication.api.get<UserCurrent>(
        '/users/current'
      )
      user = data.user
      useAuthentication.setState({ authenticated: true, authentication, user })
    } catch {
      useAuthentication.setState({
        authenticated: false,
        authentication: null,
        user: null
      })
    }
    return { tokens, authentication, user }
  }
}
