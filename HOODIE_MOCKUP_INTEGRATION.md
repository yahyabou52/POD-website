# Hoodie Mockup Integration - Complete ✅

## What Was Updated

### 1. Product Templates (`src/config/productTemplates.ts`)

Updated both `hoodie-regular` and `hoodie-oversize` color objects to include `mockups` property:

```typescript
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
]
```

### 2. Canvas Component (Already Configured)

The `SimplePlacementCanvas` component already had the correct logic:

```typescript
// Get mockup image - prioritizes color.mockups over views
const colorData = product?.colors.find(c => c.name === selectedColor)
const mockupUrl = colorData?.mockups?.[currentSide] || product?.views[currentSide]?.mockup
```

**This means:**
- ✅ First checks if selected color has `mockups` object
- ✅ Uses `mockups[currentSide]` (front/back) if available
- ✅ Falls back to `views[currentSide].mockup` if mockups not defined
- ✅ Loads from `/public/` directory (no imports needed)

### 3. File Structure in `/public/mockups/`

```
public/
└── mockups/
    └── hoodies/
        ├── white/
        │   ├── white-front.jpg
        │   └── white-back.png
        ├── black/
        │   ├── black-front.png
        │   └── black-back.png
        ├── grey/
        │   ├── grey-front.png
        │   └── grey-back.png
        └── blue/
            ├── blue-front.png
            └── blue-back.png
```

**Note:** Folder names map to color product names:
- `white` → White
- `black` → Black
- `grey` → Gray
- `blue` → Navy

## How It Works

1. **User selects hoodie product** → ProductWizard
2. **User picks color** → (e.g., "Black")
3. **User picks side** → (e.g., "front")
4. **Canvas renders:**
   - Finds color object: `{ name: 'Black', mockups: { front: '...', back: '...' } }`
   - Gets mockup URL: `mockups.front` → `/mockups/hoodies/black/black-front.png`
   - Loads image from `/public/mockups/hoodies/black/black-front.png`
   - Draws mockup on canvas first
   - Draws user's design on top

## Testing Steps

1. Start dev server: `npm run dev`
2. Navigate to `/customizer`
3. Select "Hoodie" in product wizard
4. Choose any color (White, Black, Gray, Navy)
5. Upload a design
6. Switch between Front/Back sides
7. **Verify:** Correct mockup image loads for each color/side combination

## Expected Behavior

- ✅ White hoodie front → white-front.jpg loads
- ✅ White hoodie back → white-back.png loads
- ✅ Black hoodie front → black-front.png loads
- ✅ Black hoodie back → black-back.png loads
- ✅ Gray hoodie front → grey-front.png loads
- ✅ Gray hoodie back → grey-back.png loads
- ✅ Navy hoodie front → blue-front.png loads
- ✅ Navy hoodie back → blue-back.png loads
- ✅ Design renders on top of mockup
- ✅ No image imports in code (uses /public/ path)

## Adding More Products

To add mockups for other products (T-shirts, Caps, Mugs):

1. **Create folder structure:**
   ```
   public/mockups/
   ├── tshirts/
   │   ├── white/
   │   │   ├── front.png
   │   │   └── back.png
   │   └── black/
   │       ├── front.png
   │       └── back.png
   ```

2. **Update product template:**
   ```typescript
   colors: [
     {
       name: 'White',
       hex: '#FFFFFF',
       image: '/templates/tshirt-white.svg',
       mockups: {
         front: '/mockups/tshirts/white/front.png',
         back: '/mockups/tshirts/white/back.png'
       }
     }
   ]
   ```

3. **That's it!** Canvas will automatically use the mockups.

## Fallback Behavior

If mockups are not defined or fail to load:
- Fallback to `views[side].mockup` (Unsplash URLs)
- If that fails, show gradient background with emoji

This ensures the app never breaks, even with missing mockups.
