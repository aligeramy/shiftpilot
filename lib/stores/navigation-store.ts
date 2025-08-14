import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface NavigationState {
  // Active/expanded states for menu items
  expandedItems: Record<string, boolean>
  activeUrl: string
  
  // Sidebar state
  sidebarOpen: boolean
  
  // Actions
  toggleExpanded: (itemTitle: string) => void
  setExpanded: (itemTitle: string, expanded: boolean) => void
  setActiveUrl: (url: string) => void
  isItemExpanded: (itemTitle: string) => boolean
  isUrlActive: (url: string) => boolean
  
  // Sidebar actions
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
}

const DEFAULT_EXPANDED_ITEMS: Record<string, boolean> = {
  'Dashboard': true, // Dashboard expanded by default
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set, get) => ({
      expandedItems: DEFAULT_EXPANDED_ITEMS,
      activeUrl: '/home',
      sidebarOpen: true, // Default to open
      
      toggleExpanded: (itemTitle: string) => {
        set((state) => ({
          expandedItems: {
            ...state.expandedItems,
            [itemTitle]: !state.expandedItems[itemTitle]
          }
        }))
      },
      
      setExpanded: (itemTitle: string, expanded: boolean) => {
        set((state) => ({
          expandedItems: {
            ...state.expandedItems,
            [itemTitle]: expanded
          }
        }))
      },
      
      setActiveUrl: (url: string) => {
        set({ activeUrl: url })
      },
      
      isItemExpanded: (itemTitle: string) => {
        return get().expandedItems[itemTitle] ?? (DEFAULT_EXPANDED_ITEMS as Record<string, boolean>)[itemTitle] ?? false
      },
      
      isUrlActive: (url: string) => {
        const activeUrl = get().activeUrl
        return activeUrl === url || activeUrl.startsWith(url + '/')
      },
      
      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open })
      },
      
      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }))
      }
    }),
    {
      name: 'navigation-store',
      // Persist sidebar state along with navigation state
      partialize: (state) => ({
        expandedItems: state.expandedItems,
        activeUrl: state.activeUrl,
        sidebarOpen: state.sidebarOpen
      })
    }
  )
)