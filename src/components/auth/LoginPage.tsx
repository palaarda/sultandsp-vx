import { useState } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { motion, AnimatePresence } from 'framer-motion'

export function LoginPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isRegister) {
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        if (displayName) {
          await updateProfile(cred.user, { displayName })
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (err: any) {
      console.error('Firebase Auth Error:', err?.code, err?.message)
      const code = err?.code || ''
      const errorMap: Record<string, string> = {
        'auth/user-not-found': 'Geçersiz e-posta veya şifre.',
        'auth/wrong-password': 'Geçersiz e-posta veya şifre.',
        'auth/invalid-credential': 'Geçersiz e-posta veya şifre.',
        'auth/email-already-in-use': 'Bu e-posta zaten kayıtlı.',
        'auth/weak-password': 'Şifre en az 6 karakter olmalı.',
        'auth/invalid-email': 'Geçersiz e-posta adresi.',
        'auth/too-many-requests': 'Çok fazla deneme. Lütfen biraz bekleyin.',
        'auth/network-request-failed': 'Ağ bağlantısı hatası. İnternet bağlantınızı kontrol edin.',
        'auth/operation-not-allowed': 'E-posta/şifre girişi Firebase konsolunda etkinleştirilmemiş. Firebase Console > Authentication > Sign-in method > Email/Password seçeneğini aktif edin.',
        'auth/admin-restricted-operation': 'Bu işlem kısıtlanmış. Firebase Console > Authentication > Sign-in method > Email/Password etkinleştirin.',
      }
      setError(errorMap[code] || `Hata: ${code || err?.message || 'Bilinmeyen hata'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-sultan-bg relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(200,155,60,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,155,60,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-sultan-accent/5 blur-[100px] glow-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[400px] mx-4"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-block"
          >
            <SultanLogo />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sultan-text-dim text-xs tracking-[0.3em] uppercase mt-3"
          >
            Neural Amp Modeler
          </motion.p>
        </div>

        <div className="bg-sultan-surface border border-sultan-border rounded-xl p-6 shadow-2xl shadow-black/40">
          <div className="flex mb-6 border-b border-sultan-border">
            <TabButton active={!isRegister} onClick={() => { setIsRegister(false); setError('') }}>
              Giriş Yap
            </TabButton>
            <TabButton active={isRegister} onClick={() => { setIsRegister(true); setError('') }}>
              Kayıt Ol
            </TabButton>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={isRegister ? 'register' : 'login'}
              initial={{ opacity: 0, x: isRegister ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRegister ? -20 : 20 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {isRegister && (
                <InputField
                  label="Kullanıcı Adı"
                  type="text"
                  value={displayName}
                  onChange={setDisplayName}
                  placeholder="Sultan User"
                />
              )}
              <InputField
                label="E-posta"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
                required
              />
              <InputField
                label="Şifre"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                required
              />

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-sultan-red text-xs bg-sultan-red/10 border border-sultan-red/20 rounded-lg px-3 py-2"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 rounded-lg font-semibold text-sm tracking-wide
                  bg-sultan-accent text-sultan-bg
                  hover:bg-sultan-accent/90 active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-150 cursor-pointer
                  shadow-lg shadow-sultan-accent/20"
              >
                {loading ? (
                  <LoadingDots />
                ) : isRegister ? (
                  'Hesap Oluştur'
                ) : (
                  'Giriş Yap'
                )}
              </button>
            </motion.form>
          </AnimatePresence>
        </div>

        <p className="text-center text-sultan-text-dim text-[10px] mt-6 tracking-wider uppercase">
          Sultan DSP &mdash; Pro Audio Technology
        </p>
      </motion.div>
    </div>
  )
}

function SultanLogo() {
  return (
    <svg width="160" height="40" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="8" width="4" height="24" rx="2" fill="#c89b3c" opacity="0.6" />
      <rect x="8" y="4" width="4" height="32" rx="2" fill="#c89b3c" opacity="0.8" />
      <rect x="16" y="0" width="4" height="40" rx="2" fill="#c89b3c" />
      <rect x="24" y="4" width="4" height="32" rx="2" fill="#c89b3c" opacity="0.8" />
      <rect x="32" y="8" width="4" height="24" rx="2" fill="#c89b3c" opacity="0.6" />
      <text x="50" y="28" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="24" letterSpacing="0.08em" fill="#e8e8ec">
        SULTAN
      </text>
      <text x="148" y="17" fontFamily="JetBrains Mono, monospace" fontWeight="600" fontSize="10" fill="#c89b3c">
        V.X
      </text>
    </svg>
  )
}

function TabButton({ active, onClick, children }: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 pb-3 text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer border-b-2 ${
        active
          ? 'text-sultan-accent border-sultan-accent'
          : 'text-sultan-text-dim border-transparent hover:text-sultan-text-muted'
      }`}
    >
      {children}
    </button>
  )
}

function InputField({ label, type, value, onChange, placeholder, required }: {
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-sultan-text-muted mb-1.5 tracking-wider uppercase">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full h-10 px-3 rounded-lg text-sm
          bg-sultan-surface-2 border border-sultan-border
          text-sultan-text placeholder:text-sultan-text-dim
          focus:outline-none focus:border-sultan-accent/50 focus:ring-1 focus:ring-sultan-accent/20
          transition-all duration-150"
      />
    </div>
  )
}

function LoadingDots() {
  return (
    <span className="flex items-center justify-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-sultan-bg"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  )
}
