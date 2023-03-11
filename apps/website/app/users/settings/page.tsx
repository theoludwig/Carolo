import { redirect } from 'next/navigation'

import { useAuthentication } from '@/stores/authentication'
import { UserSettings } from '@/components/UserSettings'

const UsersSettingsPage = (): JSX.Element => {
  const { authenticated } = useAuthentication.getState()

  if (!authenticated) {
    return redirect('/')
  }

  return (
    <main className='flex flex-1 flex-col items-center justify-center'>
      <UserSettings />
    </main>
  )
}

export default UsersSettingsPage
