import { useState, useCallback, useRef, useEffect } from 'react'
import { blockSceneClicksBriefly } from '@/lib/panClickGuard'

export interface Viewport {
  x: number
  y: number
  zoom: number
}

export const MIN_ZOOM = 0.3
export const MAX_ZOOM = 3.0

interface PanState {
  pointerId: number
  startScreenX: number
  startScreenY: number
  startPanX: number
  startPanY: number
  moved: boolean
}

export function useCanvasViewport(initial: Partial<Viewport> = {}) {
  const [viewport, setViewport] = useState<Viewport>({
    x: initial.x ?? 0,
    y: initial.y ?? 0,
    zoom: initial.zoom ?? 1,
  })

  const viewportRef = useRef(viewport)
  useEffect(() => { viewportRef.current = viewport }, [viewport])

  const panRef = useRef<PanState | null>(null)
  const [isPanning, setIsPanning] = useState(false)

  const startPan = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    panRef.current = {
      pointerId: e.pointerId,
      startScreenX: e.clientX,
      startScreenY: e.clientY,
      startPanX: viewportRef.current.x,
      startPanY: viewportRef.current.y,
      moved: false,
    }
    setIsPanning(true)
    document.body.style.userSelect = 'none'
    try {
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    } catch { /* ignore */ }
  }, [])

  const updatePan = useCallback((e: React.PointerEvent) => {
    const p = panRef.current
    if (!p || p.pointerId !== e.pointerId) return
    const dx = e.clientX - p.startScreenX
    const dy = e.clientY - p.startScreenY
    if (dx * dx + dy * dy > 16) p.moved = true
    setViewport((v) => ({
      ...v,
      x: p.startPanX + e.clientX - p.startScreenX,
      y: p.startPanY + e.clientY - p.startScreenY,
    }))
  }, [])

  const endPan = useCallback((e: React.PointerEvent) => {
    const p = panRef.current
    if (!p || p.pointerId !== e.pointerId) return
    if (p.moved) blockSceneClicksBriefly()
    panRef.current = null
    setIsPanning(false)
    document.body.style.userSelect = ''
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch { /* ignore */ }
  }, [])

  const zoomAtPoint = useCallback((screenX: number, screenY: number, deltaY: number) => {
    setViewport((v) => {
      const factor = Math.exp(-deltaY / 1000)
      const newZoom = clamp(v.zoom * factor, MIN_ZOOM, MAX_ZOOM)
      const wx = (screenX - v.x) / v.zoom
      const wy = (screenY - v.y) / v.zoom
      return {
        x: screenX - wx * newZoom,
        y: screenY - wy * newZoom,
        zoom: newZoom,
      }
    })
  }, [])

  const zoomBy = useCallback((factor: number, anchorScreenX?: number, anchorScreenY?: number) => {
    setViewport((v) => {
      const newZoom = clamp(v.zoom * factor, MIN_ZOOM, MAX_ZOOM)
      if (anchorScreenX === undefined || anchorScreenY === undefined) {
        return { ...v, zoom: newZoom }
      }
      const wx = (anchorScreenX - v.x) / v.zoom
      const wy = (anchorScreenY - v.y) / v.zoom
      return {
        x: anchorScreenX - wx * newZoom,
        y: anchorScreenY - wy * newZoom,
        zoom: newZoom,
      }
    })
  }, [])

  const setZoom = useCallback((zoom: number) => {
    setViewport((v) => ({ ...v, zoom: clamp(zoom, MIN_ZOOM, MAX_ZOOM) }))
  }, [])

  const setPan = useCallback((x: number, y: number) => {
    setViewport((v) => ({ ...v, x, y }))
  }, [])

  return {
    viewport,
    setViewport,
    setPan,
    setZoom,
    isPanning,
    startPan,
    updatePan,
    endPan,
    zoomAtPoint,
    zoomBy,
  }
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}
