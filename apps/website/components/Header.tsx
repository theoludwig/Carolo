import Image from 'next/image'
import NextLink from 'next/link'

import Icon from '@/public/icon.svg'
import { Link } from '@/components/Link'

export const Header = (): JSX.Element => {
  return (
    <header className='sticky top-0 z-50 flex w-full items-center justify-center bg-[#171717] p-4'>
      <div className='container flex flex-wrap items-center justify-between gap-y-4'>
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
              <Link href='/game'>Jouer</Link>
            </li>
            <li>
              <Link href='/rules/index.html'>Règles</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
