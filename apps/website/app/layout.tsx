import { cookies } from 'next/headers'
import type { TokensJWT, UserCurrent } from '@carolo/models'

import '@/styles/styles'
import { Header } from '@/components/Header'
import { Authentication, fetchRefreshToken } from '@/lib/Authentication'
import { useAuthentication } from '@/stores/authentication'
import { AuthenticationStoreInitializer } from '@/stores/AuthenticationStoreInitializer'

export type RootLayoutProps = React.PropsWithChildren

const RootLayout = async (props: RootLayoutProps): Promise<JSX.Element> => {
  const { children } = props

  const cookieStore = cookies()
  const refreshToken = cookieStore.get('refreshToken')

  let tokens: TokensJWT | null = null
  let user: UserCurrent['user'] | null = null

  if (refreshToken != null) {
    try {
      tokens = await fetchRefreshToken(refreshToken.value)
      const authentication = new Authentication(tokens)
      const { data } = await authentication.api.get<UserCurrent>(
        '/users/current'
      )
      user = data.user
      useAuthentication.setState({ authentication, user })
    } catch {}
  }

  return (
    <html lang='fr' className='dark' style={{ colorScheme: 'dark' }}>
      <head />
      <body className='font-inter flex h-screen flex-col bg-[#312E2B] pt-0'>
        <AuthenticationStoreInitializer tokens={tokens} user={user} />
        <Header />
        <main className='flex flex-1 flex-col items-center justify-center'>
          {children}
        </main>
      </body>
    </html>
  )
}

export default RootLayout
