import { SidebarProvider } from '@/components/ui/sidebar'
import DashboardNavbar from '@/modules/dashboard/ui/components/dashboard-navbar'
import DashboardSidebar from '@/modules/dashboard/ui/components/dashboard-sidebar'
import React from 'react'
interface layoutProps{
    children:React.ReactNode
}
const layout = ({children}: layoutProps) => {
  return (
    <SidebarProvider>
			<DashboardSidebar/>
      <main className='flex flex-col h-screen w-screen bg-muted overflow-hidden'>
        <DashboardNavbar/>
				{children}
			</main>
    </SidebarProvider>
  )
}

export default layout
 