'use client';

import { useState } from 'react';
import { ChevronLeft, MapPin, Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const INITIAL_ADDRESSES = [
  {
    id: 'addr-1',
    type: 'Home',
    name: 'Yoo Jae-Suk',
    phone: '+91 98765 43210',
    street: 'H-12, Sector 15',
    city: 'Gurugram',
    state: 'Haryana',
    pin: '122001',
    isDefault: true
  },
  {
    id: 'addr-2',
    type: 'Office',
    name: 'Yoo Jae-Suk',
    phone: '+91 99999 88888',
    street: 'Drip Labs, DLF Cyber City, Tower C',
    city: 'Gurugram',
    state: 'Haryana',
    pin: '122002',
    isDefault: false
  }
];

export default function SavedAddresses() {
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    type: 'Home',
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pin: ''
  });

  const handleDelete = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.street || !formData.city || !formData.pin) {
      alert('Please fill out all required fields');
      return;
    }
    const newAddress = {
      id: `addr-${Date.now()}`,
      ...formData,
      isDefault: addresses.length === 0
    };
    setAddresses(prev => [...prev, newAddress]);
    setShowAddForm(false);
    setFormData({
      type: 'Home',
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      pin: ''
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-32">
      <Navbar />

      <div className="max-w-[800px] mx-auto px-4 pt-10">
        
        {/* Back Link */}
        <Link href="/profile" className="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </Link>

        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-display font-medium italic text-black">Saved Addresses</h1>
          {!showAddForm && (
            <button 
              onClick={() => setShowAddForm(true)}
              className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-colors flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Address</span>
            </button>
          )}
        </div>

        {showAddForm && (
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm mb-10">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-800 mb-6">New Delivery Location</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Address Tag</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-xs focus:border-black outline-none h-10"
                  >
                    <option value="Home">Home (Delivery all day)</option>
                    <option value="Office">Office (Delivery 9 AM - 6 PM)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans">Full Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Recipient's name"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-xs focus:border-black outline-none h-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans">Contact Phone *</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-xs focus:border-black outline-none h-10"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans">ZIP / Pincode *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="6-digit pincode"
                    value={formData.pin}
                    onChange={e => setFormData(prev => ({ ...prev, pin: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-xs focus:border-black outline-none h-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans">Street Address / Landmark *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Flat, House no., Building, Street"
                  value={formData.street}
                  onChange={e => setFormData(prev => ({ ...prev, street: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 text-xs focus:border-black outline-none h-10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans">City *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="City name"
                    value={formData.city}
                    onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-xs focus:border-black outline-none h-10"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans">State *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="State name"
                    value={formData.state}
                    onChange={e => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-xs focus:border-black outline-none h-10"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2.5 border border-gray-200 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all shadow-sm"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-6">
          {addresses.map(addr => (
            <div 
              key={addr.id}
              className={`bg-white border rounded-2xl p-6 shadow-sm flex items-start justify-between gap-6 transition-all ${
                addr.isDefault ? 'border-black ring-1 ring-black/10' : 'border-gray-150'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${addr.isDefault ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black uppercase tracking-wider text-black">{addr.type}</span>
                    {addr.isDefault && (
                      <span className="bg-drip-coral/10 text-drip-coral text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-widest">
                        Default
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mt-2">{addr.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {addr.street}, {addr.city}, {addr.state} - {addr.pin}
                  </p>
                  <p className="text-xs text-gray-400 mt-1.5 font-medium">Phone: {addr.phone}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                {!addr.isDefault && (
                  <button 
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-[9px] font-black text-[#0055A4] uppercase tracking-widest hover:underline"
                  >
                    Set As Default
                  </button>
                )}
                <div className="flex items-center space-x-2 mt-2">
                  <button 
                    onClick={() => handleDelete(addr.id)}
                    className="p-2 border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50/20 rounded-xl transition-all"
                    title="Delete Location"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
      <Footer />
    </main>
  );
}
