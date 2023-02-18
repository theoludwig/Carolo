import { redirect } from 'next/navigation'

import { useAuthentication } from '@/stores/authentication'

const AuthenticationLayout = (): JSX.Element => {
  const { user, authentication } = useAuthentication.getState()

  if (user != null && authentication != null) {
    return redirect('/')
  }

  return <></>
}

export default AuthenticationLayout
