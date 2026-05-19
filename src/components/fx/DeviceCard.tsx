import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Plus, Zap, Speaker, Server, Footprints, Mic } from 'lucide-react'
import type { FxDevice, DeviceType, IconComponent } from '@/lib/types'
import { getDeviceLayout } from '@/lib/data/deviceLayouts'

const typeIcons: Record<DeviceType, IconComponent> = {
  pedal: Footprints,
  amp: Zap,
  cab: Speaker,
  rack: Server,
  mic: Mic,
  utility: Server,
}

const typeLabels: Record<DeviceType, string> = {
  pedal: 'Pedal',
  amp: 'Amp',
  cab: 'Cabinet',
  rack: 'Rack',
  mic: 'Mic',
  utility: 'Utility',
}

interface DeviceCardProps {
  device: FxDevice
  isFavorite: boolean
  onToggleFavorite: () => void
  onAddToScene: () => void
  compact?: boolean
}

export function DeviceCard({
  device,
  isFavorite,
  onToggleFavorite,
  onAddToScene,
  compact = false,
}: DeviceCardProps) {
  const Icon = typeIcons[device.type] || Server
  const layout = getDeviceLayout(device.id)
  const [hover, setHover] = useState(false)
  if (compact) {
    return (
      <div
        className="relative flex items-center gap-2 h-10 px-2 rounded-lg
          bg-sultan-surface border border-sultan-border
          hover:border-sultan-border-light transition-colors group"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <DeviceThumbnail device={device} layout={layout} size={28} />

        <div className="flex-1 min-w-0">
          <span className="text-xs text-sultan-text truncate block">{device.name}</span>
          <span className="text-[9px] text-sultan-text-dim font-mono">{device.brand}</span>
        </div>

        <span
          className="text-[8px] font-mono px-1.5 py-0.5 rounded shrink-0"
          style={{
            backgroundColor: `${device.color || '#888'}15`,
            color: device.color || '#888',
          }}
        >
          {typeLabels[device.type]}
        </span>

        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite() }}
          className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1"
        >
          <Star size={12} className={isFavorite ? 'text-sultan-accent fill-sultan-accent' : 'text-sultan-text-dim'} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onAddToScene() }}
          className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer
            w-6 h-6 rounded-md flex items-center justify-center
            bg-sultan-accent/10 text-sultan-accent hover:bg-sultan-accent/20"
          title="Sahneye ekle"
        >
          <Plus size={12} />
        </button>

        <AnimatePresence>
          {hover && layout && <HoverPreview device={device} layout={layout} side="right" />}
        </AnimatePresence>
      </div>
    )
  }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative bg-sultan-surface border border-sultan-border rounded-xl overflow-hidden
        hover:border-sultan-accent/30 transition-colors cursor-pointer group"
    >
      <div
        className="relative w-full overflow-hidden flex items-center justify-center"
        style={{
          height: 96,
          background: layout
            ? `radial-gradient(ellipse at center, ${device.color || '#c89b3c'}12 0%, transparent 65%), #0c0c10`
            : `linear-gradient(180deg, ${device.color || '#c89b3c'}10 0%, transparent 100%)`,
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)',
            backgroundSize: '12px 12px',
          }}
        />

        <DeviceThumbnail device={device} layout={layout} size={84} hero />

        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite() }}
          className="absolute top-1.5 right-1.5 cursor-pointer p-1 rounded-full
            hover:bg-black/40 transition-colors"
        >
          <Star
            size={13}
            className={isFavorite
              ? 'text-sultan-accent fill-sultan-accent'
              : 'text-sultan-text-dim opacity-0 group-hover:opacity-100 transition-opacity'
            }
          />
        </button>

        <span
          className="absolute top-1.5 left-1.5 text-[9px] font-bold uppercase tracking-wider
            px-1.5 py-0.5 rounded-md backdrop-blur-sm"
          style={{
            backgroundColor: `${device.color || '#888'}25`,
            color: device.color || '#888',
            border: `0.5px solid ${device.color || '#888'}40`,
          }}
        >
          {typeLabels[device.type]}
        </span>
      </div>

      <div className="p-2.5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-semibold text-sultan-text truncate">{device.name}</h3>
            <p className="text-[10px] text-sultan-text-dim font-mono truncate">{device.brand}</p>
          </div>
        </div>

        <p className="text-[10px] text-sultan-text-dim leading-relaxed line-clamp-2 mb-2 min-h-[26px]">
          {device.description}
        </p>

        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 flex-wrap min-w-0">
            {device.params.slice(0, 3).map((p) => (
              <span key={p.id} className="text-[8px] text-sultan-text-dim bg-sultan-surface-2 px-1.5 py-0.5 rounded truncate">
                {p.name}
              </span>
            ))}
            {device.params.length > 3 && (
              <span className="text-[8px] text-sultan-text-dim">+{device.params.length - 3}</span>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); onAddToScene() }}
            className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-md
              bg-sultan-accent/10 text-sultan-accent text-[10px] font-medium
              hover:bg-sultan-accent/20 transition-colors cursor-pointer"
          >
            <Plus size={10} />
            Ekle
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {hover && layout && <HoverPreview device={device} layout={layout} side="right" />}
      </AnimatePresence>
    </motion.div>
  )
}

function DeviceThumbnail({
  device,
  layout,
  size,
  hero = false,
}: {
  device: FxDevice
  layout: ReturnType<typeof getDeviceLayout>
  size: number
  hero?: boolean
}) {
  if (layout) {
    return (
      <img
        src={layout.image}
        alt={device.name}
        draggable={false}
        className="object-contain pointer-events-none"
        style={{
          maxHeight: hero ? size : size,
          maxWidth: hero ? 'none' : size,
          height: 'auto',
          width: 'auto',
          filter: hero
            ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))'
            : 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
        }}
      />
    )
  }
  const Icon = typeIcons[device.type] || Server
  const boxSize = hero ? 56 : size
  const iconSize = hero ? 28 : Math.floor(size * 0.55)

  return (
    <div
      className="rounded-lg flex items-center justify-center shrink-0"
      style={{
        width: boxSize,
        height: boxSize,
        backgroundColor: `${device.color || '#888'}20`,
        border: `1px solid ${device.color || '#888'}30`,
      }}
    >
      <Icon size={iconSize} style={{ color: device.color || '#888' }} />
    </div>
  )
}

function HoverPreview({
  device,
  layout,
  side = 'right',
}: {
  device: FxDevice
  layout: NonNullable<ReturnType<typeof getDeviceLayout>>
  side?: 'right' | 'left'
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, x: side === 'right' ? -8 : 8 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15, delay: 0.25 }}
      className={`absolute top-1/2 -translate-y-1/2 z-50 pointer-events-none
        ${side === 'right' ? 'left-full ml-2' : 'right-full mr-2'}`}
    >
      <div
        className="bg-sultan-surface border border-sultan-accent/30 rounded-xl shadow-2xl shadow-black/60
          p-3 w-[240px]"
      >
        <div
          className="relative w-full rounded-lg overflow-hidden mb-2 flex items-center justify-center"
          style={{
            height: 140,
            background: `radial-gradient(ellipse at center, ${device.color || '#c89b3c'}15 0%, transparent 70%), #0a0a0e`,
          }}
        >
          <img
            src={layout.image}
            alt={device.name}
            draggable={false}
            className="max-h-full max-w-full object-contain"
            style={{ filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.6))' }}
          />
        </div>

        <h4 className="text-xs font-bold text-sultan-text mb-0.5">{device.name}</h4>
        <p className="text-[10px] text-sultan-text-dim font-mono mb-1.5">{device.brand}</p>
        <p className="text-[10px] text-sultan-text-muted leading-relaxed mb-2">
          {device.description}
        </p>

        <div className="border-t border-sultan-border pt-2 mb-2">
          <span className="text-[9px] font-bold uppercase tracking-wider text-sultan-text-dim block mb-1">
            Parametreler
          </span>
          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
            {device.params.map((p) => (
              <span key={p.id} className="text-[10px] text-sultan-text-muted truncate">
                <span className="text-sultan-text-dim">·</span> {p.name}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {device.tags.slice(0, 6).map((tag) => (
            <span
              key={tag}
              className="text-[8px] text-sultan-text-dim bg-sultan-surface-2 px-1.5 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
