import { Knob } from '@/components/audio/Knob'
import { getDeviceLayout } from '@/lib/data/deviceLayouts'
import { ImageBackedDevice } from './ImageBackedDevice'
import type { SceneNode } from '@/lib/types'

interface PedalVisualProps {
  node: SceneNode
  onParamChange: (paramId: string, value: number) => void
  onToggle: () => void
  compact?: boolean
}

export function PedalVisual(props: PedalVisualProps) {
  const layout = getDeviceLayout(props.node.deviceId)
  if (layout) {
    return <ImageBackedDevice {...props} layout={layout} />
  }
  return <GenericPedal {...props} />
}

function GenericPedal({ node, onParamChange, onToggle, compact }: PedalVisualProps) {
  const color = node.device.color || '#c89b3c'
  const knobSize = compact ? 30 : 38
  const params = node.device.params

  return (
    <div
      className="relative select-none"
      style={{ width: compact ? 110 : 140, opacity: node.enabled ? 1 : 0.4 }}
    >
      <div
        className="rounded-xl relative overflow-hidden"
        style={{
          background: `linear-gradient(170deg, ${color}18 0%, ${color}08 40%, #0e0e12 100%)`,
          border: `1px solid ${color}30`,
          boxShadow: `0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 ${color}15`,
          padding: compact ? '8px 6px' : '10px 8px',
        }}
      >
        <div
          className="absolute top-0 left-2 right-2 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }}
        />

        <div className="text-center mb-1">
          <span
            className="text-[7px] font-bold uppercase tracking-[0.15em]"
            style={{ color: `${color}90` }}
          >
            {node.device.brand}
          </span>
        </div>

        <div className="flex justify-center mb-2">
          <div
            className="rounded-full"
            style={{
              width: compact ? 4 : 5,
              height: compact ? 4 : 5,
              backgroundColor: node.enabled ? '#3ae26a' : '#1a1a22',
              boxShadow: node.enabled ? '0 0 6px #3ae26a80, 0 0 12px #3ae26a30' : 'none',
            }}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 mb-2">
          {params.map((param) => (
            <Knob
              key={param.id}
              value={node.params[param.id] ?? param.default}
              min={param.min}
              max={param.max}
              onChange={(v) => onParamChange(param.id, v)}
              label={param.name}
              unit={param.unit}
              size={knobSize}
              color={color}
            />
          ))}
        </div>

        <div className="text-center mt-1 mb-2">
          <span className="text-[8px] font-bold text-sultan-text leading-tight block truncate px-1">
            {node.device.name}
          </span>
        </div>

        <div className="flex justify-center">
          <button
            data-device-control
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onToggle() }}
            className="cursor-pointer group"
          >
            <div
              className="rounded-full flex items-center justify-center transition-all"
              style={{
                width: compact ? 22 : 28,
                height: compact ? 22 : 28,
                background: 'linear-gradient(180deg, #2a2a34 0%, #18181e 100%)',
                border: '1.5px solid #3a3a44',
                boxShadow: 'inset 0 1px 0 #444, 0 2px 4px rgba(0,0,0,0.6)',
              }}
            >
              <div
                className="rounded-full"
                style={{
                  width: compact ? 8 : 10,
                  height: compact ? 8 : 10,
                  background: 'radial-gradient(circle, #555 0%, #333 100%)',
                  border: '0.5px solid #222',
                }}
              />
            </div>
          </button>
        </div>

        <div className="flex justify-between px-1 mt-2">
          <Screw size={compact ? 4 : 5} />
          <Screw size={compact ? 4 : 5} />
        </div>
      </div>
    </div>
  )
}

function Screw({ size }: { size: number }) {
  return (
    <div
      className="rounded-full"
      style={{
        width: size,
        height: size,
        background: 'radial-gradient(circle at 35% 35%, #555, #222)',
        border: '0.5px solid #1a1a1a',
      }}
    />
  )
}
