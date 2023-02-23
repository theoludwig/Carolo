import { MovesHistory } from '@/components/Game/LeftSidebar/MovesHistory'
import { MovesNavigation } from '@/components/Game/LeftSidebar/MovesNavigation'

export const LeftSidebar = (): JSX.Element => {
  return (
    <div className='flex w-4/12 flex-col items-center justify-center'>
      <MovesHistory />
      <MovesNavigation />
    </div>
  )
}
