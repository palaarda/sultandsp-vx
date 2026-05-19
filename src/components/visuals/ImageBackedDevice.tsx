import { useEffect, useRef } from 'react'
import { Knob } from '@/components/audio/Knob'
import { RockerSwitch } from '@/components/audio/RockerSwitch'
import type { SceneNode, DeviceLayout } from '@/lib/types'

interface ImageBackedDeviceProps {
  node: SceneNode
  onParamChange: (paramId: string, value: number) => void
  onToggle: () => void
  compact?: boolean
  layout: DeviceLayout
}

export function ImageBackedDevice({
  node,
  onParamChange,
  onToggle,
  compact,
  layout,
}: ImageBackedDeviceProps) {
  const params = node.device.params
  const isLandscape = layout.aspectRatio > 1.2
  const width = compact
    ? (isLandscape ? 480 : 200)
    : (isLandscape ? 720 : 360)
  const height = width / layout.aspectRatio

  const defaultKnobPercent = layout.knobDefaultSize ?? 18
  const pctToPx = (p: number) => (width * p) / 100
  const imgSrc = compact && layout.imageCompact ? layout.imageCompact : layout.image

  const showLabels = !layout.hideKnobLabels
  const labelColor = layout.knobLabelColor
  const valueColor = layout.knobValueColor
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const img = imgRef.current
    if (!img) return
    const nudge = () => {
      img.style.transform = 'translateZ(0.001px)'
      requestAnimationFrame(() => {
        img.style.transform = 'translateZ(0)'
      })
    }
    if (img.complete) nudge()
    else img.addEventListener('load', nudge, { once: true })
  }, [imgSrc, width, height])

  const imgW = Math.round(width)
  const imgH = Math.round(height)

  return (
    <div
      className="relative select-none isolate"
      style={{
        width,
        height,
        opacity: node.enabled ? 1 : 0.45,
        filter: node.enabled
          ? 'drop-shadow(0 6px 16px rgba(0,0,0,0.55))'
          : 'drop-shadow(0 4px 10px rgba(0,0,0,0.4)) grayscale(0.4)',
      }}
    >
      <img
        ref={imgRef}
        src={imgSrc}
        alt={node.device.name}
        width={imgW}
        height={imgH}
        draggable={false}
        decoding="async"
        onDragStart={(e) => e.preventDefault()}
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      />

      {layout.led && (() => {
        const ledPx = pctToPx(layout.led.size ?? 2)
        return (
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${layout.led.x}%`,
              top: `${layout.led.y}%`,
              width: ledPx,
              height: ledPx,
              transform: 'translate(-50%, -50%)',
              backgroundColor: node.enabled ? '#3ae26a' : '#1a1a22',
              boxShadow: node.enabled
                ? '0 0 8px #3ae26a, 0 0 16px #3ae26a60'
                : 'inset 0 0 4px #000',
              border: '0.5px solid rgba(0,0,0,0.5)',
            }}
          />
        )
      })()}

      {layout.togglePositions &&
        Object.entries(layout.togglePositions).map(([paramId, pos]) => {
          const param = params.find((p) => p.id === paramId)
          if (!param) return null
          const swW = pctToPx(pos.width ?? 2.2)
          const swH = (height * (pos.height ?? 9)) / 100
          const value = node.params[paramId] ?? param.default
          const isDown = value >= 0.5
          const labelColor = layout.toggleLabelColor ?? '#1c1c24'
          const labelSize = Math.max(6, Math.min(9, swH * 0.22))
          const labelGap = Math.max(2, swH * 0.12)
          const labelStyle = (active: boolean) => ({
            fontSize: labelSize,
            lineHeight: 1,
            letterSpacing: '0.05em',
            color: labelColor,
            opacity: active ? 1 : 0.38,
            fontWeight: active ? 700 : 500,
          } as const)
          return (
            <div
              key={paramId}
              className="absolute"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="relative" style={{ width: swW, height: swH }}>
                {pos.topLabel && (
                  <span
                    className="absolute left-1/2 -translate-x-1/2 uppercase whitespace-nowrap pointer-events-none"
                    style={{
                      ...labelStyle(!isDown),
                      bottom: `calc(100% + ${labelGap}px)`,
                    }}
                  >
                    {pos.topLabel}
                  </span>
                )}
                <RockerSwitch
                  value={value}
                  width={swW}
                  height={swH}
                  disabled={!node.enabled}
                  title={isDown ? pos.bottomLabel : pos.topLabel}
                  onChange={(v) => onParamChange(paramId, v)}
                />
                {pos.bottomLabel && (
                  <span
                    className="absolute left-1/2 -translate-x-1/2 uppercase whitespace-nowrap pointer-events-none"
                    style={{
                      ...labelStyle(isDown),
                      top: `calc(100% + ${labelGap}px)`,
                    }}
                  >
                    {pos.bottomLabel}
                  </span>
                )}
              </div>
            </div>
          )
        })}

      {params.map((param) => {
        const pos = layout.paramPositions[param.id]
        if (!pos) return null
        const knobPx = pctToPx(pos.size ?? defaultKnobPercent)
        return (
          <div
            key={param.id}
            className="absolute flex items-center justify-center"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)',
              width: knobPx,
              height: knobPx,
            }}
          >
            <Knob
              value={node.params[param.id] ?? param.default}
              min={param.min}
              max={param.max}
              size={knobPx}
              color={node.device.color || '#c89b3c'}
              unit={param.unit}
              label={showLabels ? param.name : undefined}
              labelColor={labelColor}
              valueColor={valueColor}
              onChange={(v) => onParamChange(param.id, v)}
              showArc={false}
            />
          </div>
        )
      })}

      {layout.footswitch && (() => {
        const fsPx = pctToPx(layout.footswitch.size ?? 28)
        return (
          <button
            data-device-control
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onToggle() }}
            className="absolute rounded-full cursor-pointer focus:outline-none"
            title="Aç / Kapat"
            style={{
              left: `${layout.footswitch.x}%`,
              top: `${layout.footswitch.y}%`,
              width: fsPx,
              height: fsPx,
              transform: 'translate(-50%, -50%)',
              background: 'transparent',
              border: 'none',
            }}
          />
        )
      })()}

      {layout.showNameLabel && !compact && (
        <div
          className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase tracking-wider text-sultan-text/70 pointer-events-none"
        >
          {node.device.name}
        </div>
      )}
    </div>
  )
}
