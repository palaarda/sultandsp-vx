import { create } from 'zustand'
import type { FrontendSettings, BackendSettings } from '@/lib/types'
import { settingsService } from '@/lib/services/settingsService'

interface SettingsState {
  frontend: FrontendSettings
  backend: BackendSettings

  updateFrontend: (updates: Partial<FrontendSettings>) => void
  updateBackend: (updates: Partial<BackendSettings>) => void
  resetAll: () => void
}

const initial = settingsService.getAll()

export const useSettingsStore = create<SettingsState>((set) => ({
  frontend: initial.frontend,
  backend: initial.backend,

  updateFrontend: (updates) => {
    const result = settingsService.updateFrontend(updates)
    set({ frontend: result })
  },

  updateBackend: (updates) => {
    const result = settingsService.updateBackend(updates)
    set({ backend: result })
  },

  resetAll: () => {
    const result = settingsService.resetToDefaults()
    set({ frontend: result.frontend, backend: result.backend })
  },
}))
