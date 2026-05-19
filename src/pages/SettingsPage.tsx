import { motion } from 'framer-motion'
import { Volume2, Cpu, Palette, RotateCcw, AlertTriangle } from 'lucide-react'
import { useSettingsStore } from '@/stores/settingsStore'

export function SettingsPage() {
  const { frontend, backend, updateFrontend, updateBackend, resetAll } = useSettingsStore()

  return (
    <div className="w-full h-full p-4 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[520px] mx-auto space-y-4"
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-sultan-text">Ayarlar</h2>
          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 text-[10px] text-sultan-text-dim
              hover:text-sultan-text cursor-pointer transition-colors"
          >
            <RotateCcw size={11} />
            Varsayılanlara Dön
          </button>
        </div>

        <SettingsSection icon={Palette} title="Tema & Görünüm" status="active">
          <SettingsRow label="Aksent Rengi">
            <div className="flex items-center gap-1.5">
              {['#c89b3c', '#4a8ae2', '#e24a4a', '#3ae26a', '#a855f7', '#ff6b3a'].map((color) => (
                <button
                  key={color}
                  onClick={() => updateFrontend({ accentColor: color })}
                  className={`w-5 h-5 rounded-full border-2 cursor-pointer transition-all
                    ${frontend.accentColor === color
                      ? 'border-white scale-110'
                      : 'border-sultan-border hover:border-sultan-text'
                    }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </SettingsRow>
          <SettingsSelect
            label="UI Ölçek"
            value={String(frontend.uiScale)}
            onChange={(v) => updateFrontend({ uiScale: Number(v) })}
            options={[
              { value: '75', label: '%75' },
              { value: '100', label: '%100' },
              { value: '125', label: '%125' },
              { value: '150', label: '%150' },
            ]}
          />
          <SettingsToggle
            label="Animasyonlar"
            checked={frontend.animationsEnabled}
            onChange={(v) => updateFrontend({ animationsEnabled: v })}
          />
          <SettingsToggle
            label="Araç İpuçları"
            checked={frontend.showTooltips}
            onChange={(v) => updateFrontend({ showTooltips: v })}
          />
        </SettingsSection>

        <SettingsSection icon={Volume2} title="Ses Motoru" status="backend">
          <SettingsSelect
            label="Sample Rate"
            value={String(backend.sampleRate)}
            onChange={(v) => updateBackend({ sampleRate: Number(v) })}
            options={[
              { value: '44100', label: '44.1 kHz' },
              { value: '48000', label: '48 kHz' },
              { value: '96000', label: '96 kHz' },
            ]}
          />
          <SettingsSelect
            label="Buffer Size"
            value={String(backend.bufferSize)}
            onChange={(v) => updateBackend({ bufferSize: Number(v) })}
            options={[
              { value: '64', label: '64 samples' },
              { value: '128', label: '128 samples' },
              { value: '256', label: '256 samples' },
              { value: '512', label: '512 samples' },
              { value: '1024', label: '1024 samples' },
            ]}
          />
        </SettingsSection>

        <SettingsSection icon={Cpu} title="İşleme Motoru" status="backend">
          <SettingsSelect
            label="Oversampling"
            value={String(backend.oversampling)}
            onChange={(v) => updateBackend({ oversampling: Number(v) })}
            options={[
              { value: '1', label: '1x (Off)' },
              { value: '2', label: '2x' },
              { value: '4', label: '4x' },
              { value: '8', label: '8x' },
            ]}
          />
          <SettingsToggle
            label="Latency Compensation"
            checked={backend.latencyCompensation}
            onChange={(v) => updateBackend({ latencyCompensation: v })}
          />
        </SettingsSection>
      </motion.div>
    </div>
  )
}
function SettingsSection({ icon: Icon, title, status, children }: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  title: string
  status: 'active' | 'backend'
  children: React.ReactNode
}) {
  return (
    <div className="bg-sultan-surface border border-sultan-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={14} className="text-sultan-accent" />
        <h3 className="text-xs font-semibold text-sultan-text uppercase tracking-wider">{title}</h3>
        {status === 'backend' && (
          <span className="flex items-center gap-1 ml-auto text-[9px] text-sultan-accent/60 font-mono">
            <AlertTriangle size={9} />
            Backend Mock
          </span>
        )}
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  )
}

function SettingsRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-sultan-text-muted">{label}</span>
      {children}
    </div>
  )
}

function SettingsSelect({ label, value, onChange, options }: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-sultan-text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 px-2 rounded-md text-xs bg-sultan-surface-2 border border-sultan-border
          text-sultan-text cursor-pointer focus:outline-none focus:border-sultan-accent/40"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

function SettingsToggle({ label, checked, onChange }: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-sultan-text-muted">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer
          ${checked ? 'bg-sultan-accent' : 'bg-sultan-surface-3'}`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform
            ${checked ? 'translate-x-4' : 'translate-x-0.5'}`}
        />
      </button>
    </div>
  )
}
