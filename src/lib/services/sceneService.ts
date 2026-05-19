import type { FxDevice, SceneNode, ISceneService } from '../types'

let counter = 0
function generateInstanceId(): string {
  return `node_${Date.now()}_${++counter}`
}

class LocalSceneService implements ISceneService {
  private scene: SceneNode[] = []
  private listeners: Set<() => void> = new Set()

  private notify() {
    this.listeners.forEach((fn) => fn())
  }

  subscribe(fn: () => void) {
    this.listeners.add(fn)
    return () => { this.listeners.delete(fn) }
  }

  async getScene(): Promise<SceneNode[]> {
    return [...this.scene]
  }

  async addToScene(device: FxDevice, position?: number): Promise<SceneNode> {
    const defaultParams: Record<string, number> = {}
    for (const p of device.params) {
      defaultParams[p.id] = p.default
    }

    const node: SceneNode = {
      instanceId: generateInstanceId(),
      deviceId: device.id,
      device,
      params: defaultParams,
      enabled: true,
      position: position ?? this.scene.length,
    }

    if (position !== undefined && position < this.scene.length) {
      this.scene.splice(position, 0, node)
      this.reindex()
    } else {
      this.scene.push(node)
    }

    this.notify()
    return node
  }

  async removeFromScene(instanceId: string): Promise<void> {
    this.scene = this.scene.filter((n) => n.instanceId !== instanceId)
    this.reindex()
    this.notify()
  }

  async reorderScene(instanceIds: string[]): Promise<void> {
    const map = new Map(this.scene.map((n) => [n.instanceId, n]))
    this.scene = instanceIds
      .map((id) => map.get(id))
      .filter((n): n is SceneNode => n !== undefined)
    this.reindex()
    this.notify()
  }

  async updateNodeParams(instanceId: string, params: Record<string, number>): Promise<void> {
    const node = this.scene.find((n) => n.instanceId === instanceId)
    if (node) {
      node.params = { ...node.params, ...params }
      this.notify()
    }
  }

  async toggleNode(instanceId: string): Promise<void> {
    const node = this.scene.find((n) => n.instanceId === instanceId)
    if (node) {
      node.enabled = !node.enabled
      this.notify()
    }
  }

  async moveNode(instanceId: string, direction: 'left' | 'right'): Promise<void> {
    const idx = this.scene.findIndex((n) => n.instanceId === instanceId)
    if (idx < 0) return
    const target = direction === 'left' ? idx - 1 : idx + 1
    if (target < 0 || target >= this.scene.length) return

    const temp = this.scene[idx]
    this.scene[idx] = this.scene[target]
    this.scene[target] = temp
    this.reindex()
    this.notify()
  }

  private reindex() {
    this.scene.forEach((n, i) => { n.position = i })
  }
}

export const sceneService = new LocalSceneService()
