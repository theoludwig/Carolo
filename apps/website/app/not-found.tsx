import { ErrorPage } from "@/components/ErrorPage"

const NotFound = (): JSX.Element => {
  return <ErrorPage statusCode={404} message="Cette page n'existe pas !" />
}

export default NotFound
