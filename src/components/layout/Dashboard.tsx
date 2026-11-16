import { lazy, Suspense, type ComponentType } from 'react'
import { Navbar } from './Navbar'
import { useUIStore } from '@/stores/uiStore'
import { AnimatePresence, motion } from 'framer-motion'
import { VirtualStage } from '@/pages/VirtualStage'

const FxLibrary = lazy(() =>
  import('@/pages/FxLibrary').then((module) => ({ default: module.FxLibrary })),
)
const PresetsPage = lazy(() =>
  import('@/pages/PresetsPage').then((module) => ({ default: module.PresetsPage })),
)
const MarketPage = lazy(() =>
  import('@/pages/MarketPage').then((module) => ({ default: module.MarketPage })),
)
const SettingsPage = lazy(() =>
  import('@/pages/SettingsPage').then((module) => ({ default: module.SettingsPage })),
)
const ProfilePage = lazy(() =>
  import('@/pages/ProfilePage').then((module) => ({ default: module.ProfilePage })),
)

const sections: Record<string, ComponentType> = {
  'stage': VirtualStage,
  'fx-library': FxLibrary,
  'presets': PresetsPage,
  'market': MarketPage,
  'settings': SettingsPage,
  'profile': ProfilePage,
}

export function Dashboard() {
  const activeSection = useUIStore((s) => s.activeSection)
  const ActiveComponent = sections[activeSection] || VirtualStage

  return (
    <div className="w-full h-full flex flex-col bg-sultan-bg">
      <Navbar />
      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0"
          >
            <Suspense fallback={<div className="w-full h-full bg-sultan-bg" />}>
              <ActiveComponent />
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
