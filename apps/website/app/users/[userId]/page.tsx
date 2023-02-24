import { notFound } from 'next/navigation'
import Image from 'next/image'
import date from 'date-and-time'
import type { Services } from '@carolo/models'

import { api } from '@/lib/configurations'

export interface UsersProfilePageProps {
  params: {
    userId: string
  }
}

type UserPublicById = Services['/users/:userId']['get']['response']

const UsersProfilePage = async (
  props: UsersProfilePageProps
): Promise<JSX.Element> => {
  const { userId } = props.params

  let userPublic: UserPublicById | null = null
  try {
    const { data } = await api.get<UserPublicById>(`/users/${userId}`)
    userPublic = data
  } catch {}

  if (userPublic == null) {
    return notFound()
  }

  return (
    <div className='flex flex-col items-center justify-center rounded-lg bg-[#272522] p-6'>
      <Image
        priority
        className='h-32 w-32 rounded-full'
        quality={100}
        src={userPublic.user.logo ?? '/data/user-default.png'}
        width={256}
        height={256}
        alt='User logo'
      />
      <h2 className='mt-2 text-2xl font-bold'>{userPublic.user.name}</h2>
      <p className='mt-4 text-[#D1D1D1]'>
        Compte crée le{' '}
        {date.format(new Date(userPublic.user.createdAt), 'DD/MM/YYYY')}
      </p>
      <div className='mt-4 flex space-x-6'>
        <div className='flex flex-col items-center'>
          <div className='font-bold text-[#47952C]'>Victoires</div>
          <div className='font-bold text-[#D1D1D1]'>
            {userPublic.numberOfVictory}
          </div>
        </div>

        <div className='border-r-2 border-r-[#D1D1D1]'></div>

        <div className='flex flex-col items-center'>
          <div className='font-bold text-[#C32121]'>Défaites</div>
          <div className='font-bold text-[#D1D1D1]'>
            {userPublic.numberOfDefeat}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UsersProfilePage
