import { motion } from 'framer-motion'

interface RockerSwitchProps {
  
  value: number
  onChange: (value: number) => void
  width: number
  height: number
  disabled?: boolean
  title?: string
}

export function RockerSwitch({
  value,
  onChange,
  width,
  height,
  disabled = false,
  title,
}: RockerSwitchProps) {
  const isDown = value >= 0.5
  const leverH = height * 0.34
  const pad = height * 0.1

  const setTop = () => {
    if (!disabled) onChange(0)
  }
  const setBottom = () => {
    if (!disabled) onChange(1)
  }
  const toggle = () => {
    if (!disabled) onChange(isDown ? 0 : 1)
  }

  return (
    <button
      type="button"
      disabled={disabled}
      data-device-control
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation()
        toggle()
      }}
      className="relative rounded-[2px] cursor-pointer focus:outline-none
        disabled:cursor-not-allowed disabled:opacity-40"
      style={{ width, height }}
      title={title}
    >
      <motion.div
        className="absolute inset-0 rounded-[2px] overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #222228 0%, #101014 50%, #1e1e26 100%)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.7), inset 0 -1px 0 rgba(255,255,255,0.05)',
          border: '0.5px solid rgba(0,0,0,0.6)',
        }}
      />

      <span
        className="absolute inset-x-0 top-0 z-10"
        style={{ height: '50%' }}
        onClick={(e) => {
          e.stopPropagation()
          setTop()
        }}
        aria-hidden
      />
      <span
        className="absolute inset-x-0 bottom-0 z-10"
        style={{ height: '50%' }}
        onClick={(e) => {
          e.stopPropagation()
          setBottom()
        }}
        aria-hidden
      />

      <motion.div
        className="absolute z-20 rounded-[1px] pointer-events-none"
        initial={false}
        animate={{ top: isDown ? height - leverH - pad : pad }}
        transition={{ type: 'spring', stiffness: 520, damping: 32 }}
        style={{
          left: '28%',
          right: '28%',
          height: leverH,
          background: 'linear-gradient(180deg, #ececf0 0%, #9898a0 40%, #6a6a72 75%, #b8b8c0 100%)',
          boxShadow: isDown
            ? '0 1px 3px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.45)'
            : '0 -1px 2px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.5)',
        }}
      />
    </button>
  )
}
