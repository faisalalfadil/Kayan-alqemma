import { useEffect } from 'react'
import { create } from 'zustand'

interface SiteSettings {
  id: string
  siteName: string
  phone: string
  email: string
  address: string
  workingHours: string
  whatsapp: string
  twitter: string
  instagram: string
  linkedin: string
  description: string
  chatbotPrompt: string
}

interface SettingsStore {
  settings: SiteSettings | null
  loading: boolean
  fetchSettings: () => Promise<void>
}

const DEFAULT_SETTINGS: SiteSettings = {
  id: 'default',
  siteName: 'شركة كيان القمة',
  phone: '+966 50 123 4567',
  email: 'info@kayan-alaqma.sa',
  address: 'طريق الملك فهد، حي العليا، الرياض',
  workingHours: 'السبت - الخميس: 8 صباحًا - 6 مساءً',
  whatsapp: '966501234567',
  twitter: 'https://twitter.com/kayan_alaqma',
  instagram: 'https://instagram.com/kayan_alaqma',
  linkedin: 'https://linkedin.com/company/kayan-alaqma',
  description: 'شركة كيان القمة رائدة في توريد وتركيب المظلات الكهربائية',
  chatbotPrompt: '',
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: null,
  loading: false,
  fetchSettings: async () => {
    if (get().settings) return
    set({ loading: true })
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      if (data.success && data.data) {
        set({ settings: data.data, loading: false })
      } else {
        set({ settings: DEFAULT_SETTINGS, loading: false })
      }
    } catch {
      set({ settings: DEFAULT_SETTINGS, loading: false })
    }
  },
}))

// Convenience hook with auto-fetch using useEffect
export function useSettings() {
  const settings = useSettingsStore((s) => s.settings)
  const loading = useSettingsStore((s) => s.loading)
  const fetchSettings = useSettingsStore((s) => s.fetchSettings)

  useEffect(() => {
    if (!settings && !loading) {
      fetchSettings()
    }
  }, [settings, loading, fetchSettings])

  return {
    settings: settings || DEFAULT_SETTINGS,
    loading,
    refetch: fetchSettings,
    phone: (settings || DEFAULT_SETTINGS).phone,
    whatsapp: (settings || DEFAULT_SETTINGS).whatsapp,
    email: (settings || DEFAULT_SETTINGS).email,
    siteName: (settings || DEFAULT_SETTINGS).siteName,
  }
}
