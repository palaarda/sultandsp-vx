import type { AppSettings, FrontendSettings, BackendSettings } from '../types'

const STORAGE_KEY = 'sultandsp-vx-settings'

const DEFAULT_FRONTEND: FrontendSettings = {
  uiScale: 100,
  accentColor: '#c89b3c',
  sidebarCollapsed: false,
  showTooltips: true,
  animationsEnabled: true,
}

const DEFAULT_BACKEND: BackendSettings = {
  sampleRate: 48000,
  bufferSize: 256,
  oversampling: 2,
  latencyCompensation: true,
}

class SettingsService {
  private settings: AppSettings

  constructor() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      this.settings = {
        frontend: { ...DEFAULT_FRONTEND, ...parsed.frontend },
        backend: { ...DEFAULT_BACKEND, ...parsed.backend },
      }
    } else {
      this.settings = {
        frontend: { ...DEFAULT_FRONTEND },
        backend: { ...DEFAULT_BACKEND },
      }
    }
  }

  private persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings))
  }

  getAll(): AppSettings {
    return { ...this.settings }
  }

  getFrontend(): FrontendSettings {
    return { ...this.settings.frontend }
  }

  getBackend(): BackendSettings {
    return { ...this.settings.backend }
  }

  updateFrontend(updates: Partial<FrontendSettings>): FrontendSettings {
    this.settings.frontend = { ...this.settings.frontend, ...updates }
    this.persist()
    return this.settings.frontend
  }

  
  updateBackend(updates: Partial<BackendSettings>): BackendSettings {
    this.settings.backend = { ...this.settings.backend, ...updates }
    this.persist()
    return this.settings.backend
  }

  resetToDefaults(): AppSettings {
    this.settings = {
      frontend: { ...DEFAULT_FRONTEND },
      backend: { ...DEFAULT_BACKEND },
    }
    this.persist()
    return this.settings
  }
}

export const settingsService = new SettingsService()
