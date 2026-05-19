import { Knob } from '@/components/audio/Knob'
import type { SceneNode } from '@/lib/types'

interface RackVisualProps {
  node: SceneNode
  onParamChange: (paramId: string, value: number) => void
  onToggle: () => void
  compact?: boolean
}

export function RackVisual({ node, onParamChange, onToggle, compact }: RackVisualProps) {
  const color = node.device.color || '#4a8ae2'
  const params = node.device.params
  const knobSize = compact ? 26 : 32

  return (
    <div
      className="relative select-none"
      style={{
        width: compact ? 130 : Math.max(160, params.length * 44 + 40),
        opacity: node.enabled ? 1 : 0.4,
      }}
    >
      <div
        className="rounded-md relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #18181e 0%, #111115 100%)',
          border: '1px solid #2a2a32',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 #2a2a32',
        }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-3 flex flex-col justify-between py-2 items-center">
          <RackScrew />
          <RackScrew />
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-3 flex flex-col justify-between py-2 items-center">
          <RackScrew />
          <RackScrew />
        </div>

        <div className="mx-4 py-2">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => { e.stopPropagation(); onToggle() }}
                className="cursor-pointer"
              >
                <div
                  className="rounded-sm"
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: node.enabled ? color : '#1a1a22',
                    boxShadow: node.enabled ? `0 0 6px ${color}60` : 'none',
                    border: '0.5px solid #333',
                  }}
                />
              </button>
              <span
                className="text-[7px] font-bold uppercase tracking-[0.15em]"
                style={{ color }}
              >
                {node.device.brand}
              </span>
            </div>
            <span className="text-[7px] font-semibold text-sultan-text tracking-wide">
              {node.device.name}
            </span>
          </div>

          <div
            className="h-px mb-2 mx-1"
            style={{ background: `linear-gradient(90deg, transparent, ${color}30, transparent)` }}
          />

          <div className="flex items-end justify-center gap-2 flex-wrap">
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
        </div>
      </div>
    </div>
  )
}

function RackScrew() {
  return (
    <div
      className="rounded-sm"
      style={{
        width: 5,
        height: 5,
        background: 'radial-gradient(circle at 35% 35%, #555, #1a1a1a)',
        border: '0.5px solid #111',
      }}
    />
  )
}
