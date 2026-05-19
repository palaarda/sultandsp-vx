import { useAuthStore } from '@/stores/authStore'
import { motion } from 'framer-motion'
import { User, Mail, Calendar, Cloud, Shield } from 'lucide-react'

export function ProfilePage() {
  const user = useAuthStore((s) => s.user)

  if (!user) return null

  const joinDate = user.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('tr-TR', {
        year: 'numeric', month: 'long', day: 'numeric'
      })
    : 'Bilinmiyor'

  return (
    <div className="w-full h-full p-4 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[500px] mx-auto space-y-4"
      >
        <h2 className="text-sm font-bold text-sultan-text mb-4">Profil</h2>

        <div className="bg-sultan-surface border border-sultan-border rounded-xl p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-sultan-accent/10 border border-sultan-accent/30 flex items-center justify-center">
            <span className="text-xl font-bold text-sultan-accent">
              {(user.displayName || user.email || 'U')[0].toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-sultan-text">
              {user.displayName || 'Sultan User'}
            </h3>
            <p className="text-xs text-sultan-text-dim">{user.email}</p>
          </div>
        </div>

        <div className="bg-sultan-surface border border-sultan-border rounded-xl p-4 space-y-3">
          <InfoRow icon={User} label="Kullanıcı Adı" value={user.displayName || 'Ayarlanmamış'} />
          <InfoRow icon={Mail} label="E-posta" value={user.email || ''} />
          <InfoRow icon={Calendar} label="Kayıt Tarihi" value={joinDate} />
          <InfoRow icon={Cloud} label="Cloud Sync" value="Aktif" accent />
          <InfoRow icon={Shield} label="Lisans" value="Sultan V.X Pro" accent />
        </div>
      </motion.div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value, accent }: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon size={13} className="text-sultan-text-dim" />
        <span className="text-xs text-sultan-text-muted">{label}</span>
      </div>
      <span className={`text-xs font-mono ${accent ? 'text-sultan-accent' : 'text-sultan-text'}`}>
        {value}
      </span>
    </div>
  )
}
