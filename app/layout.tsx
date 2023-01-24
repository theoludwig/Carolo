import '@fontsource/inter/200.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

import '@fontsource/goldman/400.css'
import '@fontsource/goldman/700.css'

import './globals.css'

export type RootLayoutProps = React.PropsWithChildren<{}>

const RootLayout = (props: RootLayoutProps): JSX.Element => {
  const { children } = props

  return (
    <html lang='fr' className='dark' style={{ colorScheme: 'dark' }}>
      <head />
      <body className='bg-[#312E2B] font-inter'>{children}</body>
    </html>
  )
}

export default RootLayout
