export interface UsersProfilePageProps {
  params: {
    userId: string
  }
}

const UsersProfilePage = (props: UsersProfilePageProps): JSX.Element => {
  const { userId } = props.params

  return <p>User Id: {userId}</p>
}

export default UsersProfilePage
