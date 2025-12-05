# Customizer Test Suggestions

**Generated:** 2025-12-04

This document outlines comprehensive test cases for the Customizer page, covering unit tests, integration tests, and end-to-end tests.

---

## Unit Tests

### 1. `SimplePlacementCanvas.test.tsx`

**Test Suite:** Canvas Rendering

```typescript
describe('SimplePlacementCanvas', () => {
  it('renders canvas element', () => {
    // Mount component, verify <canvas> exists
  })

  it('loads mockup image for selected product', async () => {
    // Pass productId, wait for image load, verify canvas drawn
  })

  it('renders design at correct print area position', async () => {
    // Pass designImage + placement 'fullCenter'
    // Verify design drawn at coordinates matching printAreas.ts
  })

  it('preserves aspect ratio when scaling design', () => {
    // Pass 500x1000 image, scale 0.5
    // Verify rendered dimensions maintain 1:2 ratio
  })

  it('constrains design within print area boundaries', () => {
    // Pass scale 2.0 (exceeds max)
    // Verify design doesn't exceed printArea.width/height
  })

  it('shows print area overlay when placement selected', () => {
    // Pass selectedPlacement
    // Verify dashed border div exists with correct position
  })

  it('shows placement guide when no design uploaded', () => {
    // Pass selectedPlacement but designImage=null
    // Verify blue guide box shows with placement name
  })

  it('calls onCanvasReady after render', async () => {
    const onReady = jest.fn()
    // Mount with onCanvasReady={onReady}
    // Wait for images, verify onReady called with canvas element
  })

  it('handles mockup load failure gracefully', async () => {
    // Pass invalid mockup URL
    // Verify fallback gradient background + emoji
  })

  it('recalculates dimensions when product changes', async () => {
    const { rerender } = render(<SimplePlacementCanvas productId="tshirt-regular-short" ... />)
    rerender(<SimplePlacementCanvas productId="hoodie-regular" ... />)
    // Verify canvas resizes to new mockup dimensions
  })
})
```

---

### 2. `SimplePlacementPanel.test.tsx`

**Test Suite:** Controls & Upload

```typescript
describe('SimplePlacementPanel', () => {
  it('renders all control sections', () => {
    // Verify: Upload zone, Placement grid, Scale slider, Side buttons, Colors, Sizes, Generate button
  })

  it('uploads file via file picker', async () => {
    const onUpload = jest.fn()
    // Click "Choose File", select image
    // Verify onUpload called with base64 string
  })

  it('uploads file via drag-and-drop', async () => {
    const onUpload = jest.fn()
    // Simulate dragOver, drop with File
    // Verify onUpload called
  })

  it('rejects files larger than 10MB', async () => {
    // Create 15MB file
    // Upload, verify alert shown, onUpload not called
  })

  it('rejects non-image files', async () => {
    // Upload .txt file
    // Verify alert, onUpload not called
  })

  it('shows green border after successful upload', async () => {
    // Upload image
    // Verify upload zone has green border + thumbnail
  })

  it('selects placement when button clicked', () => {
    const onPlacementChange = jest.fn()
    // Click "Full Center" button
    // Verify onPlacementChange('fullCenter')
  })

  it('updates scale when slider moved', () => {
    const onScaleChange = jest.fn()
    // Change slider value to 0.75
    // Verify onScaleChange(0.75)
  })

  it('disables Generate Preview when no design', () => {
    render(<SimplePlacementPanel designImage={null} ... />)
    const btn = screen.getByText(/Generate Preview/)
    expect(btn).toBeDisabled()
  })

  it('disables Generate Preview when no placement', () => {
    render(<SimplePlacementPanel designImage="data:..." selectedPlacement={null} ... />)
    const btn = screen.getByText(/Generate Preview/)
    expect(btn).toBeDisabled()
  })

  it('enables Generate Preview when design + placement selected', () => {
    render(<SimplePlacementPanel designImage="data:..." selectedPlacement="fullCenter" ... />)
    const btn = screen.getByText(/Generate Preview/)
    expect(btn).not.toBeDisabled()
  })

  it('shows available placements for current side', () => {
    render(<SimplePlacementPanel productId="tshirt-regular-short" currentSide="front" ... />)
    // Verify 4 placement buttons: topLeft, topRight, centerTop, fullCenter
    
    render(<SimplePlacementPanel currentSide="back" ... />)
    // Verify 1 placement button: fullBack
  })

  it('calls onSideChange when side button clicked', () => {
    const onSideChange = jest.fn()
    // Click "Back" button
    // Verify onSideChange('back')
  })

  it('calls onColorChange when color swatch clicked', () => {
    const onColorChange = jest.fn()
    // Click black color
    // Verify onColorChange('Black')
  })

  it('calls onSizeChange when size button clicked', () => {
    const onSizeChange = jest.fn()
    // Click "L" button
    // Verify onSizeChange('L')
  })
})
```

---

### 3. `ProductWizard.test.tsx`

**Test Suite:** Wizard Flow

```typescript
describe('ProductWizard', () => {
  it('shows step 1 (product type) on mount', () => {
    // Verify 4 product type cards visible
  })

  it('disables Next when no selection', () => {
    const btn = screen.getByText(/Next/)
    expect(btn).toBeDisabled()
  })

  it('enables Next after product type selected', () => {
    // Click T-Shirt
    // Verify Next enabled
  })

  it('advances to step 2 (fit type) for t-shirt', () => {
    // Click T-Shirt, click Next
    // Verify fit type options visible
  })

  it('advances to step 3 (sleeve) for t-shirt', () => {
    // Select t-shirt, regular fit, click Next
    // Verify sleeve options visible
  })

  it('shows color/size on step 4 for t-shirt', () => {
    // Select t-shirt, regular, short, click Next
    // Verify colors + sizes visible
  })

  it('calls onComplete with full selection', () => {
    const onComplete = jest.fn()
    // Complete wizard: tshirt → regular → short → white → M → Start Designing
    expect(onComplete).toHaveBeenCalledWith({
      productType: 'tshirt',
      fitType: 'regular',
      sleeveType: 'short',
      color: 'White',
      size: 'M',
      printArea: 'front'
    })
  })

  it('shows 3 steps for hoodie (no sleeve step)', () => {
    // Select hoodie
    // Verify totalSteps = 3
  })

  it('shows cap type selection for cap', () => {
    // Select cap
    // Verify baseball/trucker options
  })

  it('shows mug type selection for mug', () => {
    // Select mug
    // Verify ceramic/travel options
  })

  it('allows Back navigation', () => {
    // Go to step 2, click Back
    // Verify step 1 visible again
  })

  it('calls onCancel when Back on step 1', () => {
    const onCancel = jest.fn()
    // Click Back on step 1
    expect(onCancel).toHaveBeenCalled()
  })
})
```

---

### 4. `SimplePreviewModal.test.tsx`

**Test Suite:** Preview Modal

```typescript
describe('SimplePreviewModal', () => {
  it('does not render when isOpen=false', () => {
    render(<SimplePreviewModal isOpen={false} ... />)
    expect(screen.queryByText(/Design Preview/)).not.toBeInTheDocument()
  })

  it('renders when isOpen=true with previewData', () => {
    const data: PreviewData = {
      preview: 'data:image/png;base64,...',
      design: { ... },
      timestamp: Date.now()
    }
    render(<SimplePreviewModal isOpen={true} previewData={data} ... />)
    expect(screen.getByText(/Design Preview/)).toBeInTheDocument()
  })

  it('displays preview image', () => {
    // Render with previewData
    const img = screen.getByAlt(/Design Preview/)
    expect(img.src).toContain('data:image/png')
  })

  it('shows design metadata', () => {
    // Render with placement="fullCenter", scale=0.8, side="front", color="Black"
    expect(screen.getByText(/Full Center/)).toBeInTheDocument()
    expect(screen.getByText(/0.8x/)).toBeInTheDocument()
    expect(screen.getByText(/front/)).toBeInTheDocument()
    expect(screen.getByText(/Black/)).toBeInTheDocument()
  })

  it('downloads preview when Download clicked', () => {
    const createElementSpy = jest.spyOn(document, 'createElement')
    // Click Download button
    // Verify <a> element created with download attribute
  })

  it('closes modal when Close clicked', () => {
    const onClose = jest.fn()
    // Click Close button
    expect(onClose).toHaveBeenCalled()
  })

  it('closes modal when backdrop clicked', () => {
    const onClose = jest.fn()
    // Click outside modal content
    expect(onClose).toHaveBeenCalled()
  })

  it('does not close when modal content clicked', () => {
    const onClose = jest.fn()
    // Click inside modal content
    expect(onClose).not.toHaveBeenCalled()
  })
})
```

---

### 5. `printAreas.test.ts`

**Test Suite:** Print Area Helpers

```typescript
describe('Print Area Helpers', () => {
  describe('getPrintArea', () => {
    it('returns correct coordinates for tshirt front fullCenter', () => {
      const area = getPrintArea('tshirt', 'front', 'fullCenter')
      expect(area).toEqual({ x: 217, y: 340, width: 325, height: 470 })
    })

    it('returns null for invalid placement', () => {
      const area = getPrintArea('tshirt', 'front', 'invalidPlacement')
      expect(area).toBeNull()
    })

    it('returns null for invalid side', () => {
      const area = getPrintArea('tshirt', 'invalidSide', 'fullCenter')
      expect(area).toBeNull()
    })
  })

  describe('getAvailablePlacementsForSide', () => {
    it('returns 4 placements for tshirt front', () => {
      const placements = getAvailablePlacementsForSide('tshirt', 'front')
      expect(placements).toEqual(['topLeft', 'topRight', 'centerTop', 'fullCenter'])
    })

    it('returns 1 placement for tshirt back', () => {
      const placements = getAvailablePlacementsForSide('tshirt', 'back')
      expect(placements).toEqual(['fullBack'])
    })

    it('returns empty array for invalid side', () => {
      const placements = getAvailablePlacementsForSide('tshirt', 'invalidSide')
      expect(placements).toEqual([])
    })
  })

  describe('calculateFitDimensions', () => {
    it('fits wide image to print area width', () => {
      const fit = calculateFitDimensions(1000, 500, { x: 0, y: 0, width: 300, height: 400 })
      expect(fit.width).toBe(300)
      expect(fit.height).toBe(150) // Maintains 2:1 ratio
    })

    it('fits tall image to print area height', () => {
      const fit = calculateFitDimensions(500, 1000, { x: 0, y: 0, width: 300, height: 400 })
      expect(fit.height).toBe(400)
      expect(fit.width).toBe(200) // Maintains 1:2 ratio
    })

    it('centers image within print area', () => {
      const fit = calculateFitDimensions(100, 100, { x: 100, y: 100, width: 300, height: 300 })
      expect(fit.x).toBe(100) // No offset if fills area
      expect(fit.y).toBe(100)
    })
  })

  describe('scaleDesign', () => {
    const printArea = { x: 0, y: 0, width: 300, height: 400 }

    it('applies scale factor', () => {
      const result = scaleDesign(200, 200, 1.5, printArea)
      // 200 * 1.5 = 300 (but capped at printArea.width)
      expect(result.width).toBe(300)
      expect(result.height).toBe(300)
    })

    it('enforces minimum scale', () => {
      const result = scaleDesign(200, 200, 0.1, printArea, 0.3, 1.0)
      // 200 * 0.1 = 20, but min is 0.3 * 300 = 90
      expect(result.width).toBeGreaterThanOrEqual(90)
    })

    it('enforces maximum scale', () => {
      const result = scaleDesign(400, 400, 2.0, printArea, 0.3, 1.0)
      // 400 * 2.0 = 800, but max is 1.0 * 300 = 300
      expect(result.width).toBeLessThanOrEqual(300)
    })

    it('preserves aspect ratio when scaling', () => {
      const result = scaleDesign(200, 400, 0.8, printArea)
      const ratio = result.width / result.height
      expect(ratio).toBeCloseTo(0.5)
    })
  })
})
```

---

## Integration Tests

### 1. `CustomizerFlow.test.tsx`

**Test Suite:** End-to-End Customizer Workflow

```typescript
describe('Customizer Full Flow', () => {
  it('completes wizard to canvas flow', async () => {
    render(<CustomizerPage />)
    
    // Step 1: Wizard visible on mount
    expect(screen.getByText(/Design Your Product/)).toBeInTheDocument()
    
    // Select T-Shirt
    fireEvent.click(screen.getByText(/T-Shirt/))
    fireEvent.click(screen.getByText(/Next/))
    
    // Select Regular Fit
    fireEvent.click(screen.getByText(/Regular Fit/))
    fireEvent.click(screen.getByText(/Next/))
    
    // Select Short Sleeve
    fireEvent.click(screen.getByText(/Short Sleeve/))
    fireEvent.click(screen.getByText(/Next/))
    
    // Select White + M
    fireEvent.click(screen.getByText(/White/))
    fireEvent.click(screen.getByText(/M/))
    fireEvent.click(screen.getByText(/Start Designing/))
    
    // Wizard closes, canvas visible
    await waitFor(() => {
      expect(screen.queryByText(/Design Your Product/)).not.toBeInTheDocument()
      expect(screen.getByText(/Create Your Design/)).toBeInTheDocument()
    })
  })

  it('uploads design and generates preview', async () => {
    render(<CustomizerPage />)
    // Complete wizard first...
    
    // Upload image
    const file = new File(['image'], 'design.png', { type: 'image/png' })
    const input = screen.getByLabelText(/Choose File/)
    fireEvent.change(input, { target: { files: [file] } })
    
    // Select placement
    await waitFor(() => {
      fireEvent.click(screen.getByText(/Full Center/))
    })
    
    // Adjust scale
    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: '0.7' } })
    
    // Generate preview
    const generateBtn = screen.getByText(/Generate Preview/)
    expect(generateBtn).not.toBeDisabled()
    fireEvent.click(generateBtn)
    
    // Preview modal opens
    await waitFor(() => {
      expect(screen.getByText(/Design Preview/)).toBeInTheDocument()
    })
  })

  it('switches product sides', async () => {
    render(<CustomizerPage />)
    // Complete wizard, upload design...
    
    // Initially on front
    expect(screen.getByText(/front/i)).toBeInTheDocument()
    
    // Switch to back
    fireEvent.click(screen.getByText(/Back/))
    
    // Verify back mockup loaded (check for different placement options)
    await waitFor(() => {
      expect(screen.getByText(/Full Back/)).toBeInTheDocument()
      expect(screen.queryByText(/Top Left/)).not.toBeInTheDocument()
    })
  })

  it('changes product color', async () => {
    render(<CustomizerPage />)
    // Complete wizard (White selected)...
    
    // Click Black color
    const blackSwatch = screen.getAllByRole('button').find(btn => 
      btn.style.backgroundColor === 'rgb(0, 0, 0)'
    )
    fireEvent.click(blackSwatch!)
    
    // Verify color updated (check product name subtitle)
    expect(screen.getByText(/Black/i)).toBeInTheDocument()
  })
})
```

---

### 2. `CartIntegration.test.tsx`

**Test Suite:** Cart Interaction (Future)

```typescript
describe('Cart Integration', () => {
  it('adds design to cart when implemented', async () => {
    // This test will fail until BUG-3 is fixed
    const { getState } = useCartStore
    
    render(<CustomizerPage />)
    // Complete wizard, upload design, generate preview...
    
    // (Future) Click "Add to Cart" button
    // fireEvent.click(screen.getByText(/Add to Cart/))
    
    // Verify cart updated
    // const cart = getState()
    // expect(cart.items).toHaveLength(1)
    // expect(cart.items[0]).toMatchObject({
    //   productId: 'tshirt-regular-short',
    //   color: 'White',
    //   size: 'M',
    //   customDesign: expect.objectContaining({
    //     placement: 'fullCenter',
    //     scale: expect.any(Number)
    //   })
    // })
  })
})
```

---

## End-to-End Tests

### 1. `customizer-happy-path.spec.ts` (Playwright/Cypress)

```typescript
test('User completes design workflow', async ({ page }) => {
  // Navigate to customizer
  await page.goto('/customizer')
  
  // Wait for wizard
  await expect(page.locator('text=Design Your Product')).toBeVisible()
  
  // Step 1: Select T-Shirt
  await page.click('text=T-Shirt')
  await page.click('text=Next')
  
  // Step 2: Select Regular Fit
  await page.click('text=Regular Fit')
  await page.click('text=Next')
  
  // Step 3: Select Short Sleeve
  await page.click('text=Short Sleeve')
  await page.click('text=Next')
  
  // Step 4: Select White color
  await page.click('[style*="background-color"][title="White"]')
  // Select M size
  await page.click('text=M')
  // Start Designing
  await page.click('text=Start Designing')
  
  // Wizard closes
  await expect(page.locator('text=Design Your Product')).not.toBeVisible()
  
  // Upload design
  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles('./test-assets/sample-design.png')
  
  // Wait for upload
  await expect(page.locator('text=Design uploaded!')).toBeVisible()
  
  // Select placement
  await page.click('text=Full Center')
  
  // Adjust scale
  await page.locator('input[type="range"]').fill('0.8')
  
  // Generate preview
  await page.click('text=Generate Preview')
  
  // Preview modal opens
  await expect(page.locator('text=Design Preview')).toBeVisible()
  
  // Verify preview image loaded
  const previewImg = page.locator('img[alt="Design Preview"]')
  await expect(previewImg).toBeVisible()
  
  // Download preview
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('text=Download')
  ])
  expect(download.suggestedFilename()).toMatch(/design.*\.png/)
  
  // Close modal
  await page.click('button:has-text("Close")')
  await expect(page.locator('text=Design Preview')).not.toBeVisible()
})
```

---

### 2. `customizer-edge-cases.spec.ts`

```typescript
test('Rejects invalid file type', async ({ page }) => {
  await page.goto('/customizer')
  // Complete wizard...
  
  // Upload .txt file
  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles('./test-assets/invalid.txt')
  
  // Expect error alert/toast
  await expect(page.locator('text=Please upload an image file')).toBeVisible()
})

test('Rejects oversized file', async ({ page }) => {
  await page.goto('/customizer')
  // Complete wizard...
  
  // Upload 15MB file
  await page.locator('input[type="file"]').setInputFiles('./test-assets/large-image.png')
  
  // Expect error
  await expect(page.locator('text=File size must be less than 10MB')).toBeVisible()
})

test('Handles side switch without design', async ({ page }) => {
  await page.goto('/customizer')
  // Complete wizard...
  
  // Switch to Back without uploading
  await page.click('text=Back')
  
  // Should not crash, show empty canvas
  await expect(page.locator('canvas')).toBeVisible()
  await expect(page.locator('text=Drop image here')).toBeVisible()
})

test('Scale slider updates in real-time', async ({ page }) => {
  await page.goto('/customizer')
  // Complete wizard, upload design, select placement...
  
  // Move slider
  const slider = page.locator('input[type="range"]')
  await slider.fill('0.5')
  
  // Verify label updates
  await expect(page.locator('text=Scale: 0.5x')).toBeVisible()
  
  // (Visual regression test: compare canvas screenshots)
})
```

---

## Test Coverage Goals

- **Unit Tests:** 80%+ coverage of utility functions, helpers, pure logic
- **Integration Tests:** All major user flows (wizard, upload, preview)
- **E2E Tests:** Happy path + critical edge cases

**Priority:**
1. Unit tests for `printAreas.ts` helpers (critical for print accuracy)
2. Integration test for wizard → canvas → preview flow
3. E2E happy path test
4. Unit tests for canvas rendering
5. E2E edge case tests

**Tooling:**
- Jest + React Testing Library (unit/integration)
- Playwright or Cypress (E2E)
- MSW for mocking image requests
- jest-canvas-mock for canvas testing
