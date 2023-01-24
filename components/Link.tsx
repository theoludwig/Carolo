import NextLink from 'next/link'
import classNames from 'clsx'

export interface LinkProps extends React.ComponentPropsWithoutRef<'a'> {
  href: string
}

export const Link = (props: LinkProps): JSX.Element => {
  const { children, className, ...rest } = props

  return (
    <NextLink
      className={classNames('font-inter hover:underline', className)}
      {...rest}
    >
      {children}
    </NextLink>
  )
}
