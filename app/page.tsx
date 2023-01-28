import Image from 'next/image'

import { ButtonLink } from '@/components/Button'
import { Header } from '@/components/Header'
import { SocialMediaLink } from '@/components/SocialMediaLink'
import Home from '@/public/home.png'
import Home2 from '@/public/home-2.png'
import { Features } from '@/components/Features/Features'

const HomePage = (): JSX.Element => {
  return (
    <>
      <Header />
      <main className='flex flex-1 flex-col'>
        <section className='mt-6 flex flex-col items-center justify-center space-y-4 md:w-full md:flex-row md:space-x-12 md:space-y-0'>
          <SocialMediaLink socialMedia='Reddit' href='/' />
          <SocialMediaLink socialMedia='Discord' href='/' />
          <SocialMediaLink socialMedia='Twitter' href='/' />
        </section>
        <section className='mt-12 flex flex-col items-center px-10 sm:flex-row'>
          <div className='w-full sm:w-6/12'>
            <p className='text-sm font-bold text-[#8C55C0]'>
              UN JEU DE PLATEAU ORIGINAL ET ENVOUTANT
            </p>
            <h2 className='mt-3 text-3xl font-bold'>
              JOUEZ GRATUITEMENT AU CAROLO !
            </h2>
            <p className='mt-4 text-lg opacity-75'>
              Le Carolo est un nouveau jeu de plateau stratégique, fait par la
              communauté, pour la communauté, qui allie autant l{"'"}aspect
              tactique que romantique !
            </p>
            <ButtonLink className='mt-6' href='/play'>
              Jouer
            </ButtonLink>
          </div>
          <div className='mt-8 w-full sm:mt-0 sm:w-8/12 md:w-6/12'>
            <Image src={Home} quality={100} alt='Carolo Home' />
          </div>
        </section>
        <Features />
        <section className='my-8 flex flex-wrap justify-around px-6'>
          <div>
            <Image
              className='max-w-xs md:max-w-md'
              quality={100}
              src={Home2}
              alt='Carolo Home 2'
            />
          </div>
          <div className='max-w-sm'>
            <h2 className='mt-3 text-2xl font-bold'>
              UN JEU INTUITIF, RAPIDE ET FACILE À PRENDRE EN MAIN !
            </h2>
            <p className='mt-3 opacity-75'>
              Apprenez à jouer en moins de 5 minutes, éveillez le champion que
              vous êtes, et lancez-vous à la conquête du classement !{' '}
            </p>
            <ButtonLink className='mt-6' href='/rules'>
              Les règles
            </ButtonLink>
          </div>
        </section>
      </main>
    </>
  )
}

export default HomePage
