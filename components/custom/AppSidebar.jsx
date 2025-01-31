import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar'

import Logo from '@/public/logo.svg'
import Image from 'next/image'
import { Button } from '../ui/button'
import { MessageCircleCode } from 'lucide-react'
import WorkspaceHistory from './WorkspaceHistory'
import Footer from './Footer'
const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader className="p-5">
        <Image src={Logo} alt="logo" width={40} height={40} />
        <Button className="mt-5">
          <MessageCircleCode /> Start New Chat
        </Button>
      </SidebarHeader>
      <SidebarContent className="p-5">
        <SidebarGroup>
          <WorkspaceHistory />
        </SidebarGroup>
        {/* <SidebarGroup /> */}
      </SidebarContent>
      <SidebarFooter>
        <Footer />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
