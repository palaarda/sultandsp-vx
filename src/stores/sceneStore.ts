import { create } from 'zustand'
import type { SceneNode, FxDevice } from '@/lib/types'
import { sceneService } from '@/lib/services/sceneService'

interface SceneState {
  nodes: SceneNode[]
  selectedNodeId: string | null

  loadScene: () => Promise<void>
  addDevice: (device: FxDevice, position?: number) => Promise<void>
  removeNode: (instanceId: string) => Promise<void>
  moveNode: (instanceId: string, direction: 'left' | 'right') => Promise<void>
  toggleNode: (instanceId: string) => Promise<void>
  updateParams: (instanceId: string, params: Record<string, number>) => Promise<void>
  selectNode: (instanceId: string | null) => void
}

export const useSceneStore = create<SceneState>((set) => ({
  nodes: sceneService.currentScene(),
  selectedNodeId: null,

  loadScene: async () => {
    const nodes = await sceneService.getScene()
    set({ nodes })
  },

  addDevice: async (device, position) => {
    await sceneService.addToScene(device, position)
    const nodes = await sceneService.getScene()
    set({ nodes })
  },

  removeNode: async (instanceId) => {
    await sceneService.removeFromScene(instanceId)
    const nodes = await sceneService.getScene()
    set((s) => ({
      nodes,
      selectedNodeId: s.selectedNodeId === instanceId ? null : s.selectedNodeId,
    }))
  },

  moveNode: async (instanceId, direction) => {
    await sceneService.moveNode(instanceId, direction)
    const nodes = await sceneService.getScene()
    set({ nodes })
  },

  toggleNode: async (instanceId) => {
    await sceneService.toggleNode(instanceId)
    const nodes = await sceneService.getScene()
    set({ nodes })
  },

  updateParams: async (instanceId, params) => {
    await sceneService.updateNodeParams(instanceId, params)
    const nodes = await sceneService.getScene()
    set({ nodes })
  },

  selectNode: (instanceId) => set({ selectedNodeId: instanceId }),
}))
