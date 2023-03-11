import Image from 'next/image'
import classNames from 'clsx'

export interface UserProps {
  user: {
    name: string
    logo: string | null
  }
  className?: string
}

export const User = (props: UserProps): JSX.Element => {
  const { user, className } = props

  return (
    <>
      <Image
        className={classNames('rounded-full', className)}
        priority
        quality={100}
        src={user.logo ?? '/data/user-default.png'}
        alt='User Picture'
        width={64}
        height={64}
      />
      <h2 className='text-base font-semibold'>{user.name}</h2>
    </>
  )
}
