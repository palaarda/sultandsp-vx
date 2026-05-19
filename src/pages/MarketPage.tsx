import { motion } from 'framer-motion'
import { Store } from 'lucide-react'

export function MarketPage() {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(200,155,60,0.5) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(200,155,60,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-sultan-border/30 rounded-tl-lg pointer-events-none" />
      <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-sultan-border/30 rounded-tr-lg pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-sultan-border/30 rounded-bl-lg pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-sultan-border/30 rounded-br-lg pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="relative w-20 h-20 rounded-2xl flex items-center justify-center
            bg-sultan-surface border border-sultan-accent/25 mb-6"
          style={{
            boxShadow:
              '0 0 32px rgba(200,155,60,0.18), inset 0 0 16px rgba(200,155,60,0.06)',
          }}
        >
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 30%, rgba(200,155,60,0.12) 0%, transparent 70%)',
            }}
          />
          <Store size={32} className="text-sultan-accent relative" />

          <motion.div
            className="absolute inset-0 rounded-2xl border border-sultan-accent/15"
            animate={{ opacity: [0.25, 0.6, 0.25] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[10px] font-bold uppercase tracking-[0.35em] text-sultan-accent mb-3"
        >
          Sultan Market
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-3xl font-bold text-sultan-text tracking-tight mb-3"
          style={{
            backgroundImage:
              'linear-gradient(180deg, #f3eedc 0%, #c89b3c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Coming Soon
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-xs text-sultan-text-muted max-w-md leading-relaxed mb-6"
        >
          Premium amp profilleri, IR paketleri ve sanatçı imza tonları.
          Yakında Sultan Market burada açılıyor.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="w-32 h-px origin-center"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, #c89b3c66 50%, transparent 100%)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-6 flex items-center gap-2 px-3 py-1.5 rounded-full
            bg-sultan-surface border border-sultan-border"
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-sultan-accent"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[10px] font-mono uppercase tracking-wider text-sultan-text-dim">
            Geliştirme Aşamasında
          </span>
        </motion.div>
      </motion.div>
    </div>
  )
}
