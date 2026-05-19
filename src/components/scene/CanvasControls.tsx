import { Plus, Minus, Maximize2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface CanvasControlsProps {
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
}

export function CanvasControls({ zoom, onZoomIn, onZoomOut, onReset }: CanvasControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.1 }}
      className="absolute bottom-4 right-4 z-30 flex flex-col items-stretch
        bg-sultan-surface/85 backdrop-blur-md border border-sultan-border rounded-lg
        shadow-lg shadow-black/40 overflow-hidden select-none"
      data-no-pan="true"
    >
      <ControlButton onClick={onZoomIn} title="Yakınlaştır">
        <Plus size={13} />
      </ControlButton>

      <button
        onClick={onReset}
        title="Görünümü sıfırla (100%)"
        className="w-10 h-7 flex items-center justify-center text-[9.5px] font-mono
          text-sultan-text-muted hover:text-sultan-accent hover:bg-sultan-surface-2
          transition-colors cursor-pointer border-y border-sultan-border tabular-nums"
      >
        {Math.round(zoom * 100)}%
      </button>

      <ControlButton onClick={onZoomOut} title="Uzaklaştır">
        <Minus size={13} />
      </ControlButton>

      <div className="border-t border-sultan-border" />

      <ControlButton onClick={onReset} title="Görünümü sıfırla">
        <Maximize2 size={11} />
      </ControlButton>
    </motion.div>
  )
}

function ControlButton({
  onClick,
  title,
  children,
}: {
  onClick: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-10 h-9 flex items-center justify-center text-sultan-text-dim
        hover:text-sultan-accent hover:bg-sultan-surface-2 transition-colors cursor-pointer"
    >
      {children}
    </button>
  )
}
