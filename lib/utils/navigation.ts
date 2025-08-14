import { NAVIGATION_CONFIG } from "@/lib/constants/navigation"

/**
 * Get navigation item by URL
 */
export const getNavItemByUrl = (url: string) => {
  return NAVIGATION_CONFIG.navMain.find(item => 
    item.url === url || item.items?.some(subItem => subItem.url === url)
  )
}

/**
 * Generate breadcrumb items for a given URL
 */
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