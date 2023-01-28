import Image from 'next/image'

export interface FeatureProps {
  title: string
  icon: string
  description: string
}

export const Feature = (props: FeatureProps): JSX.Element => {
  const { title, icon, description } = props

  return (
    <div className='mt-4 w-56 rounded-xl bg-[#272522] py-6'>
      <div className='flex items-center justify-center space-x-2'>
        <Image quality={100} width={40} height={40} src={icon} alt='Run' />
        <h4 className='text-xl font-bold'>{title}</h4>
      </div>
      <p className='mt-4 px-5 text-sm opacity-75'>{description}</p>
    </div>
  )
}
