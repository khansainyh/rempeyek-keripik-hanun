export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  badge?: string;
}

// Foto produk ada di folder public/img/
// Untuk ganti foto: timpa file dengan nama yang sama, atau ubah nama file di "image".
export const products: Product[] = [
  {
    id: 'keripik-tempe',
    name: 'Keripik Tempe',
    price: 10000,
    description: 'Keripik tempe tipis renyah, gurih alami.',
    image: '/img/keripik_tempe.JPG',
    badge: 'Best Seller',
  },
  {
    id: 'rempeyek-kacang',
    name: 'Rempeyek Kacang',
    price: 10000,
    description: 'Rempeyek tipis renyah dengan kacang tanah.',
    image: '/img/rempeyek_kacang.JPG',
  },
  {
    id: 'rempeyek-kacang-hijau',
    name: 'Rempeyek Kacang Hijau',
    price: 10000,
    description: 'Rempeyek renyah dengan kacang hijau.',
    image: '/img/rempeyek_kacang_hijau.JPG',
  },
  {
    id: 'rempeyek-rebon',
    name: 'Rempeyek Rebon',
    price: 10000,
    description: 'Rempeyek gurih dengan udang rebon.',
    image: '/img/rempeyek_rebon.JPG',
  },
  {
    id: 'rempeyek-teri',
    name: 'Rempeyek Teri',
    price: 10000,
    description: 'Rempeyek gurih dengan ikan teri.',
    image: '/img/rempeyek_teri.JPG',
  },
];

export const WHATSAPP_NUMBER = '6285740171750';
