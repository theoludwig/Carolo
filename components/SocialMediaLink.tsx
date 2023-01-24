import { useMemo } from 'react'
import Image from 'next/image'
import classNames from 'clsx'

export type SocialMedia = 'Discord' | 'Reddit' | 'Twitter'

type SocialMediaColors = {
  [key in SocialMedia]: string
}

const socialMediaColors: SocialMediaColors = {
  Discord: '#8578B3',
  Reddit: '#D15521',
  Twitter: '#2885F2'
}

export interface SocialMediaLinkProps extends React.ComponentPropsWithRef<'a'> {
  socialMedia: SocialMedia
}

export const SocialMediaLink = (props: SocialMediaLinkProps): JSX.Element => {
  const { socialMedia, className, ...rest } = props

  const socialMediaColor = useMemo(() => {
    return socialMediaColors[socialMedia]
  }, [socialMedia])

  return (
    <a
      {...rest}
      style={{ background: socialMediaColor }}
      className={classNames(
        'mt-4 inline-flex cursor-pointer items-center rounded-lg py-2 px-4 font-semibold uppercase outline-none transition duration-300 ease-in-out hover:opacity-80 focus:outline-none md:mt-0 md:w-auto',
        className
      )}
    >
      <Image
        className='h-auto w-auto'
        quality={100}
        width={25}
        height={25}
        src={`/social-media/${socialMedia}.png`}
        alt={socialMedia}
      />
      <span className='ml-2'>{socialMedia}</span>
    </a>
  )
}
