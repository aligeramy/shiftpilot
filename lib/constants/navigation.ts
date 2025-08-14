import {
  Calendar,
  Home,
  Settings2,
  BarChart3,
  User as UserIcon,
  Moon,
  Sun,
  LogOut,
  ArrowRightLeft,
} from "lucide-react"
import { ShiftPilotLogo } from "@/components/ui/shiftpilot-logo"

import type { NavigationConfig, ProfileMenuConfig } from "@/lib/types/navigation"

export const NAVIGATION_CONFIG: NavigationConfig = {
  teams: [
    {
      name: "ShiftPilot",
      logo: ShiftPilotLogo,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/home",
      icon: Home,
      items: [
        {
          title: "Overview",
          url: "/home",
          description: "Main dashboard overview",
        }
      ],
    },
    {
      title: "Schedule Calendar",
      url: "/schedule",
      icon: Calendar,
      items: [
        {
          title: "View Schedule",
          url: "/schedule",
          description: "Interactive calendar view of generated schedules",
        },
      ],
    },
    {
      title: "Vacation Preferences",
      url: "/preferences",
      icon: Calendar,
      items: [
        {
          title: "Manage Preferences",
          url: "/preferences",
          description: "Collect and manage radiologist vacation preferences",
        },
      ],
    },
    {
      title: "Shift Swaps",
      url: "/swaps",
      icon: ArrowRightLeft,
      items: [
        {
          title: "Manage Swaps",
          url: "/swaps",
          description: "Request and approve shift exchanges",
        },
      ],
    },
    {
      title: "Reports",
      url: "/fairness",
      icon: BarChart3,
      items: [
        {
          title: "Fairness Ledger",
          url: "/fairness",
          description: "Monthly vacation fairness points and YTD totals",
        },
        {
          title: "System Testing",
          url: "/testing",
          description: "Comprehensive system testing and validation",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "Overview",
          url: "/settings",
          description: "Organization, subspecialties, shift types, and staff",
        },
        {
          title: "Onboarding",
          url: "/onboarding",
          description: "Organization setup and configuration",
        },
      ],
    },
  ],
}

// Navigation utility functions
export const getNavItemByUrl = (url: string) => {
  return NAVIGATION_CONFIG.navMain.find(item => 
    item.url === url || item.items?.some(subItem => subItem.url === url)
  )
}

export const generateBreadcrumbs = (url: string) => {
  const navItem = getNavItemByUrl(url)
  if (!navItem) return []

  const breadcrumbs = []
  
  // Add main nav item (only if it's not the current page)
  if (navItem.url !== url) {
    breadcrumbs.push({
      label: navItem.title,
      href: navItem.url
    })
  }

  // Add sub item if it's a sub-page
  const subItem = navItem.items?.find(item => item.url === url)
  if (subItem) {
    breadcrumbs.push({
      label: subItem.title
    })
  } else if (navItem.url === url) {
    // If we're on the main nav item page, just show it as the current page
    breadcrumbs.push({
      label: navItem.title
    })
  }

  return breadcrumbs
}

// Profile Menu Configuration
export const PROFILE_MENU_CONFIG: ProfileMenuConfig = {
  groups: [
    {
      items: [
        {
          title: "Profile",
          icon: UserIcon,
          href: "/profile"
        },
        {
          title: "Settings",
          icon: Settings2,
          href: "/settings"
        }
      ]
    },
    {
      items: [
        {
          title: "Toggle theme",
          icon: { light: Moon, dark: Sun },
          action: "theme"
        },
        {
          title: "Log out",
          icon: LogOut,
          action: "logout"
        }
      ]
    }
  ]
}