# CuanSelor Design System Specification

Selamat datang di spesifikasi **Sistem Desain Resmi CuanSelor** — sebuah platform perencanaan masa depan keuangan dan proyeksi pensiun bertenaga AI yang dirancang khusus untuk Gen Z Indonesia. 

Dokumen ini menjabarkan seluruh pedoman visual, palet warna, tipografi, grid responsif, serta animasi interaktivitas mikro premium yang digunakan pada halaman utama (**HomePage**) CuanSelor.

---

## 1. Visual Theme & Atmosphere

Sistem desain CuanSelor memadukan nuansa **keuangan yang terpercaya, cerdas, dan hangat**. Canvas visual kami mengalir secara dinamis melalui tiga ritme permukaan utama:
1. **Parchment Cream** (`#f2f0eb`): Warna krem hangat yang membumi, memberikan ruang bernapas visual layaknya membaca jurnal finansial fisik yang mahal.
2. **Pristine Canvas** (`#ffffff`): Menyajikan keterbacaan tingkat tinggi untuk area data, grafik, dan kartu informasi.
3. **Emerald Fintech & Slate** (`#006241` / `#00754A`): Warna hijau tua khas yang melambangkan kemakmuran, kestabilan finansial, dan pertumbuhan jangka panjang.

### Sentuhan Dekoratif Premium:
- **Sweeping Gradient Curves**: Kurva latar belakang (SVG) yang membingkai sisi kiri dan kanan dashboard. Kurva ini menyapu tinggi dari bawah ke atas (`h-[96%]`) dengan gradasi warna memudar lembut dari transparan, menguat di warna merah muda pink khas Gen Z (`#ff4b4b`), bertransisi ke biru modern (`#0066cc`), dan menghilang lembut di bagian atas.
- **Micro-Interactions**: Seluruh elemen interaktif menggunakan transisi elastis (*springy feel*) guna menciptakan kepuasan taktil (*tactile feedback*) bagi pengguna Gen Z saat menavigasi situs.

---

## 2. Palet Warna & Token (`tokens.ts`)

Seluruh warna dalam aplikasi dikontrol ketat melalui token terpusat di `src/components/landing/tokens.ts` (konstanta `T`). Pengembang **harus selalu menggunakan nilai token ini** alih-alih memasukkan nilai hex mentah (*hardcoded hex*):

### A. Permukaan (Surfaces)
- **`T.canvas`** (`#ffffff`): Latar belakang utama halaman putih, kartu informasi, akordeon FAQ, dan lembar dialog (modals).
- **`T.parchment`** (`#f2f0eb`): Latar belakang krem hangat untuk memisahkan seksi konten (digunakan pada `AboutSection`, `HeroSection` latar dasar, dll.).
- **`T.tileDark`** (`#1E3932`): Hijau gelap pekat (*House Green*) untuk panel penutup konversi (`CtaSection`) dan *footer* situs.
- **`T.tileDark2`** (`#2b5148`): Hijau rimba (*Green Uplift*) sebagai variasi aksen gelap.
- **`T.black`** (`#000000`): Hitam mutlak untuk kontras ekstrim.

### B. Warna Teks (Typography Colors)
- **`T.ink`** (`rgba(0, 0, 0, 0.87)`): Hitam arang ber-opasitas 87%. Digunakan sebagai warna teks utama pada permukaan terang agar tidak terlalu tajam di mata.
- **`T.inkMuted`** (`rgba(0, 0, 0, 0.58)`): Abu-abu arang ber-opasitas 58%. Digunakan untuk sub-judul, deskripsi sekunder, dan teks pembantu.
- **`T.inkMuted48`** (`rgba(0, 0, 0, 0.38)`): Abu-abu ber-opasitas 38% untuk teks mikro, cap kaki, atau panduan pengisian form.
- **`T.onDark`** (`#ffffff`): Putih murni untuk teks utama di atas latar belakang gelap (`T.tileDark`).
- **`T.mutedDark`** (`rgba(255, 255, 255, 0.70)`): Putih ber-opasitas 70% untuk paragraf sekunder di atas latar belakang gelap.

### C. Aksen Utama & Tombol (Brand Accents)
- **`T.blue`** (`#006241`): Hijau tua ikonik CuanSelor (*Starbucks Green*). Digunakan untuk tulisan tajuk utama (`h1`, `h2`), lencana khusus, dan sorotan merek.
- **`T.blueDark`** (`#00754A`): Hijau aksen terang (*Green Accent*). Digunakan sebagai warna dasar tombol CTA utama (`PillCTA` primary) dan ikon interaktif.

### D. Garis Batas & Pemisah (Borders)
- **`T.hairline`** (`#e7e7e7`): Garis pembatas abu-abu super tipis untuk memisahkan kartu metrik dan baris tabel.
- **`T.divSoft`** (`rgba(0, 0, 0, 0.04)`): Pemisah transparan sangat lembut untuk kontras latar yang tipis.

---

## 3. Aturan Tipografi (Typography)

Tipografi CuanSelor mengedepankan keterbacaan yang ramah namun berwibawa:

### Font Family
- **Universal Font**: `'SoDoSans', 'Helvetica Neue', Helvetica, Arial, sans-serif`
  - SoDoSans memberikan tampilan geometris humanist yang bersih dengan spasi antar huruf (*letter-spacing*) bawaan yang rapat (`-0.01em` hingga `-0.16px`), membuatnya terlihat mapan dan profesional layaknya aplikasi finansial kelas dunia.

### Hierarki Teks Utama

| Peran visual | Ukuran | Tebal (Weight) | Jarak Baris | Letter Spacing | Keterangan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Title (Hero)** | `clamp(32px, 4.5vw, 54px)` | 700 (Bold) | 1.08 | `-0.03em` | Judul utama Hero Section |
| **Section Title (H2)** | `clamp(34px, 5vw, 56px)` | 600 (Semibold) | 1.1 | `-0.03em` | Judul seksi halaman (About, How it works, dll.) |
| **Paragraph Large** | `17px` - `21px` | 300 (Light) | 1.5 | Normal | Pengantar Hero dan sub-judul pembuka |
| **Body Default** | `16px` | 400 (Regular) | 1.5 | `-0.01em` | Teks isi default |
| **Card / Button Label**| `14px` - `16px` | 600 (Semibold) | 1.2 | `-0.01em` | Teks tombol PillCTA & label metrik |
| **Micro Copy** | `11px` - `13px` | 400 (Regular) | 1.4 | Normal | Caption grafis, keterangan di bawah CTA |

---

## 4. Komponen Interaktif & Animasi Hover

CuanSelor HomePage dirancang agar terasa "hidup dan responsif" melalui sentuhan mikro-interaksi berikut:

### A. Tombol PillCTA
- **Bentuk**: Ujung membulat penuh (`border-radius: 50px` / pill-shape).
- **Hover State**: Mengembang dinamis (`hover:scale-105`) dengan penambahan bayangan pendaran lembut di belakang tombol (`hover:shadow-lg`). Tombol utama memancarkan pendaran biru/hijau (`hover:shadow-blue-500/25`), tombol sekunder mengaburkan kontras latar.
- **Active Click State**: Sedikit mengempis elastis (`active:scale-95`) saat ditekan jari/kursor mouse.

### B. Panel Mockup Dashboard
- **Dashboard Lift**: Ketika kursor mouse melintasi area *Dashboard Mockup*, **seluruh panel dasbor akan terangkat naik secara anggun** (`hover:-translate-y-2`) dan memancarkan bayangan ambient menyebar yang tebal (`hover:shadow-[0_32px_80px_rgba(0,0,0,0.12)]`).
- **Sidebar Slide**: Elemen menu samping kiri bergeser sedikit ke kanan (`hover:translate-x-1.5`) dengan sorotan latar belakang yang lembut.
- **Metric Cards Glow**: Setiap kartu metrik di dalam dasbor akan terangkat naik (`hover:-translate-y-1`) dan memancarkan pendaran bayangan berwarna sesuai kelompok datanya:
  - Kartu *Total Saldo Aktif* berpendar **Hijau** 🟢 (`hover:shadow-green-500/10`)
  - Kartu *Target Pensiun* berpendar **Biru** 🔵 (`hover:shadow-blue-500/10`)
  - Kartu *Dana Darurat* berpendar **Kuning/Emas** 🟡 (`hover:shadow-yellow-500/10`)

### C. How It Works Cards
- Menggunakan efek 3D perspective (`perspective: 1200`).
- Efek *zoom* membesar saat didekati kursor untuk memperjelas alur tahapan langkah penggunaan CuanSelor.

---

## 5. Sistem Grid & Responsivitas Mobile

HomePage dirancang agar sepenuhnya fleksibel pada berbagai peranti (HP/Tablet/PC Desktop):

### A. Pola Layouting & Breakpoints
- **Mobile View (< 768px)**:
  - Padding sisi samping aman: `px-6` (24px) untuk mencegah konten menabrak pinggiran HP.
  - Penumpukan Vertikal: Seluruh baris data, metrik, FAQ, dan kolom info wajib bertumpuk 1 kolom saja (`grid-cols-1`, `flex-col`).
  - Penyelamatan Dashboard: Menyembunyikan komponen Sidebar dasbor (`hidden md:flex`), kolom pencarian (`hidden sm:flex`), dan melipat kartu metrik sampingan agar pas di layar sempit tanpa *horizontal overflow* (hanya menampilkan metrik Total Saldo).
  - Standarisasi Padding Antar-Seksi: `py-[60px]` di mobile untuk menjaga ritme gulir layar agar tidak terlalu lelah.
- **Desktop View (>= 1024px)**:
  - Struktur baris menyebar normal (`grid-cols-2`, `grid-cols-4`, `flex-row`).
  - Padding vertikal antar seksi dikembalikan longgar: `py-[120px]` atau `py-[140px]`.
  - Dashboard Mockup dirender penuh lengkap dengan Sidebar, Grafik Akumulasi AI, Alokasi Portofolio SBN/Obligasi/Emas, dan 3 Kartu Metrik lengkap.

---

## 6. Pedoman Do's and Don'ts Bagi Pengembang

### DO:
- **SELALU** gunakan token dari `tokens.ts` (misalnya `style={{ color: T.ink }}`) untuk teks biasa, bukan warna hitam murni `#000000`.
- **SELALU** pastikan padding mobile menggunakan utilitas Tailwind responsif (`py-[60px] md:py-[120px] px-6 md:px-[5%]`) agar konsisten di seluruh seksi landing page.
- **SELALU** verifikasi build produksi (`npm run build`) setelah melakukan modifikasi untuk memastikan tag JSX tertutup rapi dan aman dari galat kompilasi TypeScript.
- **SELALU** gunakan bentuk bulat penuh (`50px`) pada tombol CTA dengan interaksi elastis `scale` yang halus.

### DON'T:
- **JANGAN** gunakan grid statis yang dipaksakan melebar di HP — selalu gunakan media query `grid-cols-1 md:grid-cols-X` untuk melipat konten secara vertikal di ponsel.
- **JANGAN** menggunakan bayangan drop-shadow tunggal yang pekat dan hitam legam. Selalu gunakan bayangan ambient tipis ber-opasitas rendah (`rgba(0,0,0,0.03)` hingga `rgba(0,0,0,0.08)`) atau bayangan pendar berwarna sesuai token aksen.
- **JANGAN** menambahkan teks/elemen dengan lebar tetap (misal: `width: 500px`) secara inline tanpa pembatas responsif, karena hal tersebut merupakan penyebab utama kerusakan tata letak di perangkat mobile. Gunakan kelas Tailwind seperti `w-full max-w-[500px]`.
