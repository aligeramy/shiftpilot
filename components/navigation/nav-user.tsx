"use client"

import {
  ChevronsUpDown,
} from "lucide-react"
import Link from "next/link"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import type { User, ProfileMenuItem } from "@/lib/types/navigation"
import { useTheme } from "next-themes"
import { signOutAction } from "@/lib/actions/auth-actions"
import { PROFILE_MENU_CONFIG } from "@/lib/constants/navigation"

export function NavUser({
  user,
}: {
  user: User
}) {
  const { isMobile } = useSidebar()
  const { theme, setTheme } = useTheme()

  const handleMenuAction = (action: string | undefined) => {
    if (!action) return
    
    switch (action) {
      case "theme":
        setTheme(theme === "light" ? "dark" : "light")
        break
      case "upgrade":
        // Handle upgrade action
        break
      case "account":
        // Handle account action
        break
      case "billing":
        // Handle billing action
        break
      case "notifications":
        // Handle notifications action
        break
      default:
        break
    }
  }

  const renderIcon = (iconConfig: ProfileMenuItem['icon']) => {
    if (typeof iconConfig === 'object' && 'light' in iconConfig && 'dark' in iconConfig) {
      const IconComponent = theme === "light" ? iconConfig.light : iconConfig.dark
      return <IconComponent className="text-current" />
    } else {
      const IconComponent = iconConfig
      return <IconComponent className="text-current" />
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent/20 border border-border/10 ring-1 ring-foreground/3 data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-brand-primary text-brand-light">
                  {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg mb-5.5 bg-background/10 backdrop-blur-sm border border-border/10 ring-1 ring-foreground/3"
            side={isMobile ? "top" : "right"}
            align={isMobile ? "end" : "start"}
            sideOffset={4}
            alignOffset={isMobile ? 0 : -8}
            avoidCollisions={true}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-brand-primary text-brand-light">
                    {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            {PROFILE_MENU_CONFIG.groups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {group.items.map((item, itemIndex) => {
                    if (item.href) {
                      return (
                        <DropdownMenuItem key={itemIndex} asChild>
                          <Link href={item.href}>
                            {renderIcon(item.icon)}
                            {item.title}
                          </Link>
                        </DropdownMenuItem>
                      )
                    } else if (item.action === "logout") {
                      return (
                        <DropdownMenuItem key={itemIndex} asChild>
                          <form action={signOutAction} className="w-full">
                            <button type="submit" className="flex w-full items-center gap-2">
                              {renderIcon(item.icon)}
                              {item.title}
                            </button>
                          </form>
                        </DropdownMenuItem>
                      )
                    } else {
                      return (
                        <DropdownMenuItem 
                          key={itemIndex} 
                          onClick={() => handleMenuAction(item.action)}
                        >
                          {renderIcon(item.icon)}
                          {item.title}
                        </DropdownMenuItem>
                      )
                    }
                  })}
                </DropdownMenuGroup>
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}