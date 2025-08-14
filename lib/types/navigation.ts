import { type LucideIcon } from "lucide-react"

export interface NavigationItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: NavigationSubItem[]
}

export interface NavigationSubItem {
  title: string
  url: string
  description?: string
}

export interface Team {
  name: string
  logo: LucideIcon
  plan: string
}

export interface User {
  name: string
  email: string
  avatar?: string
}

export interface NavigationConfig {
  teams: Team[]
  navMain: NavigationItem[]
}

export interface ProfileMenuItem {
  title: string
  icon: LucideIcon | { light: LucideIcon; dark: LucideIcon }
  href?: string
  action?: string
}

export interface ProfileMenuGroup {
  items: ProfileMenuItem[]
}

export interface ProfileMenuConfig {
  groups: ProfileMenuGroup[]
}