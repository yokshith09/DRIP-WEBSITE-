'use client';

import { useState } from 'react';
import { X, Check, Search } from 'lucide-react';

const COLORS = [
  { id: 'black', hex: '#000000' }, { id: 'white', hex: '#FFFFFF', border: true },
  { id: 'navy', hex: '#1A1A2E' }, { id: 'grey', hex: '#808080' },
  { id: 'olive', hex: '#556B2F' }, { id: 'burgundy', hex: '#800020' },
  { id: 'beige', hex: '#F5F5DC', border: true }, { id: 'coral', hex: '#E94560' }
];

const OCCASIONS = ['Casual', 'Work', 'Party', 'Gym', 'Festive', 'Travel'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface SmartFilterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SmartFilter({ isOpen, onClose }: SmartFilterProps) {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const toggleColor = (id: string) => {
    setSelectedColors(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const toggleOccasion = (occ: string) => {
    setSelectedOccasions(prev => prev.includes(occ) ? prev.filter(o => o !== occ) : [...prev, occ]);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-50 transition-opacity" onClick={onClose} />
      
      {/* Bottom Sheet Modal */}
      <div className="fixed bottom-0 left-0 w-full h-[85vh] md:h-[75vh] md:max-w-md md:left-auto md:right-0 bg-white rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none z-50 flex flex-col shadow-2xl transform transition-transform overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-drip-grey">
          <h2 className="text-xl font-display font-bold text-drip-dark">Filters</h2>
          <div className="flex items-center space-x-4">
            <button className="text-sm font-semibold text-drip-coral uppercase tracking-wide">Clear All</button>
            <button onClick={onClose} className="p-2 hover:bg-drip-grey rounded-full transition-colors text-drip-dark">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto p-6 space-y-8">
          
          {/* Colors Filter */}
          <section>
            <h3 className="text-sm font-semibold text-drip-dark mb-4 uppercase tracking-wider">Color</h3>
            <div className="grid grid-cols-6 gap-3">
              {COLORS.map((c) => {
                const isSelected = selectedColors.includes(c.id);
                return (
                  <button 
                    key={c.id} 
                    onClick={() => toggleColor(c.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform ${c.border ? 'border border-gray-200' : ''} ${isSelected ? 'ring-2 ring-offset-2 ring-drip-navy scale-110' : 'hover:scale-105'}`}
                    style={{ backgroundColor: c.hex }}
                    aria-label={`Color ${c.id}`}
                  >
                    {isSelected && <Check className={`w-4 h-4 ${c.id === 'white' || c.id === 'beige' ? 'text-drip-dark' : 'text-white'}`} />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Occasion Filter */}
          <section>
            <h3 className="text-sm font-semibold text-drip-dark mb-4 uppercase tracking-wider">Occasion</h3>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map((occ) => {
                const isSelected = selectedOccasions.includes(occ);
                return (
                  <button 
                    key={occ}
                    onClick={() => toggleOccasion(occ)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${isSelected ? 'bg-drip-navy text-white' : 'bg-drip-grey text-drip-dark hover:bg-gray-200'}`}
                  >
                    {occ}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Size Filter */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-drip-dark uppercase tracking-wider">Size</h3>
              <button className="text-xs text-drip-muted underline">Size Guide</button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {SIZES.map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button 
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`h-12 border rounded-drip-input font-medium transition-colors ${isSelected ? 'bg-drip-navy text-white border-transparent' : 'border-drip-grey text-drip-dark hover:border-drip-dark hover:bg-gray-50'}`}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-drip-muted mt-2">Only sizes currently in stock are shown.</p>
          </section>

          {/* Price Range */}
          <section>
            <h3 className="text-sm font-semibold text-drip-dark mb-4 uppercase tracking-wider">Price Range</h3>
            {/* Simple Mock Range Slider */}
            <div className="h-1 bg-drip-grey rounded-full relative mb-6">
              <div className="absolute left-1/4 right-1/4 h-full bg-drip-coral rounded-full"></div>
              <div className="absolute left-1/4 w-4 h-4 bg-white border-2 border-drip-coral rounded-full -top-1.5 -ml-2"></div>
              <div className="absolute right-1/4 w-4 h-4 bg-white border-2 border-drip-coral rounded-full -top-1.5 -mr-2"></div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm font-medium text-drip-dark">₹1,500</span>
              <span className="text-sm font-medium text-drip-dark">₹6,000+</span>
            </div>
          </section>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-drip-grey bg-white">
          <button onClick={onClose} className="w-full bg-drip-coral text-white py-4 rounded-drip-btn font-semibold tracking-widest uppercase hover:bg-opacity-90 transition-opacity flex justify-center items-center">
            View 124 Results
          </button>
        </div>
      </div>
    </>
  );
}
