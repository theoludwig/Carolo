import type { AxiosInstance } from 'axios'
import axios from 'axios'
import type { TokensJWT } from '@carolo/models'

import { API_URL, api } from '@/lib/configurations'
import { cookies } from '@/lib/cookies'

export const fetchRefreshToken = async (
  refreshToken: string
): Promise<TokensJWT> => {
  const { data } = await api.post<TokensJWT>('/users/refresh-token', {
    refreshToken
  })
  return { ...data, refreshToken }
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

  public signin(): void {
    cookies.set('refreshToken', this.tokens.refreshToken)
  }
}
