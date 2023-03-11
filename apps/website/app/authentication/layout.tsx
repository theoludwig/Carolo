import { redirect } from 'next/navigation'

import { useAuthentication } from '@/stores/authentication'

export type AuthenticationLayoutProps = React.PropsWithChildren

const AuthenticationLayout = (
  props: AuthenticationLayoutProps
): JSX.Element => {
  const { children } = props
  const { authenticated } = useAuthentication.getState()

  if (authenticated) {
    return redirect('/')
  }

  return (
    <main className='flex flex-1 flex-col items-center justify-center'>
      {children}
    </main>
  )
}

export default AuthenticationLayout
