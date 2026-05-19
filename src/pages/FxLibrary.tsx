import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Star, Grid3X3, List } from 'lucide-react'
import type { FxCategory, FxDevice } from '@/lib/types'
import { fxService } from '@/lib/services/fxService'
import { useSceneStore } from '@/stores/sceneStore'
import { useFavoritesStore } from '@/stores/favoritesStore'
import { CategoryList } from '@/components/fx/CategoryList'
import { DeviceCard } from '@/components/fx/DeviceCard'
import { AddNamCard } from '@/components/fx/AddNamCard'

type ViewMode = 'grid' | 'list'

export function FxLibrary() {
  const [categories, setCategories] = useState<FxCategory[]>([])
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null)
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  const addDevice = useSceneStore((s) => s.addDevice)
  const { favoriteIds, toggleFavorite, loadFavorites, loaded } = useFavoritesStore()

  useEffect(() => {
    fxService.getLibrary().then(setCategories)
    if (!loaded) loadFavorites()
  }, [loaded, loadFavorites])

  const devices = useMemo(() => {
    let result: FxDevice[] = []

    if (selectedCatId && selectedSubId) {
      const cat = categories.find((c) => c.id === selectedCatId)
      const sub = cat?.subcategories.find((s) => s.id === selectedSubId)
      result = sub?.devices || []
    } else if (selectedCatId) {
      const cat = categories.find((c) => c.id === selectedCatId)
      result = cat?.subcategories.flatMap((s) => s.devices) || []
    } else {
      result = categories.flatMap((c) => c.subcategories.flatMap((s) => s.devices))
    }

    if (search) {
      const q = search.toLowerCase()
      result = result.filter((d) =>
        d.name.toLowerCase().includes(q) ||
        d.brand.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    if (showFavoritesOnly) {
      result = result.filter((d) => favoriteIds.has(d.id))
    }

    return result
  }, [categories, selectedCatId, selectedSubId, search, showFavoritesOnly, favoriteIds])
  const showNamCard = useMemo(() => {
    if (search || showFavoritesOnly) return false
    if (!selectedCatId) return false
    return selectedCatId === 'amps'
  }, [selectedCatId, search, showFavoritesOnly])

  function handleSelectCategory(id: string) {
    if (selectedCatId === id) {
      setSelectedCatId(null)
      setSelectedSubId(null)
    } else {
      setSelectedCatId(id)
      const cat = categories.find((c) => c.id === id)
      if (cat && cat.subcategories.length === 1) {
        setSelectedSubId(cat.subcategories[0].id)
      } else {
        setSelectedSubId(null)
      }
    }
  }

  function handleSelectSubcategory(catId: string, subId: string) {
    setSelectedCatId(catId)
    setSelectedSubId(selectedSubId === subId ? null : subId)
  }

  async function handleAddToScene(device: FxDevice) {
    await addDevice(device)
  }

  return (
    <div className="w-full h-full flex overflow-hidden">
      <div className="w-[180px] shrink-0 border-r border-sultan-border p-3 overflow-y-auto">
        <h3 className="text-[10px] font-bold text-sultan-text-dim uppercase tracking-wider mb-3">
          Kategoriler
        </h3>
        <CategoryList
          categories={categories}
          selectedCategoryId={selectedCatId}
          selectedSubcategoryId={selectedSubId}
          onSelectCategory={handleSelectCategory}
          onSelectSubcategory={handleSelectSubcategory}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden p-3">
        <div className="flex items-center gap-2 mb-3 shrink-0">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sultan-text-dim" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cihaz ara..."
              className="w-full h-8 pl-8 pr-3 rounded-lg text-xs
                bg-sultan-surface border border-sultan-border
                text-sultan-text placeholder:text-sultan-text-dim
                focus:outline-none focus:border-sultan-accent/40 transition-colors"
            />
          </div>

          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`h-8 px-2.5 rounded-lg border text-[10px] font-semibold
              transition-colors cursor-pointer flex items-center gap-1.5
              ${showFavoritesOnly
                ? 'bg-sultan-accent/10 border-sultan-accent/30 text-sultan-accent'
                : 'bg-sultan-surface border-sultan-border text-sultan-text-dim hover:text-sultan-text'
              }`}
          >
            <Star size={11} className={showFavoritesOnly ? 'fill-sultan-accent' : ''} />
            Favoriler
          </button>

          <div className="flex items-center border border-sultan-border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`w-8 h-8 flex items-center justify-center cursor-pointer transition-colors
                ${viewMode === 'grid' ? 'bg-sultan-surface-3 text-sultan-text' : 'text-sultan-text-dim hover:text-sultan-text'}`}
            >
              <Grid3X3 size={13} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`w-8 h-8 flex items-center justify-center cursor-pointer transition-colors
                ${viewMode === 'list' ? 'bg-sultan-surface-3 text-sultan-text' : 'text-sultan-text-dim hover:text-sultan-text'}`}
            >
              <List size={13} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-2 text-[10px] text-sultan-text-dim shrink-0">
          <button
            onClick={() => { setSelectedCatId(null); setSelectedSubId(null) }}
            className="hover:text-sultan-text cursor-pointer transition-colors"
          >
            Tümü
          </button>
          {selectedCatId && (
            <>
              <span>/</span>
              <button
                onClick={() => {
                  const cat = categories.find((c) => c.id === selectedCatId)
                  if (cat && cat.subcategories.length === 1) {
                    setSelectedSubId(cat.subcategories[0].id)
                  } else {
                    setSelectedSubId(null)
                  }
                }}
                className="hover:text-sultan-text cursor-pointer transition-colors"
              >
                {categories.find((c) => c.id === selectedCatId)?.name}
              </button>
            </>
          )}
          {selectedSubId && (() => {
            const cat = categories.find((c) => c.id === selectedCatId)
            if (cat && cat.subcategories.length <= 1) return null
            return (
              <>
                <span>/</span>
                <span className="text-sultan-text">
                  {cat?.subcategories.find((s) => s.id === selectedSubId)?.name}
                </span>
              </>
            )
          })()}
          <span className="ml-auto font-mono">{devices.length} cihaz</span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {devices.length === 0 && !showNamCard ? (
            <div className="flex items-center justify-center h-full text-xs text-sultan-text-dim">
              {showFavoritesOnly
                ? 'Henüz favori cihaz eklenmemiş.'
                : 'Bu kategoride cihaz bulunamadı.'}
            </div>
          ) : viewMode === 'grid' ? (
            <motion.div
              className="grid gap-2.5"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.03 } },
              }}
            >
              {showNamCard && <AddNamCard />}
              {devices.map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  isFavorite={favoriteIds.has(device.id)}
                  onToggleFavorite={() => toggleFavorite(device.id)}
                  onAddToScene={() => handleAddToScene(device)}
                />
              ))}
            </motion.div>
          ) : (
            <div className="space-y-1">
              {devices.map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  isFavorite={favoriteIds.has(device.id)}
                  onToggleFavorite={() => toggleFavorite(device.id)}
                  onAddToScene={() => handleAddToScene(device)}
                  compact
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
