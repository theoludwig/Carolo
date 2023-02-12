import type { NextPage } from 'next'

import { ErrorPage } from '@/components/ErrorPage'

const Error500: NextPage = () => {
  return <ErrorPage statusCode={500} message='Erreur Interne du Serveur !' />
}

export default Error500
