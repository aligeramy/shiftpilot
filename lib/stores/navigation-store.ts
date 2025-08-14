import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface NavigationState {
  // Active/expanded states for menu items
  expandedItems: Record<string, boolean>
  activeUrl: string
  
  // Actions
  toggleExpanded: (itemTitle: string) => void
  setExpanded: (itemTitle: string, expanded: boolean) => void
  setActiveUrl: (url: string) => void
  isItemExpanded: (itemTitle: string) => boolean
  isUrlActive: (url: string) => boolean
}

const DEFAULT_EXPANDED_ITEMS: Record<string, boolean> = {
  'Dashboard': true, // Dashboard expanded by default
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set, get) => ({
      expandedItems: DEFAULT_EXPANDED_ITEMS,
      activeUrl: '/home',
      
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
      }
    }),
    {
      name: 'navigation-store',
      // Only persist the expanded states and active URL
      partialize: (state) => ({
        expandedItems: state.expandedItems,
        activeUrl: state.activeUrl
      })
    }
  )
)