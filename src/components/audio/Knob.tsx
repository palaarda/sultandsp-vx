import { useRef, useCallback, useState } from 'react'
import { motion } from 'framer-motion'

interface KnobProps {
  value: number
  min?: number
  max?: number
  size?: number
  label?: string
  unit?: string
  onChange?: (value: number) => void
  color?: string
  showArc?: boolean
  labelColor?: string
  labelWeight?: 'normal' | 'bold'
  valueColor?: string
}

const MIN_ANGLE = -135
const MAX_ANGLE = 135
const TOTAL_ARC = MAX_ANGLE - MIN_ANGLE

export function Knob({
  value,
  min = 0,
  max = 100,
  size = 64,
  label,
  unit = '',
  onChange,
  color = '#c89b3c',
  showArc = true,
  labelColor,
  labelWeight = 'normal',
  valueColor,
}: KnobProps) {
  const knobRef = useRef<SVGSVGElement>(null)
  const dragRef = useRef({ dragging: false, startY: 0, startValue: 0 })
  const [hovering, setHovering] = useState(false)
  const [dragging, setDragging] = useState(false)

  const normalizedValue = (value - min) / (max - min)
  const angle = MIN_ANGLE + normalizedValue * TOTAL_ARC

  const center = size / 2
  const radius = showArc ? size / 2 - 6 : size / 2 - 1
  const trackRadius = radius - 2

  function polarToCartesian(cx: number, cy: number, r: number, deg: number) {
    const rad = ((deg - 90) * Math.PI) / 180
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }

  function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
    const start = polarToCartesian(cx, cy, r, endAngle)
    const end = polarToCartesian(cx, cy, r, startAngle)
    const largeArc = endAngle - startAngle <= 180 ? 0 : 1
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`
  }

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragRef.current = { dragging: true, startY: e.clientY, startValue: value }
    setDragging(true)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [value])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.dragging) return
    const dy = dragRef.current.startY - e.clientY
    const sensitivity = e.shiftKey ? 600 : 200
    const range = max - min
    const newValue = Math.min(max, Math.max(min, dragRef.current.startValue + (dy / sensitivity) * range))
    onChange?.(Math.round(newValue * 10) / 10)
  }, [min, max, onChange])

  const handlePointerUp = useCallback(() => {
    dragRef.current.dragging = false
    setDragging(false)
  }, [])

  const handleDoubleClick = useCallback(() => {
    onChange?.((min + max) / 2)
  }, [min, max, onChange])

  const indicatorOuter = showArc ? radius - 10 : radius - 2
  const indicatorInner = showArc ? radius - 18 : radius - radius * 0.55
  const indicatorEnd = polarToCartesian(center, center, indicatorOuter, angle)
  const indicatorStart = polarToCartesian(center, center, indicatorInner, angle)

  return (
    <div className="relative flex flex-col items-center select-none" data-device-control>
      <svg
        ref={knobRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="cursor-ns-resize"
        data-device-control
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <defs>
          <filter id={`glow-${label}`}>
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id={`knob-bg-${label}`} cx="40%" cy="35%">
            <stop offset="0%" stopColor="#2a2a34" />
            <stop offset="100%" stopColor="#141418" />
          </radialGradient>
        </defs>

        {showArc && (
          <>
            <circle cx={center} cy={center} r={radius + 1} fill="none" stroke="#000" strokeWidth="1" opacity="0.3" />

            <path
              d={describeArc(center, center, trackRadius, MIN_ANGLE, MAX_ANGLE)}
              fill="none"
              stroke="#1a1a22"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {normalizedValue > 0.005 && (
              <path
                d={describeArc(center, center, trackRadius, MIN_ANGLE, angle)}
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                opacity={dragging ? 1 : 0.8}
                filter={hovering || dragging ? `url(#glow-${label})` : undefined}
              />
            )}
          </>
        )}

        <circle
          cx={center}
          cy={center}
          r={showArc ? radius - 6 : radius}
          fill={`url(#knob-bg-${label})`}
        />
        <circle
          cx={center}
          cy={center}
          r={showArc ? radius - 6 : radius}
          fill="none"
          stroke="#333340"
          strokeWidth="0.5"
        />

        <line
          x1={indicatorStart.x}
          y1={indicatorStart.y}
          x2={indicatorEnd.x}
          y2={indicatorEnd.y}
          stroke={color}
          strokeWidth={showArc ? 2 : Math.max(2, size * 0.06)}
          strokeLinecap="round"
          opacity={dragging ? 1 : 0.9}
        />

        {showArc && (
          <>
            {[0, 0.25, 0.5, 0.75, 1].map((t) => {
              const tickAngle = MIN_ANGLE + t * TOTAL_ARC
              const outer = polarToCartesian(center, center, radius, tickAngle)
              const inner = polarToCartesian(center, center, radius - 3, tickAngle)
              return (
                <line
                  key={t}
                  x1={inner.x}
                  y1={inner.y}
                  x2={outer.x}
                  y2={outer.y}
                  stroke="#444"
                  strokeWidth="0.7"
                />
              )
            })}
          </>
        )}
      </svg>

      {(hovering || dragging) ? (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute left-1/2 -translate-x-1/2 top-full mt-1
            text-[10px] font-mono tabular-nums whitespace-nowrap pointer-events-none
            ${valueColor ? '' : 'text-sultan-accent'}`}
          style={valueColor ? { color: valueColor } : undefined}
        >
          {value.toFixed(1)}{unit}
        </motion.span>
      ) : label ? (
        <span
          className={`absolute left-1/2 -translate-x-1/2 top-full mt-1
            text-[9px] uppercase tracking-wider whitespace-nowrap pointer-events-none
            ${labelColor ? '' : 'text-sultan-text-dim'}
            ${labelWeight === 'bold' ? 'font-bold' : ''}`}
          style={labelColor ? { color: labelColor } : undefined}
        >
          {label}
        </span>
      ) : null}
    </div>
  )
}
