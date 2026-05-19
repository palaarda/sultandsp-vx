import { useEffect, useRef } from 'react'

interface VuMeterProps {
  level: number
  peak?: number
  width?: number
  height?: number
  orientation?: 'vertical' | 'horizontal'
  label?: string
}

export function VuMeter({
  level,
  peak,
  width = 12,
  height = 120,
  orientation = 'vertical',
  label,
}: VuMeterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const smoothLevel = useRef(0)
  const smoothPeak = useRef(0)
  const peakHold = useRef(0)
  const peakTimer = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    function draw() {
      if (!ctx) return

      smoothLevel.current += (level - smoothLevel.current) * 0.15
      const currentPeak = peak ?? level
      if (currentPeak >= smoothPeak.current) {
        smoothPeak.current = currentPeak
        peakTimer.current = 30
      } else if (peakTimer.current > 0) {
        peakTimer.current--
      } else {
        smoothPeak.current += (currentPeak - smoothPeak.current) * 0.05
      }

      ctx.clearRect(0, 0, width, height)

      const segments = 24
      const segHeight = (height - (segments - 1)) / segments
      const gap = 1
      const activeSegments = Math.floor(smoothLevel.current * segments)
      const peakSegment = Math.floor(smoothPeak.current * segments)

      for (let i = 0; i < segments; i++) {
        const y = height - (i + 1) * (segHeight + gap)
        const ratio = i / segments

        let color: string
        if (ratio > 0.85) color = '#e24a4a'
        else if (ratio > 0.65) color = '#e2c83a'
        else color = '#3ae26a'

        if (i < activeSegments) {
          ctx.fillStyle = color
          ctx.globalAlpha = 0.9
        } else if (i === peakSegment) {
          ctx.fillStyle = color
          ctx.globalAlpha = 0.7
        } else {
          ctx.fillStyle = '#1a1a22'
          ctx.globalAlpha = 1
        }

        ctx.fillRect(0, y, width, segHeight)
      }

      ctx.globalAlpha = 1
      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  }, [level, peak, width, height, orientation])

  return (
    <div className="flex flex-col items-center gap-1">
      <canvas
        ref={canvasRef}
        style={{ width, height }}
        className="rounded-sm"
      />
      {label && (
        <span className="text-[8px] text-sultan-text-dim uppercase tracking-wider">
          {label}
        </span>
      )}
    </div>
  )
}
