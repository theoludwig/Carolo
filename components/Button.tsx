import NextLink from 'next/link'
import classNames from 'clsx'

const className =
  'rounded bg-white py-3 px-20 text-xl font-bold text-black hover:bg-gray-300'

export interface ButtonLinkProps extends React.ComponentPropsWithoutRef<'a'> {
  href: string
}

export const ButtonLink = (props: ButtonLinkProps): JSX.Element => {
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

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {}

export const Button = (props: ButtonProps): JSX.Element => {
  const { children, className: givenClassName, ...rest } = props

  return (
    <button className={classNames(className, givenClassName)} {...rest}>
      {children}
    </button>
  )
}
