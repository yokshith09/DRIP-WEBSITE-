'use client';

import { useState, useEffect } from 'react';
import { useProductStore } from '@/store/products';
import { Product } from '@/data/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Trash2, Plus, LogOut, Package, Search, Tag, Settings, SlidersHorizontal, Sparkles, Check } from 'lucide-react';

export default function AdminDashboard() {
  const { products, addProduct, deleteProduct, resetProducts } = useProductStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Form fields for adding product
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState<'mens' | 'womens' | 'accessories'>('mens');
  const [subcategory, setSubcategory] = useState<'Shirts' | 'Jeans' | 'Pants' | 'Sneakers' | 'Accessories'>('Shirts');
  const [fit, setFit] = useState('Relaxed Fit');
  const [material, setMaterial] = useState('Premium Cotton');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Authentication logic
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@drip.com' && password === 'admin123') {
      setIsAuthenticated(true);
      setLoginError('');
      if (typeof window !== 'undefined') {
        localStorage.setItem('drip_admin_auth', 'true');
      }
    } else {
      setLoginError('Invalid administrator credentials.');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('drip_admin_auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('drip_admin_auth');
    }
  };

  // Add Product Submit
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !brand || !price || !image) {
      alert('Please fill out all required fields.');
      return;
    }

    const priceNum = parseInt(price.replace(/[^\d]/g, ''), 10) || 1999;
    const originalPriceNum = Math.round(priceNum * 1.25);

    const newProduct: Product = {
      id: `admin-added-${Date.now()}`,
      category,
      subcategory,
      name,
      brand,
      price: `₹ ${priceNum.toLocaleString('en-IN')}`,
      originalPrice: `₹ ${originalPriceNum.toLocaleString('en-IN')}`,
      priceNumber: priceNum,
      originalPriceNumber: originalPriceNum,
      rating: 4.8,
      reviews: '12',
      image,
      images: [image],
      sizes: subcategory === 'Sneakers' ? ['UK 7', 'UK 8', 'UK 9', 'UK 10'] : ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'Navy', 'Grey'],
      fit,
      material,
      tags: [subcategory.toLowerCase(), 'admin-listed', brand.toLowerCase()],
      bodyShapeSuitable: ['rectangle', 'inverted-triangle', 'hourglass'],
      skinToneSuitable: ['warm', 'cool', 'neutral'],
      stock: 30,
      isNew: true,
      matchPercentage: 90
    };

    addProduct(newProduct);
    setFormSuccess(true);

    // Reset Form
    setName('');
    setBrand('');
    setPrice('');
    setImage('');
    setFit('Relaxed Fit');
    setMaterial('Premium Cotton');

    setTimeout(() => setFormSuccess(false), 3000);
  };

  const handleDelete = (id: string, prodName: string) => {
    if (confirm(`Are you sure you want to delete "${prodName}" from the store database?`)) {
      deleteProduct(id);
    }
  };

  // Filter products based on search
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.subcategory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const shirtsCount = products.filter(p => p.subcategory === 'Shirts').length;
  const jeansCount = products.filter(p => p.subcategory === 'Jeans').length;
  const pantsCount = products.filter(p => p.subcategory === 'Pants').length;
  const sneakersCount = products.filter(p => p.subcategory === 'Sneakers').length;
  const accCount = products.filter(p => p.subcategory === 'Accessories').length;

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#FAF4EE] flex flex-col justify-between font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-gray-150 rounded-3xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <span className="text-[10px] text-[#7A0C16] font-black uppercase tracking-[0.3em]">DRIP Systems</span>
              <h2 className="text-2xl font-display font-bold text-gray-900 mt-1">Admin Portal Login</h2>
              <p className="text-xs text-gray-500 mt-2">Sign in using credentials to manage products database catalog.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@drip.com"
                  className="w-full border border-gray-200 px-4 py-3 rounded-xl text-xs font-medium focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 px-4 py-3 rounded-xl text-xs font-medium focus:outline-none focus:border-black"
                  required
                />
              </div>

              {loginError && (
                <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider">{loginError}</p>
              )}

              <button 
                type="submit"
                className="w-full py-4 bg-[#7A0C16] hover:bg-black text-[#FAF4EE] hover:text-white rounded-xl font-bold tracking-widest uppercase text-xs transition-all shadow-md mt-4"
              >
                Sign In to Dashboard
              </button>
            </form>

            <div className="mt-6 border-t border-gray-100 pt-4 text-center">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Default Credentials:</p>
              <p className="text-[11px] text-gray-600 mt-1 font-mono">admin@drip.com / admin123</p>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF9F7] font-sans text-gray-900">
      <Navbar />

      <div className="max-w-[1440px] mx-auto px-5 md:px-12 pt-10 pb-20 space-y-10">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-150 pb-6 gap-4">
          <div>
            <span className="text-[10px] text-[#7A0C16] font-black uppercase tracking-[0.3em]">Atelier Control Center</span>
            <h1 className="text-3xl font-display font-bold text-gray-900 leading-none mt-1">Admin Curation Dashboard</h1>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 border border-gray-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Database Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[
            { label: 'Shirts & Polos', count: shirtsCount, color: 'bg-drip-navy text-white' },
            { label: 'Jeans Denim', count: jeansCount, color: 'bg-white border border-gray-150 text-black' },
            { label: 'Cargo & Pants', count: pantsCount, color: 'bg-white border border-gray-150 text-black' },
            { label: 'Sneakers Shoes', count: sneakersCount, color: 'bg-white border border-gray-150 text-black' },
            { label: 'Accessories', count: accCount, color: 'bg-white border border-gray-150 text-black' }
          ].map((stat, i) => (
            <div key={i} className={`p-5 rounded-2xl shadow-xs ${stat.color} flex flex-col justify-between h-28`}>
              <span className="text-[10px] font-black uppercase tracking-wider opacity-60">{stat.label}</span>
              <span className="text-2xl font-display font-bold leading-none">{stat.count} items</span>
            </div>
          ))}
        </div>

        {/* Main Content split: Form vs Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Creator Form */}
          <div className="bg-white border border-gray-150 p-6 rounded-3xl shadow-sm h-fit space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-800 flex items-center border-b border-gray-100 pb-3">
              <Plus className="w-4 h-4 mr-1 text-[#7A0C16]" />
              <span>Add New Product</span>
            </h3>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Category</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full border border-gray-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-black bg-white"
                  >
                    <option value="mens">Men's Wear</option>
                    <option value="womens">Women's Wear</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Subcategory</label>
                  <select 
                    value={subcategory} 
                    onChange={(e) => setSubcategory(e.target.value as any)}
                    className="w-full border border-gray-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-black bg-white"
                  >
                    <option value="Shirts">Shirts &amp; Tops</option>
                    <option value="Jeans">Jeans</option>
                    <option value="Pants">Pants &amp; Cargos</option>
                    <option value="Sneakers">Sneakers</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Product Name *</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Classic Linen Shirt"
                  className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Brand *</label>
                  <input 
                    type="text" 
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. The Bear House"
                    className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-black"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Price (INR) *</label>
                  <input 
                    type="text" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 1999"
                    className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-black"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Image URL *</label>
                <input 
                  type="text" 
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://cdn.shopify.com/..."
                  className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Fit Description</label>
                  <input 
                    type="text" 
                    value={fit}
                    onChange={(e) => setFit(e.target.value)}
                    placeholder="e.g. Relaxed Fit"
                    className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Material Composition</label>
                  <input 
                    type="text" 
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="e.g. 100% Linen Blend"
                    className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {formSuccess && (
                <div className="bg-drip-green/10 text-drip-green border border-drip-green/20 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1.5 animate-pulse">
                  <Check className="w-4 h-4" /> <span>Product Added Successfully!</span>
                </div>
              )}

              <button 
                type="submit"
                className="w-full py-3.5 bg-black hover:bg-drip-coral text-white rounded-xl font-bold tracking-widest uppercase text-xs transition-colors shadow-sm"
              >
                Create Listing
              </button>
            </form>

            <button 
              onClick={() => {
                if (confirm('Reset catalog back to initial scraped listings? This clears admin additions.')) {
                  resetProducts();
                }
              }}
              className="w-full text-center text-gray-400 hover:text-red-500 font-bold uppercase tracking-wider text-[9px] pt-2"
            >
              Reset Database to Defaults
            </button>
          </div>

          {/* Listings Table */}
          <div className="lg:col-span-2 bg-white border border-gray-150 p-6 rounded-3xl shadow-sm space-y-6">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-800 flex items-center">
                <Package className="w-4 h-4 mr-1 text-[#7A0C16]" />
                <span>Store Catalog Listings ({filteredProducts.length})</span>
              </h3>

              {/* Search Bar */}
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search catalog products..."
                  className="w-full border border-gray-200 pl-9 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* List Table */}
            <div className="overflow-y-auto max-h-[500px] border border-gray-100 rounded-2xl hide-scrollbar">
              {filteredProducts.length === 0 ? (
                <div className="p-12 text-center text-gray-400 text-xs uppercase tracking-wider font-bold">
                  No products match search queries
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      <th className="p-4">Item Thumbnail</th>
                      <th className="p-4">Brand &amp; Name</th>
                      <th className="p-4">Subcategory</th>
                      <th className="p-4">Price</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-gray-50/50">
                        <td className="p-4">
                          <div className="w-10 h-12 bg-gray-50 border border-gray-100 rounded-lg relative overflow-hidden">
                            <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                          </div>
                        </td>
                        <td className="p-4 font-bold text-gray-800">
                          <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">{prod.brand}</span>
                          <span className="truncate max-w-[200px] block">{prod.name}</span>
                        </td>
                        <td className="p-4 font-bold uppercase tracking-wider text-gray-500 text-[10px]">
                          {prod.subcategory}
                        </td>
                        <td className="p-4 font-black text-black">
                          {prod.price}
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => handleDelete(prod.id, prod.name)}
                            className="p-2 border border-gray-200 hover:border-red-200 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            title="Delete listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>

        </div>

      </div>

      <Footer />
    </main>
  );
}
