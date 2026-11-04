import Link from 'next/link';


const SHOP_LINKS = [
  { href: '/categories/smartphone', label: 'Smartphone' },
  { href: '/categories/tv', label: 'Televisi' },
  { href: '/categories/ac', label: 'Air Conditioner (AC)' },
  { href: '/categories/washing-machine', label: 'Washing Machine' },
];

const HELP_LINKS = [
  { href: '/faq', label: 'Pusat Bantuan' },
  { href: '/terms', label: 'Syarat & Ketentuan' },
];

const AKSES_KHUSUS_LINKS = [
  { href: '/admin/add_product', label: 'Tambah Produk' },
  { href: '/admin/products', label: 'Edit Produk' },

];

// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-[#070F0B] text-[#BBB7BC] text-sm border-t border-gray-800 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Top Section: Banner / Call to Action */}
        <div className="flex flex-col md:flex-row justify-between items-center pb-8 border-b border-gray-800 gap-4">
          <div>
            <h3 className="text-white text-lg font-semibold tracking-wide">Revo Electronic Shop</h3>
            <p className="text-xs text-gray-400 mt-1">Solusi kebutuhan elektronik modern dengan kualitas dan garansi terbaik.</p>
          </div>
          <Link 
            href="/categories" 
            className="px-5 py-2.5 rounded bg-[#BE9160] text-white font-medium hover:bg-[#a77e53] transition-colors text-xs tracking-wider uppercase"
          >
            Jelajahi Produk
          </Link>
        </div>

        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10 border-b border-gray-800">
          
          {/* Kolom 1: Informasi & Lokasi */}
          <div>
            <h4 className="text-white font-medium mb-4 text-xs tracking-wider uppercase">Lokasi Toko</h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-2">
              Jl. Kaliurang Km. 12<br />
              Yogyakarta, Indonesia
            </p>
            <p className="text-xs text-gray-400 mb-1">Telepon: +62 812-3456-7890</p>
            <p className="text-xs text-gray-400">Email: support@revoelectronic.com</p>
          </div>

          {/* Kolom 2: Kategori Toko */}
          <div>
            <h4 className="text-white font-medium mb-4 text-xs tracking-wider uppercase">Kategori</h4>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors text-xs">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Layanan Pelanggan */}
          <div>
            <h4 className="text-white font-medium mb-4 text-xs tracking-wider uppercase">Bantuan</h4>
            <ul className="space-y-2.5">
              {HELP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors text-xs">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 4: Menu Navigasi / Admin*/}
          <div>
            <h4 className="text-white font-medium mb-4 text-xs tracking-wider uppercase">Akses Khusus atau Admin Panel</h4>
            <ul className="space-y-2.5">
              {AKSES_KHUSUS_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors text-xs">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Legal Bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; 2026 Indra Wahyu Inc. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link href="/privacy" className="hover:text-gray-300">Kebijakan Privasi</Link>
            <Link href="/terms" className="hover:text-gray-300">Ketentuan Layanan</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}