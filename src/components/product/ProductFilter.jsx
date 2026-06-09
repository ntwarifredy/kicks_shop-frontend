import { useState, useEffect } from 'react';

const categories = ['Running', 'Casual', 'Sports', 'Formal', 'Boots', 'Sandals'];
const brands = ['Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance', 'Converse', 'Vans'];
const genders = ['All', 'Men', 'Women', 'Unisex'];
const sizes = ['6', '7', '8', '9', '10', '11', '12'];
const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Gray', 'Brown', 'Navy'];

const ProductFilter = ({ filters, setFilters, onApply, onReset }) => {
  const [localFilters, setLocalFilters] = useState(filters || {});

  useEffect(() => {
    setLocalFilters(filters || {});
  }, [filters]);

  const handleCategoryChange = (category) => {
    const current = localFilters.category || [];
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    setLocalFilters({ ...localFilters, category: updated });
  };

  const handleBrandChange = (brand) => {
    const current = localFilters.brand || [];
    const updated = current.includes(brand)
      ? current.filter((b) => b !== brand)
      : [...current, brand];
    setLocalFilters({ ...localFilters, brand: updated });
  };

  const handleColorChange = (color) => {
    const current = localFilters.color || [];
    const updated = current.includes(color)
      ? current.filter((c) => c !== color)
      : [...current, color];
    setLocalFilters({ ...localFilters, color: updated });
  };

  const handleApply = () => {
    if (onApply) onApply(localFilters);
  };

  const handleReset = () => {
    setLocalFilters({});
    if (onReset) onReset();
  };

  return (
    <div className="card p-6 space-y-6">
      <div className="card-header">
        <span className="w-1 h-5 bg-brand-500 rounded-full flex-shrink-0" />
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        <button onClick={handleReset} className="btn-ghost text-sm ml-auto">
          Reset All
        </button>
      </div>

      <div>
        <h4 className="text-sm font-medium text-surface-300 mb-3">Gender</h4>
        <div className="flex flex-wrap gap-2">
          {genders.map((g) => (
            <button key={g} onClick={() => setLocalFilters({ ...localFilters, gender: g === 'All' ? '' : g })}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${(localFilters.gender === g || (!localFilters.gender && g === 'All'))
                ? 'bg-brand-600 border-brand-500 text-white'
                : 'border-surface-700 text-surface-400 hover:border-surface-600'}`}>
              {g}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-surface-300 mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={(localFilters.category || []).includes(cat)}
                onChange={() => handleCategoryChange(cat)}
                className="rounded border-surface-700 bg-surface-800 text-brand-600 focus:ring-brand-500/40" />
              <span className="text-sm text-surface-400">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-surface-300 mb-3">Brand</h4>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={(localFilters.brand || []).includes(brand)}
                onChange={() => handleBrandChange(brand)}
                className="rounded border-surface-700 bg-surface-800 text-brand-600 focus:ring-brand-500/40" />
              <span className="text-sm text-surface-400">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-surface-300 mb-3">Price Range</h4>
        <div className="flex items-center gap-2">
          <input type="number" placeholder="Min" value={localFilters.minPrice || ''}
            onChange={(e) => setLocalFilters({ ...localFilters, minPrice: e.target.value })}
            className="input-field w-full" />
          <span className="text-surface-500">-</span>
          <input type="number" placeholder="Max" value={localFilters.maxPrice || ''}
            onChange={(e) => setLocalFilters({ ...localFilters, maxPrice: e.target.value })}
            className="input-field w-full" />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-surface-300 mb-3">Size</h4>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button key={size} onClick={() => setLocalFilters({ ...localFilters, size: localFilters.size === size ? '' : size })}
              className={`w-10 h-10 text-xs rounded-lg border transition-colors ${localFilters.size === size
                ? 'bg-brand-600 border-brand-500 text-white'
                : 'border-surface-700 text-surface-400 hover:border-surface-600'}`}>
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-surface-300 mb-3">Color</h4>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button key={color} onClick={() => handleColorChange(color)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${(localFilters.color || []).includes(color)
                ? 'bg-brand-600 border-brand-500 text-white'
                : 'border-surface-700 text-surface-400 hover:border-surface-600'}`}>
              {color}
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleApply}
        className="btn-primary w-full">
        Apply Filters
      </button>
    </div>
  );
};

export default ProductFilter;
