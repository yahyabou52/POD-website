import type { ProductType } from '@/types/customizer'

export interface PrintAreaPosition {
  x: number
  y: number
  width: number
  height: number
}

export interface ProductPrintAreas {
  [side: string]: {
    [placement: string]: PrintAreaPosition
  }
}

export const PRINT_AREAS: Record<ProductType, ProductPrintAreas> = {
  hoodie: {
    front: {
      topLeft: { x: 210, y: 373, width: 140, height: 115 },
      topRight: { x: 380, y: 373, width: 140, height: 115 },
      centerTop: { x: 275, y: 340, width: 180, height: 115 },
      fullCenter: { x: 200, y: 333, width: 325, height: 285 },
    },
    back: {
      fullBack: { x: 200, y: 400, width: 325, height: 370 },
    },
    'left-sleeve': {
      centered: { x: 50, y: 100, width: 150, height: 300 },
    },
    'right-sleeve': {
      centered: { x: 50, y: 100, width: 150, height: 300 },
    },
  },
  tshirt: {
    front: {
      topLeft: { x: 225, y: 360, width: 140, height: 115 },
      topRight: { x: 395, y: 360, width: 140, height: 115 },
      centerTop: { x: 290, y: 360, width: 180, height: 115 },
      fullCenter: { x: 217, y: 340, width: 325, height: 470 },
    },
    back: {
      fullBack: { x: 200, y: 340, width: 325, height: 470 },
    },  
    'left-sleeve': {
      centered: { x: 50, y: 100, width: 100, height: 250 },
    },
    'right-sleeve': {
      centered: { x: 50, y: 100, width: 100, height: 250 },
    },
    hood: {},
  },
  cap: {
    front: {
      centered: { x: 150, y: 200, width: 400, height: 200 },
    },
    back: {
      centered: { x: 150, y: 200, width: 400, height: 150 },
    },
    'left-sleeve': {},
    'right-sleeve': {},
    hood: {},
  },
  mug: {
    front: {
      centered: { x: 150, y: 150, width: 400, height: 400 },
    },
    back: {
      centered: { x: 150, y: 150, width: 400, height: 400 },
    },
    'left-sleeve': {},
    'right-sleeve': {},
    hood: {},
  },
}

// Helper function to get print area for a product
export function getPrintArea(
  productType: ProductType,
  side: string,
  placement: string
): PrintAreaPosition | null {
  return PRINT_AREAS[productType]?.[side]?.[placement] || null
}

// Helper function to get available placements for a product side
export function getAvailablePlacementsForSide(
  productType: ProductType,
  side: string
): string[] {
  return Object.keys(PRINT_AREAS[productType]?.[side] || {})
}

// Helper function to calculate image dimensions that fit within print area while maintaining aspect ratio
export function calculateFitDimensions(
  imageWidth: number,
  imageHeight: number,
  printArea: PrintAreaPosition
): { width: number; height: number; x: number; y: number } {
  const aspectRatio = imageWidth / imageHeight
  const printAspectRatio = printArea.width / printArea.height

  let finalWidth: number
  let finalHeight: number

  if (aspectRatio > printAspectRatio) {
    // Image is wider - fit to width
    finalWidth = printArea.width
    finalHeight = finalWidth / aspectRatio
  } else {
    // Image is taller - fit to height
    finalHeight = printArea.height
    finalWidth = finalHeight * aspectRatio
  }

  // Center the image within the print area
  const x = printArea.x + (printArea.width - finalWidth) / 2
  const y = printArea.y + (printArea.height - finalHeight) / 2

  return { width: finalWidth, height: finalHeight, x, y }
}

// Helper function to scale design within limits
export function scaleDesign(
  currentWidth: number,
  currentHeight: number,
  scaleFactor: number,
  printArea: PrintAreaPosition,
  minScale: number = 0.3,
  maxScale: number = 1.0
): { width: number; height: number } {
  const aspectRatio = currentWidth / currentHeight

  // Calculate new dimensions
  let newWidth = currentWidth * scaleFactor
  let newHeight = currentHeight * scaleFactor

  // Apply min/max constraints based on print area
  const maxAllowedWidth = printArea.width * maxScale
  const maxAllowedHeight = printArea.height * maxScale
  const minAllowedWidth = printArea.width * minScale
  const minAllowedHeight = printArea.height * minScale

  if (newWidth > maxAllowedWidth) {
    newWidth = maxAllowedWidth
    newHeight = newWidth / aspectRatio
  }

  if (newHeight > maxAllowedHeight) {
    newHeight = maxAllowedHeight
    newWidth = newHeight * aspectRatio
  }

  if (newWidth < minAllowedWidth) {
    newWidth = minAllowedWidth
    newHeight = newWidth / aspectRatio
  }

  if (newHeight < minAllowedHeight) {
    newHeight = minAllowedHeight
    newWidth = newHeight * aspectRatio
  }

  return { width: newWidth, height: newHeight }
}

// Get mockup path for product
export function getMockupPath(
  productType: ProductType,
  color: string,
  side: string
): string {
  const colorLower = color.toLowerCase()
  const sideLower = side.toLowerCase()
  
  // Map color names to folder names if needed
  const colorMap: Record<string, string> = {
    white: 'white',
    black: 'black',
    gray: 'grey',
    grey: 'grey',
    navy: 'blue',
    blue: 'blue',
    red: 'red',
  }
  
  const mappedColor = colorMap[colorLower] || colorLower
  
  return `/mockups/${productType}s/${mappedColor}/${sideLower}.png`
}
