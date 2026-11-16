import type { FxDevice, SceneNode, ISceneService } from '../types'
import { fxLibraryData } from '../data/fxLibrary'

const STORAGE_KEY = 'sultandsp-vx-scene'

interface PersistedSceneNode {
  instanceId: string
  deviceId: string
  params: Record<string, number>
  enabled: boolean
  position: number
}

let counter = 0
function generateInstanceId(): string {
  return `node_${Date.now()}_${++counter}`
}

function findDevice(deviceId: string): FxDevice | undefined {
  for (const category of fxLibraryData) {
    for (const subcategory of category.subcategories) {
      const device = subcategory.devices.find((item) => item.id === deviceId)
      if (device) return device
    }
  }
  return undefined
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isPersistedNode(value: unknown): value is PersistedSceneNode {
  if (!isRecord(value)) return false
  if (typeof value.instanceId !== 'string' || value.instanceId.trim() === '') return false
  if (typeof value.deviceId !== 'string' || value.deviceId.trim() === '') return false
  if (typeof value.enabled !== 'boolean') return false
  if (typeof value.position !== 'number' || !Number.isFinite(value.position)) return false
  if (!isRecord(value.params)) return false

  for (const paramValue of Object.values(value.params)) {
    if (typeof paramValue !== 'number' || !Number.isFinite(paramValue)) return false
  }

  return true
}

function sanitizeParams(device: FxDevice, raw: Record<string, number>): Record<string, number> {
  const params: Record<string, number> = {}
  for (const param of device.params) {
    const value = raw[param.id]
    if (typeof value === 'number' && Number.isFinite(value)) {
      params[param.id] = Math.min(param.max, Math.max(param.min, value))
    } else {
      params[param.id] = param.default
    }
  }
  return params
}

function parseStoredScene(raw: string): SceneNode[] {
  const parsed: unknown = JSON.parse(raw)
  if (!Array.isArray(parsed)) return []

  const seen = new Set<string>()
  const draft: Array<{ saved: PersistedSceneNode; device: FxDevice }> = []

  for (const item of parsed) {
    if (!isPersistedNode(item)) return []
    if (seen.has(item.instanceId)) return []
    seen.add(item.instanceId)

    const device = findDevice(item.deviceId)
    if (!device) return []

    draft.push({ saved: item, device })
  }

  draft.sort((a, b) => a.saved.position - b.saved.position)

  return draft.map(({ saved, device }, index) => ({
    instanceId: saved.instanceId,
    deviceId: device.id,
    device,
    params: sanitizeParams(device, saved.params),
    enabled: saved.enabled,
    position: index,
  }))
}

function loadStoredScene(): SceneNode[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    return parseStoredScene(stored)
  } catch {
    return []
  }
}

class LocalSceneService implements ISceneService {
  private scene: SceneNode[] = loadStoredScene()
  private listeners: Set<() => void> = new Set()

  private persist() {
    try {
      const payload: PersistedSceneNode[] = this.scene.map((node) => ({
        instanceId: node.instanceId,
        deviceId: node.deviceId,
        params: node.params,
        enabled: node.enabled,
        position: node.position,
      }))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      // Storage can be unavailable (private mode, quota). Keep the in-memory scene.
    }
  }

  private notify() {
    this.persist()
    this.listeners.forEach((fn) => fn())
  }

  subscribe(fn: () => void) {
    this.listeners.add(fn)
    return () => { this.listeners.delete(fn) }
  }

  currentScene(): SceneNode[] {
    return [...this.scene]
  }

  async getScene(): Promise<SceneNode[]> {
    return this.currentScene()
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
    const index = this.scene.findIndex((n) => n.instanceId === instanceId)
    if (index < 0) return

    const target = direction === 'left' ? index - 1 : index + 1
    if (target < 0 || target >= this.scene.length) return

    const instanceIds = this.scene.map((n) => n.instanceId)
    const current = instanceIds[index]
    const swapped = instanceIds[target]
    if (current === undefined || swapped === undefined) return

    instanceIds[index] = swapped
    instanceIds[target] = current
    await this.reorderScene(instanceIds)
  }

  private reindex() {
    this.scene.forEach((n, i) => { n.position = i })
  }
}

export const sceneService = new LocalSceneService()
