'use client'

import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import classNames from 'clsx'

import type { LinkProps } from '@/components/Link'

export interface HeaderLinkProps extends LinkProps {}

export const HeaderLink = (props: HeaderLinkProps): JSX.Element => {
  const { children, className, href, ...rest } = props

  const pathname = usePathname()

  return (
    <NextLink
      className={classNames(
        'font-inter underline-offset-2 hover:underline',
        {
          underline: pathname === href
        },
        className
      )}
      href={href}
      {...rest}
    >
      {children}
    </NextLink>
  )
}
