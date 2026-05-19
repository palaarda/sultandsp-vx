import { create } from 'zustand'
import { favoritesService } from '@/lib/services/favoritesService'

interface FavoritesState {
  favoriteIds: Set<string>
  loaded: boolean

  loadFavorites: () => Promise<void>
  toggleFavorite: (deviceId: string) => Promise<void>
  isFavorite: (deviceId: string) => boolean
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteIds: new Set<string>(),
  loaded: false,

  loadFavorites: async () => {
    const ids = await favoritesService.getFavorites()
    set({ favoriteIds: new Set(ids), loaded: true })
  },

  toggleFavorite: async (deviceId) => {
    const nowFav = await favoritesService.toggleFavorite(deviceId)
    const next = new Set(get().favoriteIds)
    if (nowFav) next.add(deviceId)
    else next.delete(deviceId)
    set({ favoriteIds: next })
  },

  isFavorite: (deviceId) => get().favoriteIds.has(deviceId),
}))
