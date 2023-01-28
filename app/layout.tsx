import '@/styles/styles'

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
