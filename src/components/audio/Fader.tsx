import { useRef, useCallback, useState } from 'react'
import { motion } from 'framer-motion'

interface FaderProps {
  value: number
  min?: number
  max?: number
  height?: number
  label?: string
  unit?: string
  onChange?: (value: number) => void
}

export function Fader({
  value,
  min = 0,
  max = 100,
  height = 120,
  label,
  unit = '',
  onChange,
}: FaderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)

  const normalized = (value - min) / (max - min)

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    setDragging(true)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    updateValue(e)
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return
    updateValue(e)
  }, [dragging])

  const handlePointerUp = useCallback(() => {
    setDragging(false)
  }, [])

  function updateValue(e: React.PointerEvent) {
    const track = trackRef.current
    if (!track) return
    const rect = track.getBoundingClientRect()
    const y = 1 - Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
    const newValue = min + y * (max - min)
    onChange?.(Math.round(newValue * 10) / 10)
  }

  return (
    <div className="flex flex-col items-center gap-1.5 select-none">
      <div
        ref={trackRef}
        className="relative cursor-ns-resize"
        style={{ width: 24, height }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="absolute left-1/2 -translate-x-1/2 w-[3px] h-full rounded-full bg-sultan-surface-3">
          <div
            className="absolute bottom-0 w-full rounded-full bg-sultan-accent/60"
            style={{ height: `${normalized * 100}%` }}
          />
        </div>

        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <div
            key={t}
            className="absolute w-2 h-px bg-sultan-border-light"
            style={{
              bottom: `${t * 100}%`,
              left: 0,
            }}
          />
        ))}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <div
            key={`r-${t}`}
            className="absolute w-2 h-px bg-sultan-border-light"
            style={{
              bottom: `${t * 100}%`,
              right: 0,
            }}
          />
        ))}

        <div
          className="absolute left-1/2 -translate-x-1/2 w-5 h-3 rounded-sm transition-shadow"
          style={{
            bottom: `calc(${normalized * 100}% - 6px)`,
            background: 'linear-gradient(180deg, #3a3a44 0%, #28282e 100%)',
            boxShadow: dragging
              ? '0 0 8px rgba(200,155,60,0.3), 0 2px 4px rgba(0,0,0,0.5)'
              : '0 2px 4px rgba(0,0,0,0.4)',
            borderTop: '1px solid #555',
          }}
        >
          <div className="w-3 h-px bg-sultan-accent/40 mx-auto mt-[5px] rounded-full" />
        </div>
      </div>

      {dragging ? (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] font-mono text-sultan-accent tabular-nums"
        >
          {value.toFixed(1)}{unit}
        </motion.span>
      ) : label ? (
        <span className="text-[9px] text-sultan-text-dim uppercase tracking-wider">{label}</span>
      ) : null}
    </div>
  )
}
