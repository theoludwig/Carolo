import { Html, Head, Main, NextScript } from 'next/document'

const Document: React.FC = () => {
  return (
    <Html lang='fr' className='dark' style={{ colorScheme: 'dark' }}>
      <Head />
      <body className='bg-[#312E2B] font-inter'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document
