import NextLink from 'next/link'
import Image from 'next/image'
import classNames from 'clsx'

import type { LinkProps } from '@/components/Link'

type LinkElementProps = LinkProps
type ButtonElementProps = React.ComponentPropsWithoutRef<'button'>
export type ButtonLinkProps = LinkElementProps | ButtonElementProps
export type ButtonProps = ButtonLinkProps & {
  variant?: 'white' | 'purple' | 'dark' | 'red'
  icon?: string
}

const isLink = (props: ButtonProps): props is LinkElementProps => {
  return (props as LinkElementProps).href !== undefined
}

export const Button = (props: ButtonProps): JSX.Element => {
  const { variant = 'white', icon } = props

  const mainClasses = 'rounded py-3 font-bold text-center flex items-center'

  const whiteClasses = 'text-xl px-20 bg-white text-black hover:bg-gray-300'

  const purpleClasses =
    'text-md font-bold px-4 bg-[#8417DA] text-white hover:bg-[#6514a6]'

  const darkClasses =
    'text-md bg-[#272522] font-bold px-4 text-white hover:opacity-80'

  const redClasses =
    'text-md bg-[#C82323] font-bold px-4 text-white hover:opacity-80'

  const className = classNames(mainClasses, {
    [whiteClasses]: variant === 'white',
    [purpleClasses]: variant === 'purple',
    [darkClasses]: variant === 'dark',
    [redClasses]: variant === 'red',
    'justify-center': icon == null
  })

  if (isLink(props)) {
    const { children, className: givenClassName, ...rest } = props
    return (
      <NextLink
        className={classNames(className, 'inline-block', givenClassName)}
        {...rest}
      >
        {icon != null ? (
          <Image
            className='my-1 mx-2'
            src={icon}
            width={20}
            height={20}
            alt='Icon'
          />
        ) : null}
        {children}
      </NextLink>
    )
  }

  const { children, className: givenClassName, ...rest } = props
  return (
    <button className={classNames(className, givenClassName)} {...rest}>
      {icon != null ? (
        <Image
          className='my-1 mx-2'
          src={icon}
          width={20}
          height={20}
          alt='Icon'
        />
      ) : null}
      {children}
    </button>
  )
}
