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
      { 
        name: 'White', 
        hex: '#FFFFFF', 
        image: '/templates/tshirt-white.svg',
        mockups: {
          front: '/mockups/tshirts/white/white-front.png',
          back: '/mockups/tshirts/white/white-back.png'
        }
      },
      { 
        name: 'Black', 
        hex: '#000000', 
        image: '/templates/tshirt-black.svg',
        mockups: {
          front: '/mockups/tshirts/black/balck-front.png',
          back: '/mockups/tshirts/black/black-back.png'
        }
      },
      { 
        name: 'Navy', 
        hex: '#1E3A8A', 
        image: '/templates/tshirt-navy.svg',
        mockups: {
          front: '/mockups/tshirts/blue/blue-front.png',
          back: '/mockups/tshirts/blue/blue-back.png'
        }
      },
      { 
        name: 'Gray', 
        hex: '#6B7280', 
        image: '/templates/tshirt-gray.svg',
        mockups: {
          front: '/mockups/tshirts/grey/grey-front.png',
          back: '/mockups/tshirts/grey/grey-back.png'
        }
      },
      { 
        name: 'Red', 
        hex: '#DC2626', 
        image: '/templates/tshirt-red.svg',
        mockups: {
          front: '/mockups/tshirts/red/red-front.png',
          back: '/mockups/tshirts/red/red-back.png'
        }
      },
    ],
    views: {
      front: {
        mockup: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=1600&fit=crop&q=90',
        mask: 'https://via.placeholder.com/300x350/000000/000000?text=',
        area: { x: 250, y: 300, width: 300, height: 350 }
      },
      back: {
        mockup: 'https://images.unsplash.com/photo-1622445275576-721325763afe?w=1200&h=1600&fit=crop&q=90',
        mask: 'https://via.placeholder.com/300x350/000000/000000?text=',
        area: { x: 250, y: 300, width: 300, height: 350 }
      },
      'left-sleeve': { mockup: '', area: { x: 0, y: 0, width: 0, height: 0 } },
      'right-sleeve': { mockup: '', area: { x: 0, y: 0, width: 0, height: 0 } },
      hood: { mockup: '', area: { x: 0, y: 0, width: 0, height: 0 } },
    },
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
      { 
        name: 'White', 
        hex: '#FFFFFF', 
        image: '/templates/tshirt-white.svg',
        mockups: {
          front: '/mockups/tshirts/white/white-front.png',
          back: '/mockups/tshirts/white/white-back.png'
        }
      },
      { 
        name: 'Black', 
        hex: '#000000', 
        image: '/templates/tshirt-black.svg',
        mockups: {
          front: '/mockups/tshirts/black/balck-front.png',
          back: '/mockups/tshirts/black/black-back.png'
        }
      },
      { 
        name: 'Navy', 
        hex: '#1E3A8A', 
        image: '/templates/tshirt-navy.svg',
        mockups: {
          front: '/mockups/tshirts/blue/blue-front.png',
          back: '/mockups/tshirts/blue/blue-back.png'
        }
      },
      { 
        name: 'Gray', 
        hex: '#6B7280', 
        image: '/templates/tshirt-gray.svg',
        mockups: {
          front: '/mockups/tshirts/grey/grey-front.png',
          back: '/mockups/tshirts/grey/grey-back.png'
        }
      },
    ],
    views: {
      front: {
        mockup: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1200&fit=crop',
        mask: 'https://via.placeholder.com/300x350/000000/000000?text=',
        area: { x: 250, y: 300, width: 300, height: 350 }
      },
      back: {
        mockup: 'https://images.unsplash.com/photo-1622445275576-721325763afe?w=800&h=1200&fit=crop',
        mask: 'https://via.placeholder.com/300x350/000000/000000?text=',
        area: { x: 250, y: 300, width: 300, height: 350 }
      },
      'left-sleeve': {
        mockup: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1200&fit=crop',
        area: { x: 350, y: 400, width: 100, height: 300 }
      },
      'right-sleeve': {
        mockup: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1200&fit=crop',
        area: { x: 350, y: 400, width: 100, height: 300 }
      },
      hood: { mockup: '', area: { x: 0, y: 0, width: 0, height: 0 } },
    },
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
      { 
        name: 'White', 
        hex: '#FFFFFF', 
        image: '/templates/tshirt-white.svg',
        mockups: {
          front: '/mockups/tshirts/white/white-front.png',
          back: '/mockups/tshirts/white/white-back.png'
        }
      },
      { 
        name: 'Black', 
        hex: '#000000', 
        image: '/templates/tshirt-black.svg',
        mockups: {
          front: '/mockups/tshirts/black/balck-front.png',
          back: '/mockups/tshirts/black/black-back.png'
        }
      },
      { 
        name: 'Gray', 
        hex: '#6B7280', 
        image: '/templates/tshirt-gray.svg',
        mockups: {
          front: '/mockups/tshirts/grey/grey-front.png',
          back: '/mockups/tshirts/grey/grey-back.png'
        }
      },
    ],
    views: {
      front: {
        mockup: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1200&fit=crop',
        mask: 'https://via.placeholder.com/400x420/000000/000000?text=',
        area: { x: 200, y: 280, width: 400, height: 420 }
      },
      back: {
        mockup: 'https://images.unsplash.com/photo-1622445275576-721325763afe?w=800&h=1200&fit=crop',
        mask: 'https://via.placeholder.com/400x420/000000/000000?text=',
        area: { x: 200, y: 280, width: 400, height: 420 }
      },
      'left-sleeve': { mockup: '', area: { x: 0, y: 0, width: 0, height: 0 } },
      'right-sleeve': { mockup: '', area: { x: 0, y: 0, width: 0, height: 0 } },
      hood: { mockup: '', area: { x: 0, y: 0, width: 0, height: 0 } },
    },
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
      { 
        name: 'White', 
        hex: '#FFFFFF', 
        image: '/templates/tshirt-white.svg',
        mockups: {
          front: '/mockups/tshirts/white/white-front.png',
          back: '/mockups/tshirts/white/white-back.png'
        }
      },
      { 
        name: 'Black', 
        hex: '#000000', 
        image: '/templates/tshirt-black.svg',
        mockups: {
          front: '/mockups/tshirts/black/balck-front.png',
          back: '/mockups/tshirts/black/black-back.png'
        }
      },
      { 
        name: 'Gray', 
        hex: '#6B7280', 
        image: '/templates/tshirt-gray.svg',
        mockups: {
          front: '/mockups/tshirts/grey/grey-front.png',
          back: '/mockups/tshirts/grey/grey-back.png'
        }
      },
    ],
    views: {
      front: {
        mockup: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1200&fit=crop',
        mask: 'https://via.placeholder.com/400x420/000000/000000?text=',
        area: { x: 200, y: 280, width: 400, height: 420 }
      },
      back: {
        mockup: 'https://images.unsplash.com/photo-1622445275576-721325763afe?w=800&h=1200&fit=crop',
        mask: 'https://via.placeholder.com/400x420/000000/000000?text=',
        area: { x: 200, y: 280, width: 400, height: 420 }
      },
      'left-sleeve': {
        mockup: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1200&fit=crop',
        area: { x: 350, y: 400, width: 100, height: 300 }
      },
      'right-sleeve': {
        mockup: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1200&fit=crop',
        area: { x: 350, y: 400, width: 100, height: 300 }
      },
      hood: { mockup: '', area: { x: 0, y: 0, width: 0, height: 0 } },
    },
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
    availableSides: ['front', 'back', 'left-sleeve', 'right-sleeve'],
    basePrice: 39.99,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { 
        name: 'White', 
        hex: '#FFFFFF', 
        image: '/templates/hoodie-white.svg',
        mockups: {
          front: '/mockups/hoodies/white/white-front.jpg',
          back: '/mockups/hoodies/white/white-back.png'
        }
      },
      { 
        name: 'Black', 
        hex: '#000000', 
        image: '/templates/hoodie-black.svg',
        mockups: {
          front: '/mockups/hoodies/black/black-front.png',
          back: '/mockups/hoodies/black/black-back.png'
        }
      },
      { 
        name: 'Gray', 
        hex: '#6B7280', 
        image: '/templates/hoodie-gray.svg',
        mockups: {
          front: '/mockups/hoodies/grey/grey-front.png',
          back: '/mockups/hoodies/grey/grey-back.png'
        }
      },
      { 
        name: 'Navy', 
        hex: '#1E3A8A', 
        image: '/templates/hoodie-navy.svg',
        mockups: {
          front: '/mockups/hoodies/blue/blue-front.png',
          back: '/mockups/hoodies/blue/blue-back.png'
        }
      },
    ],
    views: {
      front: {
        mockup: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1200&fit=crop',
        mask: 'https://via.placeholder.com/300x300/000000/000000?text=',
        area: { x: 250, y: 350, width: 300, height: 300 }
      },
      back: {
        mockup: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1200&fit=crop',
        mask: 'https://via.placeholder.com/300x400/000000/000000?text=',
        area: { x: 250, y: 300, width: 300, height: 400 }
      },
      hood: {
        mockup: 'https://images.unsplash.com/photo-1620799140834-6b8f844fbe61?w=800&h=1200&fit=crop',
        area: { x: 200, y: 450, width: 400, height: 150 }
      },
      'left-sleeve': {
        mockup: 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?w=800&h=1200&fit=crop',
        area: { x: 350, y: 400, width: 100, height: 300 }
      },
      'right-sleeve': {
        mockup: 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?w=800&h=1200&fit=crop',
        area: { x: 350, y: 400, width: 100, height: 300 }
      },
    },
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
    availableSides: ['front', 'back', 'left-sleeve', 'right-sleeve'],
    basePrice: 44.99,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { 
        name: 'White', 
        hex: '#FFFFFF', 
        image: '/templates/hoodie-white.svg',
        mockups: {
          front: '/mockups/hoodies/white/white-front.jpg',
          back: '/mockups/hoodies/white/white-back.png'
        }
      },
      { 
        name: 'Black', 
        hex: '#000000', 
        image: '/templates/hoodie-black.svg',
        mockups: {
          front: '/mockups/hoodies/black/black-front.png',
          back: '/mockups/hoodies/black/black-back.png'
        }
      },
      { 
        name: 'Gray', 
        hex: '#6B7280', 
        image: '/templates/hoodie-gray.svg',
        mockups: {
          front: '/mockups/hoodies/grey/grey-front.png',
          back: '/mockups/hoodies/grey/grey-back.png'
        }
      },
    ],
    views: {
      front: {
        mockup: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1200&fit=crop',
        mask: 'https://via.placeholder.com/400x350/000000/000000?text=',
        area: { x: 200, y: 320, width: 400, height: 350 }
      },
      back: {
        mockup: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1200&fit=crop',
        mask: 'https://via.placeholder.com/400x450/000000/000000?text=',
        area: { x: 200, y: 280, width: 400, height: 450 }
      },
      hood: {
        mockup: 'https://images.unsplash.com/photo-1620799140834-6b8f844fbe61?w=800&h=1200&fit=crop',
        area: { x: 180, y: 440, width: 440, height: 180 }
      },
      'left-sleeve': {
        mockup: 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?w=800&h=1200&fit=crop',
        area: { x: 350, y: 400, width: 100, height: 300 }
      },
      'right-sleeve': {
        mockup: 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?w=800&h=1200&fit=crop',
        area: { x: 350, y: 400, width: 100, height: 300 }
      },
    },
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
      { name: 'White', hex: '#FFFFFF', image: '/templates/cap-white.svg' },
      { name: 'Black', hex: '#000000', image: '/templates/cap-black.svg' },
      { name: 'Navy', hex: '#1E3A8A', image: '/templates/cap-navy.svg' },
      { name: 'Red', hex: '#DC2626', image: '/templates/cap-red.svg' },
    ],
    views: {
      front: {
        mockup: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=1200&fit=crop',
        mask: 'https://via.placeholder.com/250x150/000000/000000?text=',
        area: { x: 275, y: 450, width: 250, height: 150 }
      },
      back: {
        mockup: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=800&h=1200&fit=crop',
        area: { x: 300, y: 480, width: 200, height: 100 }
      },
      'left-sleeve': { mockup: '', area: { x: 0, y: 0, width: 0, height: 0 } },
      'right-sleeve': { mockup: '', area: { x: 0, y: 0, width: 0, height: 0 } },
      hood: { mockup: '', area: { x: 0, y: 0, width: 0, height: 0 } },
    },
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
      { name: 'White/Black', hex: '#FFFFFF', image: '/templates/cap-white.svg' },
      { name: 'Black/White', hex: '#000000', image: '/templates/cap-black.svg' },
      { name: 'Navy/White', hex: '#1E3A8A', image: '/templates/cap-navy.svg' },
      { name: 'Red/White', hex: '#DC2626', image: '/templates/cap-red.svg' },
    ],
    views: {
      front: {
        mockup: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=1200&fit=crop',
        mask: 'https://via.placeholder.com/250x150/000000/000000?text=',
        area: { x: 275, y: 450, width: 250, height: 150 }
      },
      back: {
        mockup: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=800&h=1200&fit=crop',
        area: { x: 300, y: 480, width: 200, height: 100 }
      },
      'left-sleeve': { mockup: '', area: { x: 0, y: 0, width: 0, height: 0 } },
      'right-sleeve': { mockup: '', area: { x: 0, y: 0, width: 0, height: 0 } },
      hood: { mockup: '', area: { x: 0, y: 0, width: 0, height: 0 } },
    },
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
      { name: 'White', hex: '#FFFFFF', image: '/templates/mug-white.svg' },
      { name: 'Black', hex: '#000000', image: '/templates/mug-black.svg' },
      { name: 'Blue', hex: '#3B82F6', image: '/templates/mug-blue.svg' },
    ],
    views: {
      front: {
        mockup: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&h=1200&fit=crop',
        mask: 'https://via.placeholder.com/300x200/000000/000000?text=',
        area: { x: 250, y: 420, width: 300, height: 200 }
      },
      back: {
        mockup: 'https://images.unsplash.com/photo-1556911261-6bd341186b2f?w=800&h=1200&fit=crop',
        mask: 'https://via.placeholder.com/300x200/000000/000000?text=',
        area: { x: 250, y: 420, width: 300, height: 200 }
      },
      'left-sleeve': { mockup: '', area: { x: 0, y: 0, width: 0, height: 0 } },
      'right-sleeve': { mockup: '', area: { x: 0, y: 0, width: 0, height: 0 } },
      hood: { mockup: '', area: { x: 0, y: 0, width: 0, height: 0 } },
    },
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
      { name: 'Stainless', hex: '#C0C0C0', image: '/templates/mug-steel.svg' },
      { name: 'Black', hex: '#000000', image: '/templates/mug-black.svg' },
      { name: 'White', hex: '#FFFFFF', image: '/templates/mug-white.svg' },
    ],
    views: {
      front: {
        mockup: 'https://images.unsplash.com/photo-1534056217147-5602c89e0e7b?w=800&h=1200&fit=crop',
        mask: 'https://via.placeholder.com/300x250/000000/000000?text=',
        area: { x: 250, y: 400, width: 300, height: 250 }
      },
      back: { mockup: '', area: { x: 0, y: 0, width: 0, height: 0 } },
      'left-sleeve': { mockup: '', area: { x: 0, y: 0, width: 0, height: 0 } },
      'right-sleeve': { mockup: '', area: { x: 0, y: 0, width: 0, height: 0 } },
      hood: { mockup: '', area: { x: 0, y: 0, width: 0, height: 0 } },
    },
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
