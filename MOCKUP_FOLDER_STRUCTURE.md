# 📁 Mockup Folder Structure Guide

## Required Structure

```
public/
└── mockups/
    ├── hoodies/
    │   ├── white/
    │   │   ├── front.png
    │   │   ├── back.png
    │   │   ├── hood.png (optional)
    │   │   ├── left-sleeve.png (optional)
    │   │   └── right-sleeve.png (optional)
    │   ├── black/
    │   │   ├── front.png
    │   │   └── back.png
    │   ├── grey/
    │   │   ├── front.png
    │   │   └── back.png
    │   └── blue/
    │       ├── front.png
    │       └── back.png
    │
    ├── tshirts/
    │   ├── white/
    │   │   ├── front.png
    │   │   ├── back.png
    │   │   ├── left-sleeve.png (optional)
    │   │   └── right-sleeve.png (optional)
    │   ├── black/
    │   │   ├── front.png
    │   │   └── back.png
    │   └── grey/
    │       ├── front.png
    │       └── back.png
    │
    ├── caps/
    │   ├── white/
    │   │   ├── front.png
    │   │   └── back.png
    │   └── black/
    │       ├── front.png
    │       └── back.png
    │
    └── mugs/
        ├── white/
        │   ├── front.png
        │   └── back.png
        └── black/
            ├── front.png
            └── back.png
```

## Naming Conventions

### Product Folders (plural)
- `hoodies/` (not `hoodie/`)
- `tshirts/` (not `tshirt/`)
- `caps/` (not `cap/`)
- `mugs/` (not `mug/`)

### Color Folders (lowercase)
- `white/`
- `black/`
- `grey/` (NOT `gray/`)
- `blue/` (for Navy color)
- `red/`

### File Names (lowercase)
- `front.png`
- `back.png`
- `hood.png`
- `left-sleeve.png`
- `right-sleeve.png`

## Color Mapping

Product color names automatically map to folder names:

| Product Color | Folder Name | Example Path |
|--------------|-------------|--------------|
| White | white | `/mockups/hoodies/white/front.png` |
| Black | black | `/mockups/hoodies/black/front.png` |
| Gray | grey | `/mockups/hoodies/grey/front.png` |
| Grey | grey | `/mockups/hoodies/grey/front.png` |
| Navy | blue | `/mockups/hoodies/blue/front.png` |
| Blue | blue | `/mockups/hoodies/blue/front.png` |
| Red | red | `/mockups/hoodies/red/front.png` |

## Image Requirements

### Format
- **PNG** (recommended for transparency)
- **JPG** (acceptable, but no transparency)

### Size
- No specific size requirement (aspect ratio preserved)
- Recommended: 800-1200px width for quality
- Will be scaled down if too large (max 800×1000)

### Quality
- High resolution for best results
- Compressed but not pixelated
- Clear product visibility

## Current Hoodie Setup

Based on your files:

```
public/mockups/hoodies/
├── white/
│   ├── white-front.jpg  ← Should be renamed to: front.png or front.jpg
│   └── white-back.png   ← Should be renamed to: back.png
├── black/
│   ├── black-front.png  ← Should be renamed to: front.png
│   └── black-back.png   ← Should be renamed to: back.png
├── grey/
│   ├── grey-front.png   ← Should be renamed to: front.png
│   └── grey-back.png    ← Should be renamed to: back.png
└── blue/
    ├── blue-front.png   ← Should be renamed to: front.png
    └── blue-back.png    ← Should be renamed to: back.png
```

## Renaming Script (PowerShell)

Run this in the `/public/mockups/hoodies/` directory:

```powershell
# Rename white mockups
Rename-Item "white/white-front.jpg" "white/front.jpg"
Rename-Item "white/white-back.png" "white/back.png"

# Rename black mockups
Rename-Item "black/black-front.png" "black/front.png"
Rename-Item "black/black-back.png" "black/back.png"

# Rename grey mockups
Rename-Item "grey/grey-front.png" "grey/front.png"
Rename-Item "grey/grey-back.png" "grey/back.png"

# Rename blue mockups
Rename-Item "blue/blue-front.png" "blue/front.png"
Rename-Item "blue/blue-back.png" "blue/back.png"
```

## Adding New Products

### Step 1: Create Folder Structure
```
public/mockups/sweatshirts/
├── white/
├── black/
└── grey/
```

### Step 2: Add Mockup Images
Place mockup images with correct names:
- `front.png`
- `back.png`
- etc.

### Step 3: Test
1. Select product in customizer
2. Choose color
3. Verify mockup loads correctly

## Fallback Behavior

If mockup file is not found:

1. **First:** Tries `/mockups/{product}s/{color}/{side}.png`
2. **Second:** Checks product template `colors[].mockups` property
3. **Third:** Uses `views[side].mockup` (Unsplash URLs)
4. **Final:** Shows gradient background with emoji

## Troubleshooting

### Mockup not loading?

**Check:**
1. ✅ File exists in correct location
2. ✅ Folder name is lowercase and plural (`hoodies/` not `Hoodies/`)
3. ✅ Color folder name matches mapping (Gray → grey, Navy → blue)
4. ✅ File name is lowercase (`front.png` not `Front.PNG`)
5. ✅ File extension is correct (`.png` or `.jpg`)

### Wrong mockup showing?

**Check:**
1. ✅ Color name in product template matches folder name
2. ✅ Side name is correct (`front`, `back`, `hood`, etc.)
3. ✅ Browser cache (hard refresh with Ctrl+Shift+R)

### Image looks stretched?

**Check:**
1. ✅ Image is not distorted in source file
2. ✅ Aspect ratio preservation is working (should be automatic)
3. ✅ Canvas is resizing to mockup dimensions

## Best Practices

✅ **Use PNG format** for transparent backgrounds  
✅ **Optimize images** before uploading (compress to ~200-500KB)  
✅ **Maintain aspect ratio** in source images  
✅ **Use consistent naming** across all products  
✅ **Test each color** after adding mockups  
✅ **Version control** mockup files if possible  
✅ **Document sizes** used for each product type  

## Quick Reference

| What | Where | Example |
|------|-------|---------|
| Product folders | `/public/mockups/` | `hoodies/`, `tshirts/` |
| Color folders | Inside product folder | `white/`, `black/`, `grey/` |
| Mockup files | Inside color folder | `front.png`, `back.png` |
| Full path | Complete URL | `/mockups/hoodies/white/front.png` |

---

**Need help?** Check `PRINT_AREA_SYSTEM.md` for complete documentation.
