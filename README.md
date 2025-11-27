# PODify - Print On Demand E-commerce Website

A modern, feature-rich Print On Demand e-commerce website built with React + Vite + TypeScript. Create custom products with an intuitive design tool and manage your orders seamlessly.

## ✨ Features

### 🎨 Design Customizer
- **Fabric.js Integration**: Powerful canvas-based design editor
- **Upload Support**: PNG, JPEG, SVG file uploads
- **Interactive Tools**: Drag, drop, scale, rotate, and position designs
- **Text & Shapes**: Add custom text and geometric shapes
- **Real-time Preview**: See your design on product mockups instantly

### 🛍️ E-commerce Functionality
- **Product Catalog**: Browse t-shirts, hoodies, caps, and mugs
- **Shopping Cart**: Add items, adjust quantities, and manage orders
- **User Authentication**: Login/register with form validation
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Modern UI**: Beautiful interface with smooth animations

### 📱 Pages & Features
- **Home**: Hero section with featured products
- **Products**: Searchable catalog with filters
- **Customizer**: Advanced design tool with Fabric.js
- **Cart**: Shopping cart with quantity controls
- **Checkout**: Order processing (placeholder)
- **Dashboard**: User account management
- **Authentication**: Login/register pages
- **About & Contact**: Company information

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe development
- **React Router DOM** - Client-side routing

### Styling & UI
- **TailwindCSS** - Utility-first CSS framework
- **ShadCN UI** - Reusable component library
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

### State Management & Forms
- **Zustand** - Lightweight state management
- **React Hook Form** - Performant forms
- **Zod** - Schema validation

### Design Tools
- **Fabric.js** - Canvas manipulation and design tools
- **Custom Controls** - Rotate, scale, position controls

## 🛠️ Installation & Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # ShadCN UI components
│   └── CartSidebar.tsx # Shopping cart sidebar
├── pages/              # Page components
├── layouts/            # Layout components
├── store/              # Zustand stores
├── utils/              # Utility functions
├── config/             # Configuration files
└── features/           # Feature modules
```

## 🎨 Design Customizer Features

### Canvas Tools
- **Upload Images**: Support for PNG, JPEG, SVG files
- **Add Text**: Custom text with font controls
- **Add Shapes**: Basic geometric shapes
- **Layer Management**: Bring to front/back controls

### Object Controls
- **Move**: Drag objects around the canvas
- **Scale**: Resize objects proportionally
- **Rotate**: Rotate objects with precise control
- **Delete**: Remove unwanted elements

## 🚀 Getting Started

1. **Start dev server**: `npm run dev`
2. **Build for production**: `npm run build`
3. **Preview build**: `npm run preview`

## 🎯 Next Steps

### Backend Integration
- [ ] Connect to e-commerce API
- [ ] Payment processing (Stripe/PayPal)
- [ ] Order management system
- [ ] User profile management

### Advanced Features
- [ ] 3D product previews
- [ ] Bulk design uploads
- [ ] Social media sharing
- [ ] Mobile app development

---

**Built with ❤️ using React + Vite + TypeScript**
