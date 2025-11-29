import type { ProductTemplate, PrintArea } from '@/types/customizer'

// Product templates with full variations
export const PRODUCT_TEMPLATES: Record<string, ProductTemplate> = {
  'tshirt-regular-short': {
    id: 'tshirt-regular-short',
    type: 'tshirt',
    name: 'Regular Fit T-Shirt (Short Sleeve)',
    fitTypes: ['regular'],
    sleeveTypes: ['short'],
    availableSides: ['front', 'back'],
    basePrice: 19.99,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'White', hex: '#FFFFFF', image: '/templates/tshirt-white.png' },
      { name: 'Black', hex: '#000000', image: '/templates/tshirt-black.png' },
      { name: 'Navy', hex: '#1E3A8A', image: '/templates/tshirt-navy.png' },
      { name: 'Gray', hex: '#6B7280', image: '/templates/tshirt-gray.png' },
      { name: 'Red', hex: '#DC2626', image: '/templates/tshirt-red.png' },
    ],
    printAreas: {
      front: { 
        x: 150, y: 100, width: 300, height: 350, 
        maxWidth: 350, maxHeight: 400,
        canvasWidth: 600, canvasHeight: 600
      },
      back: { 
        x: 150, y: 100, width: 300, height: 350, 
        maxWidth: 350, maxHeight: 400,
        canvasWidth: 600, canvasHeight: 600
      },
      'left-sleeve': { x: 0, y: 0, width: 0, height: 0, maxWidth: 0, maxHeight: 0, canvasWidth: 0, canvasHeight: 0 },
      'right-sleeve': { x: 0, y: 0, width: 0, height: 0, maxWidth: 0, maxHeight: 0, canvasWidth: 0, canvasHeight: 0 },
      hood: { x: 0, y: 0, width: 0, height: 0, maxWidth: 0, maxHeight: 0, canvasWidth: 0, canvasHeight: 0 },
    },
  },
  'tshirt-regular-full': {
    id: 'tshirt-regular-full',
    type: 'tshirt',
    name: 'Regular Fit T-Shirt (Full Sleeve)',
    fitTypes: ['regular'],
    sleeveTypes: ['full'],
    availableSides: ['front', 'back', 'left-sleeve', 'right-sleeve'],
    basePrice: 22.99,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'White', hex: '#FFFFFF', image: '/templates/tshirt-white.png' },
      { name: 'Black', hex: '#000000', image: '/templates/tshirt-black.png' },
      { name: 'Navy', hex: '#1E3A8A', image: '/templates/tshirt-navy.png' },
      { name: 'Gray', hex: '#6B7280', image: '/templates/tshirt-gray.png' },
    ],
    printAreas: {
      front: { 
        x: 150, y: 100, width: 300, height: 350, 
        maxWidth: 350, maxHeight: 400,
        canvasWidth: 600, canvasHeight: 600
      },
      back: { 
        x: 150, y: 100, width: 300, height: 350, 
        maxWidth: 350, maxHeight: 400,
        canvasWidth: 600, canvasHeight: 600
      },
      'left-sleeve': { 
        x: 50, y: 50, width: 100, height: 300, 
        maxWidth: 120, maxHeight: 350,
        canvasWidth: 200, canvasHeight: 500
      },
      'right-sleeve': { 
        x: 50, y: 50, width: 100, height: 300, 
        maxWidth: 120, maxHeight: 350,
        canvasWidth: 200, canvasHeight: 500
      },
      hood: { x: 0, y: 0, width: 0, height: 0, maxWidth: 0, maxHeight: 0, canvasWidth: 0, canvasHeight: 0 },
    },
  },
  'tshirt-oversize-short': {
    id: 'tshirt-oversize-short',
    type: 'tshirt',
    name: 'Oversize Fit T-Shirt (Short Sleeve)',
    fitTypes: ['oversize'],
    sleeveTypes: ['short'],
    availableSides: ['front', 'back'],
    basePrice: 24.99,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'White', hex: '#FFFFFF', image: '/templates/tshirt-white.png' },
      { name: 'Black', hex: '#000000', image: '/templates/tshirt-black.png' },
      { name: 'Gray', hex: '#6B7280', image: '/templates/tshirt-gray.png' },
    ],
    printAreas: {
      front: { 
        x: 100, y: 80, width: 400, height: 420, 
        maxWidth: 450, maxHeight: 480,
        canvasWidth: 600, canvasHeight: 650
      },
      back: { 
        x: 100, y: 80, width: 400, height: 420, 
        maxWidth: 450, maxHeight: 480,
        canvasWidth: 600, canvasHeight: 650
      },
      'left-sleeve': { x: 0, y: 0, width: 0, height: 0, maxWidth: 0, maxHeight: 0, canvasWidth: 0, canvasHeight: 0 },
      'right-sleeve': { x: 0, y: 0, width: 0, height: 0, maxWidth: 0, maxHeight: 0, canvasWidth: 0, canvasHeight: 0 },
      hood: { x: 0, y: 0, width: 0, height: 0, maxWidth: 0, maxHeight: 0, canvasWidth: 0, canvasHeight: 0 },
    },
  },
  'tshirt-oversize-full': {
    id: 'tshirt-oversize-full',
    type: 'tshirt',
    name: 'Oversize Fit T-Shirt (Full Sleeve)',
    fitTypes: ['oversize'],
    sleeveTypes: ['full'],
    availableSides: ['front', 'back', 'left-sleeve', 'right-sleeve'],
    basePrice: 27.99,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'White', hex: '#FFFFFF', image: '/templates/tshirt-white.png' },
      { name: 'Black', hex: '#000000', image: '/templates/tshirt-black.png' },
      { name: 'Gray', hex: '#6B7280', image: '/templates/tshirt-gray.png' },
    ],
    printAreas: {
      front: { 
        x: 100, y: 80, width: 400, height: 420, 
        maxWidth: 450, maxHeight: 480,
        canvasWidth: 600, canvasHeight: 650
      },
      back: { 
        x: 100, y: 80, width: 400, height: 420, 
        maxWidth: 450, maxHeight: 480,
        canvasWidth: 600, canvasHeight: 650
      },
      'left-sleeve': { 
        x: 50, y: 50, width: 100, height: 300, 
        maxWidth: 120, maxHeight: 350,
        canvasWidth: 200, canvasHeight: 500
      },
      'right-sleeve': { 
        x: 50, y: 50, width: 100, height: 300, 
        maxWidth: 120, maxHeight: 350,
        canvasWidth: 200, canvasHeight: 500
      },
      hood: { x: 0, y: 0, width: 0, height: 0, maxWidth: 0, maxHeight: 0, canvasWidth: 0, canvasHeight: 0 },
    },
  },
  'hoodie-regular': {
    id: 'hoodie-regular',
    type: 'hoodie',
    name: 'Regular Fit Hoodie',
    fitTypes: ['regular'],
    availableSides: ['front', 'back', 'hood', 'left-sleeve', 'right-sleeve'],
    basePrice: 39.99,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'White', hex: '#FFFFFF', image: '/templates/hoodie-white.png' },
      { name: 'Black', hex: '#000000', image: '/templates/hoodie-black.png' },
      { name: 'Gray', hex: '#6B7280', image: '/templates/hoodie-gray.png' },
      { name: 'Navy', hex: '#1E3A8A', image: '/templates/hoodie-navy.png' },
    ],
    printAreas: {
      front: { 
        x: 150, y: 150, width: 300, height: 300, 
        maxWidth: 350, maxHeight: 350,
        canvasWidth: 600, canvasHeight: 650
      },
      back: { 
        x: 150, y: 100, width: 300, height: 400, 
        maxWidth: 350, maxHeight: 450,
        canvasWidth: 600, canvasHeight: 650
      },
      hood: { 
        x: 100, y: 50, width: 400, height: 150, 
        maxWidth: 450, maxHeight: 180,
        canvasWidth: 600, canvasHeight: 300
      },
      'left-sleeve': { 
        x: 50, y: 50, width: 100, height: 300, 
        maxWidth: 120, maxHeight: 350,
        canvasWidth: 200, canvasHeight: 500
      },
      'right-sleeve': { 
        x: 50, y: 50, width: 100, height: 300, 
        maxWidth: 120, maxHeight: 350,
        canvasWidth: 200, canvasHeight: 500
      },
    },
  },
  'hoodie-oversize': {
    id: 'hoodie-oversize',
    type: 'hoodie',
    name: 'Oversize Fit Hoodie',
    fitTypes: ['oversize'],
    availableSides: ['front', 'back', 'hood', 'left-sleeve', 'right-sleeve'],
    basePrice: 44.99,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'White', hex: '#FFFFFF', image: '/templates/hoodie-white.png' },
      { name: 'Black', hex: '#000000', image: '/templates/hoodie-black.png' },
      { name: 'Gray', hex: '#6B7280', image: '/templates/hoodie-gray.png' },
    ],
    printAreas: {
      front: { 
        x: 100, y: 120, width: 400, height: 350, 
        maxWidth: 450, maxHeight: 400,
        canvasWidth: 600, canvasHeight: 700
      },
      back: { 
        x: 100, y: 80, width: 400, height: 450, 
        maxWidth: 450, maxHeight: 500,
        canvasWidth: 600, canvasHeight: 700
      },
      hood: { 
        x: 80, y: 40, width: 440, height: 180, 
        maxWidth: 480, maxHeight: 200,
        canvasWidth: 600, canvasHeight: 300
      },
      'left-sleeve': { 
        x: 50, y: 50, width: 100, height: 300, 
        maxWidth: 120, maxHeight: 350,
        canvasWidth: 200, canvasHeight: 500
      },
      'right-sleeve': { 
        x: 50, y: 50, width: 100, height: 300, 
        maxWidth: 120, maxHeight: 350,
        canvasWidth: 200, canvasHeight: 500
      },
    },
  },
  'cap-baseball': {
    id: 'cap-baseball',
    type: 'cap',
    name: 'Baseball Cap',
    capTypes: ['baseball'],
    availableSides: ['front', 'back'],
    basePrice: 24.99,
    sizes: ['One Size', 'Youth', 'Adult'],
    colors: [
      { name: 'White', hex: '#FFFFFF', image: '/templates/cap-white.png' },
      { name: 'Black', hex: '#000000', image: '/templates/cap-black.png' },
      { name: 'Navy', hex: '#1E3A8A', image: '/templates/cap-navy.png' },
      { name: 'Red', hex: '#DC2626', image: '/templates/cap-red.png' },
    ],
    printAreas: {
      front: { 
        x: 175, y: 150, width: 250, height: 150, 
        maxWidth: 300, maxHeight: 180,
        canvasWidth: 600, canvasHeight: 500
      },
      back: { 
        x: 200, y: 180, width: 200, height: 100, 
        maxWidth: 250, maxHeight: 120,
        canvasWidth: 600, canvasHeight: 500
      },
      'left-sleeve': { x: 0, y: 0, width: 0, height: 0, maxWidth: 0, maxHeight: 0, canvasWidth: 0, canvasHeight: 0 },
      'right-sleeve': { x: 0, y: 0, width: 0, height: 0, maxWidth: 0, maxHeight: 0, canvasWidth: 0, canvasHeight: 0 },
      hood: { x: 0, y: 0, width: 0, height: 0, maxWidth: 0, maxHeight: 0, canvasWidth: 0, canvasHeight: 0 },
    },
  },
  'cap-trucker': {
    id: 'cap-trucker',
    type: 'cap',
    name: 'Trucker Cap',
    capTypes: ['trucker'],
    availableSides: ['front', 'back'],
    basePrice: 26.99,
    sizes: ['One Size', 'Youth', 'Adult'],
    colors: [
      { name: 'White/Black', hex: '#FFFFFF', image: '/templates/cap-white.png' },
      { name: 'Black/White', hex: '#000000', image: '/templates/cap-black.png' },
      { name: 'Navy/White', hex: '#1E3A8A', image: '/templates/cap-navy.png' },
      { name: 'Red/White', hex: '#DC2626', image: '/templates/cap-red.png' },
    ],
    printAreas: {
      front: { 
        x: 175, y: 150, width: 250, height: 150, 
        maxWidth: 300, maxHeight: 180,
        canvasWidth: 600, canvasHeight: 500
      },
      back: { 
        x: 200, y: 180, width: 200, height: 100, 
        maxWidth: 250, maxHeight: 120,
        canvasWidth: 600, canvasHeight: 500
      },
      'left-sleeve': { x: 0, y: 0, width: 0, height: 0, maxWidth: 0, maxHeight: 0, canvasWidth: 0, canvasHeight: 0 },
      'right-sleeve': { x: 0, y: 0, width: 0, height: 0, maxWidth: 0, maxHeight: 0, canvasWidth: 0, canvasHeight: 0 },
      hood: { x: 0, y: 0, width: 0, height: 0, maxWidth: 0, maxHeight: 0, canvasWidth: 0, canvasHeight: 0 },
    },
  },
  'mug-ceramic': {
    id: 'mug-ceramic',
    type: 'mug',
    name: 'Ceramic Mug',
    mugTypes: ['ceramic'],
    availableSides: ['front', 'back'],
    basePrice: 14.99,
    sizes: ['11oz', '15oz'],
    colors: [
      { name: 'White', hex: '#FFFFFF', image: '/templates/mug-white.png' },
      { name: 'Black', hex: '#000000', image: '/templates/mug-black.png' },
      { name: 'Blue', hex: '#3B82F6', image: '/templates/mug-blue.png' },
    ],
    printAreas: {
      front: { 
        x: 150, y: 120, width: 300, height: 200, 
        maxWidth: 350, maxHeight: 250,
        canvasWidth: 600, canvasHeight: 500
      },
      back: { 
        x: 150, y: 120, width: 300, height: 200, 
        maxWidth: 350, maxHeight: 250,
        canvasWidth: 600, canvasHeight: 500
      },
      'left-sleeve': { x: 0, y: 0, width: 0, height: 0, maxWidth: 0, maxHeight: 0, canvasWidth: 0, canvasHeight: 0 },
      'right-sleeve': { x: 0, y: 0, width: 0, height: 0, maxWidth: 0, maxHeight: 0, canvasWidth: 0, canvasHeight: 0 },
      hood: { x: 0, y: 0, width: 0, height: 0, maxWidth: 0, maxHeight: 0, canvasWidth: 0, canvasHeight: 0 },
    },
  },
  'mug-travel': {
    id: 'mug-travel',
    type: 'mug',
    name: 'Travel Mug',
    mugTypes: ['travel'],
    availableSides: ['front'],
    basePrice: 19.99,
    sizes: ['16oz', '20oz'],
    colors: [
      { name: 'Stainless', hex: '#C0C0C0', image: '/templates/mug-steel.png' },
      { name: 'Black', hex: '#000000', image: '/templates/mug-black.png' },
      { name: 'White', hex: '#FFFFFF', image: '/templates/mug-white.png' },
    ],
    printAreas: {
      front: { 
        x: 150, y: 100, width: 300, height: 250, 
        maxWidth: 350, maxHeight: 300,
        canvasWidth: 600, canvasHeight: 550
      },
      back: { x: 0, y: 0, width: 0, height: 0, maxWidth: 0, maxHeight: 0, canvasWidth: 0, canvasHeight: 0 },
      'left-sleeve': { x: 0, y: 0, width: 0, height: 0, maxWidth: 0, maxHeight: 0, canvasWidth: 0, canvasHeight: 0 },
      'right-sleeve': { x: 0, y: 0, width: 0, height: 0, maxWidth: 0, maxHeight: 0, canvasWidth: 0, canvasHeight: 0 },
      hood: { x: 0, y: 0, width: 0, height: 0, maxWidth: 0, maxHeight: 0, canvasWidth: 0, canvasHeight: 0 },
    },
  },
}

// Helper to get product template by configuration
export function getProductTemplate(
  productType: string,
  fitType?: string,
  sleeveType?: string,
  capType?: string,
  mugType?: string
): ProductTemplate | undefined {
  const key = [productType, fitType, sleeveType, capType, mugType].filter(Boolean).join('-')
  return Object.values(PRODUCT_TEMPLATES).find(t => t.id === key)
}

// Helper functions
export const GRID_SIZE = 20
export const SNAP_THRESHOLD = 10

export function snapToGrid(value: number, gridSize: number = GRID_SIZE): number {
  return Math.round(value / gridSize) * gridSize
}

export function isWithinPrintArea(
  x: number,
  y: number,
  width: number,
  height: number,
  printArea: PrintArea
): boolean {
  return (
    x >= printArea.x &&
    y >= printArea.y &&
    x + width <= printArea.x + printArea.width &&
    y + height <= printArea.y + printArea.height
  )
}

export function calculatePresetPosition(
  position: string,
  printArea: PrintArea,
  elementWidth: number,
  elementHeight: number
): { x: number; y: number } {
  const { x, y, width, height } = printArea

  switch (position) {
    case 'center':
      return { x: x + width / 2 - elementWidth / 2, y: y + height / 2 - elementHeight / 2 }
    case 'top-left':
      return { x: x + 10, y: y + 10 }
    case 'top-center':
      return { x: x + width / 2 - elementWidth / 2, y: y + 10 }
    case 'top-right':
      return { x: x + width - elementWidth - 10, y: y + 10 }
    case 'bottom-left':
      return { x: x + 10, y: y + height - elementHeight - 10 }
    case 'bottom-center':
      return { x: x + width / 2 - elementWidth / 2, y: y + height - elementHeight - 10 }
    case 'bottom-right':
      return { x: x + width - elementWidth - 10, y: y + height - elementHeight - 10 }
    default:
      return { x: x + 10, y: y + 10 }
  }
}
