import './layout.css'

export type GameLayoutProps = React.PropsWithChildren

const GameLayout = (props: GameLayoutProps): JSX.Element => {
  const { children } = props

  return <>{children}</>
}

export default GameLayout
