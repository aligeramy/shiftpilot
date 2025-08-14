import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface NavigationState {
  // Menu expanded states
  expandedItems: Record<string, boolean>
  
  // Sidebar state
  sidebarOpen: boolean
  
  // Actions
  toggleExpanded: (itemTitle: string) => void
  setExpanded: (itemTitle: string, expanded: boolean) => void
  isItemExpanded: (itemTitle: string) => boolean
  
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
      expandedItems: { ...DEFAULT_EXPANDED_ITEMS },
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
      
      isItemExpanded: (itemTitle: string) => {
        const state = get()
        return state.expandedItems[itemTitle] ?? DEFAULT_EXPANDED_ITEMS[itemTitle] ?? false
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
      // Persist both sidebar and menu state
      partialize: (state) => ({
        expandedItems: state.expandedItems,
        sidebarOpen: state.sidebarOpen
      }),
      // Merge function to ensure defaults are always applied
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<NavigationState>
        return {
          ...currentState,
          ...(persisted || {}),
          expandedItems: {
            ...DEFAULT_EXPANDED_ITEMS,
            ...(persisted?.expandedItems || {}),
          },
        }
      },
    }
  )
)