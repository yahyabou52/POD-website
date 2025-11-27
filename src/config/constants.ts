export const API_BASE_URL = 'http://localhost:3001/api'

export const PRODUCT_TYPES = {
  TSHIRT: 'tshirt',
  HOODIE: 'hoodie',
  CAP: 'cap',
  MUG: 'mug',
} as const

export const PRODUCT_SIZES = {
  XS: 'xs',
  S: 's',
  M: 'm',
  L: 'l',
  XL: 'xl',
  XXL: 'xxl',
} as const

export const PRODUCT_COLORS = {
  BLACK: '#000000',
  WHITE: '#ffffff',
  NAVY: '#1f2937',
  GRAY: '#6b7280',
  RED: '#ef4444',
  BLUE: '#3b82f6',
  GREEN: '#10b981',
  YELLOW: '#f59e0b',
} as const

export const MAX_DESIGN_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_DESIGN_FORMATS = ['image/png', 'image/jpeg', 'image/svg+xml']