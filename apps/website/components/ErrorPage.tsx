import { Link } from '@/components/Link'

export interface ErrorPageProps {
  statusCode: number
  message: string
}

export const ErrorPage = (props: ErrorPageProps): JSX.Element => {
  const { message, statusCode } = props

  return (
    <main className='flex flex-1 flex-col items-center justify-center'>
      <h1 className='my-6 text-4xl font-semibold'>
        Erreur <span data-cy='status-code'>{statusCode}</span>
      </h1>
      <p className='text-center text-lg'>
        {message} <Link href='/'>Revenir à la page d{"'"}accueil ?</Link>
      </p>
    </main>
  )
}
