import type { IFavoritesService } from '../types'

const STORAGE_KEY = 'sultandsp-vx-favorites'

class LocalFavoritesService implements IFavoritesService {
  private favorites: Set<string>

  constructor() {
    const stored = localStorage.getItem(STORAGE_KEY)
    this.favorites = new Set(stored ? JSON.parse(stored) : [])
  }

  private persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...this.favorites]))
  }

  async getFavorites(): Promise<string[]> {
    return [...this.favorites]
  }

  async addFavorite(deviceId: string): Promise<void> {
    this.favorites.add(deviceId)
    this.persist()
  }

  async removeFavorite(deviceId: string): Promise<void> {
    this.favorites.delete(deviceId)
    this.persist()
  }

  async isFavorite(deviceId: string): Promise<boolean> {
    return this.favorites.has(deviceId)
  }

  async toggleFavorite(deviceId: string): Promise<boolean> {
    if (this.favorites.has(deviceId)) {
      this.favorites.delete(deviceId)
      this.persist()
      return false
    } else {
      this.favorites.add(deviceId)
      this.persist()
      return true
    }
  }
}

export const favoritesService = new LocalFavoritesService()
