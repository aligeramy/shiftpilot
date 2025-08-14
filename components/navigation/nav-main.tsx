"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"
import { usePathname } from "next/navigation"
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
  const { toggleExpanded, isItemExpanded, isUrlActive } = useNavigationStore()

  return (
    <SidebarGroup suppressHydrationWarning>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isExpanded = isItemExpanded(item.title)
          const isActive = isUrlActive(item.url) || item.items?.some(subItem => isUrlActive(subItem.url))
          
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
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
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