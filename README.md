# AI Agent Project Guide: CuanSelor

## 1. Project Context
- **Project Name:** CuanSelor (sebelumnya CampusMarket).
- **Domain:** Financial Investment Advisor & Fintech.
- **Goal:** Membantu generasi muda merencanakan kebebasan finansial menggunakan AI dan perhitungan aktuaria (termasuk probabilitas mortalitas, inflasi, dan target gaya hidup).

## 2. Tech Stack & Architecture
Proyek ini menggunakan struktur **Monorepo**:
- **Frontend (Port 3000):** Next.js 16+ (App Router), React 19, Tailwind CSS v4.
  - Import alias: Menggunakan `@/*` (contoh: `@/components/Button`).
- **Backend (Port 8000):** Node.js, Express.js.
  - Berjalan mandiri dan diakses melalui koneksi API (CORS diaktifkan).
- **Package Manager:** npm (dijalankan menggunakan `concurrently` di root).

## 3. Coding Guidelines for AI
- **UI/UX:** Gunakan prinsip desain yang modern, minimalis, dan *clean*. 
- **Code Style:** - Gunakan TypeScript (Strict mode) untuk Frontend.
  - Tulis komponen React secara modular (Client Components hanya saat dibutuhkan untuk interaktivitas, sisanya gunakan Server Components).
  - Jaga agar *controller* di Express.js tetap bersih dan pisahkan logika bisnis (perhitungan finansial) ke folder `services/` atau `utils/`.
- **Documentation:** Jika diminta untuk membuat atau mengedit bagian dokumentasi proyek (terutama bagian "Model"), ingat bahwa "Model" merujuk secara spesifik pada **notasi arsitektur dan diagram**, bukan bagian dari bab Tinjauan Pustaka (Literature Review).

## 4. Key Financial Logic (To be implemented)
- Kalkulator dana pensiun harus memperhitungkan inflasi tahunan (dinamis).
- Integrasi Tabel Mortalitas dan Morbiditas Penduduk Indonesia 2023 untuk proyeksi risiko.
- Algoritma *Risk Profile Analysis* untuk merekomendasikan instrumen investasi.

## 5. Development Workflow
- Selalu patuhi `.gitignore` yang sudah disetel di root directory.
- Jangan pernah mengganggu folder `node_modules/` atau `.next/`.
- Berikan komentar singkat pada fungsi-fungsi matematika/finansial yang kompleks agar mudah dibaca oleh tim (Farhan, Ammar, Alfian, Rangga, Lukas, Raihan).