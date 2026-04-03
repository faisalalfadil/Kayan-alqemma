import { create } from 'zustand'

interface AdminState {
  isOpen: boolean
  isAuthenticated: boolean
  activeTab: string
  refreshTrigger: number

  toggle: () => void
  open: () => void
  close: () => void
  login: (password: string) => boolean
  logout: () => void
  setActiveTab: (tab: string) => void
  triggerRefresh: () => void
}

export const useAdminStore = create<AdminState>((set) => ({
  isOpen: false,
  isAuthenticated: false,
  activeTab: 'dashboard',
  refreshTrigger: 0,

  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  login: (password: string) => {
    if (password === 'admin123' || password === 'كيان2025') {
      set({ isAuthenticated: true })
      return true
    }
    return false
  },
  logout: () => set({ isAuthenticated: false, activeTab: 'dashboard' }),
  setActiveTab: (tab: string) => set({ activeTab: tab }),
  triggerRefresh: () =>
    set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}))
