import Image from 'next/image'
import NextLink from 'next/link'

import Icon from '@/public/icon.svg'
import { HeaderLink } from '@/components/HeaderLink'
import { Button } from '@/components/Button'

export const Header = (): JSX.Element => {
  return (
    <header className='sticky top-0 z-50 flex w-full items-center justify-center bg-[#171717] py-1 px-4'>
      <div className='flex w-full flex-wrap items-center justify-between gap-y-4'>
        <NextLink href='/' className='mr-5'>
          <section className='flex items-center'>
            <Image src={Icon} priority quality={100} alt='Carolo' />
            <div className='ml-2'>
              <h1 className='font-goldman text-3xl font-bold leading-7'>
                Carolo.org
              </h1>
              <p className='text-xs font-extralight italic'>
                Prin lod pennos arduo
              </p>
            </div>
          </section>
        </NextLink>

        <nav>
          <ul className='flex space-x-6 font-semibold'>
            <li>
              <HeaderLink href='/game'>Jouer</HeaderLink>
            </li>
            <li>
              <HeaderLink
                href='/rules'
                target='_blank'
                rel='noopener noreferrer'
              >
                Règles
              </HeaderLink>
            </li>
          </ul>
        </nav>

        <div className='flex flex-col space-y-2'>
          <Button
            variant='primary'
            className='rounded-xl !py-[2px] !px-6 !text-base'
            href='/authentication/signin'
          >
            Connexion
          </Button>
          <Button
            variant='tertiary'
            className='rounded-xl !py-[2px] !px-6 !text-base'
            href='/authentication/signup'
          >
            Inscription
          </Button>
        </div>
      </div>
    </header>
  )
}
