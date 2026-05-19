import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/stores/authStore'
import { LoginPage } from '@/components/auth/LoginPage'
import { Dashboard } from '@/components/layout/Dashboard'
import { AnimatePresence, motion } from 'framer-motion'

export function App() {
  useAuth()
  const { user, loading } = useAuthStore()

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-sultan-bg">
      <AnimatePresence mode="wait">
        {user ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <Dashboard />
          </motion.div>
        ) : (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <LoginPage />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-sultan-bg">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-1 rounded-full bg-sultan-accent"
              animate={{
                height: [8, 24, 8],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
        <span className="text-[10px] text-sultan-text-dim tracking-[0.3em] uppercase">
          Sultan V.X
        </span>
      </motion.div>
    </div>
  )
}
