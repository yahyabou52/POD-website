import { create } from 'zustand';
import products from '@/config/products';
import type { Product } from '@/types/Product';

type CatalogState = {
  products: Product[];
  filters: {
    category: string;
    color: string;
    priceRange: [number, number];
  };
  setFilter: (filter: Partial<CatalogState['filters']>) => void;
  resetFilters: () => void;
  getFilteredProducts: () => Product[];
};

export const useCatalogStore = create<CatalogState>((set, get) => ({
  products,
  filters: {
    category: 'all',
    color: 'all',
    priceRange: [0, 100],
  },
  setFilter: (filter) =>
    set((state) => ({ filters: { ...state.filters, ...filter } })),
  resetFilters: () =>
    set(() => ({
      filters: { category: 'all', color: 'all', priceRange: [0, 100] },
    })),
  getFilteredProducts: () => {
    const { products, filters } = get();
    return products.filter((product) => {
      const matchesCategory =
        filters.category === 'all' || product.category === filters.category;
      const matchesColor =
        filters.color === 'all' || product.colors.includes(filters.color);
      const matchesPrice =
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1];
      return matchesCategory && matchesColor && matchesPrice;
    });
  },
}));