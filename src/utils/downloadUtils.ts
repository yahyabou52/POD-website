import type { ProductTemplate, ProductSide, DesignElement } from '@/types/customizer'
import html2canvas from 'html2canvas'

/**
 * Export mockup using html2canvas (captures the entire mockup container)
 */
export async function exportMockupWithHtml2Canvas(
  elementId: string,
  filename?: string
): Promise<void> {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`)
  }

  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2, // Higher quality
    logging: false,
    useCORS: true,
    allowTaint: true,
  })

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to generate image'))
        }
      },
      'image/png',
      1.0
    )
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename || `product-mockup-${Date.now()}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Generate a downloadable product image with designs applied
 */
export async function generateProductImage(
  product: ProductTemplate,
  side: ProductSide,
  designs: DesignElement[]
): Promise<Blob> {
  const view = product.views[side]
  if (!view?.mockup) {
    throw new Error('No mockup available for this view')
  }

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Failed to get canvas context')
  }

  // Load mockup image
  const mockupImg = await loadImage(view.mockup)
  
  // Set canvas size to mockup dimensions (high quality)
  canvas.width = mockupImg.width
  canvas.height = mockupImg.height

  // Draw mockup
  ctx.drawImage(mockupImg, 0, 0, canvas.width, canvas.height)

  // Create design layer
  const designCanvas = document.createElement('canvas')
  designCanvas.width = canvas.width
  designCanvas.height = canvas.height
  const designCtx = designCanvas.getContext('2d')
  if (!designCtx) {
    throw new Error('Failed to get design canvas context')
  }

  const printArea = product.printAreas[side]

  // Draw all designs
  for (const design of designs.sort((a, b) => a.zIndex - b.zIndex)) {
    if (design.type === 'image' && design.src) {
      const designImg = await loadImage(design.src)

      // Calculate relative position within print area
      const relativeX = (design.x - printArea.x) / printArea.width
      const relativeY = (design.y - printArea.y) / printArea.height
      const relativeWidth = design.width / printArea.width
      const relativeHeight = design.height / printArea.height

      // Map to view area on mockup
      const drawX = view.area.x + relativeX * view.area.width
      const drawY = view.area.y + relativeY * view.area.height
      const drawWidth = relativeWidth * view.area.width
      const drawHeight = relativeHeight * view.area.height

      // Apply rotation if any
      if (design.rotation && design.rotation !== 0) {
        designCtx.save()
        designCtx.translate(drawX + drawWidth / 2, drawY + drawHeight / 2)
        designCtx.rotate((design.rotation * Math.PI) / 180)
        designCtx.drawImage(designImg, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)
        designCtx.restore()
      } else {
        designCtx.drawImage(designImg, drawX, drawY, drawWidth, drawHeight)
      }
    }
  }

  // Apply mask if provided
  if (view.mask) {
    const maskImg = await loadImage(view.mask)
    designCtx.globalCompositeOperation = 'destination-in'
    designCtx.drawImage(maskImg, view.area.x, view.area.y, view.area.width, view.area.height)
    designCtx.globalCompositeOperation = 'source-over'
  }

  // Composite design layer onto main canvas
  ctx.drawImage(designCanvas, 0, 0)

  // Convert to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to generate image'))
        }
      },
      'image/png',
      1.0 // Maximum quality
    )
  })
}

/**
 * Download product image
 */
export async function downloadProductImage(
  product: ProductTemplate,
  side: ProductSide,
  designs: DesignElement[],
  filename?: string
): Promise<void> {
  const blob = await generateProductImage(product, side, designs)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename || `${product.name}-${side}-${Date.now()}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Load image and return promise
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}
