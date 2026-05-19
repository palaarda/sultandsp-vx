import { useEffect } from 'react'
import { useSceneStore } from '@/stores/sceneStore'
import { useUIStore } from '@/stores/uiStore'
import { SceneChain } from '@/components/scene/SceneChain'
import { InfiniteCanvas } from '@/components/scene/InfiniteCanvas'

export function VirtualStage() {
  const { nodes, loadScene } = useSceneStore()
  const setActiveSection = useUIStore((s) => s.setActiveSection)

  useEffect(() => { loadScene() }, [loadScene])

  return (
    <div className="w-full h-full relative overflow-hidden">
      <InfiniteCanvas>
        <div className="select-none" style={{ position: 'absolute', left: 0, top: 0, transform: 'translate(-50%, -50%)' }}>
          <SceneChain onOpenLibrary={() => setActiveSection('fx-library')} />
        </div>
      </InfiniteCanvas>

      <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-sultan-border/30 rounded-tl-lg pointer-events-none z-10" />
      <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-sultan-border/30 rounded-tr-lg pointer-events-none z-10" />
      <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-sultan-border/30 rounded-bl-lg pointer-events-none z-10" />
      <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-sultan-border/30 rounded-br-lg pointer-events-none z-10" />

      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="text-center mt-24">
            <p className="text-xs text-sultan-text-dim">
              Sinyal zinciriniz boş. <strong className="text-sultan-accent">"+"</strong> butonuna tıklayın
              veya <button
                onClick={() => setActiveSection('fx-library')}
                className="text-sultan-accent underline pointer-events-auto cursor-pointer"
              >Components</button>'tan cihaz ekleyin.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
