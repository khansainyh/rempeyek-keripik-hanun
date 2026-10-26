# 📊 Panduan Setup Google Sheets untuk E-Katalog Hanun

Dengan setup ini, kamu bisa menambah, mengedit, dan menyembunyikan produk langsung dari Google Spreadsheet — **tanpa coding sama sekali**. Perubahan akan tampil di website dalam beberapa detik.

---

## Langkah 1: Buat Google Spreadsheet baru

1. Buka [sheets.google.com](https://sheets.google.com)
2. Klik **+ Blank** untuk buat spreadsheet baru
3. Ganti judul spreadsheet (pojok kiri atas) menjadi: `Hanun - Data Produk`
4. Ganti nama tab/sheet (pojok bawah) menjadi: `Produk`

---

## Langkah 2: Buat header kolom

Di **baris 1**, isi kolom berikut persis seperti ini (huruf kecil semua):

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| `id` | `name` | `price` | `description` | `image` | `badge` | `active` |

---

## Langkah 3: Isi data produk

Mulai dari **baris 2**, isi satu produk per baris. Contoh:

| id | name | price | description | image | badge | active |
|--------|----------|-----------|-----------------|-----------|-----------|------------|
| keripik-tempe | Keripik Tempe | 10000 | Keripik tempe tipis renyah, gurih alami. | https://... | Best Seller | TRUE |
| rempeyek-kacang | Rempeyek Kacang | 10000 | Rempeyek tipis renyah dengan kacang tanah. | https://... | | TRUE |
| rempeyek-teri | Rempeyek Teri | 10000 | Rempeyek gurih dengan ikan teri. | https://... | | FALSE |

### Penjelasan kolom:

- **id**: Unik, huruf kecil, tanpa spasi (pakai `-`). Contoh: `keripik-tempe`
- **name**: Nama produk yang tampil di website
- **price**: Angka saja tanpa titik/koma. Contoh: `10000`
- **description**: Deskripsi singkat produk
- **image**: URL foto produk (lihat Langkah 4 untuk cara upload foto)
- **badge**: Label opsional. Contoh: `Best Seller`, `Baru`, `Hot`. Kosongkan jika tidak ada.
- **active**: `TRUE` = tampil di website, `FALSE` = disembunyikan

---

## Langkah 4: Upload foto produk

Gunakan salah satu cara gratis berikut:

### Opsi A: Google Drive (Paling mudah)
1. Upload foto ke Google Drive
2. Klik kanan foto → **Share** → ubah ke **Anyone with the link**
3. Salin link, lalu ubah formatnya:
   - Link asli: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
   - Ubah jadi: `https://drive.google.com/thumbnail?id=FILE_ID&sz=w600`
4. Paste URL yang sudah diubah ke kolom **E (image)**

### Opsi B: Imgur (Alternatif)
1. Buka [imgur.com](https://imgur.com)
2. Drag & drop foto → klik kanan gambar → **Copy image address**
3. Paste URL ke kolom **E (image)**

---

## Langkah 5: Publish spreadsheet ke publik

> Penting: Sheet harus bisa dibaca siapapun (tidak perlu login) agar website bisa membacanya.

1. Klik **File** → **Share** → **Share with others**
2. Klik **Change to anyone with the link**
3. Pastikan permission: **Viewer** (bukan Editor)
4. Klik **Done**

---

## Langkah 6: Ambil Sheet ID

1. Lihat URL spreadsheet kamu:
   ```
   https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/edit#gid=0
   ```
2. **Sheet ID** adalah bagian di antara `/d/` dan `/edit`:
   ```
   1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms
   ```
3. Salin Sheet ID tersebut.

---

## Langkah 7: Daftarkan Sheet ID di kode

Buka file `src/sheets.ts` dan cari baris ini:

```typescript
export const SHEET_ID = '';
```

Ganti dengan Sheet ID kamu:

```typescript
export const SHEET_ID = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms';
```

Simpan file, lalu jalankan `npm run dev` untuk test.

---

## Selesai! Cara kelola produk sekarang:

| Aksi | Caranya |
|------|---------|
| **Tambah produk baru** | Tambah baris baru di spreadsheet |
| **Edit nama / harga / deskripsi** | Edit sel yang sesuai |
| **Sembunyikan produk** | Ubah kolom G menjadi `FALSE` |
| **Hapus produk** | Hapus barisnya dari spreadsheet |
| **Ganti foto** | Upload foto baru, update URL di kolom E |

Perubahan di Google Sheets langsung tampil di website saat user refresh halaman. Tidak perlu deploy ulang!

---

## Deploy ke Vercel (100% gratis)

1. Push kode ke GitHub:
   ```bash
   git add .
   git commit -m "feat: google sheets integration"
   git push
   ```
2. Buka [vercel.com](https://vercel.com) → **Add New Project**
3. Import repo GitHub kamu
4. Settings Vercel:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Klik **Deploy** → selesai! Dapat domain gratis `*.vercel.app`

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Produk tidak muncul, muncul data lokal | Cek SHEET_ID di `sheets.ts` sudah benar |
| Badge kuning "Data lokal" | Sheet ID belum diisi atau sheet belum dipublish |
| Foto tidak muncul | Cek URL foto sudah publik (Google Drive: gunakan format thumbnail) |
| Semua produk hilang | Cek kolom `active` — jangan kosong, harus `TRUE` atau `FALSE` |
| Error di console | Buka DevTools → Console → cari pesan `[Hanun]` |
