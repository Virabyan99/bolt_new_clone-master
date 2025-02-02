'use client'

import { Button } from '../ui/button'
import Colors from '@/data/Colors'
import { useContext } from 'react'
import { UserDetailContext } from '@/context/UserDetailContext'
import { useSidebar } from '../ui/sidebar'
import { usePathname } from 'next/navigation'
import { ActionContext } from '@/context/ActionContext'
import { LucideDownload, Rocket } from 'lucide-react'
import Image from 'next/image'

const Header = () => {
  const { userDetail, setUserDetail } = useContext(UserDetailContext)
  const { toggleSidebar } = useSidebar()
   const { action, setAction } = useContext(ActionContext)
  const path = usePathname()
  console.log(path?.includes('workspace'))

  const onActionBtn = (action) => {
    setAction({
      actionType: action,
      timeStamp: Date.now()
    })
  }
  return (
    <div className="p-4 flex justify-between items-center border-b">
      {!userDetail?.name ? (
        <div className="flex gap-5">
          <Button variant="ghost">Sign In</Button>
          <Button
            className="text-white"
            style={{ backgroundColor: Colors.BLUE }}>
            Get Started
          </Button>
        </div>
      ) : (
        path?.includes('workspace') && (
          <div className="flex gap-2 items-center">
            <Button variant="ghost" onClick={() => onActionBtn('export')}>
              <LucideDownload />
              Export
            </Button>
            <Button
              onClick={() => onActionBtn('deploy')}
              className="bg-blue-500 text-white hover:bg-blue-600">
              <Rocket />
              Deploy
            </Button>
            {userDetail && (
              <Image
                src={userDetail?.picture}
                alt="user"
                width={30}
                height={30}
                className="rounded-full w-[30px]"
                // onClick={toggleSidebar}
              />
            )}
          </div>
        )
      )}
    </div>
  )
}

export default Header
