import NextLink from 'next/link'
import classNames from 'clsx'

import type { LinkProps } from '@/components/Link'

type LinkElementProps = LinkProps
type ButtonElementProps = React.ComponentPropsWithoutRef<'button'>
export type ButtonLinkProps = LinkElementProps | ButtonElementProps
export type ButtonProps = ButtonLinkProps & {
  variant?: 'primary' | 'secondary' | 'tertiary'
}

const isLink = (props: ButtonProps): props is LinkElementProps => {
  return (props as LinkElementProps).href !== undefined
}

export const Button = (props: ButtonProps): JSX.Element => {
  const { variant = 'primary' } = props

  const mainClasses = 'rounded py-3 font-bold'
  const primaryClasses = 'text-xl px-20 bg-white text-black hover:bg-gray-300'
  const secondaryClasses =
    'text-md font-bold px-4 bg-[#8417DA] text-white hover:bg-[#6514a6]'

  const tertiaryClasses =
    'text-md bg-[#272522] font-bold px-4 text-white hover:opacity-80'

  const className = classNames(mainClasses, {
    [primaryClasses]: variant === 'primary',
    [secondaryClasses]: variant === 'secondary',
    [tertiaryClasses]: variant === 'tertiary'
  })

  if (isLink(props)) {
    const { children, className: givenClassName, ...rest } = props
    return (
      <NextLink
        className={classNames(className, 'inline-block', givenClassName)}
        {...rest}
      >
        {children}
      </NextLink>
    )
  }

  const { children, className: givenClassName, ...rest } = props
  return (
    <button className={classNames(className, givenClassName)} {...rest}>
      {children}
    </button>
  )
}
