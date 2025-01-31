'use client'
import { UserDetailContext } from '@/context/UserDetailContext'
import { api } from '@/convex/_generated/api'
import { useConvex } from 'convex/react'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import { useSidebar } from '../ui/sidebar'


const WorkspaceHistory = () => {
  const { userDetail, setUserDetail } = useContext(UserDetailContext)
  const convex = useConvex()
  const [workspaceList, setWorkspaceList] = useState()
  const { toggleSidebar } = useSidebar()

  useEffect(() => {
    userDetail && GetAllWorkspace()
  }, [userDetail])

  const GetAllWorkspace = async () => {
    const result = await convex.query(api.workspace.GetAllWorkspace, {
      userId: userDetail?._id,
    })
    console.log(result)
    setWorkspaceList(result)
  }
  return (
    <div >
      <h2 className="font-medium text-lg">Your Chats</h2>
      <div >
        {workspaceList &&
        
          workspaceList.map((workspace, index) => (
            <Link  key={index} href={`/workspace/${workspace._id}`}>
              <h2
                
                onClick={toggleSidebar}
                className="  text-sm text-gray-400 mt-5 font-light hover:text-white cursor-pointer">
                {workspace.messages[0].content}
              </h2>
            </Link>
          ))}
      </div>
    </div>
  )
}

export default WorkspaceHistory
