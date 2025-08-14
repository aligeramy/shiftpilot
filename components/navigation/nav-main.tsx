"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useNavigationStore } from "@/lib/stores/navigation-store"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import type { NavigationItem } from "@/lib/types/navigation"

export function NavMain({
  items,
}: {
  items: NavigationItem[]
}) {
  const pathname = usePathname()
  const { isItemExpanded, toggleExpanded } = useNavigationStore()
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.url || item.items?.some(subItem => pathname === subItem.url)
          
          // For SSR, use a safe default. After hydration, use the actual store state
          const isExpanded = isMounted ? isItemExpanded(item.title) : item.title === 'Dashboard'
          
          return (
            <Collapsible
              key={item.title}
              open={isExpanded}
              onOpenChange={() => toggleExpanded(item.title)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton 
                    tooltip={item.title}
                    isActive={isActive}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton 
                          asChild
                          isActive={pathname === subItem.url}
                        >
                          <Link href={subItem.url} prefetch={true}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                    {item.title === 'Settings' && (
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={pathname === '/home/profile'}>
                          <Link href="/home/profile" prefetch={true}>
                            <span>Profile</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}