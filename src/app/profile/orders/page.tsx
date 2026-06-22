'use client';

import { ChevronLeft, Package, MapPin, Truck, RefreshCw, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const MOCK_ORDERS = [
  {
    id: 'DRIP-9843A',
    date: 'June 20, 2026',
    status: 'In Transit',
    statusColor: 'text-blue-500 bg-blue-50 border-blue-100',
    step: 2, // Ordered (0), Processing (1), Shipped (2), Delivered (3)
    deliveryAddress: 'Yoo Jae-Suk, H-12, Sector 15, Gurugram, HR, 122001',
    items: [
      { id: 'm1', name: 'Oxford Cotton Shirt', brand: 'Ralph Lauren', price: '₹ 4,500', size: 'M', color: 'Light Blue', image: '/images/hero/cat-shirts.png' },
      { id: 'a5', name: 'Retro White Leather Sneakers', brand: 'DRIP Co.', price: '₹ 5,990', size: 'UK 9', color: 'Vintage White', image: '/images/hero/cat-sneakers.png' }
    ],
    total: '₹ 10,490',
  },
  {
    id: 'DRIP-7621B',
    date: 'May 14, 2026',
    status: 'Delivered',
    statusColor: 'text-green-600 bg-green-50 border-green-100',
    step: 3,
    deliveryAddress: 'Yoo Jae-Suk, H-12, Sector 15, Gurugram, HR, 122001',
    items: [
      { id: 'm12', name: 'Knit Modal Polo', brand: 'Massimo Dutti', price: '₹ 4,990', size: 'L', color: 'Cream', image: '/images/hero/cat-polos.png' }
    ],
    total: '₹ 4,990',
  }
];

export default function MyOrders() {
  return (
    <main className="min-h-screen bg-gray-50 pb-32">
      <Navbar />

      <div className="max-w-[1000px] mx-auto px-4 pt-10">
        
        {/* Back Link */}
        <Link href="/profile" className="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </Link>

        <h1 className="text-3xl font-display font-medium italic text-black mb-10">My Orders</h1>

        <div className="space-y-10">
          {MOCK_ORDERS.map((order) => (
            <div key={order.id} className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
              
              {/* Order Header */}
              <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                <div className="flex space-x-8 text-xs font-semibold text-gray-500">
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-400">Order ID</span>
                    <span className="text-black font-black">{order.id}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-400">Placed On</span>
                    <span className="text-black">{order.date}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-400">Total</span>
                    <span className="text-black font-black">{order.total}</span>
                  </div>
                </div>
                <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 border rounded-full ${order.statusColor}`}>
                  {order.status}
                </div>
              </div>

              {/* Order Tracking Timeline */}
              {order.status !== 'Delivered' && (
                <div className="px-6 py-8 border-b border-gray-100 bg-white">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-drip-coral" />
                    <span>Real-time Delivery Timeline</span>
                  </h4>
                  <div className="relative flex justify-between items-center max-w-xl mx-auto">
                    {/* Line behind steps */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>
                    <div className="absolute top-1/2 left-0 h-0.5 bg-drip-coral -translate-y-1/2 z-0 transition-all" style={{ width: `${(order.step / 3) * 100}%` }}></div>
                    
                    {['Placed', 'Processing', 'Shipped', 'Delivered'].map((label, idx) => {
                      const isActive = idx <= order.step;
                      return (
                        <div key={label} className="relative z-10 flex flex-col items-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${isActive ? 'bg-drip-coral border-drip-coral text-white' : 'bg-white border-gray-200 text-gray-300'}`}>
                            <span className="text-[10px] font-black">{idx + 1}</span>
                          </div>
                          <span className={`text-[9px] font-black uppercase tracking-widest mt-2 ${isActive ? 'text-black' : 'text-gray-400'}`}>
                            {label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="p-6 space-y-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-gray-50 last:border-0 pb-6 last:pb-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-20 bg-gray-50 relative rounded-lg border border-gray-100 overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.brand}</span>
                        <h3 className="text-sm font-semibold text-gray-900 leading-snug">{item.name}</h3>
                        <p className="text-[10px] text-gray-500 font-medium mt-1">Size: {item.size} | Color: {item.color}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="text-sm font-black text-black">{item.price}</span>
                      <div className="flex space-x-2">
                        <Link href={`/product/${item.id}`} className="px-4 py-2 border border-gray-200 text-[9px] font-black uppercase tracking-widest rounded-xl hover:border-black transition-colors">
                          View
                        </Link>
                        {order.status === 'Delivered' && (
                          <button className="px-4 py-2 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-colors">
                            Buy Again
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer Details */}
              <div className="bg-gray-50/30 px-6 py-4 border-t border-gray-100 flex flex-wrap justify-between items-center text-xs font-semibold text-gray-500 gap-4">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="truncate max-w-md">Deliver to: {order.deliveryAddress}</span>
                </span>
                <span className="flex items-center gap-1 text-drip-coral cursor-pointer hover:underline">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Track Package</span>
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
      <Footer />
    </main>
  );
}
