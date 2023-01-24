import classNames from 'clsx'

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {}

export const Button = (props: ButtonProps): JSX.Element => {
  const { children, className, ...rest } = props

  return (
    <button
      className={classNames(
        'rounded bg-white py-3 px-20 text-xl font-bold text-black hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
