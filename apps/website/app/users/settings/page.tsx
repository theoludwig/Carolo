import { redirect } from 'next/navigation'

import { useAuthentication } from '@/stores/authentication'

const UsersSettingsPage = (): JSX.Element => {
  const { authenticated, user } = useAuthentication.getState()

  if (!authenticated) {
    return redirect('/')
  }

  return <p>{user.name}</p>
}

export default UsersSettingsPage
