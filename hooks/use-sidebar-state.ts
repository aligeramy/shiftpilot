"use client"

import { useCallback, useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { useNavigationStore } from "@/lib/stores/navigation-store"

export function useSidebarState() {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = useState(false)
  
  // Get sidebar state from Zustand store
  const { sidebarOpen, setSidebarOpen, toggleSidebar: storeToggleSidebar } = useNavigationStore()
  
  // For desktop, use store state; for mobile, use local state
  const open = isMobile ? openMobile : sidebarOpen
  
  const setOpen = useCallback((value: boolean | ((value: boolean) => boolean)) => {
    const openState = typeof value === "function" ? value(open) : value
    
    if (isMobile) {
      setOpenMobile(openState)
    } else {
      setSidebarOpen(openState)
    }
  }, [isMobile, open, setSidebarOpen])

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile((prev) => !prev)
    } else {
      storeToggleSidebar()
    }
  }, [isMobile, storeToggleSidebar])

  // State for sidebar UI
  const state = open ? "expanded" : "collapsed"

  return {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  }
}

export type SidebarState = ReturnType<typeof useSidebarState>
