import { Product } from '@/types/Product';

const products: Product[] = [
  {
    id: '1',
    name: 'Classic White T-Shirt',
    description: 'A timeless classic white t-shirt.',
    category: 'tshirt',
    colors: ['white', 'black', 'blue'],
    price: 19.99,
    variants: ['S', 'M', 'L', 'XL'],
    image: '/src/assets/products/tshirt-white.jpg',
    template: {
      printAreas: {
        front: { x: 50, y: 50, width: 300, height: 400 },
        back: { x: 50, y: 50, width: 300, height: 400 },
      },
    },
  },
  {
    id: '2',
    name: 'Premium Black Hoodie',
    description: 'A premium black hoodie for ultimate comfort.',
    category: 'hoodie',
    colors: ['black', 'gray', 'navy'],
    price: 39.99,
    variants: ['M', 'L', 'XL'],
    image: '/src/assets/products/hoodie-black.jpg',
    template: {
      printAreas: {
        front: { x: 60, y: 60, width: 280, height: 380 },
        back: { x: 60, y: 60, width: 280, height: 380 },
      },
    },
  },
  {
    id: '3',
    name: 'Baseball Cap',
    description: 'A stylish baseball cap.',
    category: 'cap',
    colors: ['red', 'blue', 'green'],
    price: 24.99,
    image: '/src/assets/products/cap.jpg',
    template: {
      printAreas: {
        front: { x: 30, y: 30, width: 100, height: 50 },
      },
    },
  },
  {
    id: '4',
    name: 'Coffee Mug',
    description: 'A ceramic coffee mug.',
    category: 'mug',
    colors: ['white', 'black'],
    price: 14.99,
    image: '/src/assets/products/mug.jpg',
    template: {
      printAreas: {
        front: { x: 20, y: 20, width: 200, height: 100 },
      },
    },
  },
];

export default products;