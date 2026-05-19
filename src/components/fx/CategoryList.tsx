import { motion } from 'framer-motion'
import { ChevronRight, Zap, Speaker, Server, Footprints } from 'lucide-react'
import type { FxCategory, FxSubcategory } from '@/lib/types'

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  footprints: Footprints,
  zap: Zap,
  speaker: Speaker,
  server: Server,
}

interface CategoryListProps {
  categories: FxCategory[]
  selectedCategoryId: string | null
  selectedSubcategoryId: string | null
  onSelectCategory: (id: string) => void
  onSelectSubcategory: (catId: string, subId: string) => void
}

export function CategoryList({
  categories,
  selectedCategoryId,
  selectedSubcategoryId,
  onSelectCategory,
  onSelectSubcategory,
}: CategoryListProps) {
  return (
    <div className="space-y-1">
      {categories.map((cat) => {
        const Icon = iconMap[cat.icon] || Server
        const totalCount = cat.subcategories.reduce((sum, s) => sum + s.devices.length, 0)
        const isFlat = cat.subcategories.length <= 1
        const isActive = selectedCategoryId === cat.id
        const isExpanded = isActive && !isFlat

        return (
          <div key={cat.id}>
            <button
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full flex items-center gap-2 h-8 px-2.5 rounded-lg
                text-xs font-medium transition-all cursor-pointer
                ${isActive
                  ? 'bg-sultan-accent/10 text-sultan-accent'
                  : 'text-sultan-text-muted hover:text-sultan-text hover:bg-sultan-surface-2'
                }`}
            >
              <Icon size={13} />
              <span className="flex-1 text-left truncate">{cat.name}</span>
              <span className="text-[9px] text-sultan-text-dim font-mono">
                {totalCount}
              </span>
              {!isFlat && (
                <ChevronRight
                  size={12}
                  className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                />
              )}
            </button>

            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="ml-4 mt-0.5 space-y-0.5 overflow-hidden"
              >
                {cat.subcategories.map((sub) => (
                  <SubcategoryItem
                    key={sub.id}
                    subcategory={sub}
                    active={selectedSubcategoryId === sub.id}
                    onClick={() => onSelectSubcategory(cat.id, sub.id)}
                  />
                ))}
              </motion.div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function SubcategoryItem({ subcategory, active, onClick }: {
  subcategory: FxSubcategory
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 h-7 px-2 rounded-md
        text-[11px] transition-colors cursor-pointer
        ${active
          ? 'bg-sultan-surface-3 text-sultan-text'
          : 'text-sultan-text-dim hover:text-sultan-text hover:bg-sultan-surface-2'
        }`}
    >
      <div className={`w-1 h-1 rounded-full ${active ? 'bg-sultan-accent' : 'bg-sultan-text-dim'}`} />
      <span className="flex-1 text-left truncate">{subcategory.name}</span>
      <span className="text-[9px] font-mono text-sultan-text-dim">{subcategory.devices.length}</span>
    </button>
  )
}
