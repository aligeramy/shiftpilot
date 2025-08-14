"use client"

import * as React from "react"
import { NavMain } from "@/components/navigation/nav-main"
import { NavUser } from "@/components/navigation/nav-user"
import { TeamSwitcher } from "@/components/navigation/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NAVIGATION_CONFIG } from "@/lib/constants/navigation"
import type { User } from "@/lib/types/navigation"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: User
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const defaultUser: User = {
    name: "John Doe",
    email: "john@shiftpilot.com",
    avatar: "/avatars/user.jpg",
  }

  const userData = user || defaultUser

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={NAVIGATION_CONFIG.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={NAVIGATION_CONFIG.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}