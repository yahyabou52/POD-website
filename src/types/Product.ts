export type Product = {
  id: string;
  name: string;
  description: string;
  category: 'tshirt' | 'hoodie' | 'cap' | 'mug';
  colors: string[];
  price: number;
  variants?: string[];
  image: string;
  template: {
    printAreas: {
      front: { x: number; y: number; width: number; height: number };
      back?: { x: number; y: number; width: number; height: number };
    };
  };
};