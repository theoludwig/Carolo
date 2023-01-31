import NextLink from 'next/link'
import classNames from 'clsx'

import type { LinkProps } from './Link'

type LinkElementProps = LinkProps
type ButtonElementProps = React.ComponentPropsWithoutRef<'button'>
export type ButtonProps = LinkElementProps | ButtonElementProps

const isLink = (props: ButtonProps): props is LinkElementProps => {
  return (props as LinkElementProps).href !== undefined
}

export const Button = (props: ButtonProps): JSX.Element => {
  const className =
    'rounded bg-white py-3 px-20 text-xl font-bold text-black hover:bg-gray-300'

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
