import { useRef, useEffect, useCallback, useState } from 'react'
import { useCanvasViewport } from '@/hooks/useCanvasViewport'
import { useSceneStore } from '@/stores/sceneStore'
import { CanvasControls } from './CanvasControls'

interface InfiniteCanvasProps {
  children: React.ReactNode
  initialViewport?: (size: { width: number; height: number }) => {
    x: number; y: number; zoom: number
  }
}

const defaultInitial = (size: { width: number; height: number }) => ({
  x: size.width / 2,
  y: size.height / 2,
  zoom: 1,
})

export function InfiniteCanvas({ children, initialViewport = defaultInitial }: InfiniteCanvasProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const selectNode = useSceneStore((s) => s.selectNode)

  const {
    viewport,
    setViewport,
    isPanning,
    startPan,
    updatePan,
    endPan,
    zoomAtPoint,
    zoomBy,
  } = useCanvasViewport()

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (rect.width > 0 && rect.height > 0) {
      setViewport(initialViewport({ width: rect.width, height: rect.height }))
      setReady(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      e.preventDefault()
      const rect = el.getBoundingClientRect()
      zoomAtPoint(e.clientX - rect.left, e.clientY - rect.top, e.deltaY)
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [zoomAtPoint])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return
      if (e.key === 'Escape') {
        selectNode(null)
        return
      }
      if (e.key === '0') {
        e.preventDefault()
        const el = rootRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        setViewport(initialViewport({ width: rect.width, height: rect.height }))
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setViewport, initialViewport, selectNode])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return
    const t = e.target as HTMLElement
    if (!t.closest('[data-scene-node]')) {
      selectNode(null)
    }
    if (t.closest('button, input, [data-device-control]')) return
    if (t.closest('svg.cursor-ns-resize')) return
    e.preventDefault()
    startPan(e)
  }, [startPan, selectNode])

  const handleReset = useCallback(() => {
    const el = rootRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setViewport(initialViewport({ width: rect.width, height: rect.height }))
  }, [setViewport, initialViewport])

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 overflow-hidden select-none"
      style={{ cursor: isPanning ? 'grabbing' : 'default' }}
      onPointerDown={onPointerDown}
      onPointerMove={updatePan}
      onPointerUp={endPan}
      onPointerCancel={endPan}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(200,155,60,0.45) 1px, transparent 0)',
          backgroundSize: `${24 * viewport.zoom}px ${24 * viewport.zoom}px`,
          backgroundPosition: `${viewport.x}px ${viewport.y}px`,
          opacity: 0.55,
        }}
      />

      <div
        className="absolute select-none"
        style={{
          left: 0,
          top: 0,
          transform: `translate3d(${viewport.x}px, ${viewport.y}px, 0) scale(${viewport.zoom})`,
          transformOrigin: '0 0',
          visibility: ready ? 'visible' : 'hidden',
        }}
      >
        {children}
      </div>

      <CanvasControls
        zoom={viewport.zoom}
        onZoomIn={() => zoomBy(1.2)}
        onZoomOut={() => zoomBy(1 / 1.2)}
        onReset={handleReset}
      />
    </div>
  )
}

function isTypingTarget(t: EventTarget | null): boolean {
  if (!t || !(t instanceof HTMLElement)) return false
  const tag = t.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || t.isContentEditable
}
