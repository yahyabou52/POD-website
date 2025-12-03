import type { ProductSide } from '@/types/customizer'

export interface PlacementConfig {
  x: number
  y: number
  size: number
  label: string
}

export interface DesignData {
  image: string // base64 or URL
  placement: string
  scale: number // 0.5 to 1.5
  side: ProductSide
  color: string
  size: string
  productId: string
}

export interface PreviewData {
  preview: string // base64 PNG
  design: DesignData
  timestamp: number
}
