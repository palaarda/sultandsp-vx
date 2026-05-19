export type DeviceType = 'pedal' | 'amp' | 'cab' | 'rack' | 'mic' | 'utility'

export type IconComponent = React.ComponentType<{
  size?: number
  className?: string
  style?: React.CSSProperties
}>

export interface DeviceParam {
  id: string
  name: string
  min: number
  max: number
  default: number
  unit?: string
  step?: number
}

export interface FxDevice {
  id: string
  name: string
  brand: string
  type: DeviceType
  category: string
  subcategory: string
  description: string
  params: DeviceParam[]
  tags: string[]
  color?: string
}

export interface FxSubcategory {
  id: string
  name: string
  description?: string
  devices: FxDevice[]
}

export interface FxCategory {
  id: string
  name: string
  icon: string
  description?: string
  subcategories: FxSubcategory[]
}

export interface KnobLayout {
  x: number
  y: number
  size?: number
}

export interface ToggleSpot {
  x: number
  y: number
  size?: number
}

export interface RockerSwitchLayout {
  x: number
  y: number
  width?: number
  height?: number
  topLabel?: string
  bottomLabel?: string
}

export interface DeviceLayout {
  image: string
  imageCompact?: string
  aspectRatio: number
  paramPositions: Record<string, KnobLayout>
  togglePositions?: Record<string, RockerSwitchLayout>
  led?: ToggleSpot
  footswitch?: ToggleSpot
  knobDefaultSize?: number
  showNameLabel?: boolean
  knobLabelColor?: string
  hideKnobLabels?: boolean
  knobValueColor?: string
  toggleLabelColor?: string
}

export interface SceneNode {
  instanceId: string
  deviceId: string
  device: FxDevice
  params: Record<string, number>
  enabled: boolean
  position: number
}

export interface FrontendSettings {
  uiScale: number
  accentColor: string
  sidebarCollapsed: boolean
  showTooltips: boolean
  animationsEnabled: boolean
}

export interface BackendSettings {
  sampleRate: number
  bufferSize: number
  oversampling: number
  latencyCompensation: boolean
}

export interface AppSettings {
  frontend: FrontendSettings
  backend: BackendSettings
}

export interface IFxService {
  getLibrary(): Promise<FxCategory[]>
  getDeviceById(id: string): Promise<FxDevice | undefined>
  searchDevices(query: string): Promise<FxDevice[]>
}

export interface ISceneService {
  getScene(): Promise<SceneNode[]>
  addToScene(device: FxDevice, position?: number): Promise<SceneNode>
  removeFromScene(instanceId: string): Promise<void>
  reorderScene(instanceIds: string[]): Promise<void>
  updateNodeParams(instanceId: string, params: Record<string, number>): Promise<void>
  toggleNode(instanceId: string): Promise<void>
}

export interface IFavoritesService {
  getFavorites(): Promise<string[]>
  addFavorite(deviceId: string): Promise<void>
  removeFavorite(deviceId: string): Promise<void>
  isFavorite(deviceId: string): Promise<boolean>
}
