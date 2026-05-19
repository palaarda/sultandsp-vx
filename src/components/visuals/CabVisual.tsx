import { Knob } from '@/components/audio/Knob'
import type { SceneNode } from '@/lib/types'

interface CabVisualProps {
  node: SceneNode
  onParamChange: (paramId: string, value: number) => void
  onToggle: () => void
  compact?: boolean
}

export function CabVisual({ node, onParamChange, onToggle, compact }: CabVisualProps) {
  const color = node.device.color || '#8b7355'
  const params = node.device.params
  const is4x12 = node.device.subcategory.includes('4x12')

  return (
    <div
      className="relative select-none"
      style={{ width: compact ? 110 : 140, opacity: node.enabled ? 1 : 0.4 }}
    >
      <div
        className="rounded-lg relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #141418 0%, #0e0e12 100%)',
          border: '1px solid #2a2a32',
          boxShadow: '0 6px 24px rgba(0,0,0,0.6)',
          padding: compact ? '6px' : '8px',
        }}
      >
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-[7px] font-bold uppercase tracking-wider" style={{ color }}>
            {node.device.brand}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onToggle() }}
            className="cursor-pointer"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: node.enabled ? '#3ae26a' : '#1a1a22',
                boxShadow: node.enabled ? '0 0 4px #3ae26a60' : 'none',
                border: '0.5px solid #333',
              }}
            />
          </button>
        </div>

        <div
          className="rounded-md overflow-hidden mb-2"
          style={{
            aspectRatio: is4x12 ? '1 / 0.85' : '1 / 0.7',
            background: '#0a0a0c',
            border: '1px solid #1a1a20',
            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.6)',
          }}
        >
          <div className={`w-full h-full grid ${is4x12 ? 'grid-cols-2 grid-rows-2' : 'grid-cols-1'} gap-1 p-1.5`}>
            {(is4x12 ? [1, 2, 3, 4] : [1]).map((i) => (
              <SpeakerCone key={i} color={color} />
            ))}
          </div>
        </div>

        <div className="text-center mb-1.5">
          <span className="text-[8px] font-bold text-sultan-text block truncate">
            {node.device.name}
          </span>
        </div>

        {params.length > 0 && (
          <div className="flex items-end justify-center gap-2">
            {params.map((param) => (
              <Knob
                key={param.id}
                value={node.params[param.id] ?? param.default}
                min={param.min}
                max={param.max}
                onChange={(v) => onParamChange(param.id, v)}
                label={param.name}
                unit={param.unit}
                size={compact ? 26 : 30}
                color={color}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SpeakerCone({ color }: { color: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="rounded-full w-full h-full relative"
        style={{ maxWidth: 50, maxHeight: 50 }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, #1a1a20 60%, ${color}15 100%)`,
            border: '1px solid #222',
          }}
        />
        <div
          className="absolute inset-[15%] rounded-full"
          style={{ border: '0.5px solid #222' }}
        />
        <div
          className="absolute inset-[35%] rounded-full"
          style={{ border: '0.5px solid #1a1a1a' }}
        />
        <div
          className="absolute inset-[40%] rounded-full"
          style={{
            background: 'radial-gradient(circle at 40% 40%, #2a2a30, #151518)',
            border: '0.5px solid #222',
          }}
        />
      </div>
    </div>
  )
}
