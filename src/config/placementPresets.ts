/**
 * Placement Presets Configuration
 * Defines visual metadata and descriptions for each print area placement option
 */

import { 
  AlignLeft, 
  AlignRight, 
  AlignCenter, 
  Maximize2, 
  Square,
  type LucideIcon 
} from 'lucide-react'

export interface PlacementPreset {
  id: string
  label: string
  description: string
  icon: LucideIcon
  category: 'front' | 'back' | 'sleeve' | 'universal'
}

/**
 * Comprehensive placement presets for all product types
 * Maps placement IDs to their visual representation and metadata
 */
export const PLACEMENT_PRESETS: Record<string, PlacementPreset> = {
  // Front placement options (hoodie & t-shirt)
  topLeft: {
    id: 'topLeft',
    label: 'Top Left',
    description: 'Small logo placement on upper left chest',
    icon: AlignLeft,
    category: 'front',
  },
  topRight: {
    id: 'topRight',
    label: 'Top Right',
    description: 'Small logo placement on upper right chest',
    icon: AlignRight,
    category: 'front',
  },
  centerTop: {
    id: 'centerTop',
    label: 'Center Top',
    description: 'Centered placement at chest level',
    icon: AlignCenter,
    category: 'front',
  },
  fullCenter: {
    id: 'fullCenter',
    label: 'Full Center',
    description: 'Large centered design (recommended)',
    icon: Maximize2,
    category: 'front',
  },

  // Back placement options
  fullBack: {
    id: 'fullBack',
    label: 'Full Back',
    description: 'Large back design (full print area)',
    icon: Square,
    category: 'back',
  },

  // Universal/sleeve placement
  centered: {
    id: 'centered',
    label: 'Centered',
    description: 'Centered on available print area',
    icon: AlignCenter,
    category: 'universal',
  },
}

/**
 * Get preset by ID
 */
export function getPlacementPreset(placementId: string): PlacementPreset | null {
  return PLACEMENT_PRESETS[placementId] || null
}

/**
 * Get all presets for a given category
 */
export function getPresetsByCategory(category: PlacementPreset['category']): PlacementPreset[] {
  return Object.values(PLACEMENT_PRESETS).filter(preset => preset.category === category)
}

/**
 * Check if a placement is available for a specific product type and side
 * This integrates with the printAreas configuration
 */
export function isPlacementAvailable(
  placementId: string,
  availablePlacements: string[]
): boolean {
  return availablePlacements.includes(placementId)
}
