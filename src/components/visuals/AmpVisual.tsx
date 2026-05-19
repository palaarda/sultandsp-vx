import { Knob } from '@/components/audio/Knob'
import { getDeviceLayout } from '@/lib/data/deviceLayouts'
import { ImageBackedDevice } from './ImageBackedDevice'
import type { SceneNode } from '@/lib/types'

interface AmpVisualProps {
  node: SceneNode
  onParamChange: (paramId: string, value: number) => void
  onToggle: () => void
  compact?: boolean
}

export function AmpVisual(props: AmpVisualProps) {
  const layout = getDeviceLayout(props.node.deviceId)
  if (layout) {
    return <ImageBackedDevice {...props} layout={layout} />
  }
  return <GenericAmp {...props} />
}

function GenericAmp({ node, onParamChange, onToggle, compact }: AmpVisualProps) {
  const color = node.device.color || '#c89b3c'
  const knobSize = compact ? 28 : 34
  const params = node.device.params

  return (
    <div
      className="relative select-none"
      style={{
        width: compact ? 140 : Math.max(180, params.length * 48 + 40),
        opacity: node.enabled ? 1 : 0.4,
      }}
    >
      <div
        className="rounded-lg relative overflow-hidden"
        style={{
          background: `linear-gradient(180deg, #1a1a20 0%, #111115 50%, #0c0c10 100%)`,
          border: '1px solid #2a2a32',
          boxShadow: '0 6px 24px rgba(0,0,0,0.6), inset 0 1px 0 #333',
        }}
      >
        <div
          className="px-3 pt-2 pb-1"
          style={{
            background: `linear-gradient(180deg, ${color}12 0%, transparent 100%)`,
            borderBottom: '1px solid #222',
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <div
                className="rounded-full"
                style={{
                  width: 4,
                  height: 4,
                  backgroundColor: node.enabled ? '#e24a4a' : '#1a1a22',
                  boxShadow: node.enabled ? '0 0 4px #e24a4a80' : 'none',
                }}
              />
              <span
                className="text-[7px] font-bold uppercase tracking-[0.2em]"
                style={{ color: `${color}` }}
              >
                {node.device.brand}
              </span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onToggle() }}
              className="cursor-pointer"
            >
              <div
                className="rounded-sm flex items-center justify-center"
                style={{
                  width: 14,
                  height: 14,
                  background: node.enabled
                    ? 'linear-gradient(180deg, #2a2a34, #1a1a20)'
                    : 'linear-gradient(180deg, #1a1a20, #111)',
                  border: `1px solid ${node.enabled ? '#444' : '#222'}`,
                }}
              >
                <div
                  className="rounded-full"
                  style={{
                    width: 3,
                    height: 3,
                    backgroundColor: node.enabled ? '#3ae26a' : '#333',
                    boxShadow: node.enabled ? '0 0 4px #3ae26a80' : 'none',
                  }}
                />
              </div>
            </button>
          </div>

          <div className="text-center">
            <span className="text-[8px] font-semibold text-sultan-text tracking-wide">
              {node.device.name}
            </span>
          </div>
        </div>

        <div
          className="px-2 py-2"
          style={{
            background: 'linear-gradient(180deg, #0f0f14 0%, #0a0a0e 100%)',
          }}
        >
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

        <div
          className="h-8 mx-2 mb-2 rounded-md overflow-hidden"
          style={{
            background: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 1px,
                rgba(255,255,255,0.02) 1px,
                rgba(255,255,255,0.02) 2px
              )
            `,
            border: '1px solid #1a1a20',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
          }}
        >
          <div
            className="w-full h-full opacity-30"
            style={{
              backgroundImage: `
                radial-gradient(circle at 2px 2px, #333 0.5px, transparent 0.5px)
              `,
              backgroundSize: '4px 4px',
            }}
          />
        </div>

        <div className="flex justify-between px-2 pb-1.5">
          <CornerBolt />
          <span className="text-[6px] text-sultan-text-dim font-mono tracking-wider self-center">
            NAM
          </span>
          <CornerBolt />
        </div>
      </div>
    </div>
  )
}

function CornerBolt() {
  return (
    <div
      className="rounded-full"
      style={{
        width: 6,
        height: 6,
        background: 'radial-gradient(circle at 35% 35%, #444, #1a1a1a)',
        border: '0.5px solid #111',
      }}
    />
  )
}
