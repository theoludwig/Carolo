import type { NextPage } from 'next'

import { ErrorPage } from '@/components/ErrorPage'

const Error404: NextPage = () => {
  return <ErrorPage statusCode={404} message={"Cette page n'existe pas !"} />
}

export default Error404
