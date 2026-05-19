import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

interface AddNamCardProps {
  onImportNam?: (file: File) => void | Promise<void>
}

export function AddNamCard({ onImportNam }: AddNamCardProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [hover, setHover] = useState(false)
  const [busy, setBusy] = useState(false)

  function handleClick() {
    inputRef.current?.click()
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setBusy(true)
    try {
      if (onImportNam) {
        await onImportNam(file)
      } else {
        await mockImport(file)
      }
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.99 }}
      className="relative bg-sultan-surface border border-dashed border-sultan-border rounded-xl
        overflow-hidden hover:border-sultan-accent/40 transition-colors cursor-pointer group"
      role="button"
      aria-label=".NAM profili ekle"
    >
      <input
        ref={inputRef}
        type="file"
        accept=".nam"
        onChange={handleFile}
        className="hidden"
      />

      <div
        className="relative w-full overflow-hidden flex items-center justify-center"
        style={{
          height: 96,
          background: 'radial-gradient(ellipse at center, #c89b3c12 0%, transparent 65%), #0c0c10',
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)',
            backgroundSize: '12px 12px',
          }}
        />

        <motion.div
          animate={{
            scale: hover ? 1.08 : 1,
            rotate: hover ? 90 : 0,
          }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-14 h-14 rounded-2xl flex items-center justify-center
            bg-sultan-accent/10 border border-sultan-accent/30
            group-hover:bg-sultan-accent/15 group-hover:border-sultan-accent/50 transition-colors"
          style={{
            boxShadow: hover
              ? '0 0 24px rgba(200,155,60,0.25), inset 0 0 12px rgba(200,155,60,0.08)'
              : 'inset 0 0 8px rgba(200,155,60,0.05)',
          }}
        >
          <Plus
            size={28}
            strokeWidth={2}
            className="text-sultan-accent"
          />
        </motion.div>

        <span
          className="absolute top-1.5 left-1.5 text-[9px] font-bold uppercase tracking-wider
            px-1.5 py-0.5 rounded-md backdrop-blur-sm"
          style={{
            backgroundColor: '#c89b3c25',
            color: '#c89b3c',
            border: '0.5px solid #c89b3c40',
          }}
        >
          NAM
        </span>
      </div>

      <div className="p-2.5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-semibold text-sultan-text truncate">
              {busy ? 'Yükleniyor…' : 'Add NAM Profile'}
            </h3>
            <p className="text-[10px] text-sultan-text-dim font-mono truncate">
              .nam · external
            </p>
          </div>
        </div>

        <p className="text-[10px] text-sultan-text-dim leading-relaxed line-clamp-2 mb-2 min-h-[26px]">
          Dışarıdan .NAM amp profili içe aktar. Dosyanı seç ve kütüphanene ekle.
        </p>

        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 flex-wrap min-w-0">
            <span className="text-[8px] text-sultan-text-dim bg-sultan-surface-2 px-1.5 py-0.5 rounded">
              import
            </span>
            <span className="text-[8px] text-sultan-text-dim bg-sultan-surface-2 px-1.5 py-0.5 rounded">
              .nam
            </span>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-md
              bg-sultan-accent/10 text-sultan-accent text-[10px] font-medium
              group-hover:bg-sultan-accent/20 transition-colors"
          >
            <Plus size={10} />
            Ekle
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
async function mockImport(file: File) {
  await new Promise((r) => setTimeout(r, 600))
  // eslint-disable-next-line no-console
  console.info('[Sultan DSP] Mock NAM import:', {
    name: file.name,
    size: file.size,
    type: file.type,
  })
}
