import { cookies } from 'next/headers'
import type { TokensJWT, UserCurrent } from '@carolo/models'

import { Header } from '@/components/Header/Header'
import { Authentication } from '@/lib/Authentication'
import { AuthenticationStoreInitializer } from '@/stores/AuthenticationStoreInitializer'

import '@fontsource/inter/200.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

import '@fontsource/goldman/400.css'
import '@fontsource/goldman/700.css'

import './globals.css'

export type RootLayoutProps = React.PropsWithChildren

const RootLayout = async (props: RootLayoutProps): Promise<JSX.Element> => {
  const { children } = props

  const cookieStore = cookies()
  const refreshToken = cookieStore.get('refreshToken')

  let tokens: TokensJWT | null = null
  let user: UserCurrent['user'] | null = null
  if (refreshToken != null) {
    const result = await Authentication.signin(refreshToken.value)
    tokens = result.tokens
    user = result.user
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
