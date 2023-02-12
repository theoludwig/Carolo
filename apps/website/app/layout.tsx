import '@/styles/styles'
import { Header } from '@/components/Header'

export type RootLayoutProps = React.PropsWithChildren

const RootLayout = (props: RootLayoutProps): JSX.Element => {
  const { children } = props

  return (
    <html lang='fr' className='dark' style={{ colorScheme: 'dark' }}>
      <head />
      <body className='font-inter bg-[#312E2B]'>
        <Header />
        <main className='flex flex-1 flex-col'>{children}</main>
      </body>
    </html>
  )
}

export default RootLayout
