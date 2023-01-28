import type { AppType } from 'next/app'

import '@/styles/styles'

const Application: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />
}

export default Application
