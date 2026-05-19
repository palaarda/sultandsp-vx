import { Navbar } from './Navbar'
import { useUIStore } from '@/stores/uiStore'
import { AnimatePresence, motion } from 'framer-motion'
import { VirtualStage } from '@/pages/VirtualStage'
import { FxLibrary } from '@/pages/FxLibrary'
import { PresetsPage } from '@/pages/PresetsPage'
import { MarketPage } from '@/pages/MarketPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { ProfilePage } from '@/pages/ProfilePage'

const sections: Record<string, React.ComponentType> = {
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
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
