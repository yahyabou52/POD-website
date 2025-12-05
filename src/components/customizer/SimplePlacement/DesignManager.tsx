import { motion, AnimatePresence } from 'framer-motion'
import { Edit2, Copy, Trash2, ChevronUp, ChevronDown, Layers } from 'lucide-react'
import { useCustomizerStore } from '@/store/customizerStore'
import { PLACEMENT_PRESETS } from '@/config/placementPresets'
import type { ProductSide } from '@/types/customizer'

interface DesignManagerProps {
  currentSide: ProductSide
}

export default function DesignManager({ currentSide }: DesignManagerProps) {
  // Get placements for current side
  const placements = useCustomizerStore((state) => state.placements[currentSide] || [])
  const activePlacementId = useCustomizerStore((state) => state.activePlacementId)
  
  // Store actions
  const setActivePlacement = useCustomizerStore((state) => state.setActivePlacement)
  const removePlacement = useCustomizerStore((state) => state.removePlacement)
  const duplicatePlacement = useCustomizerStore((state) => state.duplicatePlacement)
  const reorderPlacement = useCustomizerStore((state) => state.reorderPlacement)

  // Get zone label from preset
  const getZoneLabel = (zone: string): string => {
    const preset = PLACEMENT_PRESETS[zone]
    return preset?.label || zone
  }

  if (placements.length === 0) {
    return (
      <div className="w-80 bg-white rounded-2xl border border-mist shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-royal/10 flex items-center justify-center">
            <Layers className="w-5 h-5 text-royal" />
          </div>
          <div>
            <h3 className="font-semibold text-onyx">Design Manager</h3>
            <p className="text-xs text-carbon">Manage placements</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-mist flex items-center justify-center mb-4">
            <Layers className="w-8 h-8 text-carbon" />
          </div>
          <p className="text-sm font-medium text-graphite mb-1">No designs yet</p>
          <p className="text-xs text-carbon">
            Upload a design to get started
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white rounded-2xl border border-mist shadow-md flex flex-col max-h-[75vh]">
      {/* Header */}
      <div className="p-6 border-b border-mist flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-royal/10 flex items-center justify-center">
            <Layers className="w-5 h-5 text-royal" />
          </div>
          <div>
            <h3 className="font-semibold text-onyx">Design Manager</h3>
            <p className="text-xs text-carbon">
              {placements.length} {placements.length === 1 ? 'design' : 'designs'} on {currentSide}
            </p>
          </div>
        </div>
      </div>

      {/* Placements List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        <AnimatePresence mode="popLayout">
          {placements.map((placement, index) => {
            const isActive = placement.id === activePlacementId
            const zoneLabel = getZoneLabel(placement.zone)
            const canMoveUp = index > 0
            const canMoveDown = index < placements.length - 1

            return (
              <motion.div
                key={placement.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`
                  relative rounded-xl border-2 transition-all cursor-pointer
                  ${isActive 
                    ? 'border-gold bg-gold/5 shadow-lg' 
                    : 'border-mist bg-white hover:border-carbon hover:shadow-md'
                  }
                `}
                onClick={() => setActivePlacement(placement.id)}
              >
                {/* Placement Content */}
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-mist bg-gray-50 flex-shrink-0">
                      <img
                        src={placement.designId}
                        alt={`Design ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm text-onyx truncate">
                          Placement {index + 1}
                        </h4>
                        {isActive && (
                          <div className="px-2 py-0.5 rounded-full bg-gold text-white text-xs font-medium">
                            Active
                          </div>
                        )}
                      </div>
                      
                      <p className="text-xs text-carbon mb-2">
                        <span className="font-medium">Zone:</span> {zoneLabel}
                      </p>
                      
                      <p className="text-xs text-carbon">
                        <span className="font-medium">Scale:</span> {placement.scale.toFixed(1)}x
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-3 flex items-center gap-2">
                    {/* Edit (Set Active) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setActivePlacement(placement.id)
                      }}
                      className={`
                        flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                        ${isActive
                          ? 'bg-gold text-white'
                          : 'bg-mist text-graphite hover:bg-carbon hover:text-white'
                        }
                      `}
                      title="Edit this placement"
                    >
                      <Edit2 className="w-3 h-3 inline mr-1" />
                      Edit
                    </button>

                    {/* Duplicate */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        duplicatePlacement(placement.id)
                      }}
                      className="px-3 py-1.5 rounded-lg bg-mist text-graphite hover:bg-royal hover:text-white text-xs font-medium transition-all"
                      title="Duplicate this placement"
                    >
                      <Copy className="w-3 h-3" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm('Delete this placement?')) {
                          removePlacement(placement.id)
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-mist text-graphite hover:bg-red-500 hover:text-white text-xs font-medium transition-all"
                      title="Delete this placement"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Reorder Buttons */}
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        reorderPlacement(placement.id, 'up')
                      }}
                      disabled={!canMoveUp}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-mist text-graphite hover:bg-carbon hover:text-white text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-mist disabled:hover:text-graphite"
                      title="Move up (z-index)"
                    >
                      <ChevronUp className="w-3 h-3 inline mr-1" />
                      Move Up
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        reorderPlacement(placement.id, 'down')
                      }}
                      disabled={!canMoveDown}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-mist text-graphite hover:bg-carbon hover:text-white text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-mist disabled:hover:text-graphite"
                      title="Move down (z-index)"
                    >
                      <ChevronDown className="w-3 h-3 inline mr-1" />
                      Move Down
                    </button>
                  </div>
                </div>

                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gold border-2 border-white" />
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-mist bg-mist/30 flex-shrink-0">
        <p className="text-xs text-center text-carbon">
          💡 Click a design to edit, use arrows to adjust z-index
        </p>
      </div>
    </div>
  )
}
