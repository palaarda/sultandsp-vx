import { useState, useMemo } from 'react'
import { motion, Reorder, useDragControls } from 'framer-motion'
import { Search, Star, Download, Clock, ChevronRight, Save, GripVertical } from 'lucide-react'
import { useSceneStore } from '@/stores/sceneStore'

interface Preset {
  id: string
  name: string
  category: string
  author: string
  starred: boolean
  date: string
  description: string
  deviceCount: number
}

const mockPresets: Preset[] = [
  { id: '1', name: 'Clean Sparkle', category: 'Clean', author: 'Sultan DSP', starred: true, date: '2026-03-15', description: 'Kristal temiz clean ton', deviceCount: 3 },
  { id: '2', name: 'Crunch Machine', category: 'Crunch', author: 'Sultan DSP', starred: false, date: '2026-03-14', description: 'Klasik British crunch', deviceCount: 4 },
  { id: '3', name: 'High Gain Monster', category: 'High Gain', author: 'Community', starred: true, date: '2026-03-13', description: 'Modern high-gain metal tonu', deviceCount: 5 },
  { id: '4', name: 'Jazz Warm', category: 'Clean', author: 'Sultan DSP', starred: false, date: '2026-03-12', description: 'Sıcak jazz clean tonu', deviceCount: 3 },
  { id: '5', name: 'Metal Rectifier', category: 'High Gain', author: 'Community', starred: false, date: '2026-03-11', description: 'Mesa tipi ağır metal', deviceCount: 6 },
  { id: '6', name: 'Blues Overdrive', category: 'Crunch', author: 'Sultan DSP', starred: true, date: '2026-03-10', description: 'Organik blues overdrive', deviceCount: 4 },
  { id: '7', name: 'Ambient Pad', category: 'Clean', author: 'Community', starred: false, date: '2026-03-09', description: 'Eteryal ambient patchler', deviceCount: 5 },
  { id: '8', name: 'Djent Tone', category: 'High Gain', author: 'Community', starred: false, date: '2026-03-08', description: 'Tight ve percussive djent', deviceCount: 6 },
]

const categories = ['Tümü', 'Clean', 'Crunch', 'High Gain']

export function PresetsPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Tümü')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [presets, setPresets] = useState(mockPresets)
  const sceneNodeCount = useSceneStore((s) => s.nodes.length)  const isReorderable = !search && activeCategory === 'Tümü'

  const filtered = useMemo(() => {
    return presets.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.description.toLowerCase().includes(search.toLowerCase())
      const matchCat = activeCategory === 'Tümü' || p.category === activeCategory
      return matchSearch && matchCat
    })
  }, [presets, search, activeCategory])

  function toggleStar(id: string) {
    setPresets((prev) => prev.map((p) =>
      p.id === id ? { ...p, starred: !p.starred } : p
    ))
  }

  return (
    <div className="w-full h-full p-4 flex flex-col gap-3 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 h-full"
      >
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sultan-text-dim" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Preset ara..."
              className="w-full h-8 pl-8 pr-3 rounded-lg text-xs
                bg-sultan-surface border border-sultan-border
                text-sultan-text placeholder:text-sultan-text-dim
                focus:outline-none focus:border-sultan-accent/40 transition-colors"
            />
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`h-8 px-2.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider
                transition-colors cursor-pointer border
                ${activeCategory === cat
                  ? 'bg-sultan-accent/10 border-sultan-accent/30 text-sultan-accent'
                  : 'bg-sultan-surface border-sultan-border text-sultan-text-dim hover:text-sultan-text'
                }`}
            >
              {cat}
            </button>
          ))}
          {sceneNodeCount > 0 && (
            <button
              className="h-8 px-3 rounded-lg text-[10px] font-semibold
                bg-sultan-accent/10 border border-sultan-accent/30 text-sultan-accent
                hover:bg-sultan-accent/20 cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <Save size={11} />
              Kaydet
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {isReorderable ? (
            <Reorder.Group
              axis="y"
              values={presets}
              onReorder={setPresets}
              className="space-y-1 list-none p-0 m-0"
            >
              {presets.map((preset) => (
                <PresetRow
                  key={preset.id}
                  preset={preset}
                  draggable
                  isSelected={selectedId === preset.id}
                  onSelect={() => setSelectedId(preset.id)}
                  onToggleStar={() => toggleStar(preset.id)}
                />
              ))}
            </Reorder.Group>
          ) : (
            <div className="space-y-1">
              {filtered.map((preset) => (
                <PresetRow
                  key={preset.id}
                  preset={preset}
                  draggable={false}
                  isSelected={selectedId === preset.id}
                  onSelect={() => setSelectedId(preset.id)}
                  onToggleStar={() => toggleStar(preset.id)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-[10px] text-sultan-text-dim shrink-0 pt-1 border-t border-sultan-border">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Download size={10} />
              {filtered.length} preset
            </span>
            <span className="flex items-center gap-1">
              <Clock size={10} />
              Son güncelleme: Bugün
            </span>
            {isReorderable && (
              <span className="flex items-center gap-1 text-sultan-text-muted">
                <GripVertical size={10} />
                Sürükle-bırak ile sırala
              </span>
            )}
          </div>
          <span className="text-sultan-accent">Cloud Sync: Bağlı</span>
        </div>
      </motion.div>
    </div>
  )
}
interface PresetRowProps {
  preset: Preset
  draggable: boolean
  isSelected: boolean
  onSelect: () => void
  onToggleStar: () => void
}

function PresetRow({ preset, draggable, isSelected, onSelect, onToggleStar }: PresetRowProps) {
  const dragControls = useDragControls()

  const rowClass = `flex items-center gap-3 h-11 px-3 rounded-lg cursor-pointer transition-colors
    ${isSelected
      ? 'bg-sultan-accent/10 border border-sultan-accent/20'
      : 'bg-sultan-surface border border-transparent hover:bg-sultan-surface-2'
    }`

  const content = (
    <>
      {draggable && (
        <button
          onPointerDown={(e) => { e.stopPropagation(); dragControls.start(e) }}
          onClick={(e) => e.stopPropagation()}
          className="cursor-grab active:cursor-grabbing text-sultan-text-dim hover:text-sultan-text-muted
            transition-colors touch-none"
          title="Sıralamak için sürükle"
        >
          <GripVertical size={13} />
        </button>
      )}

      <button
        onClick={(e) => { e.stopPropagation(); onToggleStar() }}
        className="cursor-pointer"
      >
        <Star
          size={13}
          className={preset.starred ? 'text-sultan-accent fill-sultan-accent' : 'text-sultan-text-dim'}
        />
      </button>

      <div className="flex-1 min-w-0">
        <span className="text-xs font-medium text-sultan-text block truncate">
          {preset.name}
        </span>
        <span className="text-[9px] text-sultan-text-dim block truncate">
          {preset.description}
        </span>
      </div>

      <span className="text-[10px] text-sultan-text-dim font-mono shrink-0">
        {preset.category}
      </span>

      <span className="text-[9px] text-sultan-text-dim shrink-0">
        {preset.deviceCount} cihaz
      </span>

      <span className="text-[10px] text-sultan-text-dim shrink-0">
        {preset.author}
      </span>

      <ChevronRight size={12} className="text-sultan-text-dim shrink-0" />
    </>
  )

  if (draggable) {
    return (
      <Reorder.Item
        value={preset}
        dragListener={false}
        dragControls={dragControls}
        onClick={onSelect}
        className={`${rowClass} list-none`}
        whileDrag={{
          scale: 1.015,
          boxShadow: '0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(200,155,60,0.3)',
          zIndex: 10,
        }}
        transition={{ type: 'spring', stiffness: 600, damping: 40 }}
        layout
      >
        {content}
      </Reorder.Item>
    )
  }

  return (
    <motion.div
      layout
      onClick={onSelect}
      className={rowClass}
    >
      {content}
    </motion.div>
  )
}
