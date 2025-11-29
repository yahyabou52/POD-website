import { useState, useRef } from 'react'
import { useCustomizerStore } from '@/store/customizer'
import { PRODUCT_TEMPLATES } from '@/config/productTemplates'
import { Button } from '@/components/ui/button'
import {
  Upload,
  Trash2,
  Copy,
  Lock,
  Unlock,
  Layers,
  MoveUp,
  MoveDown,
  Undo,
  Redo,
  RefreshCw,
  ShoppingCart,
  Maximize,
  Search,
} from 'lucide-react'

export default function ControlPanel() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState<'upload' | 'library' | 'edit'>('upload')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const {
    productId,
    currentSide,
    selectedColor,
    selectedSize,
    designs,
    selectedElementId,
    snapToGrid,
    setCurrentSide,
    setSelectedColor,
    setSelectedSize,
    setSnapToGrid,
    updateDesign,
    deleteDesign,
    duplicateDesign,
    bringToFront,
    sendToBack,
    moveToPreset,
    undo,
    redo,
    canUndo,
    canRedo,
    resetCurrentSide,
    addDesign,
    copyDesignToSide,
  } = useCustomizerStore()

  const product = PRODUCT_TEMPLATES[productId]
  const currentDesigns = designs[currentSide]
  const selectedDesign = currentDesigns.find((d) => d.id === selectedElementId)

  // File upload handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return

      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          const printArea = product.printAreas[currentSide]
          const maxWidth = printArea.maxWidth
          const maxHeight = printArea.maxHeight
          
          let width = img.width
          let height = img.height
          
          if (width > maxWidth || height > maxHeight) {
            const scale = Math.min(maxWidth / width, maxHeight / height)
            width = width * scale
            height = height * scale
          }

          addDesign({
            type: 'image',
            src: event.target?.result as string,
            x: printArea.x + 20,
            y: printArea.y + 20,
            width,
            height,
            scaleX: 1,
            scaleY: 1,
            locked: false,
          })
        }
        img.src = event.target?.result as string
      }
      reader.readAsDataURL(file)
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Library designs - Example designs
  const libraryDesigns = [
    { id: 1, name: 'Skull', category: 'Dark', url: 'https://via.placeholder.com/200x200/000000/FFFFFF?text=Skull' },
    { id: 2, name: 'Rose', category: 'Nature', url: 'https://via.placeholder.com/200x200/FF1493/FFFFFF?text=Rose' },
    { id: 3, name: 'Eagle', category: 'Animals', url: 'https://via.placeholder.com/200x200/FFD700/000000?text=Eagle' },
    { id: 4, name: 'Lightning', category: 'Elements', url: 'https://via.placeholder.com/200x200/FFFF00/000000?text=Lightning' },
    { id: 5, name: 'Crown', category: 'Royalty', url: 'https://via.placeholder.com/200x200/FFD700/000000?text=Crown' },
    { id: 6, name: 'Heart', category: 'Love', url: 'https://via.placeholder.com/200x200/FF0000/FFFFFF?text=Heart' },
    { id: 7, name: 'Star', category: 'Elements', url: 'https://via.placeholder.com/200x200/FFD700/000000?text=Star' },
    { id: 8, name: 'Fire', category: 'Elements', url: 'https://via.placeholder.com/200x200/FF4500/FFFFFF?text=Fire' },
    { id: 9, name: 'Wolf', category: 'Animals', url: 'https://via.placeholder.com/200x200/808080/FFFFFF?text=Wolf' },
    { id: 10, name: 'Dragon', category: 'Fantasy', url: 'https://via.placeholder.com/200x200/8B0000/FFFFFF?text=Dragon' },
    { id: 11, name: 'Butterfly', category: 'Nature', url: 'https://via.placeholder.com/200x200/FF69B4/FFFFFF?text=Butterfly' },
    { id: 12, name: 'Sword', category: 'Weapons', url: 'https://via.placeholder.com/200x200/C0C0C0/000000?text=Sword' },
  ]

  const categories = ['All', ...Array.from(new Set(libraryDesigns.map(d => d.category)))]

  const filteredDesigns = libraryDesigns.filter(design => {
    const matchesCategory = selectedCategory === 'All' || design.category === selectedCategory
    const matchesSearch = design.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleLibraryDesignClick = (design: typeof libraryDesigns[0]) => {
    const printArea = product.printAreas[currentSide]
    
    addDesign({
      type: 'image',
      src: design.url,
      x: printArea.x + 50,
      y: printArea.y + 50,
      width: 200,
      height: 200,
      scaleX: 1,
      scaleY: 1,
      locked: false,
    })
  }

  // Preset position buttons
  const presetPositions = [
    { label: 'Top Left', value: 'top-left' },
    { label: 'Top Center', value: 'top-center' },
    { label: 'Top Right', value: 'top-right' },
    { label: 'Center', value: 'center' },
    { label: 'Bottom Left', value: 'bottom-left' },
    { label: 'Bottom Center', value: 'bottom-center' },
    { label: 'Bottom Right', value: 'bottom-right' },
  ]

  return (
    <div className="bg-white rounded-2xl border border-mist shadow-md h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-mist">
        <h2 className="text-xl font-semibold text-onyx mb-2 tracking-tight">Design Studio</h2>
        <p className="text-sm text-carbon">Customize your {product.name}</p>
      </div>

      {/* Product Selection */}
      <div className="p-6 border-b border-mist space-y-4">
        <div>
          <label className="text-sm font-medium text-graphite mb-2 block">Product Side</label>
          <div className="flex gap-2 flex-wrap">
            {product.availableSides.map((side) => (
              <button
                key={side}
                onClick={() => setCurrentSide(side)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  currentSide === side
                    ? 'bg-onyx text-white shadow-sm'
                    : 'bg-mist text-carbon hover:bg-carbon hover:text-white'
                }`}
              >
                {side.charAt(0).toUpperCase() + side.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-graphite mb-2 block">Product Color</label>
          <div className="flex gap-2 flex-wrap">
            {product.colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={`w-10 h-10 rounded-lg border-2 transition-all duration-300 ${
                  selectedColor === color.name
                    ? 'border-royal scale-110'
                    : 'border-mist hover:border-carbon'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-graphite mb-2 block">Product Size</label>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-300 ${
                  selectedSize === size
                    ? 'border-gold bg-gold text-white'
                    : 'border-mist bg-white text-graphite hover:border-carbon'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-mist">
        {[
          { id: 'upload', label: 'Upload', icon: Upload },
          { id: 'library', label: 'Library', icon: Layers },
          { id: 'edit', label: 'Edit', icon: Maximize },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'text-onyx border-b-2 border-onyx'
                : 'text-graphite hover:text-carbon'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 border-2 border-dashed border-carbon hover:border-gold hover:bg-gold/5 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-2 text-graphite hover:text-gold"
            >
              <Upload className="w-8 h-8" />
              <span className="font-medium">Upload Your Design</span>
              <span className="text-xs">PNG, JPG, SVG supported</span>
            </button>

            <div className="text-xs text-center text-graphite/70">
              Drag & drop directly on canvas or click to browse
            </div>
          </div>
        )}

        {/* Library Tab */}
        {activeTab === 'library' && (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-graphite" />
              <input
                type="text"
                placeholder="Search designs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-mist rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-onyx text-white'
                      : 'bg-mist text-graphite hover:bg-carbon hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Designs Grid */}
            {filteredDesigns.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {filteredDesigns.map((design) => (
                  <button
                    key={design.id}
                    onClick={() => handleLibraryDesignClick(design)}
                    className="group relative aspect-square rounded-lg overflow-hidden border-2 border-mist hover:border-gold transition-all duration-300 bg-white"
                  >
                    <img
                      src={design.url}
                      alt={design.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end">
                      <div className="w-full bg-white/90 backdrop-blur-sm p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-xs font-medium text-onyx">{design.name}</p>
                        <p className="text-[10px] text-graphite">{design.category}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-graphite">
                <p className="text-sm">No designs found</p>
                <p className="text-xs mt-1">Try a different search or category</p>
              </div>
            )}
            
            <div className="text-xs text-center text-graphite/70 mt-4">
              {filteredDesigns.length} design{filteredDesigns.length !== 1 ? 's' : ''} available
            </div>
          </div>
        )}

        {/* Edit Tab */}
        {activeTab === 'edit' && (
          <div className="space-y-6">
            {selectedDesign ? (
              <>
                {/* Quick Actions */}
                <div>
                  <label className="text-sm font-medium text-graphite mb-3 block">Quick Actions</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => duplicateDesign(selectedDesign.id)}
                      className="text-xs"
                    >
                      <Copy className="w-3 h-3 mr-1.5" />
                      Duplicate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteDesign(selectedDesign.id)}
                      className="text-xs"
                    >
                      <Trash2 className="w-3 h-3 mr-1.5" />
                      Delete
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateDesign(selectedDesign.id, { locked: !selectedDesign.locked })}
                      className="text-xs"
                    >
                      {selectedDesign.locked ? <Unlock className="w-3 h-3 mr-1.5" /> : <Lock className="w-3 h-3 mr-1.5" />}
                      {selectedDesign.locked ? 'Unlock' : 'Lock'}
                    </Button>
                  </div>
                </div>

                {/* Layering */}
                <div>
                  <label className="text-sm font-medium text-graphite mb-3 block">Layer Order</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={() => bringToFront(selectedDesign.id)} className="text-xs">
                      <MoveUp className="w-3 h-3 mr-1.5" />
                      Bring Front
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => sendToBack(selectedDesign.id)} className="text-xs">
                      <MoveDown className="w-3 h-3 mr-1.5" />
                      Send Back
                    </Button>
                  </div>
                </div>

                {/* Preset Positions */}
                <div>
                  <label className="text-sm font-medium text-graphite mb-3 block">Preset Positions</label>
                  <div className="grid grid-cols-3 gap-2">
                    {presetPositions.map((preset) => (
                      <Button
                        key={preset.value}
                        variant="outline"
                        size="sm"
                        onClick={() => moveToPreset(selectedDesign.id, preset.value)}
                        className="text-xs px-2"
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-graphite/50">
                <Layers className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Select a design to edit</p>
              </div>
            )}

            {/* Global Controls */}
            <div className="pt-6 border-t border-mist space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-graphite">Snap to Grid</label>
                <button
                  onClick={() => setSnapToGrid(!snapToGrid)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    snapToGrid ? 'bg-royal' : 'bg-mist'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      snapToGrid ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              {product.availableSides.length > 1 && currentDesigns.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-graphite mb-2 block">Copy Design To</label>
                  <div className="flex gap-2">
                    {product.availableSides.filter(s => s !== currentSide).map((side) => (
                      <Button
                        key={side}
                        variant="outline"
                        size="sm"
                        onClick={() => copyDesignToSide(currentSide, side)}
                        className="text-xs capitalize"
                      >
                        {side.replace('-', ' ')}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-mist space-y-3">
        {/* Undo/Redo */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={undo}
            disabled={!canUndo()}
            className="flex-1"
          >
            <Undo className="w-4 h-4 mr-1.5" />
            Undo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={redo}
            disabled={!canRedo()}
            className="flex-1"
          >
            <Redo className="w-4 h-4 mr-1.5" />
            Redo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetCurrentSide}
            title="Reset Current Side"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Add to Cart */}
        <Button className="w-full h-12 font-semibold shadow-sm">
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add to Cart - ${product.basePrice.toFixed(2)}
        </Button>
      </div>
    </div>
  )
}
