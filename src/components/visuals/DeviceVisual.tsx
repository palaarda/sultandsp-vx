import type { SceneNode } from '@/lib/types'
import { PedalVisual } from './PedalVisual'
import { AmpVisual } from './AmpVisual'
import { CabVisual } from './CabVisual'
import { RackVisual } from './RackVisual'

interface DeviceVisualProps {
  node: SceneNode
  onParamChange: (paramId: string, value: number) => void
  onToggle: () => void
  compact?: boolean
}

export function DeviceVisual({ node, onParamChange, onToggle, compact }: DeviceVisualProps) {
  const props = { node, onParamChange, onToggle, compact }

  switch (node.device.type) {
    case 'pedal':
      return <PedalVisual {...props} />
    case 'amp':
      return <AmpVisual {...props} />
    case 'cab':
      return <CabVisual {...props} />
    case 'rack':
    case 'utility':
      return <RackVisual {...props} />
    default:
      return <PedalVisual {...props} />
  }
}
