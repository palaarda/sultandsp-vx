import { motion } from 'framer-motion'
import { X, ChevronUp, ChevronDown, Power } from 'lucide-react'
import { useSceneStore } from '@/stores/sceneStore'
import { DeviceVisual } from '@/components/visuals/DeviceVisual'
import { hasDeviceLayout } from '@/lib/data/deviceLayouts'
import { shouldBlockSceneClick } from '@/lib/panClickGuard'
import type { SceneNode } from '@/lib/types'

interface SceneNodeCardProps {
  node: SceneNode
  isSelected: boolean
  onSelect: () => void
}

export function SceneNodeCard({ node, isSelected, onSelect }: SceneNodeCardProps) {
  const { removeNode, toggleNode, moveNode, updateParams, nodes } = useSceneStore()
  const isFirst = node.position === 0
  const isLast = node.position === nodes.length - 1
  const isImageBacked = hasDeviceLayout(node.deviceId)

  function handleParamChange(paramId: string, value: number) {
    updateParams(node.instanceId, { [paramId]: value })
  }

  function handleCardClick(e: React.MouseEvent) {
    if (shouldBlockSceneClick()) return
    if ((e.target as HTMLElement).closest('[data-device-control]')) return
    onSelect()
  }

  return (
    <motion.div
      data-scene-node
      onClick={handleCardClick}
      className={`group relative flex flex-col items-center gap-1 shrink-0
        hover:z-30 [transform:translateZ(0)]
        ${isSelected ? 'z-20' : 'z-0'}`}
    >
      <div
        className={`relative rounded-2xl p-1 transition-all duration-200
          ${isSelected
            ? 'ring-1 ring-sultan-accent/40 bg-sultan-accent/5'
            : 'hover:bg-sultan-surface-2/30'
          }`}
      >
        <div
          className={`absolute flex items-center gap-1 z-20
            transition-opacity duration-150
            ${isImageBacked ? '-top-[23px] -right-3' : '-top-2 -right-2'}
            ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          <button
            data-device-control
            onClick={(e) => { e.stopPropagation(); toggleNode(node.instanceId) }}
            className={`w-6 h-6 rounded-full flex items-center justify-center
              border transition-colors cursor-pointer
              ${node.enabled
                ? 'bg-sultan-green/15 border-sultan-green/40 text-sultan-green hover:bg-sultan-green/25'
                : 'bg-sultan-surface-2 border-sultan-border text-sultan-text-dim hover:text-sultan-text'
              }`}
            title={node.enabled ? 'Kapat' : 'Aç'}
          >
            <Power size={11} />
          </button>

          <button
            data-device-control
            onClick={(e) => { e.stopPropagation(); removeNode(node.instanceId) }}
            className="w-6 h-6 rounded-full flex items-center justify-center
              bg-sultan-surface-2 border border-sultan-border
              text-sultan-text-dim hover:text-sultan-red hover:bg-sultan-red/15 hover:border-sultan-red/40
              cursor-pointer transition-colors"
            title="Kaldır"
          >
            <X size={12} />
          </button>
        </div>

        <DeviceVisual
          node={node}
          onParamChange={handleParamChange}
          onToggle={() => toggleNode(node.instanceId)}
          compact
        />
      </div>

      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 z-20
          flex items-center gap-1 pt-1 transition-opacity duration-150
          ${isSelected
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'}`}
      >
        <button
          data-device-control
          onClick={(e) => { e.stopPropagation(); moveNode(node.instanceId, 'left') }}
          disabled={isFirst}
          className="w-6 h-6 rounded-md flex items-center justify-center cursor-pointer
            text-sultan-text-dim hover:text-sultan-text disabled:opacity-20 disabled:cursor-not-allowed
            bg-sultan-surface-2 border border-sultan-border transition-colors"
          title="Yukarı taşı"
        >
          <ChevronUp size={12} />
        </button>
        <button
          data-device-control
          onClick={(e) => { e.stopPropagation(); moveNode(node.instanceId, 'right') }}
          disabled={isLast}
          className="w-6 h-6 rounded-md flex items-center justify-center cursor-pointer
            text-sultan-text-dim hover:text-sultan-text disabled:opacity-20 disabled:cursor-not-allowed
            bg-sultan-surface-2 border border-sultan-border transition-colors"
          title="Aşağı taşı"
        >
          <ChevronDown size={12} />
        </button>
      </div>
    </motion.div>
  )
}
