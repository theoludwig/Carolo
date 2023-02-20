import { redirect } from 'next/navigation'

import { useAuthentication } from '@/stores/authentication'
import { UserSettings } from '@/components/UserSettings'

const UsersSettingsPage = (): JSX.Element => {
  const { authenticated } = useAuthentication.getState()

  if (!authenticated) {
    return redirect('/')
  }

  return <UserSettings />
}

export default UsersSettingsPage
