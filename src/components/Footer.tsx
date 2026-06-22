import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white py-12 px-5 md:px-12 border-t border-[#EDE9E3] mt-auto">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          
          {/* Brand column */}
          <div className="lg:col-span-4">
            <Link href="/" className="text-2xl font-black tracking-tighter mb-4 block">DRIP</Link>
            <p className="text-gray-500 text-[13px] font-medium leading-relaxed mb-6 max-w-xs">
              The pinnacle of digital fashion and urban utility. Redefining style through AI and premium craftsmanship.
            </p>
            <div className="flex space-x-5">
              {['Instagram', 'Twitter', 'TikTok'].map(s => (
                <Link key={s} href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all">{s}</Link>
              ))}
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-4">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 mb-4">Join The Collective</h4>
            <p className="text-gray-500 text-[13px] font-medium mb-4">Early access. Exclusive drops. 100% Signal.</p>
            <form className="relative flex items-center">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-gray-50 border-b-2 border-gray-100 py-2 text-[13px] focus:outline-none focus:border-black transition-colors font-bold"
              />
              <button type="button" className="absolute right-0 text-[10px] font-black uppercase tracking-widest hover:text-drip-coral transition-all">Sign Up</button>
            </form>
          </div>

          {/* Links columns */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 mb-4">Menu</h4>
              <ul className="space-y-2">
                {['Men', 'Women', 'Accessories'].map(link => (
                  <li key={link}><Link href={`/collections/${link.toLowerCase()}`} className="text-gray-500 text-[13px] hover:text-black transition-colors font-semibold">{link}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2">
                {['Shipping', 'Returns', 'Stores', 'Contact', 'About Us'].map(link => (
                  <li key={link}><Link href={link === 'About Us' ? '/about' : '#'} className="text-gray-500 text-[13px] hover:text-black transition-colors font-semibold">{link}</Link></li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
            &copy; 2026 DRIP FASHION INC.
          </p>
          <div className="flex space-x-12">
            {['Privacy', 'Terms', 'Cookies'].map(link => (
              <Link key={link} href="#" className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] hover:text-black transition-colors">{link}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
