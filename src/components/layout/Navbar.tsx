import { motion } from 'framer-motion'
import { useState, useEffect, useMemo } from 'react'
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import {
  Home,
  Settings,
  User,
  LogOut,
  FolderOpen,
  Library,
  Store,
  Cpu,
  Activity,
} from 'lucide-react'

const navItems = [
  { id: 'stage', label: 'Virtual Stage', icon: Home },
  { id: 'fx-library', label: 'Components', icon: Library },
  { id: 'presets', label: 'Presets', icon: FolderOpen },
  { id: 'market', label: 'Market', icon: Store },
]

const utilityItems = [
  { id: 'settings', label: 'Ayarlar', icon: Settings },
  { id: 'profile', label: 'Profil', icon: User },
]

export function Navbar() {
  const { activeSection, setActiveSection } = useUIStore()
  const user = useAuthStore((s) => s.user)
  const backend = useSettingsStore((s) => s.backend)

  const latencyMs = useMemo(() => {
    if (!backend.sampleRate || !backend.bufferSize) return 0
    return (backend.bufferSize / backend.sampleRate) * 1000
  }, [backend.sampleRate, backend.bufferSize])

  const cpu = useMockCpuMeter()

  return (
    <header
      className="h-12 flex items-center px-4 gap-4 select-none shrink-0
        bg-sultan-surface border-b border-sultan-border relative z-20"
    >
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-6 h-6 rounded-md flex items-center justify-center
          bg-sultan-accent/15 border border-sultan-accent/30">
          <span className="text-[9px] font-bold text-sultan-accent tracking-tight">SX</span>
        </div>
        <span className="text-xs font-bold tracking-[0.22em] text-sultan-text uppercase">
          SULTAN
        </span>
        <span className="text-[9px] font-mono text-sultan-text-dim hidden md:inline">
          v.x
        </span>
      </div>

      <div className="h-5 w-px bg-sultan-border shrink-0" />

      <nav className="flex items-center gap-0.5 shrink-0">
        {navItems.map((item) => (
          <NavButton
            key={item.id}
            id={item.id}
            label={item.label}
            Icon={item.icon}
            active={activeSection === item.id}
            onClick={() => setActiveSection(item.id)}
          />
        ))}
      </nav>

      <div className="flex-1" />

      <div className="flex items-center gap-3 text-[10px] text-sultan-text-dim font-mono shrink-0">
        <Metric
          icon={<Cpu size={11} className="text-sultan-accent" />}
          label="CPU"
          value={`${cpu.toFixed(0)}%`}
          tone="accent"
        />
        <Metric
          icon={<Activity size={11} className="text-sultan-green" />}
          label="MS"
          value={latencyMs.toFixed(1)}
          tone="green"
        />
      </div>

      <div className="h-5 w-px bg-sultan-border shrink-0" />

      <div className="flex items-center gap-0.5 shrink-0">
        {utilityItems.map((item) => (
          <IconButton
            key={item.id}
            label={item.label}
            Icon={item.icon}
            active={activeSection === item.id}
            onClick={() => setActiveSection(item.id)}
          />
        ))}

        <div className="hidden lg:flex items-center px-2 ml-1 h-7 rounded-md
          bg-sultan-surface-2 border border-sultan-border">
          <span className="text-[10px] text-sultan-text-muted truncate max-w-[120px]">
            {user?.displayName || user?.email?.split('@')[0] || 'User'}
          </span>
        </div>

        <button
          onClick={() => signOut(auth)}
          title="Çıkış Yap"
          className="w-8 h-8 flex items-center justify-center rounded-md
            text-sultan-text-dim hover:text-sultan-red hover:bg-sultan-red/10
            transition-colors cursor-pointer"
        >
          <LogOut size={14} />
        </button>
      </div>
    </header>
  )
}

function NavButton({
  id,
  label,
  Icon,
  active,
  onClick,
}: {
  id: string
  label: string
  Icon: React.ComponentType<{ size?: number }>
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 h-8 px-3 rounded-md transition-colors cursor-pointer
        ${active
          ? 'text-sultan-accent'
          : 'text-sultan-text-muted hover:text-sultan-text hover:bg-sultan-surface-2'
        }`}
    >
      <Icon size={14} />
      <span className="text-xs font-medium hidden sm:inline">{label}</span>

      {active && (
        <motion.div
          layoutId="navbar-active-pill"
          className="absolute inset-0 rounded-md bg-sultan-accent/10 -z-10"
          transition={{ type: 'spring', stiffness: 500, damping: 38 }}
        />
      )}
      {active && (
        <motion.div
          layoutId="navbar-active-underline"
          className="absolute -bottom-[7px] left-2 right-2 h-px bg-sultan-accent"
          transition={{ type: 'spring', stiffness: 500, damping: 38 }}
        />
      )}
      <span className="sr-only">{id}</span>
    </button>
  )
}

function IconButton({
  label,
  Icon,
  active,
  onClick,
}: {
  label: string
  Icon: React.ComponentType<{ size?: number }>
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors cursor-pointer
        ${active
          ? 'bg-sultan-accent/10 text-sultan-accent'
          : 'text-sultan-text-dim hover:text-sultan-text hover:bg-sultan-surface-2'
        }`}
    >
      <Icon size={14} />
    </button>
  )
}

function Metric({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: string
  tone: 'accent' | 'green'
}) {
  return (
    <div className="flex items-center gap-1.5 px-2 h-7 rounded-md
      bg-sultan-surface-2/60 border border-sultan-border">
      {icon}
      <span className="text-[9px] uppercase tracking-wider text-sultan-text-dim">
        {label}
      </span>
      <span
        className={`text-[10px] font-mono tabular-nums
          ${tone === 'accent' ? 'text-sultan-accent' : 'text-sultan-green'}`}
      >
        {value}
      </span>
    </div>
  )
}

function useMockCpuMeter(): number {
  const [cpu, setCpu] = useState(14)

  useEffect(() => {
    const id = setInterval(() => {
      setCpu((prev) => {
        const target = 12 + Math.random() * 8
        return prev + (target - prev) * 0.3
      })
    }, 1200)
    return () => clearInterval(id)
  }, [])

  return cpu
}
