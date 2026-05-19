import { motion, AnimatePresence } from 'framer-motion'
import { Cable, Speaker, Plus } from 'lucide-react'
import { useSceneStore } from '@/stores/sceneStore'
import { SceneNodeCard } from './SceneNodeCard'

interface SceneChainProps {
  onOpenLibrary?: () => void
}

export function SceneChain({ onOpenLibrary }: SceneChainProps) {
  const { nodes, selectedNodeId, selectNode } = useSceneStore()

  return (
    <div className="flex items-center gap-0 pt-10 pb-6 px-2 min-h-[180px] select-none">
      <TerminalNode type="input" />
      <ChainConnector />

      <AnimatePresence mode="popLayout">
        {nodes.map((node) => (
          <motion.div
            key={node.instanceId}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center shrink-0 relative [transform:translateZ(0)]"
          >
            <SceneNodeCard
              node={node}
              isSelected={selectedNodeId === node.instanceId}
              onSelect={() => selectNode(
                selectedNodeId === node.instanceId ? null : node.instanceId
              )}
            />
            <ChainConnector />
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenLibrary}
        className="w-10 h-10 rounded-xl border-2 border-dashed border-sultan-border
          flex items-center justify-center
          text-sultan-text-dim hover:text-sultan-accent hover:border-sultan-accent/30
          transition-colors cursor-pointer shrink-0"
        title="Cihaz Ekle"
      >
        <Plus size={16} />
      </motion.button>

      <ChainConnector />

      <TerminalNode type="output" />
    </div>
  )
}

function TerminalNode({ type }: { type: 'input' | 'output' }) {
  const isInput = type === 'input'
  return (
    <div className="flex flex-col items-center gap-1 shrink-0">
      <div className="w-11 h-11 rounded-xl bg-sultan-surface-2 border border-sultan-border
        flex items-center justify-center"
      >
        {isInput
          ? <Cable size={16} className="text-sultan-green" />
          : <Speaker size={16} className="text-sultan-accent" />
        }
      </div>
      <span className="text-[8px] text-sultan-text-dim uppercase tracking-wider font-semibold select-none">
        {isInput ? 'Input' : 'Output'}
      </span>
    </div>
  )
}

function ChainConnector() {
  return (
    <svg width="28" height="12" viewBox="0 0 28 12" className="shrink-0 mx-0.5">
      <line x1="0" y1="6" x2="20" y2="6" stroke="#2a2a32" strokeWidth="1.5" />
      <polygon points="20,2.5 27,6 20,9.5" fill="#2a2a32" />
    </svg>
  )
}
