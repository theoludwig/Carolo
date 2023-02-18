import NextLink from 'next/link'
import type { LinkProps as NextLinkProps } from 'next/link'
import classNames from 'clsx'

type LinkTypeProps = NextLinkProps &
  Omit<React.ComponentPropsWithoutRef<'a'>, 'href'>

export interface LinkProps extends LinkTypeProps {
  href: LinkTypeProps['href'] | `/rules`
}

export const Link = (props: LinkProps): JSX.Element => {
  const { children, className, ...rest } = props

  return (
    <NextLink
      className={classNames(
        'font-inter text-[#2885F2] hover:underline',
        className
      )}
      {...rest}
    >
      {children}
    </NextLink>
  )
}
