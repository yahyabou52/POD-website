# Hoodie Mockup Testing Checklist

## Quick Test Guide

### 1. White Hoodie
- [ ] Select "Hoodie" → "Regular" → "White"
- [ ] **Front side:** Should show `white-front.jpg`
- [ ] **Back side:** Should show `white-back.png`
- [ ] Upload design → Should render on top of mockup

### 2. Black Hoodie
- [ ] Switch color to "Black"
- [ ] **Front side:** Should show `black-front.png`
- [ ] **Back side:** Should show `black-back.png`
- [ ] Design should be visible on dark background

### 3. Gray Hoodie
- [ ] Switch color to "Gray"
- [ ] **Front side:** Should show `grey-front.png`
- [ ] **Back side:** Should show `grey-back.png`
- [ ] Verify image loads correctly

### 4. Navy Hoodie (Blue folder)
- [ ] Switch color to "Navy"
- [ ] **Front side:** Should show `blue-front.png` (from blue folder)
- [ ] **Back side:** Should show `blue-back.png` (from blue folder)
- [ ] Verify blue/navy mockup displays

### 5. Design Placement
- [ ] Upload a logo/design
- [ ] Select placement (top-left, center-full, etc.)
- [ ] **Verify:** Design appears ON TOP of mockup
- [ ] **Verify:** Design doesn't show behind mockup

### 6. Scale Testing
- [ ] Adjust scale slider (0.5x - 1.5x)
- [ ] **Verify:** Design scales correctly
- [ ] **Verify:** Mockup stays same size (background)

### 7. Preview Generation
- [ ] Click "Generate Preview"
- [ ] **Verify:** Preview shows mockup + design combined
- [ ] Download preview PNG
- [ ] **Verify:** Downloaded image has both mockup and design

## Browser Console Checks

Open DevTools (F12) and check:

```javascript
// No 404 errors for mockup images
// Should see successful loads:
// ✅ /mockups/hoodies/white/white-front.jpg
// ✅ /mockups/hoodies/black/black-front.png
// etc.
```

## Common Issues & Fixes

### Issue: Mockup not loading (404)
**Check:**
- File exists in `/public/mockups/hoodies/<color>/`
- Path matches exactly (case-sensitive)
- File extension is correct (.jpg vs .png)

### Issue: Design appears behind mockup
**Problem:** Canvas draw order is wrong
**Fix:** Already implemented - mockup drawn first, then design

### Issue: Wrong color mockup shows
**Check:**
- Color name in template matches folder name
- Gray → grey folder
- Navy → blue folder

### Issue: Fallback to Unsplash images
**Reason:** Mockups object not found or failed to load
**Expected:** Should use local mockups, not Unsplash

## File Paths Reference

```
Color: White  → Folder: white → Files: white-front.jpg, white-back.png
Color: Black  → Folder: black → Files: black-front.png, black-back.png
Color: Gray   → Folder: grey  → Files: grey-front.png, grey-back.png
Color: Navy   → Folder: blue  → Files: blue-front.png, blue-back.png
```

## Canvas Drawing Order (Correct Implementation)

```
1. Clear canvas
2. Draw mockup image (background)
   ↓
3. Draw design image (foreground)
   ↓
4. Canvas ready for preview/download
```

## Success Criteria

✅ All 4 hoodie colors load correct front mockups
✅ All 4 hoodie colors load correct back mockups  
✅ Design renders on top of mockup (not behind)
✅ No console errors (404s)
✅ Preview generation includes both mockup + design
✅ Download works and shows combined image
✅ No imports in code (uses /public/ paths)

## Next Steps After Testing

If all tests pass:
- [ ] Add mockups for other sides (hood, sleeves) if available
- [ ] Add mockups for T-shirts
- [ ] Add mockups for Caps
- [ ] Add mockups for Mugs
- [ ] Update other product templates with same pattern

## Performance Notes

- Mockup images load asynchronously
- Canvas redraws when: color, side, design, or scale changes
- Images cached by browser after first load
- No performance issues expected with this implementation
