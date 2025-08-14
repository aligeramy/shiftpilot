import {
  Calendar,
  Clock,
  Home,
  Settings2,
  Users,
  BarChart3,
  Stethoscope,
  UserCheck,
  Sparkles,
  User as UserIcon,
  BadgeCheck,
  CreditCard,
  Bell,
  Moon,
  Sun,
  LogOut,
} from "lucide-react"

import type { NavigationConfig, ProfileMenuConfig } from "@/lib/types/navigation"

export const NAVIGATION_CONFIG: NavigationConfig = {
  teams: [
    {
      name: "ShiftPilot",
      logo: Stethoscope,
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
        },
        {
          title: "Analytics",
          url: "/home/analytics",
          description: "Performance analytics and insights",
        },
        {
          title: "Reports",
          url: "/home/reports",
          description: "Generate and view reports",
        },
      ],
    },
    {
      title: "Scheduling",
      url: "/scheduling",
      icon: Calendar,
      items: [
        {
          title: "Current Schedule",
          url: "/scheduling",
          description: "View current shift schedules",
        },
        {
          title: "Create Schedule",
          url: "/scheduling/create",
          description: "Create new shift schedules",
        },
        {
          title: "Template Library",
          url: "/scheduling/templates",
          description: "Manage schedule templates",
        },
        {
          title: "Calendar View",
          url: "/scheduling/calendar",
          description: "Monthly calendar view",
        },
      ],
    },
    {
      title: "Staff Management",
      url: "/staff",
      icon: Users,
      items: [
        {
          title: "Staff Directory",
          url: "/staff/directory",
          description: "View all staff members",
        },
        {
          title: "Availability",
          url: "/staff/availability",
          description: "Manage staff availability",
        },
        {
          title: "Preferences",
          url: "/staff/preferences",
          description: "Staff scheduling preferences",
        },
        {
          title: "Credentials",
          url: "/staff/credentials",
          description: "Manage staff certifications",
        },
      ],
    },
    {
      title: "Shifts",
      url: "/shifts",
      icon: Clock,
      items: [
        {
          title: "Open Shifts",
          url: "/shifts/open",
          description: "View available shifts",
        },
        {
          title: "Shift History",
          url: "/shifts/history",
          description: "Past shift records",
        },
        {
          title: "Time Off Requests",
          url: "/shifts/time-off",
          description: "Manage vacation and time off",
        },
        {
          title: "Shift Swaps",
          url: "/shifts/swaps",
          description: "Approve shift exchanges",
        },
      ],
    },
    {
      title: "Coverage",
      url: "/coverage",
      icon: UserCheck,
      items: [
        {
          title: "Coverage Analysis",
          url: "/coverage/analysis",
          description: "Analyze shift coverage",
        },
        {
          title: "Gap Detection",
          url: "/coverage/gaps",
          description: "Identify coverage gaps",
        },
        {
          title: "Emergency Coverage",
          url: "/coverage/emergency",
          description: "Manage emergency situations",
        },
      ],
    },
    {
      title: "Reports",
      url: "/reports",
      icon: BarChart3,
      items: [
        {
          title: "Coverage Reports",
          url: "/reports/coverage",
          description: "Shift coverage statistics",
        },
        {
          title: "Staff Utilization",
          url: "/reports/utilization",
          description: "Staff workload analysis",
        },
        {
          title: "Compliance Reports",
          url: "/reports/compliance",
          description: "Regulatory compliance reports",
        },
        {
          title: "Export Data",
          url: "/reports/export",
          description: "Export data to external systems",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/settings/general",
          description: "General application settings",
        },
        {
          title: "Notifications",
          url: "/settings/notifications",
          description: "Configure notifications",
        },
        {
          title: "Integration",
          url: "/settings/integration",
          description: "Third-party integrations",
        },
        {
          title: "Security",
          url: "/settings/security",
          description: "Security and access controls",
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
          title: "Upgrade to Pro",
          icon: Sparkles,
          action: "upgrade"
        }
      ]
    },
    {
      items: [
        {
          title: "Profile",
          icon: UserIcon,
          href: "/profile"
        },
        {
          title: "Account",
          icon: BadgeCheck,
          action: "account"
        },
        {
          title: "Billing",
          icon: CreditCard,
          action: "billing"
        },
        {
          title: "Notifications",
          icon: Bell,
          action: "notifications"
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